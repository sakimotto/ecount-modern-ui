# ECOUNT API Integration Guide

This guide provides specific instructions for integrating the modern UI with your ECOUNT ERP system.

## Prerequisites

1. ECOUNT ERP system with API access
2. API Authentication Key issued from ECOUNT
3. Basic knowledge of REST APIs and JavaScript

## Step 1: Obtain an API Key from ECOUNT

1. Log in to your ECOUNT ERP system
2. Navigate to: User Customization > Information > API Authentication Key Issuance
3. Click the "Issue" button
4. Confirm the issuance in the notification dialog
5. Copy the generated API key

Note: The Authentication Key will be permanently deleted 3 months after the expiration date.

## Step 2: Configure the API Integration

1. Open the `real-api.js` file in the project
2. Replace the placeholder API key with your actual ECOUNT API key:

```javascript
// API key for authentication - Replace with your actual ECOUNT API key
const API_KEY = 'YOUR_ECOUNT_API_KEY_HERE';
```

3. Update the API base URL if necessary:

```javascript
// Base URL for the ECOUNT API
const API_BASE_URL = 'https://api.ecount.com';  // Replace with your actual ECOUNT API endpoint
```

## Step 3: Test the Integration

1. Update the index.html file to use the real API implementation:

```html
<!-- Replace this line -->
<script src="api-mock.js"></script>

<!-- With this line -->
<script src="real-api.js"></script>
```

2. Open the application in a browser
3. Check the browser console for authentication status
4. Verify that data is being loaded from ECOUNT

## ECOUNT API Endpoints

Based on the ECOUNT URL structure, here are the likely endpoints for different functionalities:

### Authentication
- `/ECERP/ECP/ECP050M` - API Authentication

### Purchase Orders
- `/ECERP/ECP/ECP051M` - Purchase Order List
- `/ECERP/ECP/ECP052M` - Purchase Order Details
- `/ECERP/ECP/ECP053M` - Create Purchase Order
- `/ECERP/ECP/ECP054M` - Update Purchase Order

### Vendors
- `/ECERP/ECP/ECP060M` - Vendor List
- `/ECERP/ECP/ECP061M` - Vendor Details
- `/ECERP/ECP/ECP062M` - Create Vendor
- `/ECERP/ECP/ECP063M` - Update Vendor

Note: The actual endpoints may differ. Refer to the ECOUNT API documentation for the correct endpoints.

## Handling CORS Issues

If you encounter Cross-Origin Resource Sharing (CORS) issues when connecting to the ECOUNT API, you may need to:

1. Request CORS configuration from ECOUNT support
2. Use a proxy server to make the API requests
3. Create a server-side component to handle the API requests

## Error Handling

Common ECOUNT API errors:

- **401 Unauthorized**: Invalid or expired API key
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Endpoint not found
- **500 Internal Server Error**: Server-side error

Implement proper error handling in your code:

```javascript
try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
    }
    
    return await response.json();
} catch (error) {
    console.error('ECOUNT API Error:', error);
    // Show user-friendly error message
    showNotification(`API Error: ${error.message}`, 'error');
    throw error;
}
```

## Next Steps

After successfully integrating with the ECOUNT API:

1. Implement caching to reduce API calls
2. Add more comprehensive error handling
3. Implement user authentication based on ECOUNT user roles
4. Expand the integration to include more ECOUNT modules

## Support

If you encounter issues with the ECOUNT API:

1. Check the ECOUNT API documentation
2. Contact ECOUNT support for API-specific questions
3. Review the browser console for detailed error messages