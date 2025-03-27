/**
 * ECOUNT Modern UI - Real API Integration
 * 
 * This file demonstrates how to connect to the sample ECOUNT API server.
 * To use this with the actual application:
 * 
 * 1. Start the sample API server: npm run api
 * 2. In your HTML file, replace api-mock.js with real-api.js
 */

// API key for authentication - Replace with your actual ECOUNT API key
const API_KEY = 'YOUR_ECOUNT_API_KEY_HERE';

// Base URL for the ECOUNT API
const API_BASE_URL = 'https://api.ecount.com';  // Replace with your actual ECOUNT API endpoint

/**
 * Real API Class for ECOUNT Integration
 */
class RealEcountAPI {
    constructor(apiKey, baseUrl = API_BASE_URL) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        this.isAuthenticated = false;
        this.authToken = null;
    }
    
    /**
     * Check if authenticated
     */
    checkAuth() {
        if (!this.isAuthenticated || !this.authToken) {
            throw new Error('Not authenticated. Call authenticate() first.');
        }
    }
    
    /**
     * Authenticate with the ECOUNT API
     *
     * ECOUNT API uses a different authentication method than our mock API.
     * This method authenticates using the API key issued from the ECOUNT system.
     */
    async authenticate() {
        console.log('Authenticating with ECOUNT API...');
        
        try {
            // ECOUNT API typically uses API key in the header for authentication
            // This is a placeholder - adjust based on actual ECOUNT API documentation
            const response = await fetch(`${this.baseUrl}/ECERP/ECP/ECP050M`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            // Check if the response is successful
            if (response.ok) {
                const data = await response.json();
                this.isAuthenticated = true;
                this.authToken = this.apiKey; // ECOUNT might use the API key directly
                console.log('Authentication with ECOUNT successful');
                return data;
            } else {
                const errorData = await response.json();
                console.error('ECOUNT authentication failed:', errorData);
                throw new Error(errorData.message || `Authentication failed with status ${response.status}`);
            }
        } catch (error) {
            console.error('ECOUNT API Error:', error);
            throw error;
        }
    }
    
    /**
     * Get dashboard statistics from ECOUNT
     *
     * This method retrieves purchase-related statistics from the ECOUNT API
     * and transforms them into the format our front-end expects.
     */
    async getDashboardStats() {
        this.checkAuth();
        
        try {
            // Make requests to ECOUNT API endpoints to gather dashboard data
            // These endpoints should be adjusted based on actual ECOUNT API documentation
            
            // Get open purchase orders count
            const openPOsResponse = await fetch(`${this.baseUrl}/ECERP/ECP/ECP051M`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.authToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                // Add query parameters to filter for open POs
                // This is a placeholder - adjust based on actual ECOUNT API
                params: {
                    Status: 'Open'
                }
            });
            
            // Get total spend data
            const spendResponse = await fetch(`${this.baseUrl}/ECERP/ECP/ECP052M`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.authToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            // Process responses
            if (openPOsResponse.ok && spendResponse.ok) {
                const openPOsData = await openPOsResponse.json();
                const spendData = await spendResponse.json();
                
                // Transform ECOUNT data into our dashboard format
                // This is a placeholder - adjust based on actual ECOUNT API response structure
                return {
                    openPOs: openPOsData.length || 0,
                    totalSpend: spendData.totalAmount || 0,
                    activeVendors: 37, // This would come from another ECOUNT API call
                    pendingDeliveries: 12, // This would come from another ECOUNT API call
                    trends: {
                        openPOs: 12,
                        totalSpend: -5,
                        activeVendors: 8,
                        pendingDeliveries: 0
                    }
                };
            } else {
                throw new Error('Failed to fetch dashboard stats from ECOUNT');
            }
        } catch (error) {
            console.error('ECOUNT API Error:', error);
            throw error;
        }
    }
    
    /**
     * Get vendors
     */
    async getVendors(filters = {}) {
        this.checkAuth();
        
        try {
            // Build query string from filters
            const queryParams = new URLSearchParams();
            
            if (filters.status) {
                queryParams.append('status', filters.status);
            }
            
            if (filters.search) {
                queryParams.append('search', filters.search);
            }
            
            const queryString = queryParams.toString();
            const url = `${this.baseUrl}/api/vendors${queryString ? `?${queryString}` : ''}`;
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${this.authToken}`
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                return data.data;
            } else {
                throw new Error(data.message || 'Failed to fetch vendors');
            }
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    /**
     * Get vendor by ID
     */
    async getVendor(id) {
        this.checkAuth();
        
        try {
            const response = await fetch(`${this.baseUrl}/api/vendors/${id}`, {
                headers: {
                    'Authorization': `Bearer ${this.authToken}`
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                return data.data;
            } else {
                throw new Error(data.message || 'Vendor not found');
            }
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    /**
     * Create vendor
     */
    async createVendor(vendorData) {
        this.checkAuth();
        
        try {
            const response = await fetch(`${this.baseUrl}/api/vendors`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.authToken}`
                },
                body: JSON.stringify(vendorData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                return data.data;
            } else {
                throw new Error(data.message || 'Failed to create vendor');
            }
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    /**
     * Update vendor
     */
    async updateVendor(id, vendorData) {
        this.checkAuth();
        
        try {
            const response = await fetch(`${this.baseUrl}/api/vendors/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.authToken}`
                },
                body: JSON.stringify(vendorData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                return data.data;
            } else {
                throw new Error(data.message || 'Failed to update vendor');
            }
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    /**
     * Delete vendor
     */
    async deleteVendor(id) {
        this.checkAuth();
        
        try {
            const response = await fetch(`${this.baseUrl}/api/vendors/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.authToken}`
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                return true;
            } else {
                throw new Error(data.message || 'Failed to delete vendor');
            }
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    /**
     * Get purchase orders
     */
    async getPurchaseOrders(filters = {}) {
        this.checkAuth();
        
        try {
            // Build query string from filters
            const queryParams = new URLSearchParams();
            
            if (filters.status) {
                queryParams.append('status', filters.status);
            }
            
            if (filters.vendorId) {
                queryParams.append('vendorId', filters.vendorId);
            }
            
            if (filters.dateFrom) {
                queryParams.append('dateFrom', filters.dateFrom);
            }
            
            if (filters.dateTo) {
                queryParams.append('dateTo', filters.dateTo);
            }
            
            if (filters.search) {
                queryParams.append('search', filters.search);
            }
            
            const queryString = queryParams.toString();
            const url = `${this.baseUrl}/api/purchase-orders${queryString ? `?${queryString}` : ''}`;
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${this.authToken}`
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                return data.data;
            } else {
                throw new Error(data.message || 'Failed to fetch purchase orders');
            }
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    /**
     * Get purchase order by ID
     */
    async getPurchaseOrder(id) {
        this.checkAuth();
        
        try {
            const response = await fetch(`${this.baseUrl}/api/purchase-orders/${id}`, {
                headers: {
                    'Authorization': `Bearer ${this.authToken}`
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                return data.data;
            } else {
                throw new Error(data.message || 'Purchase order not found');
            }
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    /**
     * Create purchase order
     */
    async createPurchaseOrder(orderData) {
        this.checkAuth();
        
        try {
            const response = await fetch(`${this.baseUrl}/api/purchase-orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.authToken}`
                },
                body: JSON.stringify(orderData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                return data.data;
            } else {
                throw new Error(data.message || 'Failed to create purchase order');
            }
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
}

// Create global API instance
window.ecountAPI = new RealEcountAPI(API_KEY);

// Auto-authenticate on page load
window.addEventListener('DOMContentLoaded', async () => {
    try {
        await window.ecountAPI.authenticate();
        console.log('API authenticated successfully');
    } catch (error) {
        console.error('API authentication failed:', error);
        showNotification('API authentication failed. Please check your API key.', 'error');
    }
});

/**
 * Show notification
 * This is a utility function to display notifications to the user
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style notification
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '4px';
    notification.style.zIndex = '1000';
    notification.style.animation = 'fadeIn 0.3s, fadeOut 0.3s 2.7s';
    
    // Set background color based on type
    if (type === 'success') {
        notification.style.backgroundColor = 'var(--success-color, #2ecc71)';
    } else if (type === 'error') {
        notification.style.backgroundColor = 'var(--danger-color, #e74c3c)';
    } else if (type === 'warning') {
        notification.style.backgroundColor = 'var(--warning-color, #f39c12)';
    } else {
        notification.style.backgroundColor = 'var(--info-color, #3498db)';
    }
    
    notification.style.color = 'white';
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(20px); }
        }
    `;
    document.head.appendChild(style);
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}