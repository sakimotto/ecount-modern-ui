/**
 * ECOUNT API Test Script
 * 
 * This script tests the connection to the ECOUNT API using your API key.
 * Run this script with Node.js to verify your API connection.
 * 
 * Usage:
 * 1. Replace the API_KEY value with your actual ECOUNT API key
 * 2. Run: node test-ecount-api.js
 */

// Your ECOUNT API key - Replace with your actual key
const API_KEY = 'PASTE_YOUR_ECOUNT_API_KEY_HERE';

// Base URL for the ECOUNT API - Adjust based on your ECOUNT URL
const API_BASE_URL = 'https://loginins.ecount.com';

// Required for making HTTP requests in Node.js
const https = require('https');
const querystring = require('querystring');

/**
 * Test the ECOUNT API connection
 */
async function testEcountApiConnection() {
    console.log('Testing ECOUNT API connection...');
    console.log(`API Base URL: ${API_BASE_URL}`);
    console.log(`API Key: ${API_KEY.substring(0, 5)}...${API_KEY.substring(API_KEY.length - 5)}`);
    
    try {
        // Test authentication
        console.log('\n1. Testing Authentication...');
        const authResult = await makeRequest('/ECERP/ECP/ECP050M', 'GET', {
            apiKey: API_KEY
        });
        
        if (authResult.success) {
            console.log('✅ Authentication successful!');
            console.log(`Token: ${authResult.token}`);
        } else {
            console.log('❌ Authentication failed!');
            console.log(`Error: ${authResult.message}`);
            return;
        }
        
        // Test data retrieval
        console.log('\n2. Testing Data Retrieval...');
        const dataResult = await makeRequest('/ECERP/ECP/ECP051M', 'GET', {
            token: authResult.token
        });
        
        if (dataResult.success) {
            console.log('✅ Data retrieval successful!');
            console.log(`Retrieved ${dataResult.data.length} records`);
        } else {
            console.log('❌ Data retrieval failed!');
            console.log(`Error: ${dataResult.message}`);
        }
        
        console.log('\nAPI Test Complete!');
        
    } catch (error) {
        console.error('❌ Error testing API connection:', error.message);
        
        if (error.message.includes('ENOTFOUND')) {
            console.log('\nPossible causes:');
            console.log('- The API base URL is incorrect');
            console.log('- Your internet connection is not working');
            console.log('- The ECOUNT server is down');
        } else if (error.message.includes('401')) {
            console.log('\nPossible causes:');
            console.log('- Your API key is incorrect or expired');
            console.log('- Your account does not have API access permissions');
        } else if (error.message.includes('CORS')) {
            console.log('\nPossible causes:');
            console.log('- CORS is not enabled on the ECOUNT server');
            console.log('- You need to use a CORS proxy');
        }
    }
}

/**
 * Make an HTTP request to the ECOUNT API
 */
function makeRequest(endpoint, method, params) {
    return new Promise((resolve, reject) => {
        const queryParams = querystring.stringify(params);
        const url = `${API_BASE_URL}${endpoint}?${queryParams}`;
        
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };
        
        const req = https.request(url, options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    // Try to parse as JSON
                    const jsonData = JSON.parse(data);
                    resolve(jsonData);
                } catch (e) {
                    // If not JSON, return as text
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve({
                            success: true,
                            message: 'Request successful but response is not JSON',
                            data: data
                        });
                    } else {
                        reject(new Error(`HTTP Error ${res.statusCode}: ${data}`));
                    }
                }
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        req.end();
    });
}

// Run the test
testEcountApiConnection();