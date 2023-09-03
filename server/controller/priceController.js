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
      expriencelevel:experienceLevelDoc.id,
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
      const sessionNumber = 1;
  
      const prices = await Price.find({ session: sessionNumber })
        .populate('expriencelevel');
  
      res.json(prices);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

// Get price information by experience level
exports.getPriceByExperienceLevel= async (req, res) => {
  const { experienceLevelId } = req.params;

  try {
    const prices = await Price.find({ expriencelevel: experienceLevelId });

    if (!prices || prices.length === 0) {
      return res.status(404).json({ error: 'Prices not found for this experience level' });
    }

    return res.status(200).json(prices);
  } catch (error) {
    console.error('Error fetching prices:', error);
    return res.status(500).json({ error: 'An error occurred while fetching the prices' });
  }
};


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
  
  