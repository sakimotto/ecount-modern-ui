# Testing ECOUNT API Integration - Step by Step Guide

This guide will walk you through the process of testing the integration between your modern UI and the ECOUNT ERP system.

## Prerequisites
- ECOUNT ERP system with API access
- API Authentication Key from ECOUNT
- Modern UI application running on a local server

## Step 1: Insert Your API Key

1. Open the `real-api.js` file in the project
2. Replace the placeholder with your actual ECOUNT API key:
   ```javascript
   const API_KEY = 'PASTE_YOUR_ECOUNT_API_KEY_HERE';
   ```
3. Save the file

## Step 2: Update the Base URL (if needed)

1. In the same `real-api.js` file, verify that the base URL matches your ECOUNT instance:
   ```javascript
   const API_BASE_URL = 'https://loginins.ecount.com';
   ```
2. If your ECOUNT instance has a different URL, update it accordingly
3. Save the file

## Step 3: Switch to Using the ECOUNT API

1. Open the `index.html` file
2. Find the script tag that loads the API:
   ```html
   <script id="api-script" src="api-mock.js"></script>
   ```
3. Change it to use the real API:
   ```html
   <script id="api-script" src="real-api.js"></script>
   ```
4. Save the file

## Step 4: Test the Integration

1. Start the local server (if not already running):
   ```
   npm start
   ```
   or
   ```
   npx http-server -p 8000
   ```

2. Open the application in your browser (http://localhost:8000)

3. Check the browser console (F12 > Console) for authentication messages:
   - You should see "Authenticating with ECOUNT API..."
   - If successful, you'll see "Authentication with ECOUNT successful"
   - If there's an error, you'll see details about what went wrong

4. Test the functionality:
   - Navigate through the tabs (Purchase Orders, Vendors, Purchase History)
   - Try creating a new purchase order
   - Check if vendor data is loading correctly

## Troubleshooting

### Authentication Errors
- Verify that your API key is correct and not expired
- Check that the base URL is correct for your ECOUNT instance
- Ensure your ECOUNT account has API access permissions

### CORS Issues
If you see errors like "Access to fetch at '...' from origin 'http://localhost:8000' has been blocked by CORS policy":

1. You may need to use a CORS proxy
2. Add this before your fetch calls in real-api.js:
   ```javascript
   const corsProxy = 'https://cors-anywhere.herokuapp.com/';
   const url = corsProxy + apiEndpoint;
   ```

### Network Errors
- Check your internet connection
- Verify that your ECOUNT system is accessible
- Try accessing the ECOUNT API directly using a tool like Postman

## Next Steps After Successful Testing

1. Refine the API integration based on your specific needs
2. Add more endpoints for additional functionality
3. Implement error handling and user feedback
4. Deploy the application to a production environment

## Need Help?

If you encounter issues that you can't resolve, please provide:
1. The specific error message from the console
2. The steps you took that led to the error
3. Any changes you made to the code