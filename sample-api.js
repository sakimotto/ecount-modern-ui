/**
 * ECOUNT Sample API Server
 * 
 * This is a simple Express server that simulates the ECOUNT API
 * for testing purposes. Run this server alongside your front-end
 * application to test the API integration.
 * 
 * To run:
 * 1. Install dependencies: npm install express cors
 * 2. Run the server: node sample-api.js
 * 3. The API will be available at http://localhost:3000
 */

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock database (in-memory)
const db = {
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
    }
  ],
  dashboardStats: {
    openPOs: 24,
    totalSpend: 45678,
    activeVendors: 37,
    pendingDeliveries: 12,
    trends: {
      openPOs: 12,
      totalSpend: -5,
      activeVendors: 8,
      pendingDeliveries: 0
    }
  }
};

// Valid API key for authentication
const VALID_API_KEY = 'ecount_api_key_12345';

// Authentication middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  if (token !== 'mock_auth_token_123') {
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token'
    });
  }
  
  next();
};

// Routes

// Authentication
app.post('/api/auth', (req, res) => {
  const { apiKey } = req.body;
  
  if (apiKey === VALID_API_KEY) {
    res.json({
      success: true,
      token: 'mock_auth_token_123',
      message: 'Authentication successful'
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid API key'
    });
  }
});

// Dashboard stats
app.get('/api/dashboard/stats', authenticate, (req, res) => {
  res.json({
    success: true,
    data: db.dashboardStats
  });
});

// Vendors
app.get('/api/vendors', authenticate, (req, res) => {
  const { status, search } = req.query;
  let vendors = [...db.vendors];
  
  if (status) {
    vendors = vendors.filter(vendor => vendor.status === status);
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    vendors = vendors.filter(vendor => 
      vendor.name.toLowerCase().includes(searchLower) ||
      vendor.contact.toLowerCase().includes(searchLower) ||
      vendor.email.toLowerCase().includes(searchLower)
    );
  }
  
  res.json({
    success: true,
    data: vendors
  });
});

app.get('/api/vendors/:id', authenticate, (req, res) => {
  const vendor = db.vendors.find(v => v.id === parseInt(req.params.id));
  
  if (vendor) {
    res.json({
      success: true,
      data: vendor
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Vendor not found'
    });
  }
});

app.post('/api/vendors', authenticate, (req, res) => {
  const newVendor = {
    id: db.vendors.length + 1,
    ...req.body
  };
  
  db.vendors.push(newVendor);
  
  res.status(201).json({
    success: true,
    data: newVendor,
    message: 'Vendor created successfully'
  });
});

app.put('/api/vendors/:id', authenticate, (req, res) => {
  const id = parseInt(req.params.id);
  const index = db.vendors.findIndex(v => v.id === id);
  
  if (index !== -1) {
    db.vendors[index] = {
      ...db.vendors[index],
      ...req.body
    };
    
    res.json({
      success: true,
      data: db.vendors[index],
      message: 'Vendor updated successfully'
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Vendor not found'
    });
  }
});

app.delete('/api/vendors/:id', authenticate, (req, res) => {
  const id = parseInt(req.params.id);
  const index = db.vendors.findIndex(v => v.id === id);
  
  if (index !== -1) {
    db.vendors.splice(index, 1);
    
    res.json({
      success: true,
      message: 'Vendor deleted successfully'
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Vendor not found'
    });
  }
});

// Purchase Orders
app.get('/api/purchase-orders', authenticate, (req, res) => {
  const { status, vendorId, dateFrom, dateTo, search } = req.query;
  let orders = [...db.purchaseOrders];
  
  if (status) {
    orders = orders.filter(order => order.status === status);
  }
  
  if (vendorId) {
    orders = orders.filter(order => order.vendorId === parseInt(vendorId));
  }
  
  if (dateFrom) {
    orders = orders.filter(order => new Date(order.date) >= new Date(dateFrom));
  }
  
  if (dateTo) {
    orders = orders.filter(order => new Date(order.date) <= new Date(dateTo));
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    orders = orders.filter(order => order.id.toLowerCase().includes(searchLower));
  }
  
  // Expand vendor information
  orders = orders.map(order => {
    const vendor = db.vendors.find(v => v.id === order.vendorId);
    return {
      ...order,
      vendor: vendor ? vendor.name : 'Unknown Vendor'
    };
  });
  
  res.json({
    success: true,
    data: orders
  });
});

app.get('/api/purchase-orders/:id', authenticate, (req, res) => {
  const order = db.purchaseOrders.find(o => o.id === req.params.id);
  
  if (order) {
    // Expand vendor information
    const vendor = db.vendors.find(v => v.id === order.vendorId);
    
    // Expand item information
    const items = order.items.map(item => {
      const itemData = db.items.find(i => i.id === item.itemId);
      return {
        ...item,
        name: itemData ? itemData.name : 'Unknown Item',
        description: itemData ? itemData.description : '',
        unit: itemData ? itemData.unit : 'ea'
      };
    });
    
    res.json({
      success: true,
      data: {
        ...order,
        vendor: vendor ? vendor.name : 'Unknown Vendor',
        vendorData: vendor,
        items
      }
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Purchase order not found'
    });
  }
});

app.post('/api/purchase-orders', authenticate, (req, res) => {
  const { vendorId, items } = req.body;
  
  // Validate vendor
  const vendor = db.vendors.find(v => v.id === vendorId);
  if (!vendor) {
    return res.status(400).json({
      success: false,
      message: 'Invalid vendor'
    });
  }
  
  // Validate items
  if (!items || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Purchase order must have at least one item'
    });
  }
  
  // Generate PO number
  const year = new Date().getFullYear();
  const poCount = db.purchaseOrders.length + 1;
  const poNumber = `PO-${year}-${poCount.toString().padStart(3, '0')}`;
  
  const newOrder = {
    id: poNumber,
    ...req.body,
    status: 'open'
  };
  
  db.purchaseOrders.push(newOrder);
  
  // Update dashboard stats
  db.dashboardStats.openPOs++;
  db.dashboardStats.totalSpend += newOrder.total;
  
  res.status(201).json({
    success: true,
    data: newOrder,
    message: 'Purchase order created successfully'
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Sample ECOUNT API server running at http://localhost:${port}`);
  console.log(`Valid API Key for testing: ${VALID_API_KEY}`);
  console.log('Use this API key in your front-end application to test the integration');
});