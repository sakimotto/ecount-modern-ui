/**
 * ECOUNT Modern UI - Purchase Module
 * Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initTabs();
    initFormValidation();
    initLineItems();
    initModals();
    initVendorManagement();
    initPurchaseHistory();
    
    // Simulate loading data from API
    loadDashboardData();
});

/**
 * Tab Switching Functionality
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    console.log('Initializing tabs:', tabButtons.length, 'buttons,', tabContents.length, 'content sections');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Log which tab was clicked
            const tabId = button.getAttribute('data-tab');
            console.log('Tab clicked:', tabId);
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show corresponding content
            const tabContent = document.getElementById(tabId);
            if (tabContent) {
                tabContent.classList.add('active');
                console.log('Tab content activated:', tabId);
            } else {
                console.error('Tab content not found for ID:', tabId);
            }
        });
    });
}

/**
 * Form Validation
 */
function initFormValidation() {
    const purchaseOrderForm = document.querySelector('.purchase-order-form');
    
    if (purchaseOrderForm) {
        purchaseOrderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic validation
            const vendor = document.getElementById('vendor');
            const poDate = document.getElementById('po-date');
            const deliveryDate = document.getElementById('delivery-date');
            
            let isValid = true;
            
            if (!vendor.value) {
                showError(vendor, 'Please select a vendor');
                isValid = false;
            } else {
                clearError(vendor);
            }
            
            if (!poDate.value) {
                showError(poDate, 'Please select a PO date');
                isValid = false;
            } else {
                clearError(poDate);
            }
            
            if (!deliveryDate.value) {
                showError(deliveryDate, 'Please select a delivery date');
                isValid = false;
            } else {
                clearError(deliveryDate);
            }
            
            // Check line items
            const lineItems = document.querySelectorAll('.line-items-table tbody tr');
            let hasItems = false;
            
            lineItems.forEach(item => {
                const itemSelect = item.querySelector('select');
                const quantity = item.querySelector('input[type="number"]');
                
                if (itemSelect.value && parseFloat(quantity.value) > 0) {
                    hasItems = true;
                }
            });
            
            if (!hasItems) {
                showNotification('Please add at least one item to the purchase order', 'error');
                isValid = false;
            }
            
            if (isValid) {
                // Submit form - in a real app, this would call the API
                showNotification('Purchase order created successfully!', 'success');
                
                // Reset form
                purchaseOrderForm.reset();
                updateTotals();
            }
        });
    }
}

/**
 * Line Items Functionality
 */
function initLineItems() {
    const addLineItemButton = document.querySelector('.add-line-item');
    const lineItemsTable = document.querySelector('.line-items-table tbody');
    
    if (addLineItemButton && lineItemsTable) {
        // Add new line item
        addLineItemButton.addEventListener('click', () => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>
                    <select>
                        <option value="">Select Item</option>
                        <option value="item1">Item 1</option>
                        <option value="item2">Item 2</option>
                    </select>
                </td>
                <td><input type="text" placeholder="Description"></td>
                <td><input type="number" value="1" min="1"></td>
                <td><input type="number" value="0.00" step="0.01"></td>
                <td>$0.00</td>
                <td><button type="button" class="btn-icon"><i class="fas fa-trash"></i></button></td>
            `;
            
            lineItemsTable.appendChild(newRow);
            
            // Add event listeners to new row
            addLineItemEventListeners(newRow);
        });
        
        // Add event listeners to existing rows
        const existingRows = lineItemsTable.querySelectorAll('tr');
        existingRows.forEach(row => {
            addLineItemEventListeners(row);
        });
        
        // Initial calculation
        updateTotals();
    }
}

/**
 * Add event listeners to line item row
 */
function addLineItemEventListeners(row) {
    const quantityInput = row.querySelector('input[type="number"]:nth-of-type(1)');
    const priceInput = row.querySelector('input[type="number"]:nth-of-type(2)');
    const deleteButton = row.querySelector('.btn-icon');
    
    // Calculate line total when quantity or price changes
    if (quantityInput) {
        quantityInput.addEventListener('input', () => {
            calculateLineTotal(row);
            updateTotals();
        });
    }
    
    if (priceInput) {
        priceInput.addEventListener('input', () => {
            calculateLineTotal(row);
            updateTotals();
        });
    }
    
    // Delete line item
    if (deleteButton) {
        deleteButton.addEventListener('click', () => {
            row.remove();
            updateTotals();
        });
    }
}

/**
 * Calculate total for a line item
 */
function calculateLineTotal(row) {
    const quantityInput = row.querySelector('input[type="number"]:nth-of-type(1)');
    const priceInput = row.querySelector('input[type="number"]:nth-of-type(2)');
    const totalCell = row.querySelector('td:nth-of-type(5)');
    
    if (!quantityInput || !priceInput || !totalCell) return;
    
    const quantity = parseFloat(quantityInput.value) || 0;
    const price = parseFloat(priceInput.value) || 0;
    const total = quantity * price;
    
    totalCell.textContent = '$' + total.toFixed(2);
}

/**
 * Update order totals
 */
function updateTotals() {
    const lineItems = document.querySelectorAll('.line-items-table tbody tr');
    let subtotal = 0;
    
    if (lineItems.length > 0) {
        lineItems.forEach(item => {
            const totalCell = item.querySelector('td:nth-of-type(5)');
            if (totalCell) {
                const totalText = totalCell.textContent;
                const total = parseFloat(totalText.replace('$', '')) || 0;
                subtotal += total;
            }
        });
    }
    
    const tax = subtotal * 0.1; // 10% tax
    const shipping = 0; // For demo purposes
    const total = subtotal + tax + shipping;
    
    // Update totals in the UI
    const totalsSection = document.querySelector('.totals-section');
    if (totalsSection) {
        const subtotalElement = totalsSection.querySelector('.total-row:nth-of-type(1) span:nth-of-type(2)');
        const taxElement = totalsSection.querySelector('.total-row:nth-of-type(2) span:nth-of-type(2)');
        const shippingElement = totalsSection.querySelector('.total-row:nth-of-type(3) span:nth-of-type(2)');
        const totalElement = totalsSection.querySelector('.total-row:nth-of-type(4) span:nth-of-type(2)');
        
        if (subtotalElement) subtotalElement.textContent = '$' + subtotal.toFixed(2);
        if (taxElement) taxElement.textContent = '$' + tax.toFixed(2);
        if (shippingElement) shippingElement.textContent = '$' + shipping.toFixed(2);
        if (totalElement) totalElement.textContent = '$' + total.toFixed(2);
    }
}

/**
 * Modal Functionality
 */
function initModals() {
    const vendorModal = document.getElementById('vendor-modal');
    const addVendorButton = document.querySelector('.tab-header .btn-primary');
    const closeModalButton = document.querySelector('.close-modal');
    const cancelButton = document.getElementById('cancel-vendor');
    const saveButton = document.getElementById('save-vendor');
    
    if (vendorModal && addVendorButton) {
        // Open modal
        addVendorButton.addEventListener('click', () => {
            vendorModal.style.display = 'flex';
        });
        
        // Close modal
        if (closeModalButton) {
            closeModalButton.addEventListener('click', () => {
                vendorModal.style.display = 'none';
            });
        }
        
        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                vendorModal.style.display = 'none';
            });
        }
        
        // Save vendor
        if (saveButton) {
            saveButton.addEventListener('click', () => {
                const vendorName = document.getElementById('vendor-name').value;
                const contactName = document.getElementById('contact-name').value;
                const email = document.getElementById('vendor-email').value;
                const phone = document.getElementById('vendor-phone').value;
                
                if (!vendorName) {
                    showError(document.getElementById('vendor-name'), 'Vendor name is required');
                    return;
                }
                
                // In a real app, this would call the API
                addVendorToTable({
                    name: vendorName,
                    contact: contactName,
                    email: email,
                    phone: phone,
                    status: document.getElementById('vendor-status').value
                });
                
                // Close modal and reset form
                vendorModal.style.display = 'none';
                document.querySelector('.vendor-form').reset();
                
                showNotification('Vendor added successfully!', 'success');
            });
        }
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === vendorModal) {
                vendorModal.style.display = 'none';
            }
        });
    }
}

/**
 * Add vendor to table
 */
function addVendorToTable(vendor) {
    const vendorTable = document.querySelector('#vendors .data-table tbody');
    
    if (vendorTable) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${vendor.name}</td>
            <td>${vendor.contact}</td>
            <td>${vendor.email}</td>
            <td>${vendor.phone}</td>
            <td><span class="status-badge ${vendor.status}">${vendor.status === 'active' ? 'Active' : 'Inactive'}</span></td>
            <td>
                <button class="btn-icon"><i class="fas fa-edit"></i></button>
                <button class="btn-icon"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        vendorTable.appendChild(newRow);
    }
}

/**
 * Vendor Management
 */
function initVendorManagement() {
    const vendorTable = document.querySelector('#vendors .data-table tbody');
    const searchInput = document.querySelector('#vendors .search-filter input');
    const statusFilter = document.querySelector('#vendors .search-filter select');
    
    if (vendorTable && searchInput && statusFilter) {
        // Search functionality
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            const rows = vendorTable.querySelectorAll('tr');
            
            rows.forEach(row => {
                const vendorName = row.querySelector('td:first-child').textContent.toLowerCase();
                const contactName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                const email = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
                
                const match = vendorName.includes(searchTerm) || 
                              contactName.includes(searchTerm) || 
                              email.includes(searchTerm);
                
                row.style.display = match ? '' : 'none';
            });
        });
        
        // Filter functionality
        statusFilter.addEventListener('change', () => {
            const filterValue = statusFilter.value;
            const rows = vendorTable.querySelectorAll('tr');
            
            rows.forEach(row => {
                const statusBadge = row.querySelector('.status-badge');
                
                if (filterValue === 'all') {
                    row.style.display = '';
                } else {
                    const isActive = statusBadge.classList.contains('active');
                    row.style.display = (filterValue === 'active' && isActive) || 
                                        (filterValue === 'inactive' && !isActive) ? '' : 'none';
                }
            });
        });
        
        // Delete vendor
        vendorTable.addEventListener('click', (e) => {
            if (e.target.closest('.fa-trash')) {
                const row = e.target.closest('tr');
                const vendorName = row.querySelector('td:first-child').textContent;
                
                if (confirm(`Are you sure you want to delete ${vendorName}?`)) {
                    row.remove();
                    showNotification('Vendor deleted successfully!', 'success');
                }
            }
        });
    }
}

/**
 * Purchase History
 */
function initPurchaseHistory() {
    const historyTable = document.querySelector('#history .data-table tbody');
    const searchInput = document.querySelector('#history .search-filter input');
    const statusFilter = document.querySelector('#history .search-filter select');
    const exportButton = document.querySelector('#history .btn-secondary');
    
    if (historyTable && searchInput && statusFilter) {
        // Search functionality
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            const rows = historyTable.querySelectorAll('tr');
            
            rows.forEach(row => {
                const poNumber = row.querySelector('td:first-child').textContent.toLowerCase();
                const vendor = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                
                const match = poNumber.includes(searchTerm) || vendor.includes(searchTerm);
                
                row.style.display = match ? '' : 'none';
            });
        });
        
        // Filter functionality
        statusFilter.addEventListener('change', () => {
            const filterValue = statusFilter.value;
            const rows = historyTable.querySelectorAll('tr');
            
            rows.forEach(row => {
                const statusBadge = row.querySelector('.status-badge');
                
                if (filterValue === 'all') {
                    row.style.display = '';
                } else {
                    const status = statusBadge.classList.contains(filterValue);
                    row.style.display = status ? '' : 'none';
                }
            });
        });
        
        // Export functionality
        if (exportButton) {
            exportButton.addEventListener('click', () => {
                showNotification('Purchase history exported successfully!', 'success');
            });
        }
        
        // View purchase order
        historyTable.addEventListener('click', (e) => {
            if (e.target.closest('.fa-eye')) {
                const row = e.target.closest('tr');
                const poNumber = row.querySelector('td:first-child').textContent;
                
                showNotification(`Viewing purchase order ${poNumber}`, 'info');
                // In a real app, this would open a detailed view
            }
        });
    }
}

/**
 * Load Dashboard Data
 */
function loadDashboardData() {
    // Simulate API call
    showLoading(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
        showLoading(false);
        
        // Update KPI cards with data from API
        updateKPICard('Open POs', '24', '+12%');
        updateKPICard('Total Spend', '$45,678', '-5%');
        updateKPICard('Active Vendors', '37', '+8%');
        updateKPICard('Pending Deliveries', '12', '0%');
    }, 1000);
}

/**
 * Update KPI Card
 */
function updateKPICard(title, value, trend) {
    const kpiCards = document.querySelectorAll('.kpi-card');
    
    kpiCards.forEach(card => {
        const cardTitle = card.querySelector('h3').textContent;
        
        if (cardTitle === title) {
            const valueElement = card.querySelector('.kpi-value');
            const trendElement = card.querySelector('.kpi-trend');
            
            if (valueElement) {
                valueElement.textContent = value;
            }
            
            if (trendElement) {
                const trendValue = trend.startsWith('+') ? trend : trend.startsWith('-') ? trend : trend;
                const trendIcon = trend.startsWith('+') ? 'fa-arrow-up' : trend.startsWith('-') ? 'fa-arrow-down' : 'fa-minus';
                const trendClass = trend.startsWith('+') ? 'positive' : trend.startsWith('-') ? 'negative' : 'neutral';
                
                trendElement.innerHTML = `<i class="fas ${trendIcon}"></i> ${trendValue}`;
                trendElement.className = `kpi-trend ${trendClass}`;
            }
        }
    });
}

/**
 * Show/hide loading indicator
 */
function showLoading(show) {
    // In a real app, this would show a loading spinner
    if (show) {
        console.log('Loading data...');
    } else {
        console.log('Data loaded');
    }
}

/**
 * Show error message
 */
function showError(element, message) {
    // Remove existing error
    clearError(element);
    
    // Add error message
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--danger-color)';
    errorElement.style.fontSize = 'var(--font-size-small)';
    errorElement.style.marginTop = 'var(--spacing-xs)';
    
    element.parentNode.appendChild(errorElement);
    
    // Highlight input
    element.style.borderColor = 'var(--danger-color)';
}

/**
 * Clear error message
 */
function clearError(element) {
    const errorElement = element.parentNode.querySelector('.error-message');
    
    if (errorElement) {
        errorElement.remove();
    }
    
    element.style.borderColor = '';
}

/**
 * Show notification
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
        notification.style.backgroundColor = 'var(--success-color)';
    } else if (type === 'error') {
        notification.style.backgroundColor = 'var(--danger-color)';
    } else if (type === 'warning') {
        notification.style.backgroundColor = 'var(--warning-color)';
    } else {
        notification.style.backgroundColor = 'var(--info-color)';
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