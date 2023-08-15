const Price = require('../models/prices'); // Adjust the path to your Price model
const ExperienceLevel = require('../models/exprience'); // Adjust the path to your ExperienceLevel model

// Create a new price entry

exports.createPrice = async (req, res) => {
  try {
    const { expriencelevel, session, sessionPrice, discountPrice } = req.body;

    
    // Check if the ExperienceLevel with the given ObjectId exists
    const experienceLevelDoc = await ExperienceLevel.findById(expriencelevel);
    
    if (!experienceLevelDoc) {
      return res.status(400).json({ error: 'Invalid experience level' });
    }

    const newPrice = new Price({
      level: experienceLevelDoc.level,
      session,
      sessionPrice,
      discountPrice,
    });

    const savedPrice = await newPrice.save();
    res.status(201).json(savedPrice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all price entries
exports.getAllPrices = async (req, res) => {
  try {
    const prices = await Price.find()
      .populate('expriencelevel'); // Populate the experiencelevel reference

    res.json(prices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get price information by experience level
exports.getPriceByExperienceLevel = async (req, res) => {
  try {
    const experienceLevelId = req.params.experienceLevelId;

    const price = await Price.findOne({ expriencelevel: experienceLevelId })
      .populate('expriencelevel');

    if (!price) {
      return res.status(404).json({ message: 'Price not found' });
    }

    res.json(price);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Update a price entry by ID
exports.updatePrice = async (req, res) => {
    try {
      const priceId = req.params.priceId; // Assuming you're passing the price ID in the URL
  
      const { expriencelevel, session, sessionPrice, discountPrice } = req.body;
  
      // Find the existing price entry
      const price = await Price.findByIdAndUpdate(
        priceId,
        {
          expriencelevel,
          session,
          sessionPrice,
          discountPrice,
        },
        { new: true }
      );
  
      if (!price) {
        return res.status(404).json({ message: 'Price not found' });
      }
  
      res.json(price);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Delete a price entry by ID
exports.deletePrice = async (req, res) => {
    try {
      const priceId = req.params.priceId; // Assuming you're passing the price ID in the URL
  
      const deletedPrice = await Price.findByIdAndRemove(priceId);
  
      if (!deletedPrice) {
        return res.status(404).json({ message: 'Price not found' });
      }
  
      res.json({ message: 'Price deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  