const Coin = require('../models/coin');

const { User } = require('../models/user');
const { Therapist } = require('../models/therapist');





// Get coin information by user ID
exports.getCoinByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    const coins = await Coin.find({ user: userId })
      .populate('user', 'name groupid');

    if (!coins || coins.length === 0) {
      return res.status(404).json({ message: 'No coins found for the user' });
    }

    res.json(coins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.updateCoinBalance = async (req, res) => {
  try {
    const coinId = req.params.id;
    const { coinBalance, average } = req.body;

    let message = '';

    if (coinBalance > 0) {
      message ='';
    }

    const updatedCoin = await Coin.findByIdAndUpdate(
      coinId,
      { coinBalance, average, message }, // Update the message field as well
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
