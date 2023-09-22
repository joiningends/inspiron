const express = require('express');
const router = express.Router();
const whatsappcontrooler = require('../controller/whatsappcontrooler');



// Route to retrieve the count and details of sent WhatsApp messages
router.get('/sent-whatsapp-messages', whatsappcontrooler.getSentWhatsAppMessages);

module.exports = router;
