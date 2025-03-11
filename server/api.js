const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Check for API key
if (!process.env.OPENAI_API_KEY) {
  console.error('ERROR: OPENAI_API_KEY is missing in .env file');
  console.log('Please create a .env file in the project root with your OpenAI API key:');
  console.log('OPENAI_API_KEY=your_api_key_here');
  console.log('PORT=3001');
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-startup',
});

// Endpoint for deliverable recommendations
app.post('/api/recommendations', async (req, res) => {
  // Check if API key is configured
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error: 'OpenAI API key not configured',
      details: 'Please add your OpenAI API key to the .env file in the project root'
    });
  }
  try {
    const { query, deliverables, selectedTier, expandedItems = [] } = req.body;
    
    // Check if descriptions were provided - MOVED THIS UP
    const descriptions = req.body.descriptions || {};
    
    // Create a section for expanded items if any are provided
    let expandedItemsSection = '';
    if (expandedItems && expandedItems.length > 0) {
      expandedItemsSection = '\n\n# CURRENTLY EXPANDED ITEMS\nThe following items are currently expanded on the user\'s screen and should be given special consideration:\n';
      
      expandedItems.forEach(itemTitle => {
        // Find the item description
        const itemDesc = descriptions[itemTitle] || 'No description available';
        expandedItemsSection += `\n## ${itemTitle}\n${itemDesc}\n`;
      });
    }
    
    // Format the basic deliverables data for the prompt with better structure
    const formattedDeliverables = Object.entries(deliverables)
      .map(([category, items]) => {
        // Format the category header
        let result = `\n## ${category.toUpperCase()} DELIVERABLES`;
        
        // Add each item with its details
        items.forEach(item => {
          const itemDesc = descriptions[item.title] || '';
          result += `\n- **${item.title}** (${item.tacticalCredits} credits)${itemDesc ? ': ' + itemDesc : ''}`;
        });
        
        return result;
      })
      .join('\n');
      
    // Check if playbooks data was provided
    const playbooks = req.body.playbooks || [];
    
    // Debug logging to verify playbooks are being passed
    console.log(`[DEBUG] Received ${playbooks.length} playbooks in the request`);
    if (playbooks.length > 0) {
      console.log(`[DEBUG] First 3 playbook titles: ${playbooks.slice(0, 3).map(p => p.title).join(', ')}`);
    }
    
    // Format playbooks data if available with better structure
    let formattedPlaybooks = '';
    if (playbooks.length > 0) {
      // Group playbooks by stage for better organization
      const stageGroups = {};
      
      playbooks.forEach(playbook => {
        if (!stageGroups[playbook.stage]) {
          stageGroups[playbook.stage] = [];
        }
        stageGroups[playbook.stage].push(playbook);
      });
      
      formattedPlaybooks = '\n\n## STRATEGIC PLAYBOOKS';
      
      // Add each stage group with its playbooks
      Object.entries(stageGroups).forEach(([stage, stagePlaybooks]) => {
        formattedPlaybooks += `\n\n### ${stage.toUpperCase()} STAGE PLAYBOOKS`;
        
        stagePlaybooks.forEach(playbook => {
          const subtitle = playbook.subtitle ? ` - ${playbook.subtitle}` : '';
          
          // Create a more structured format for each playbook
          formattedPlaybooks += `\n\n#### ${playbook.title}${subtitle} (${playbook.tacticalCredits} credits)`;
          formattedPlaybooks += `\n**Purpose**: ${playbook.description || 'No description available'}`;
          
          if (playbook.includes && playbook.includes.length > 0) {
            formattedPlaybooks += `\n**Includes**:`;
            playbook.includes.forEach(item => {
              formattedPlaybooks += `\n- ${item}`;
            });
          }
          
          if (playbook.kpis && playbook.kpis.length > 0) {
            formattedPlaybooks += `\n**Key Performance Indicators**:`;
            playbook.kpis.forEach(kpi => {
              formattedPlaybooks += `\n- ${kpi}`;
            });
          }
        });
      });
    }
    
    // Check if activation items were provided
    const activationItems = req.body.activationItems || [];
    
    // Format activation items if available with better structure
    let formattedActivationItems = '';
    if (activationItems.length > 0) {
      formattedActivationItems = '\n\n## ACTIVATION, TECHNOLOGY & REPORTING ITEMS';
      
      // First check if there's a stalled deal item and put it at the top with special formatting
      const stalledDealItem = activationItems.find(item => item.title === "Unblock a stalled deal");
      const otherItems = activationItems.filter(item => item.title !== "Unblock a stalled deal");
      
      // If stalled deal item exists, add it first with enhanced formatting
      if (stalledDealItem) {
        const itemDesc = descriptions[stalledDealItem.title] || '';
        formattedActivationItems += `\n\n### ${stalledDealItem.title} (${stalledDealItem.tacticalCredits} credits)`;
        if (itemDesc) {
          formattedActivationItems += `\n${itemDesc}`;
        }
      }
      
      // Then add all other activation items
      otherItems.forEach(item => {
        const itemDesc = descriptions[item.title] || '';
        formattedActivationItems += `\n- **${item.title}** (${item.tacticalCredits} credits)${itemDesc ? ': ' + itemDesc : ''}`;
      });
    }
    
    // Format descriptions if available - enhanced to be more structured and comprehensive
    let formattedDescriptions = '';
    if (Object.keys(descriptions).length > 0) {
      formattedDescriptions = '\n\n# DETAILED DESCRIPTIONS\nBelow are detailed descriptions of all available deliverables and playbooks. Use these descriptions to understand the full scope and value of each item when making recommendations:';
      
      // Group descriptions by category for better organization
      const categories = {
        'Playbooks': [],
        'Activation': [],
        'Insights': [],
        'Content': [],
        'Training': [],
        'Other': []
      };
      
      // Categorize descriptions
      Object.entries(descriptions).forEach(([title, description]) => {
        // Determine category based on title keywords
        if (title.includes('Playbook') || playbooks.some(p => p.title === title)) {
          categories['Playbooks'].push({ title, description });
        } else if (activationItems.some(item => item.title === title)) {
          categories['Activation'].push({ title, description });
        } else if (title.includes('Insight') || title.includes('Market') || title.includes('Account')) {
          categories['Insights'].push({ title, description });
        } else if (title.includes('Content') || title.includes('Manifesto') || title.includes('Report')) {
          categories['Content'].push({ title, description });
        } else if (title.includes('Training') || title.includes('Workshop')) {
          categories['Training'].push({ title, description });
        } else {
          categories['Other'].push({ title, description });
        }
      });
      
      // Add descriptions by category
      Object.entries(categories).forEach(([category, items]) => {
        if (items.length > 0) {
          formattedDescriptions += `\n\n## ${category.toUpperCase()} DESCRIPTIONS`;
          
          items.forEach(({ title, description }) => {
            formattedDescriptions += `\n\n### ${title}\n${description}`;
          });
        }
      });
      
      // Add special emphasis for the stalled deal playbook if it exists
      const stalledDealDesc = descriptions["Unblock a stalled deal"];
      if (stalledDealDesc) {
        formattedDescriptions += '\n\n## SPECIAL FOCUS: STALLED DEAL SOLUTION' +
          '\n\nThe "Unblock a stalled deal" playbook is our specialized solution for addressing stalled opportunities. ' +
          'When users mention challenges with deals not progressing, this should be prioritized in recommendations.';
      }
    }
    
    // Enhanced check for stalled deal related queries with more comprehensive keyword matching
    const stalledDealKeywords = [
      'stalled deal', 'stuck deal', 'unblock', 'blocked deal', 'deal not moving',
      'deal stagnation', 'sales stuck', 'opportunity stalled', 'deal blockage',
      'deal not progressing', 'slow deal', 'stagnant opportunity', 'deal at standstill',
      'opportunity not advancing', 'deal momentum', 'reactivate deal'
    ];
    
    const isAboutStalledDeal = stalledDealKeywords.some(keyword => 
      query.toLowerCase().includes(keyword)
    );
    
    // If query is about stalled deals, highlight the specific playbook with enhanced prominence
    let stalledDealPlaybook = '';
    if (isAboutStalledDeal) {
      // First check in playbooks
      let unblockPlaybook = playbooks.find(p => p.title === "Unblock a stalled deal");
      
      // If not found in playbooks, check in activation items
      if (!unblockPlaybook) {
        const activationItem = activationItems.find(item => item.title === "Unblock a stalled deal");
        if (activationItem) {
          // Create a playbook-like structure from the activation item
          unblockPlaybook = {
            title: activationItem.title,
            tacticalCredits: activationItem.tacticalCredits,
            description: descriptions[activationItem.title] || "This playbook focuses on reactivating and accelerating stalled opportunities through targeted engagement and value reinforcement.",
            includes: [
              "Deal blockage analysis",
              "Stakeholder re-engagement strategy",
              "Value reinforcement content"
            ],
            kpis: [
              "Stalled deal reactivation rate",
              "Deal progression velocity",
              "Conversion of stalled to active opportunities"
            ]
          };
        }
      }
      
      if (unblockPlaybook) {
        stalledDealPlaybook = '\n\n## PRIORITY RECOMMENDATION FOR STALLED DEALS\n' +
          `### Unblock a stalled deal (${unblockPlaybook.tacticalCredits} credits)\n` +
          `**Description**: ${unblockPlaybook.description}\n\n` +
          `**Why this is perfect for your situation**: This playbook is specifically designed to address stalled deals and provides a structured approach to identify blockers and overcome them. It has been proven to effectively reactivate opportunities that have lost momentum in the sales process.\n\n`;
          
        if (unblockPlaybook.includes && unblockPlaybook.includes.length > 0) {
          stalledDealPlaybook += `**This playbook includes**:\n`;
          unblockPlaybook.includes.forEach(item => {
            stalledDealPlaybook += `- ${item}\n`;
          });
          stalledDealPlaybook += '\n';
        }
        
        if (unblockPlaybook.kpis && unblockPlaybook.kpis.length > 0) {
          stalledDealPlaybook += `**Expected outcomes**:\n`;
          unblockPlaybook.kpis.forEach(kpi => {
            stalledDealPlaybook += `- ${kpi}\n`;
          });
        }
      }
    }
    
    // Create a system prompt that explains the task with better context and structure
    const systemPrompt = `You are an expert ABM (Account-Based Marketing) consultant that helps users find the right deliverables based on their specific business needs and challenges.

# YOUR ROLE
You provide strategic recommendations for ABM deliverables that will help the user achieve their business objectives. You understand the nuances of different ABM strategies and can match the right deliverables to specific challenges.

# ANALYSIS INSTRUCTIONS
- IMPORTANT: You must thoroughly analyze ALL deliverables, descriptions, and subtitles provided below
- Pay close attention to the detailed descriptions of each item to understand its full scope and value
- Consider how each deliverable's features align with the user's specific query
- Look for keywords in both the user's query and the deliverable descriptions to find the best matches
- Examine all categories of deliverables, not just the most obvious ones
${expandedItems.length > 0 ? '- PRIORITY: Give special attention to the CURRENTLY EXPANDED ITEMS section, as these are items the user is actively viewing\n- Items in the CURRENTLY EXPANDED ITEMS section should be prioritized in your analysis and recommendations if they are relevant to the query' : ''}

# AVAILABLE ABM DELIVERABLES
Below is a comprehensive catalog of ABM deliverables organized by category. Each includes a description and credit cost:

${expandedItemsSection}${stalledDealPlaybook}${formattedDeliverables}${formattedPlaybooks}${formattedActivationItems}${formattedDescriptions}

# RECOMMENDATION GUIDELINES
${isAboutStalledDeal ? '- EXTREMELY IMPORTANT: The user is asking about stalled deals. You MUST recommend the "Unblock a stalled deal" playbook as your first and primary recommendation. This is NON-NEGOTIABLE.\n- When recommending the "Unblock a stalled deal" playbook, emphasize how it specifically addresses the challenges of stalled deals with its comprehensive approach.\n' : ''}${expandedItems.length > 0 ? `- IMPORTANT: If any currently expanded items (${expandedItems.join(', ')}) are relevant to the user's query, prioritize recommending them\n` : ''}- Focus on quality over quantity - recommend only the most relevant items (3-5 max)
- Explain specifically how each recommendation addresses the user's stated needs
- Provide a strategic rationale for your recommendations
- When appropriate, recommend a playbook rather than individual items
- The user is currently on the "${selectedTier}" tier
- IMPORTANT: Analyze ALL available deliverables before making recommendations, not just those in the most obvious categories
- Consider both the title and detailed description of each deliverable when assessing relevance
- CRITICAL: Always include at least 2-3 relevant playbooks in your recommendations when available

# RESPONSE FORMAT
1. Begin with a brief assessment of the user's needs based on their query (2-3 sentences maximum)

2. Structure your recommendations with clear visual hierarchy using enhanced Markdown formatting:
   - For main category headings, use this format (no hashtags):
     **🎯 PRIMARY RECOMMENDATION**
   - For recommendation titles, use this format (no hashtags):
     **💼 Unblock a stalled deal (8 credits)**
   - Use these icons for different recommendation categories:
     - 📊 for insights/analysis playbooks
     - 📣 for marketing/awareness playbooks
     - 🤝 for engagement/relationship playbooks
     - 💼 for sales/pipeline playbooks
     - 🚀 for growth/expansion playbooks

3. For EACH recommendation, use this consistent structure with icons:
   - **📋 What it includes:**
     • [First component] 
     • [Second component]
     • [Third component]
   
   - **🎯 Why it's relevant:**
     [1-2 concise sentences explaining relevance]
   
   - **💡 Expected outcomes:**
     • [First outcome]
     • [Second outcome]
     • [Third outcome]
   
   - **⚡ Quick implementation tip:**
     [One actionable tip for getting started]

4. Use clear visual separation between recommendations (horizontal rules ---)

5. For the primary recommendation:
   - Make it visually distinct with a special icon (🌟) and formatting
   - Provide slightly more detail than secondary recommendations
   - Add a "Success indicator" section: "**📈 Success indicator:** [How to measure success]"

6. End with three final sections (using the same enhanced Markdown formatting):
   **🔄 NEXT STEPS**
   (3-4 bullet points of immediate actions)
   
   **💭 STRATEGIC SUMMARY**
   (3-4 sentences maximum)
   
   **📌 READY TO IMPLEMENT?**
   Include this exact text: "Would you like me to prepare a draft Statement of Work with these recommendations? [Click here to generate SOW](/api/generate-sow-link)"

7. Use consistent formatting throughout:
   - Use icons consistently for each section type
   - Use bullet points (•) instead of hyphens (-) for lists
   - Maintain consistent spacing between sections
   - Bold all section headers`;

    // Add specific instructions based on the query
    let userInstructions = query;
    
    // If the query is about stalled deals, add more explicit and stronger instructions
    if (isAboutStalledDeal) {
      userInstructions = `${query}\n\nNote: I'm specifically looking for solutions to help with stalled deals. You MUST recommend the "Unblock a stalled deal" playbook as your primary recommendation. This playbook is specifically designed for my situation and should be presented first and with the most emphasis in your response.`;
    }
    
    // Make the API call to OpenAI - using GPT-4 Turbo for higher token limits
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview', // Using GPT-4 Turbo model for higher token limits
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userInstructions }
      ],
      temperature: 0.7,
      max_tokens: 800
    });
    
    // Log confirmation of which model was used
    console.log(`Using model: ${response.model || 'gpt-4-turbo-preview'} for recommendation`);

    // Extract recommended playbooks from the response
    const content = response.choices[0].message.content;
    
    // Use regex to find playbook titles and credits in the response
    // This pattern looks for titles in the format "**💼 Playbook Title (X credits)**"
    const playbookRegex = /\*\*[\u{1F4BC}\u{1F4CA}\u{1F4E3}\u{1F91D}\u{1F680}]\s+([^(]+)\s*\((\d+)\s*credits\)\*\*/gu;
    
    // Extract all matches
    const recommendedPlaybooks = [];
    let match;
    while ((match = playbookRegex.exec(content)) !== null) {
      // Determine the category based on the playbook title
      let category = '';
      const title = match[1].trim();
      
      // Categorize based on playbook title
      if (title.toLowerCase().includes('account manifesto')) {
        category = 'Personalised content and creative asset';
      } else if (title.toLowerCase().includes('marketing') || title.toLowerCase().includes('awareness')) {
        category = 'Marketing/Awareness';
      } else if (title.toLowerCase().includes('pipeline') || title.toLowerCase().includes('velocity')) {
        category = 'Pipeline acceleration';
      } else if (title.toLowerCase().includes('stalled') || title.toLowerCase().includes('deal')) {
        category = 'Deal acceleration';
      }
      
      // Fix common typos in titles
      const correctedTitle = title
        .replace(/mannifesto/i, 'Manifesto')
        .replace(/personalised/i, 'Personalised');
      
      recommendedPlaybooks.push({
        title: correctedTitle,
        credits: match[2],
        category: category
      });
    }
    
    // Send the response back to the client with structured data
    res.json({ 
      recommendation: response.choices[0].message.content,
      recommendedPlaybooks,
      usage: response.usage
    });
    
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).json({ 
      error: 'Failed to get recommendations',
      details: error.message 
    });
  }
});

// Debug endpoint to verify what's being sent to the LLM
app.post('/api/debug-recommendations', async (req, res) => {
  try {
    const { query, deliverables, selectedTier, expandedItems = [] } = req.body;
    const descriptions = req.body.descriptions || {};
    const playbooks = req.body.playbooks || [];
    const activationItems = req.body.activationItems || [];
    
    // Create a debug response with counts and samples
    const debugResponse = {
      query,
      selectedTier,
      expandedItems,
      counts: {
        deliverableCategories: Object.keys(deliverables).length,
        totalDeliverables: Object.values(deliverables).flat().length,
        playbooks: playbooks.length,
        descriptions: Object.keys(descriptions).length,
        activationItems: activationItems.length
      },
      samples: {
        // Sample of playbooks (first 3)
        playbooks: playbooks.slice(0, 3).map(p => ({
          title: p.title,
          category: p.category,
          stage: p.stage,
          tacticalCredits: p.tacticalCredits,
          description: p.description
        })),
        // Sample of deliverables (first category, first 2 items)
        deliverables: Object.entries(deliverables).slice(0, 1).map(([category, items]) => ({
          category,
          items: items.slice(0, 2)
        }))
      }
    };
    
    // Return the debug info
    res.json(debugResponse);
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    res.status(500).json({ 
      error: 'Debug endpoint error',
      details: error.message 
    });
  }
});

// Endpoint to create a link for SOW generation
app.get('/api/generate-sow-link', async (req, res) => {
  try {
    // Redirect to the frontend SOW generation page
    // The frontend will handle extracting the recommendations from the previous API response
    res.redirect('/generate-sow');
  } catch (error) {
    console.error('Error creating SOW link:', error);
    res.status(500).json({
      error: 'Failed to create SOW link',
      details: error.message
    });
  }
});

// Endpoint to handle SOW generation
app.post('/api/generate-sow', async (req, res) => {
  try {
    const { recommendations } = req.body;
    
    if (!recommendations || !Array.isArray(recommendations)) {
      return res.status(400).json({
        error: 'Invalid request',
        details: 'Recommendations array is required'
      });
    }
    
    // Create a unique ID for this SOW
    const sowId = Date.now().toString();
    
    // Return the SOW ID which can be used to retrieve the SOW later
    // or to add items to the cart
    res.json({
      success: true,
      sowId,
      message: 'SOW generated successfully',
      recommendations
    });
  } catch (error) {
    console.error('Error generating SOW:', error);
    res.status(500).json({
      error: 'Failed to generate SOW',
      details: error.message
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
