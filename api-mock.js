/**
 * ECOUNT Modern UI - Purchase Module
 * Mock API for demonstration purposes
 *
 * This file simulates the ECOUNT ERP API for testing purposes.
 * In a production environment, this would be replaced with actual API calls.
 *
 * API INTEGRATION GUIDE:
 *
 * 1. Authentication:
 *    - Obtain an API key from ECOUNT ERP (API Authentication Key Issuance page)
 *    - Use the key for all API requests
 *
 * 2. API Endpoints:
 *    - Authentication: /api/auth
 *    - Dashboard Stats: /api/dashboard/stats
 *    - Vendors: /api/vendors
 *    - Items: /api/items
 *    - Purchase Orders: /api/purchase-orders
 *
 * 3. Response Format:
 *    All responses follow the format:
 *    {
 *      success: true/false,
 *      data: {...} or [...],
 *      message: "Success/error message"
 *    }
 *
 * 4. Error Handling:
 *    - 401: Authentication error
 *    - 404: Resource not found
 *    - 400: Bad request
 *    - 500: Server error
 */

// Mock API key for authentication
// Replace this with your actual ECOUNT API key for real integration testing
const API_KEY = 'ecount_api_key_12345';

// Mock data storage (in a real app, this would be on the server)
const mockDatabase = {
    vendors: [
        {
            id: 1,
            name: 'ABC Supplies',
            contact: 'John Smith',
            email: 'john@abcsupplies.com',
            phone: '555-123-4567',
            address: '123 Main St, Anytown, USA',
            status: 'active',
            category: 'supplier'
        },
        {
            id: 2,
            name: 'XYZ Manufacturing',
            contact: 'Jane Doe',
            email: 'jane@xyzmanufacturing.com',
            phone: '555-987-6543',
            address: '456 Oak Ave, Somewhere, USA',
            status: 'active',
            category: 'manufacturer'
        },
        {
            id: 3,
            name: 'Global Parts Inc.',
            contact: 'Bob Johnson',
            email: 'bob@globalparts.com',
            phone: '555-456-7890',
            address: '789 Pine St, Nowhere, USA',
            status: 'inactive',
            category: 'distributor'
        }
    ],
    
    items: [
        {
            id: 'item1',
            name: 'Widget A',
            description: 'Standard widget for general use',
            price: 10.99,
            unit: 'ea',
            category: 'widgets'
        },
        {
            id: 'item2',
            name: 'Widget B',
            description: 'Premium widget for specialized applications',
            price: 24.99,
            unit: 'ea',
            category: 'widgets'
        },
        {
            id: 'item3',
            name: 'Component X',
            description: 'Basic component for assemblies',
            price: 5.49,
            unit: 'ea',
            category: 'components'
        }
    ],
    
    purchaseOrders: [
        {
            id: 'PO-2023-001',
            vendorId: 1,
            date: '2023-06-15',
            deliveryDate: '2023-06-30',
            status: 'open',
            paymentTerms: 'net30',
            shippingMethod: 'ground',
            currency: 'usd',
            items: [
                { itemId: 'item1', quantity: 50, price: 10.99 },
                { itemId: 'item3', quantity: 100, price: 5.49 }
            ],
            subtotal: 1099.50,
            tax: 109.95,
            shipping: 40.55,
            total: 1250.00
        },
        {
            id: 'PO-2023-002',
            vendorId: 2,
            date: '2023-06-10',
            deliveryDate: '2023-06-25',
            status: 'closed',
            paymentTerms: 'net60',
            shippingMethod: 'express',
            currency: 'usd',
            items: [
                { itemId: 'item2', quantity: 150, price: 24.99 }
            ],
            subtotal: 3748.50,
            tax: 374.85,
            shipping: 126.65,
            total: 3750.00
        },
        {
            id: 'PO-2023-003',
            vendorId: 3,
            date: '2023-06-05',
            deliveryDate: '2023-06-20',
            status: 'cancelled',
            paymentTerms: 'cod',
            shippingMethod: 'pickup',
            currency: 'usd',
            items: [
                { itemId: 'item1', quantity: 25, price: 10.99 },
                { itemId: 'item2', quantity: 25, price: 24.99 }
            ],
            subtotal: 899.50,
            tax: 89.95,
            shipping: 0,
            total: 950.00
        }
    ],
    
    dashboardStats: {
        openPOs: 24,
        totalSpend: 45678,
        activeVendors: 37,
        pendingDeliveries: 12,
        trends: {
            openPOs: 12, // percentage change
            totalSpend: -5,
            activeVendors: 8,
            pendingDeliveries: 0
        }
    }
};

/**
 * REAL API INTEGRATION EXAMPLE:
 *
 * To integrate with the actual ECOUNT API, you would replace this mock class
 * with real API calls. Here's an example of how you might implement it:
 *
 * ```javascript
 * class RealEcountAPI {
 *     constructor(apiKey, baseUrl = 'https://api.ecount.com') {
 *         this.apiKey = apiKey;
 *         this.baseUrl = baseUrl;
 *         this.isAuthenticated = false;
 *     }
 *
 *     async authenticate() {
 *         try {
 *             const response = await fetch(`${this.baseUrl}/api/auth`, {
 *                 method: 'POST',
 *                 headers: {
 *                     'Content-Type': 'application/json'
 *                 },
 *                 body: JSON.stringify({ apiKey: this.apiKey })
 *             });
 *
 *             const data = await response.json();
 *
 *             if (data.success) {
 *                 this.isAuthenticated = true;
 *                 this.authToken = data.token; // Store auth token for subsequent requests
 *                 return data;
 *             } else {
 *                 throw new Error(data.message || 'Authentication failed');
 *             }
 *         } catch (error) {
 *             console.error('Authentication error:', error);
 *             throw error;
 *         }
 *     }
 *
 *     async getDashboardStats() {
 *         this.checkAuth();
 *
 *         try {
 *             const response = await fetch(`${this.baseUrl}/api/dashboard/stats`, {
 *                 headers: {
 *                     'Authorization': `Bearer ${this.authToken}`
 *                 }
 *             });
 *
 *             return await response.json();
 *         } catch (error) {
 *             console.error('Error fetching dashboard stats:', error);
 *             throw error;
 *         }
 *     }
 *
 *     // Other methods would follow the same pattern...
 * }
 * ```
 *
 * MOCK API CLASS (FOR DEMONSTRATION):
 */
class EcountAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.isAuthenticated = false;
    }
    
    /**
     * Authenticate with the API
     *
     * Real API endpoint would be: POST /api/auth
     * Request body: { apiKey: "your_api_key" }
     * Response: { success: true, token: "auth_token", message: "Authentication successful" }
     */
    authenticate() {
        console.log('Attempting to authenticate with API key:', this.apiKey);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this.apiKey === API_KEY) {
                    this.isAuthenticated = true;
                    resolve({ success: true, token: "mock_auth_token_123", message: 'Authentication successful' });
                } else {
                    reject({ success: false, message: 'Invalid API key' });
                }
            }, 500);
        });
    }
    
    /**
     * Check if authenticated
     */
    checkAuth() {
        if (!this.isAuthenticated) {
            throw new Error('Not authenticated. Call authenticate() first.');
        }
    }
    
    /**
     * Get dashboard statistics
     */
    getDashboardStats() {
        this.checkAuth();
        
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(mockDatabase.dashboardStats);
            }, 800);
        });
    }
    
    /**
     * Get vendors
     */
    getVendors(filters = {}) {
        this.checkAuth();
        
        return new Promise((resolve) => {
            setTimeout(() => {
                let vendors = [...mockDatabase.vendors];
                
                // Apply filters
                if (filters.status) {
                    vendors = vendors.filter(vendor => vendor.status === filters.status);
                }
                
                if (filters.search) {
                    const search = filters.search.toLowerCase();
                    vendors = vendors.filter(vendor => 
                        vendor.name.toLowerCase().includes(search) ||
                        vendor.contact.toLowerCase().includes(search) ||
                        vendor.email.toLowerCase().includes(search)
                    );
                }
                
                resolve(vendors);
            }, 600);
        });
    }
    
    /**
     * Get vendor by ID
     */
    getVendor(id) {
        this.checkAuth();
        
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const vendor = mockDatabase.vendors.find(v => v.id === id);
                
                if (vendor) {
                    resolve(vendor);
                } else {
                    reject({ success: false, message: 'Vendor not found' });
                }
            }, 300);
        });
    }
    
    /**
     * Create vendor
     */
    createVendor(vendorData) {
        this.checkAuth();
        
        return new Promise((resolve) => {
            setTimeout(() => {
                const newId = mockDatabase.vendors.length + 1;
                const newVendor = {
                    id: newId,
                    ...vendorData
                };
                
                mockDatabase.vendors.push(newVendor);
                
                resolve({ success: true, vendor: newVendor });
            }, 700);
        });
    }
    
    /**
     * Update vendor
     */
    updateVendor(id, vendorData) {
        this.checkAuth();
        
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = mockDatabase.vendors.findIndex(v => v.id === id);
                
                if (index !== -1) {
                    mockDatabase.vendors[index] = {
                        ...mockDatabase.vendors[index],
                        ...vendorData
                    };
                    
                    resolve({ success: true, vendor: mockDatabase.vendors[index] });
                } else {
                    reject({ success: false, message: 'Vendor not found' });
                }
            }, 700);
        });
    }
    
    /**
     * Delete vendor
     */
    deleteVendor(id) {
        this.checkAuth();
        
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = mockDatabase.vendors.findIndex(v => v.id === id);
                
                if (index !== -1) {
                    mockDatabase.vendors.splice(index, 1);
                    resolve({ success: true, message: 'Vendor deleted successfully' });
                } else {
                    reject({ success: false, message: 'Vendor not found' });
                }
            }, 500);
        });
    }
    
    /**
     * Get items
     */
    getItems(filters = {}) {
        this.checkAuth();
        
        return new Promise((resolve) => {
            setTimeout(() => {
                let items = [...mockDatabase.items];
                
                // Apply filters
                if (filters.category) {
                    items = items.filter(item => item.category === filters.category);
                }
                
                if (filters.search) {
                    const search = filters.search.toLowerCase();
                    items = items.filter(item => 
                        item.name.toLowerCase().includes(search) ||
                        item.description.toLowerCase().includes(search)
                    );
                }
                
                resolve(items);
            }, 600);
        });
    }
    
    /**
     * Get purchase orders
     */
    getPurchaseOrders(filters = {}) {
        this.checkAuth();
        
        return new Promise((resolve) => {
            setTimeout(() => {
                let orders = [...mockDatabase.purchaseOrders];
                
                // Apply filters
                if (filters.status) {
                    orders = orders.filter(order => order.status === filters.status);
                }
                
                if (filters.vendorId) {
                    orders = orders.filter(order => order.vendorId === filters.vendorId);
                }
                
                if (filters.dateFrom) {
                    orders = orders.filter(order => new Date(order.date) >= new Date(filters.dateFrom));
                }
                
                if (filters.dateTo) {
                    orders = orders.filter(order => new Date(order.date) <= new Date(filters.dateTo));
                }
                
                if (filters.search) {
                    const search = filters.search.toLowerCase();
                    orders = orders.filter(order => order.id.toLowerCase().includes(search));
                }
                
                // Expand vendor information
                orders = orders.map(order => {
                    const vendor = mockDatabase.vendors.find(v => v.id === order.vendorId);
                    return {
                        ...order,
                        vendor: vendor ? vendor.name : 'Unknown Vendor'
                    };
                });
                
                resolve(orders);
            }, 800);
        });
    }
    
    /**
     * Get purchase order by ID
     */
    getPurchaseOrder(id) {
        this.checkAuth();
        
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const order = mockDatabase.purchaseOrders.find(o => o.id === id);
                
                if (order) {
                    // Expand vendor information
                    const vendor = mockDatabase.vendors.find(v => v.id === order.vendorId);
                    
                    // Expand item information
                    const items = order.items.map(item => {
                        const itemData = mockDatabase.items.find(i => i.id === item.itemId);
                        return {
                            ...item,
                            name: itemData ? itemData.name : 'Unknown Item',
                            description: itemData ? itemData.description : '',
                            unit: itemData ? itemData.unit : 'ea'
                        };
                    });
                    
                    resolve({
                        ...order,
                        vendor: vendor ? vendor.name : 'Unknown Vendor',
                        vendorData: vendor,
                        items
                    });
                } else {
                    reject({ success: false, message: 'Purchase order not found' });
                }
            }, 500);
        });
    }
    
    /**
     * Create purchase order
     */
    createPurchaseOrder(orderData) {
        this.checkAuth();
        
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Validate vendor
                const vendor = mockDatabase.vendors.find(v => v.id === orderData.vendorId);
                if (!vendor) {
                    reject({ success: false, message: 'Invalid vendor' });
                    return;
                }
                
                // Validate items
                if (!orderData.items || orderData.items.length === 0) {
                    reject({ success: false, message: 'Purchase order must have at least one item' });
                    return;
                }
                
                // Generate PO number
                const year = new Date().getFullYear();
                const poCount = mockDatabase.purchaseOrders.length + 1;
                const poNumber = `PO-${year}-${poCount.toString().padStart(3, '0')}`;
                
                const newOrder = {
                    id: poNumber,
                    ...orderData,
                    status: 'open'
                };
                
                mockDatabase.purchaseOrders.push(newOrder);
                
                // Update dashboard stats
                mockDatabase.dashboardStats.openPOs++;
                mockDatabase.dashboardStats.totalSpend += newOrder.total;
                
                resolve({ success: true, purchaseOrder: newOrder });
            }, 1000);
        });
    }
    
    /**
     * Update purchase order
     */
    updatePurchaseOrder(id, orderData) {
        this.checkAuth();
        
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = mockDatabase.purchaseOrders.findIndex(o => o.id === id);
                
                if (index !== -1) {
                    // Update order
                    mockDatabase.purchaseOrders[index] = {
                        ...mockDatabase.purchaseOrders[index],
                        ...orderData
                    };
                    
                    resolve({ success: true, purchaseOrder: mockDatabase.purchaseOrders[index] });
                } else {
                    reject({ success: false, message: 'Purchase order not found' });
                }
            }, 800);
        });
    }
    
    /**
     * Delete purchase order
     */
    deletePurchaseOrder(id) {
        this.checkAuth();
        
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = mockDatabase.purchaseOrders.findIndex(o => o.id === id);
                
                if (index !== -1) {
                    // Update dashboard stats if order was open
                    if (mockDatabase.purchaseOrders[index].status === 'open') {
                        mockDatabase.dashboardStats.openPOs--;
                    }
                    
                    mockDatabase.purchaseOrders.splice(index, 1);
                    resolve({ success: true, message: 'Purchase order deleted successfully' });
                } else {
                    reject({ success: false, message: 'Purchase order not found' });
                }
            }, 700);
        });
    }
}

// Create global API instance
window.ecountAPI = new EcountAPI(API_KEY);

// Auto-authenticate on page load
window.addEventListener('DOMContentLoaded', () => {
    window.ecountAPI.authenticate()
        .then(() => {
            console.log('API authenticated successfully');
        })
        .catch(error => {
            console.error('API authentication failed:', error);
        });
});