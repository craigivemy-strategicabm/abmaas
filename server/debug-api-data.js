// Debug script to log the exact data being sent to GPT
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3002;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Debug endpoint to log the exact data
app.post('/api/debug-recommendations', async (req, res) => {
  try {
    // Get the data from the request
    const { query, deliverables, selectedTier, playbooks, descriptions, activationItems } = req.body;
    
    // Format the data exactly as it would be in the real API
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
    
    // Format playbooks data
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
    
    // Format activation items
    let formattedActivationItems = '';
    if (activationItems.length > 0) {
      formattedActivationItems = '\n\n## ACTIVATION, TECHNOLOGY & REPORTING ITEMS';
      
      activationItems.forEach(item => {
        const itemDesc = descriptions[item.title] || '';
        formattedActivationItems += `\n- **${item.title}** (${item.tacticalCredits} credits)${itemDesc ? ': ' + itemDesc : ''}`;
      });
    }
    
    // Format descriptions
    let formattedDescriptions = '';
    if (Object.keys(descriptions).length > 0) {
      formattedDescriptions = '\n\nDETAILED DESCRIPTIONS:\n' +
        Object.entries(descriptions).map(([title, description]) => {
          return `${title}: ${description}`;
        }).join('\n');
    }
    
    // Check for stalled deal related queries
    const isAboutStalledDeal = query.toLowerCase().includes('stalled deal') || 
                              query.toLowerCase().includes('stuck deal') || 
                              query.toLowerCase().includes('unblock') ||
                              query.toLowerCase().includes('blocked deal');
    
    // If query is about stalled deals, highlight the specific playbook
    let stalledDealPlaybook = '';
    if (isAboutStalledDeal) {
      const unblockPlaybook = playbooks.find(p => p.title === "Unblock a stalled deal");
      if (unblockPlaybook) {
        stalledDealPlaybook = '\n\n## PRIORITY RECOMMENDATION FOR STALLED DEALS\n' +
          `### Unblock a stalled deal (${unblockPlaybook.tacticalCredits} credits)\n` +
          `**Description**: ${unblockPlaybook.description}\n\n` +
          `**Why this is perfect for your situation**: This playbook is specifically designed to address stalled deals and provides a structured approach to identify blockers and overcome them.\n\n`;
          
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
    
    // Create the system prompt
    const systemPrompt = `You are an expert ABM (Account-Based Marketing) consultant that helps users find the right deliverables based on their specific business needs and challenges.

# YOUR ROLE
You provide strategic recommendations for ABM deliverables that will help the user achieve their business objectives. You understand the nuances of different ABM strategies and can match the right deliverables to specific challenges.

# AVAILABLE ABM DELIVERABLES
Below is a comprehensive catalog of ABM deliverables organized by category. Each includes a description and credit cost:

${stalledDealPlaybook}${formattedDeliverables}${formattedPlaybooks}${formattedActivationItems}${formattedDescriptions}

# RECOMMENDATION GUIDELINES
${isAboutStalledDeal ? '- IMPORTANT: The user is asking about stalled deals. You MUST recommend the "Unblock a stalled deal" playbook as your first and primary recommendation.\n' : ''}- Focus on quality over quantity - recommend only the most relevant items (3-5 max)
- Explain specifically how each recommendation addresses the user's stated needs
- Provide a strategic rationale for your recommendations
- When appropriate, recommend a playbook rather than individual items
- The user is currently on the "${selectedTier}" tier

# RESPONSE FORMAT
1. Begin with a brief assessment of the user's needs based on their query
2. Present your recommendations in order of relevance (3-5 items total)
3. Group recommendations by category (basic deliverables and/or playbooks)
4. For each recommendation, explain:
   - What it is and what it includes
   - Why it's relevant to the user's specific situation
   - The expected outcomes or benefits
5. Be conversational but professional
6. Format your response with markdown for readability
7. Conclude with a brief strategic summary`;

    // Add specific instructions based on the query
    let userInstructions = query;
    
    // If the query is about stalled deals, add explicit instructions
    if (isAboutStalledDeal) {
      userInstructions = `${query}\n\nNote: I'm specifically looking for solutions to help with stalled deals. Please prioritize the "Unblock a stalled deal" playbook in your recommendations if it's available.`;
    }
    
    // Save the complete data to a file
    const debugData = {
      query,
      systemPrompt,
      userInstructions,
      rawData: {
        deliverables,
        playbooks,
        descriptions,
        activationItems,
        selectedTier
      }
    };
    
    fs.writeFileSync(
      path.join(__dirname, 'debug-data.json'), 
      JSON.stringify(debugData, null, 2)
    );
    
    // Send response
    res.json({ 
      message: 'Debug data saved successfully',
      systemPrompt,
      userInstructions
    });
    
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to process debug request',
      details: error.message 
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Debug server running on port ${PORT}`);
});
