const express = require('express');
const router = express.Router();

// Import the controller functions
const  clientController  = require('../controller/clientController');

// Define the routes

// Route for creating a new client session
router.post('/', clientController.createClientSession);

// Export the router
module.exports = router;