const Address = require('../models/adddress');

// POST /api/address - Create a new address
exports.createAddress = async (req, res) => {
    try {
        const newAddress = new Address(req.body);
        const savedAddress = await newAddress.save();
        res.status(201).json(savedAddress);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
const BankDetails = require('../models/bankdetails.js');

// POST /api/bankdetails - Create a new bank details
exports.createBankDetails = async (req, res) => {
    try {
        const newBankDetails = new BankDetails(req.body);
        const savedBankDetails = await newBankDetails.save();
        res.status(201).json(savedBankDetails);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
const GST = require('../models/gst');

// POST /api/gst - Create a new GST details
exports.createGST = async (req, res) => {
    try {
        const { rate, type } = req.body;

        // Check if GST with the same type already exists
        const existingGST = await GST.findOne({ type });
        if (existingGST) {
            return res.status(400).json({ message: 'GST with this type already exists' });
        }

        const newGST = new GST({ rate, type });
        const savedGST = await newGST.save();
        res.status(201).json(savedGST);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
const Signature = require('../models/signeture');

// POST /api/signatures - Create a new signature
exports.createSignature = async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: 'No image file uploaded' });
        }

        // Construct the image path
        const fileName = file.filename;
        const imagePath = `${req.protocol}://${req.get('host')}/public/uploads/${fileName}`;

        // Assuming you'll store the image path in the database
        const { name } = req.body;
        const newSignature = new Signature({ name, image: imagePath });
        const savedSignature = await newSignature.save();
        
        res.status(201).json(savedSignature);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

