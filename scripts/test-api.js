#!/usr/bin/env node

// Simple script to test if playbooks are being included in the API call
const https = require('https');
const http = require('http');

// Test query about stalled deals
const testQuery = "I need help with a stalled deal that's not progressing. What playbooks do you recommend?";

// Sample data for testing
const testData = {
  query: testQuery,
  deliverables: {
    insights: [
      {title: "Sample Insight", tacticalCredits: "2", impactCredits: "2", enterpriseCredits: "2", customPrice: "2"}
    ]
  },
  selectedTier: 'Tactical ABM',
  playbooks: [
    {
      title: "Unblock a stalled deal",
      category: "net-new",
      stage: "Influence",
      tacticalCredits: "8",
      impactCredits: "8",
      enterpriseCredits: "7",
      customPrice: "8",
      description: "A strategic playbook designed to reactivate and accelerate stalled opportunities through targeted engagement and value reinforcement."
    },
    {
      title: "Pipeline velocity",
      category: "net-new",
      stage: "Influence",
      tacticalCredits: "8",
      impactCredits: "8",
      enterpriseCredits: "7",
      customPrice: "8",
      description: "A strategic framework to accelerate deal progression through targeted engagement tactics."
    }
  ],
  descriptions: {
    "Unblock a stalled deal": "This playbook focuses on reactivating and accelerating stalled opportunities through targeted engagement and value reinforcement."
  },
  activationItems: [
    {title: "Unblock a stalled deal", tacticalCredits: "8", impactCredits: "8", enterpriseCredits: "7", customPrice: "8"}
  ],
  expandedItems: ["Unblock a stalled deal"]
};

// Function to make an HTTP request
function makeRequest(endpoint) {
  return new Promise((resolve, reject) => {
    // Convert data to JSON string
    const postData = JSON.stringify(testData);
    
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

// Test the debug endpoint
async function testDebugEndpoint() {
  console.log('Testing debug endpoint...');
  try {
    const data = await makeRequest('/api/debug-recommendations');
    console.log('Debug endpoint response:');
    console.log(JSON.stringify(data, null, 2));
    
    // Check if playbooks were included
    const playbooksCount = data.counts?.playbooks || 0;
    console.log(`\nPlaybooks included in request: ${playbooksCount > 0 ? 'YES ✅' : 'NO ❌'}`);
    console.log(`Number of playbooks: ${playbooksCount}`);
    
    if (data.samples?.playbooks?.length > 0) {
      console.log('Sample playbook titles:');
      data.samples.playbooks.forEach(p => console.log(`- ${p.title}`));
    }
    
    return true;
  } catch (error) {
    console.error('Error testing debug endpoint:', error.message);
    return false;
  }
}

// Test the full API
async function testFullAPI() {
  console.log('\nTesting full recommendations API...');
  try {
    const data = await makeRequest('/api/recommendations');
    console.log('API response:');
    console.log(data.recommendation);
    
    // Check if the response mentions playbooks
    const containsStalledDealPlaybook = data.recommendation.toLowerCase().includes('unblock a stalled deal');
    const containsPipelineVelocity = data.recommendation.toLowerCase().includes('pipeline velocity');
    
    console.log(`\nResponse mentions "Unblock a stalled deal" playbook: ${containsStalledDealPlaybook ? 'YES ✅' : 'NO ❌'}`);
    console.log(`Response mentions "Pipeline velocity" playbook: ${containsPipelineVelocity ? 'YES ✅' : 'NO ❌'}`);
    
    if (data.usage) {
      console.log('Token usage:', data.usage);
    }
    
    return true;
  } catch (error) {
    console.error('Error testing full API:', error.message);
    return false;
  }
}

// Run the tests
async function runTests() {
  console.log('=== TESTING PLAYBOOKS API INTEGRATION ===\n');
  
  // Test both endpoints
  const debugSuccess = await testDebugEndpoint();
  const apiSuccess = await testFullAPI();
  
  console.log('\n=== TEST SUMMARY ===');
  console.log(`Debug endpoint test: ${debugSuccess ? 'SUCCESS ✅' : 'FAILED ❌'}`);
  console.log(`Full API test: ${apiSuccess ? 'SUCCESS ✅' : 'FAILED ❌'}`);
  
  process.exit(debugSuccess && apiSuccess ? 0 : 1);
}

// Run the tests
runTests();
