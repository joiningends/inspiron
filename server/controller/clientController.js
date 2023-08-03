const ClientSession = require('../models/client');


exports.createClientSession = async (req, res) => {
  try {
    const { name } = req.body;

    // Create a new client session object
    const newClientSession = new ClientSession({
      name,
    });

    // Save the new client session to the database
    const savedClientSession = await newClientSession.save();

    res.status(201).json(savedClientSession);
  } catch (error) {
    console.error('Error creating client session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAllClientSessions = async (req, res) => {
  try {
    // Find all client sessions in the database
    const clientSessions = await ClientSession.find();

    res.json(clientSessions);
  } catch (error) {
    console.error('Error fetching client sessions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.getClientSessionById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the client session by its ID in the database
      const clientSession = await ClientSession.findById(id);
  
      if (!clientSession) {
        return res.status(404).json({ error: 'Client session not found' });
      }
  
      res.json(clientSession);
    } catch (error) {
      console.error('Error fetching client session by ID:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };