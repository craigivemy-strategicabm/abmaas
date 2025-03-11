#!/usr/bin/env node

// This script tests if all playbooks from the actual application are being sent to the API
const fs = require('fs');
const path = require('path');
const http = require('http');

// Test query about stalled deals
const testQuery = "I need help with a stalled deal that's not progressing. What playbooks do you recommend?";

// Function to make an HTTP request
function makeRequest(endpoint, data) {
  return new Promise((resolve, reject) => {
    // Convert data to JSON string
    const postData = JSON.stringify(data);
    
    // Request options
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: endpoint,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    // Create request
    const req = http.request(options, (res) => {
      let data = '';
      
      // Collect data chunks
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      // Process when response ends
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsedData = JSON.parse(data);
            resolve(parsedData);
          } catch (e) {
            reject(new Error(`Failed to parse response: ${e.message}`));
          }
        } else {
          reject(new Error(`Request failed with status code ${res.statusCode}: ${data}`));
        }
      });
    });
    
    // Handle errors
    req.on('error', (e) => {
      reject(new Error(`Request error: ${e.message}`));
    });
    
    // Send the data
    req.write(postData);
    req.end();
  });
}

// Extract playbooks data from the source file
async function extractPlaybooksData() {
  try {
    // Read the PlaybooksNetflixLayout.tsx file
    const filePath = path.resolve(__dirname, '../src/components/PlaybooksNetflixLayout.tsx');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Extract the ALL_PLAYBOOKS array using regex
    const playbooksMatch = fileContent.match(/const ALL_PLAYBOOKS: Playbook\[\] = \[([\s\S]*?)\];/);
    
    if (!playbooksMatch) {
      throw new Error('Could not find ALL_PLAYBOOKS array in the source file');
    }
    
    // Extract the playbooks array content
    const playbooksArrayContent = playbooksMatch[1];
    
    // Count the number of playbook objects by counting occurrences of "title:"
    const playbookCount = (playbooksArrayContent.match(/title:/g) || []).length;
    
    // Extract a few sample titles for verification
    const titleMatches = playbooksArrayContent.match(/title: "([^"]+)"/g) || [];
    const sampleTitles = titleMatches.slice(0, 5).map(match => match.replace(/title: "/, '').replace(/"/, ''));
    
    console.log(`Found ${playbookCount} playbooks in the source file`);
    console.log('Sample titles:', sampleTitles);
    
    // Create a simplified version of the playbooks for testing
    // This is a workaround since we can't directly eval the TypeScript code
    const simplifiedPlaybooks = [];
    
    // Extract individual playbook objects using regex
    const playbookRegex = /{\s*title: "([^"]+)"[^}]*}/g;
    let match;
    while ((match = playbookRegex.exec(playbooksArrayContent)) !== null) {
      // Extract the title
      const titleMatch = match[0].match(/title: "([^"]+)"/);
      const title = titleMatch ? titleMatch[1] : 'Unknown';
      
      // Extract the category
      const categoryMatch = match[0].match(/category: "([^"]+)"/);
      const category = categoryMatch ? categoryMatch[1] : 'unknown';
      
      // Extract the stage
      const stageMatch = match[0].match(/stage: "([^"]+)"/);
      const stage = stageMatch ? stageMatch[1] : 'Unknown';
      
      // Extract the credits
      const creditsMatch = match[0].match(/tacticalCredits: "([^"]+)"/);
      const tacticalCredits = creditsMatch ? creditsMatch[1] : '0';
      
      // Extract the description
      const descMatch = match[0].match(/description: "([^"]+)"/);
      const description = descMatch ? descMatch[1] : 'No description available';
      
      // Add to simplified playbooks
      simplifiedPlaybooks.push({
        title,
        category,
        stage,
        tacticalCredits,
        description
      });
    }
    
    return {
      count: playbookCount,
      sampleTitles,
      playbooks: simplifiedPlaybooks
    };
  } catch (error) {
    console.error('Error extracting playbooks data:', error);
    return {
      count: 0,
      sampleTitles: [],
      playbooks: []
    };
  }
}

// Test with the actual playbooks data
async function testWithRealPlaybooks() {
  console.log('=== TESTING WITH ACTUAL PLAYBOOKS DATA ===\n');
  
  try {
    // Extract playbooks data from the source file
    const { count, sampleTitles, playbooks } = await extractPlaybooksData();
    
    if (count === 0 || playbooks.length === 0) {
      console.error('Failed to extract playbooks data from the source file');
      return false;
    }
    
    console.log(`Successfully extracted ${playbooks.length} playbooks`);
    
    // Create a minimal test payload with the real playbooks
    const testData = {
      query: testQuery,
      deliverables: {
        insights: [
          {title: "Sample Insight", tacticalCredits: "2", impactCredits: "2", enterpriseCredits: "2", customPrice: "2"}
        ]
      },
      selectedTier: 'Tactical ABM',
      playbooks: playbooks,
      descriptions: {
        "Unblock a stalled deal": "This playbook focuses on reactivating and accelerating stalled opportunities through targeted engagement and value reinforcement."
      },
      activationItems: [
        {title: "Unblock a stalled deal", tacticalCredits: "8", impactCredits: "8", enterpriseCredits: "7", customPrice: "8"}
      ],
      expandedItems: ["Unblock a stalled deal"]
    };
    
    // Test the debug endpoint with real playbooks
    console.log('\nTesting debug endpoint with real playbooks...');
    const debugData = await makeRequest('/api/debug-recommendations', testData);
    
    console.log('Debug endpoint response:');
    console.log(`Playbooks count: ${debugData.counts.playbooks}`);
    console.log('Sample playbooks:');
    debugData.samples.playbooks.forEach(p => console.log(`- ${p.title} (${p.category}, ${p.stage})`));
    
    // Check if the correct number of playbooks were included
    const playbooksIncluded = debugData.counts.playbooks === playbooks.length;
    console.log(`\nCorrect number of playbooks included: ${playbooksIncluded ? 'YES ✅' : 'NO ❌'} (${debugData.counts.playbooks} vs ${playbooks.length} expected)`);
    
    return playbooksIncluded;
  } catch (error) {
    console.error('Error testing with real playbooks:', error);
    return false;
  }
}

// Run the test
testWithRealPlaybooks().then(success => {
  console.log(`\nTest completed: ${success ? 'SUCCESS ✅' : 'FAILED ❌'}`);
  process.exit(success ? 0 : 1);
});
