# ECOUNT Modern UI - Proof of Concept

This is a proof of concept for a modern user interface that connects to the ECOUNT ERP system. It demonstrates how a modern, responsive front-end can be built to work with the existing ECOUNT API.

## Overview

This proof of concept focuses on the Purchase module, with the following features:

- Modern, clean user interface
- Responsive design that works on all devices
- Interactive dashboard with key metrics
- Purchase order creation and management
- Vendor management
- Purchase history tracking

## Technical Details

This proof of concept is built using:

- HTML5 for structure
- CSS3 for styling (with variables, Flexbox, and Grid)
- Vanilla JavaScript for functionality
- Mock API for simulating backend interactions

## How to Run

### Method 1: Using npm (Recommended)
1. Install dependencies:
   ```
   cd ecount-poc
   npm install
   ```

2. Start the front-end server:
   ```
   npm start
   ```
   This will start a local server at http://localhost:8000 and open the application in your browser.

### Method 2: Direct File Opening
1. Simply open the `index.html` file in a web browser.
2. Note that some features may not work correctly when opening the file directly.

## Testing with the Sample API

This project includes a sample API server that simulates the ECOUNT API for testing purposes.

### Starting the Sample API Server

1. Install dependencies (if you haven't already):
   ```
   cd ecount-poc
   npm install
   ```

2. Start the API server:
   ```
   npm run api
   ```
   This will start the API server at http://localhost:3000.

3. The server will output the valid API key to use for testing.

### Connecting to the Sample API

1. Open the application in your browser (using `npm start` or directly opening `index.html`)
2. To use the real API implementation instead of the mock:
   - Edit `index.html` and replace:
     ```html
     <script src="api-mock.js"></script>
     ```
     with:
     ```html
     <script src="real-api.js"></script>
     ```
3. Refresh the page to see the application using the real API implementation

### API Documentation

The sample API server provides the following endpoints:

- **Authentication**: `POST /api/auth`
- **Dashboard Stats**: `GET /api/dashboard/stats`
- **Vendors**:
  - List: `GET /api/vendors`
  - Get: `GET /api/vendors/:id`
  - Create: `POST /api/vendors`
  - Update: `PUT /api/vendors/:id`
  - Delete: `DELETE /api/vendors/:id`
- **Purchase Orders**:
  - List: `GET /api/purchase-orders`
  - Get: `GET /api/purchase-orders/:id`
  - Create: `POST /api/purchase-orders`

For more details, see the `api-testing.md` file.

## API Integration

The application includes a mock API (`api-mock.js`) that simulates how the front-end would interact with the ECOUNT ERP system. In a production environment, this would be replaced with actual API calls to the ECOUNT system.

### Mock API Features

- Authentication with API key
- Data fetching and submission
- Error handling
- State management

### Testing with Real ECOUNT API

To test with the actual ECOUNT API:

1. Obtain an API key from your ECOUNT system (as shown in the screenshot)
2. Update the `API_KEY` constant in `api-mock.js`
3. Modify the API endpoints in the `EcountAPI` class to match your ECOUNT API endpoints
4. Test the integration with your actual data

## Customizing for Different Roles

This interface can be customized for different worker roles:

- **Purchase Department**: Focus on the PO creation and vendor management
- **Sales Team**: Adapt the interface for sales orders and customer management
- **Inventory Staff**: Emphasize stock levels and inventory movements
- **Manufacturing Team**: Highlight production orders and resource planning

## Next Steps

This proof of concept can be expanded to include:

1. Additional modules (Sales, Inventory, Manufacturing)
2. Integration with the actual ECOUNT API
3. Enhanced features like reporting and analytics
4. User authentication and role-based access control
5. Offline capabilities for field workers
6. Mobile-specific optimizations

## File Structure

- `index.html` - Main application structure
- `styles.css` - CSS styles for the application
- `script.js` - JavaScript functionality
- `api-mock.js` - Mock API for simulating backend interactions
- `README.md` - This documentation file

## Notes

This is a proof of concept and not intended for production use without further development. It demonstrates the potential for creating a modern interface for the ECOUNT ERP system while maintaining your reliable backend.