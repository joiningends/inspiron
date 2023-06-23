const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const {User} = require('../models/user');
const PasswordReset = require('../models/passwordreset');

// Step 1: Receive the user's email address in the password reset request
router.post('/', async (req, res) => {
  const { email } = req.body;

  try {
    // Step 2: Find the user in your database based on the provided email address
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Step 3: Generate a password reset token unique to that user and store it in your database along with an expiration time
    const resetToken = crypto.randomBytes(20).toString('hex');

    const passwordReset = new PasswordReset({
      userId: user._id,
      token: resetToken,
      expiresAt: Date.now() + 3600000, // Token expires in 1 hour
    });

    await passwordReset.save();

    // Step 4: Send the password reset email to the user's email address, containing a link that includes the generated token
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', // Replace with your SMTP server hostname
        port: 587, // Replace with the SMTP server port (e.g., 587 for TLS)
        secure: false, 
        requireTLS:true,// Set to true if your SMTP server requires a secure connection (TLS)
        auth: {
          user: 'abhipsakhandai11@gmail.com', // Replace with your email address
          pass: '   rugncjtbikiadwvo', // Replace with your email password or application-specific password
        },
      
    });

    const mailOptions = {
      from: 'abhipsakhandai11@gmail.com',
      to: user.email,
      subject: 'Password Reset',
      html: `
        <p>You requested a password reset.</p>
        <p>Click <a href="${api}/passwordresets/${resetToken}">here</a> to reset your password.</p>
  `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to send reset email' });
      }
      console.log('Reset email sent:', info.response);
      res.status(200).json({ message: 'Reset email sent' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Step 5: Verify the token and ensure it has not expired
router.get('/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const passwordReset = await PasswordReset.findOne({
      token,
      expiresAt: { $gt: Date.now() },
    }).populate('userId');

    if (!passwordReset) {
      return res.status(404).json({ message: 'Invalid or expired token' });
    }

    // You can use the passwordReset.userId to access the user's details if needed

    res.status(200).json({ message: 'Token verified' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Step 6: Allow the user to enter a new password and update the password in your database for the corresponding user
router.post('/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const passwordReset = await PasswordReset.findOne({
      token,
      expiresAt: { $gt: Date.now() },
    }).populate('userId');

    if (!passwordReset) {
      return res.status(404).json({ message: 'Invalid or expired token' });
    }

    // Update the user's password
    const user = passwordReset.userId;
    user.password = bcrypt.hashSync(password, 10);

    await user.save();
    await passwordReset.delete();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
