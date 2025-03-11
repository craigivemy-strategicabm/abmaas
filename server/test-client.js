// Test client to send a request to the debug server
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Import the necessary data from the source files
const { ALL_PLAYBOOKS } = require('../src/components/PlaybooksNetflixLayout');
const { ITEM_GROUPS, itemDescriptions, itemGroups } = require('../src/abmTiersComponent');

async function testDebugEndpoint() {
  try {
    // Test with a stalled deal query
    const response = await fetch('http://localhost:3002/api/debug-recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: 'Do you have a playbook that supports unblocking a stalled deal?',
        deliverables: ITEM_GROUPS,
        selectedTier: 'Tactical ABM',
        playbooks: ALL_PLAYBOOKS,
        descriptions: itemDescriptions,
        activationItems: itemGroups.activation
      }),
    });

    const data = await response.json();
    console.log('Debug request completed successfully');
    
    // Read the saved debug data
    const debugData = JSON.parse(fs.readFileSync(path.join(__dirname, 'debug-data.json'), 'utf8'));
    
    // Print the exact system prompt and user instructions
    console.log('\n=== EXACT SYSTEM PROMPT ===\n');
    console.log(debugData.systemPrompt);
    
    console.log('\n=== EXACT USER INSTRUCTIONS ===\n');
    console.log(debugData.userInstructions);
    
    // Print confirmation
    console.log('\nDebug data has been saved to server/debug-data.json');
  } catch (error) {
    console.error('Error testing debug endpoint:', error);
  }
}

// Run the test
testDebugEndpoint();
