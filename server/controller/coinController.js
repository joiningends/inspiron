const Coin = require('../models/coin');

const { User } = require('../models/user');




exports.createCoin = async (req, res) => {
  try {
    const { userId } = req.body;

    // Retrieve the user's coinBalance from the User table
    const user = await User.findById(userId).select('coins expriencelevel groupid');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newCoin = new Coin({
      user: userId,
      expriencelevel: user.expriencelevel,
      coinBalance: user.coins,
      groupid: user.groupid,
    });

    const savedCoin = await newCoin.save();
    res.status(201).json(savedCoin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Get coin information by user ID
exports.getCoinByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    const coin = await Coin.findOne({ user: userId })
      .populate('expriencelevel')
      .populate('user');

    if (!coin) {
      return res.status(404).json({ message: 'Coin not found' });
    }

    res.json(coin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update coin balance by user ID
exports.updateCoinBalance = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { coinBalance } = req.body;

    const updatedCoin = await Coin.findOneAndUpdate(
      { user: userId },
      { coinBalance },
      { new: true }
    );

    if (!updatedCoin) {
      return res.status(404).json({ message: 'Coin not found' });
    }

    res.json(updatedCoin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
