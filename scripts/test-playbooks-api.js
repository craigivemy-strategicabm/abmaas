#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Test query specifically about a playbook
const testQuery = "I need help with a stalled deal that's not progressing. What playbooks do you recommend?";

// Function to run the test
async function testPlaybooksAPI() {
  try {
    console.log('Testing Playbooks API Integration...');
    
    // Import the necessary data directly from the source files
    const { ALL_PLAYBOOKS } = require('../src/components/PlaybooksNetflixLayout');
    const { ITEM_GROUPS, itemDescriptions, itemGroups } = require('../src/abmTiersComponent');
    
    // Sample expanded items for testing
    const expandedItems = ['Unblock a stalled deal'];
    
    // Log the number of playbooks being sent
    console.log(`Sending ${ALL_PLAYBOOKS.length} playbooks to the API`);
    
    // Make the API call
    const response = await fetch('http://localhost:3001/api/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: testQuery,
        deliverables: ITEM_GROUPS,
        selectedTier: 'Tactical ABM',
        playbooks: ALL_PLAYBOOKS,
        descriptions: itemDescriptions,
        activationItems: itemGroups.activation,
        expandedItems: expandedItems
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.details || 'Failed to get recommendations');
    }
    
    const data = await response.json();
    
    // Save the full API response to a file for inspection
    fs.writeFileSync(
      path.resolve(__dirname, 'api-response.json'), 
      JSON.stringify(data, null, 2)
    );
    
    console.log('\n--- API RESPONSE ---');
    console.log(data.recommendation);
    console.log('\n--- TOKEN USAGE ---');
    console.log(data.usage);
    
    // Check if the response mentions any playbooks
    const playbookTitles = ALL_PLAYBOOKS.map(p => p.title.toLowerCase());
    const responseContainsPlaybooks = playbookTitles.some(title => 
      data.recommendation.toLowerCase().includes(title)
    );
    
    console.log('\n--- TEST RESULTS ---');
    console.log(`Response contains playbook references: ${responseContainsPlaybooks ? 'YES ✅' : 'NO ❌'}`);
    
    // Check specifically for "Unblock a stalled deal" playbook
    const containsStalledDealPlaybook = data.recommendation.toLowerCase().includes('unblock a stalled deal');
    console.log(`Response contains "Unblock a stalled deal" playbook: ${containsStalledDealPlaybook ? 'YES ✅' : 'NO ❌'}`);
    
    return {
      success: true,
      containsPlaybooks: responseContainsPlaybooks,
      containsStalledDealPlaybook
    };
  } catch (error) {
    console.error('Error testing API:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the test
testPlaybooksAPI().then(result => {
  console.log('\nTest completed.');
  process.exit(result.success ? 0 : 1);
});
