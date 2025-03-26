# ECOUNT API Integration Testing Guide

This guide will help you test the integration between the modern UI and your ECOUNT ERP system.

## Prerequisites

1. An API key from your ECOUNT ERP system
2. Basic knowledge of JavaScript and API concepts
3. The modern UI application running on a local server

## Step 1: Obtain an API Key

1. Log in to your ECOUNT ERP system
2. Navigate to the API Authentication Key Issuance page
3. Click the "Issue" button to generate a new API key
4. Copy the API key for use in the next steps

## Step 2: Configure the API Integration

1. Open the `api-mock.js` file in the project
2. Replace the mock API key with your actual API key:

```javascript
// Replace this with your actual ECOUNT API key for real integration testing
const API_KEY = 'your_actual_ecount_api_key_here';
```

3. If your ECOUNT API has a different base URL, update the example in the RealEcountAPI class:

```javascript
constructor(apiKey, baseUrl = 'https://your-ecount-instance.com/api') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.isAuthenticated = false;
}
```

## Step 3: Implement Real API Integration

To switch from the mock API to a real API integration:

1. Create a new file called `real-api.js` based on the example in `api-mock.js`
2. Implement the RealEcountAPI class with all the necessary methods
3. Update the script.js file to use the RealEcountAPI instead of the mock API:

```javascript
// Replace this:
window.ecountAPI = new EcountAPI(API_KEY);

// With this:
window.ecountAPI = new RealEcountAPI(API_KEY);
```

## Step 4: Test the API Endpoints

Here are the key endpoints you'll need to implement:

### Authentication

```javascript
async authenticate() {
    // POST request to /api/auth with your API key
}
```

### Dashboard Statistics

```javascript
async getDashboardStats() {
    // GET request to /api/dashboard/stats
}
```

### Vendors

```javascript
async getVendors(filters = {}) {
    // GET request to /api/vendors with optional filters
}

async getVendor(id) {
    // GET request to /api/vendors/{id}
}

async createVendor(vendorData) {
    // POST request to /api/vendors
}

async updateVendor(id, vendorData) {
    // PUT request to /api/vendors/{id}
}

async deleteVendor(id) {
    // DELETE request to /api/vendors/{id}
}
```

### Purchase Orders

```javascript
async getPurchaseOrders(filters = {}) {
    // GET request to /api/purchase-orders with optional filters
}

async getPurchaseOrder(id) {
    // GET request to /api/purchase-orders/{id}
}

async createPurchaseOrder(orderData) {
    // POST request to /api/purchase-orders
}

async updatePurchaseOrder(id, orderData) {
    // PUT request to /api/purchase-orders/{id}
}

async deletePurchaseOrder(id) {
    // DELETE request to /api/purchase-orders/{id}
}
```

## Step 5: Error Handling

Ensure your API integration handles errors gracefully:

```javascript
try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || `Error: ${response.status}`);
    }
    
    return data;
} catch (error) {
    console.error('API Error:', error);
    // Show user-friendly error message
    showNotification(`API Error: ${error.message}`, 'error');
    throw error;
}
```

## Step 6: Testing

1. Start the application with the real API integration
2. Test each feature:
   - Authentication
   - Dashboard data loading
   - Vendor management
   - Purchase order creation and management
3. Check the browser console for any errors
4. Verify that data is being correctly sent to and received from your ECOUNT ERP system

## Troubleshooting

- **Authentication Errors**: Verify your API key is correct and not expired
- **CORS Issues**: You may need to configure CORS settings on your ECOUNT server
- **Data Format Errors**: Ensure the data format matches what the ECOUNT API expects
- **Network Errors**: Check your network connection and firewall settings

## Next Steps

Once basic API integration is working, you can:

1. Implement caching for better performance
2. Add offline support with local storage
3. Implement real-time updates with WebSockets (if supported by ECOUNT)
4. Add more advanced features like reporting and analytics