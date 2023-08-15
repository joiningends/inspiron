const Client = require('../models/client');



exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.find();

    res.status(200).json({ clients });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getClientById = async (req, res) => {
 
    try {
      const clientId = req.params.id;
  
      // Find the client by ID
      const client = await Client.findById(clientId);
  
      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }
  
      res.status(200).json({ client });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

  exports.generateURL = async (req, res) => {
    try {
      const { name, address, credit,companypayment } = req.body;
      const file = req.file;
  
      let generatedGroupId = 'not-generated'; // Use a default value for not explicitly generated
  
      // Generate the URL based on the presence of address
      let generatedUrl = `http://localhost:3000/login`;
  
      if (address) {
        // Generate a random 6-character alphanumeric groupid
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        generatedGroupId = '';
        for (let i = 0; i < 6; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          generatedGroupId += characters[randomIndex];
        }
  
        generatedUrl += `/${name}/${generatedGroupId}`;
      }
  
      // Create a new client using the Client model
      const newClient = new Client({
        name,
        address,
        image: file ? file.filename : null,
        credit,
        companypayment,
        groupid: generatedGroupId,
        url: generatedUrl,
      });
  
      // Save the client to the database
      await newClient.save();
  
      // Send the response with the generated URL and the new client details
      res.status(201).json({ message: 'Client created successfully', url: generatedUrl, client: newClient });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

// Controller for handling the PUT request to update a client
exports.updateClient = async (req, res) => {
  try {
    const { name, address, image, credit,companypayment } = req.body;
    const clientId = req.params.id;
    
    // Find the existing client by ID
    const existingClient = await Client.findById(clientId);

    // Check if the client exists
    if (!existingClient) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Update the client details if provided in the request
    if (name) {
      existingClient.name = name;
    }
    if (address) {
      existingClient.address = address;
    }
    if (image) {
      existingClient.image = imagePath;
    }
    if (credit) {
      existingClient.credit = credit;
    }
    if (companypayment) {
      existingClient.companypayment = companypayment;
    }
    // Save the updated client to the database
    await existingClient.save();

    // Generate the URL based on the presence of address and image
    let generatedUrl = 'http://localhost:3000/group-signup';
    if (address && existingClient.image) {
      generatedUrl += `/${name}/${existingClient.groupid}`; // Use existingClient.groupid
    }
    res.status(200).json({
      message: 'Client updated successfully',
      client: {
        _id: existingClient._id,
        name: existingClient.name,
        address: existingClient.address,
        image: existingClient.image, // Include the updated image URL in the response
        credit: existingClient.credit,
        companypayment : existingClient.companypayment
      },
      url: generatedUrl
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.deleteClientById = async (req, res) => {
  try {
    const clientId = req.params.id;

    // Find and delete the client by ID
    const deletedClient = await Client.findByIdAndDelete(clientId);

    if (!deletedClient) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.status(200).json({ message: 'Client deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
