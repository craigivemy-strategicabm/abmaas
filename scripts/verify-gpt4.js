/**
 * GPT-4 Verification Script
 * 
 * This script verifies that your application is correctly configured to use GPT-4
 * and provides guidance on how to ensure it's properly set up.
 */

const fs = require('fs');
const path = require('path');

console.log('\n=== GPT-4 Configuration Verification ===\n');

// Check for .env file
try {
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    console.log('✅ .env file exists');
    
    // Read .env file content
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    // Check for OpenAI API key
    if (envContent.includes('OPENAI_API_KEY=')) {
      console.log('✅ OPENAI_API_KEY is configured in .env file');
    } else {
      console.log('❌ OPENAI_API_KEY may be missing in your .env file');
      console.log('   Please add your OpenAI API key to the .env file:');
      console.log('   OPENAI_API_KEY=your_api_key_here');
    }
    
    // Check frontend configuration
    if (envContent.includes('REACT_APP_USE_GPT4=false')) {
      console.log('❌ REACT_APP_USE_GPT4 is set to false in your .env file');
      console.log('   To use GPT-4, set REACT_APP_USE_GPT4=true in your .env file');
    } else if (envContent.includes('REACT_APP_USE_GPT4=true') || !envContent.includes('REACT_APP_USE_GPT4=')) {
      console.log('✅ Frontend is configured to use GPT-4');
    }
  } else {
    console.log('❌ .env file not found');
    console.log('   Please create a .env file in the project root with:');
    console.log('   OPENAI_API_KEY=your_api_key_here');
    console.log('   REACT_APP_USE_GPT4=true');
  }
} catch (error) {
  console.error('Error checking .env file:', error.message);
}

// Check server configuration
try {
  const apiPath = path.resolve(__dirname, '../server/api.js');
  const apiContent = fs.readFileSync(apiPath, 'utf8');
  
  if (apiContent.includes("model: 'gpt-4'")) {
    console.log('✅ Server is configured to use GPT-4');
  } else {
    console.log('❌ Server may not be using GPT-4');
    console.log('   Check the model parameter in server/api.js');
  }
} catch (error) {
  console.error('Error reading server configuration:', error.message);
}

console.log('\n=== GPT-4 Usage Instructions ===\n');
console.log('To ensure your application uses GPT-4:');
console.log('1. Make sure your .env file contains:');
console.log('   OPENAI_API_KEY=your_valid_openai_api_key');
console.log('   REACT_APP_USE_GPT4=true');
console.log('2. Verify that server/api.js uses model: "gpt-4"');
console.log('3. Restart your server after making any changes');
console.log('\nYour application should now be using GPT-4 for all recommendations!\n');
