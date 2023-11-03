const { User } = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Therapist } = require('../models/therapist');
const Heading = require('../models/heading');
const Client = require('../models/client');
const nodemailer = require('nodemailer'); 
const { Appointment } = require('../models/appointment');
const fetch = require('node-fetch');
const { sendWhatsAppMessage, getSentMessageCount, getSentMessages } = require('../controller/whatsappcontrooler'); 
const getUsers = async (req, res) => {
  try {
    // Find users without a groupid
    const userListWithoutGroupId = await User.find({ groupid: { $exists: false } }).select('-passwordHash');
    
    // Find approved users with a groupid
    const approvedUsersWithGroupId = await User.find({ types: 'approved', groupid: { $exists: true } }).select('-passwordHash');

    // Assuming you have a 'Client' model with a 'groupid' and 'name' field
    const clientMap = new Map(); // Create a map to store groupid to client name mappings
    
    // Populate the clientMap with groupid to name mappings
    const clients = await Client.find();
    clients.forEach(client => {
      clientMap.set(client.groupid, client.name);
    });

    // Create an array to store users with groupid and client name
    const usersWithGroupIdAndName = approvedUsersWithGroupId.map(user => ({
      ...user.toObject(),
      clientName: clientMap.get(user.groupid) || null, // Use the client name if found, otherwise null
    }));
    
    const allUsers = [...userListWithoutGroupId, ...usersWithGroupIdAndName];
   
    allUsers.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    res.send(allUsers);
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

const getUserById = async (req, res) => {
 
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUsersByGroup = async (req, res) => {
  try {
    const { groupid } = req.params;

    // Query users by groupid
    const users = await User.find({ groupid: groupid })

    // Send the list of users in the response
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get users' });
  }
};

const generateRandomToken = () => {
  const tokenLength = 16; // You can adjust the length of the token as needed
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  
  for (let i = 0; i < tokenLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }
  
  return token;
};







const registernormalUser = async (req, res) => {
  try {
    const { name, mobile, email, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    // Generate a random verification token (you can use a library like crypto to create a secure token)
    const verificationToken = generateRandomToken();

    const user = new User({
      name,
      mobile,
      email,
      passwordHash,
      verificationToken, // Save the token in the user object
      isVerified: false, // Set the initial verification status to false
    });

    const savedUser = await user.save();

    if (!savedUser) {
      return res.status(400).send('The user could not be created!');
    }

     sendWhatsAppMessage(savedUser.mobile, `
Hi ${savedUser.name},
Your account has been created.Please check your email for verification.
Thanks,
Team Inspiron
`);

    sendVerificationEmail(savedUser.email, verificationToken, savedUser.name);

    res.send('Please check your email to verify your account.');
  } catch (error) {
    console.error('Failed to create user:', error);
    res
      .status(500)
      .json({ success: false, error: 'An error occurred while creating the user' });
  }
};

// Function to send a verification email
const sendVerificationEmail = (email, token, name) => {
  const verificationLink = `${process.env.CLIENT_URL}/thankyouForRegistering_teamInspiron/verify/${token}`;

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Replace with your SMTP server hostname
    port: 587, // Replace with the SMTP server port (e.g., 587 for TLS)
    secure: false,
    requireTLS: true, // Set to true if your SMTP server requires a secure connection (TLS)
    auth: {
      user: 'inspiron434580@gmail.com', // Replace with your email address
      pass: 'rogiprjtijqxyedm', // Replace with your email password or application-specific password
    },
  });

  const mailOptions = {
    from: 'inspiron434580@gmail.com',
    to: email,
    subject: 'Verify Your Email Address',
    html: `
      <p>Hi ${name},</p>
      <p>Thank you for registering with Inspiron. Please click the following link to verify your email address:</p>
      <a href="${verificationLink}">Verify Email</a>
      <p>Thanks,<br>Team Inspiron</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending verification email:', error);
    } else {
      console.log('Verification email sent:', info.response);
    }
  });
};



// Route for handling email verification
const verify = async (req, res) => {
  const { verificationToken } = req.params;

  try {
    // Find the user by the verification token
    const user = await User.findOne({ verificationToken });

    if (!user) {
      return res.status(404).send('Invalid or expired token');
    }

    // Mark the user as verified and remove the verification token
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.send('Email verified successfully. You can now log in.');
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).send('Internal server error');
  }
}






const updateUser = async (req, res) => {
  const userId = req.params.id;
  const updateData = req.body;

  try {
    // Find the user by their ID
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, upsert: true }
    );

    if (!user) {
      return res.status(400).send('The user could not be updated!');
    }

    res.send(user);
  } catch (error) {
    console.error('Failed to update user:', error);
    res.status(500).json({ success: false, error: 'An error occurred while updating the user' });
  }
};



const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user is the admin
    if (email === 'admin@example.com' && password === 'adminpassword') {
      const secret = process.env.secret;
      const token = jwt.sign(
        {
          userId: 'admin-id', // You can use an actual admin ID from your database here.
          role: 'admin',
          groupid: null, // No groupid for admin
          empid: null,   // No empid for admin
        },
        secret,
        { expiresIn: '30d' }
      );

      return res.status(200).send({ user: email, role: 'admin', token: token, groupid: null, empid: null });
    }

    // Check if the user is a therapist
    const therapist = await Therapist.findOne({ email });

    if (therapist) {
      if (therapist.password === password) { // Directly compare the password from the database
        const secret = process.env.secret;
        const token = jwt.sign(
          {
            userId: therapist.id,
            role: 'therapist',
            groupid: null, // No groupid for therapist
            empid: therapist.empid || null, // Return therapist's empid if present, otherwise null
          },
          secret,
          { expiresIn: '30d' }
        );

        return res.status(200).send({ user: therapist.email, role: 'therapist', token: token, groupid: null, empid: therapist.empid || null });
      }
    }
   
    // Check if the user is a regular user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('Invalid email or password!');
    }

    if (user.isVerified === false) {
      
      return res.status(400).send('Email not verified. Please check your email for verification instructions.');
    }
    
    if (user && bcrypt.compareSync(password, user.passwordHash)) {
      let role = 'user'; // Default role is user
      let groupid = null;
      let empid = null;

      if (user.groupid) {
        if (user.types === 'approved' || user.types === 'enable') {
          role = 'user'; // Use the groupid as role if user has one and is approved
          groupid = user.groupid;
        } else {
          return res.status(200).send('Please wait, your approval is in process');
        }
      }

      if (user.empid) {
        empid = user.empid;
      }

      const secret = process.env.secret;
      const token = jwt.sign(
        {
          userId: user.id,
          role: role,
          groupid: groupid,
          empid: empid,
        },
        secret,
        { expiresIn: '30d' }
      );

      return res.status(200).send({ userId: user.id, user: user.email, role: role, token: token, groupid: groupid, empid: empid });
    }

    // If the user is not found or the password is wrong, return an error
    res.status(400).send('Invalid email or password!');
  } catch (error) {
    res.status(500).json({ error: 'Failed to log in' });
  }
};




  
    
const registerUser = async (req, res) => {
  try {
      const {
        name,
        mobile,
        email,
        password,
        empid,
      } = req.body;
  
      const generatedGroupId = req.params.generatedGroupId;
  
      console.log('Generated Group ID:', generatedGroupId);
  
      // Check if the user with the provided email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }
  
      // Hash the password before storing it in the database
      const passwordHash = bcrypt.hashSync(password, 10);
  
      // Find a matching client based on generatedGroupId
      const matchingClient = await Client.findOne({ groupid: generatedGroupId });
  
      if (!matchingClient) {
        return res.status(404).json({ success: false, message: 'No matching corporate found for this group' });
      }
  
      const verificationToken = generateRandomToken();
  
      // Create a new user with the provided data and the extracted groupid
      const newUser = new User({
        name,
        mobile,
        email,
        passwordHash,
        empid,
        verificationToken,
        isVerified: false,
        groupid: generatedGroupId,
        corporate: matchingClient.name,
      });
  
      console.log('New User:', newUser);
  
      const savedUser = await newUser.save();

      if (!savedUser) {
        return res.status(400).send('The user could not be created!');
      }
  
       sendWhatsAppMessage(savedUser.mobile, `
  Hi ${savedUser.name},
  Your account has been created.Please check your email for verification.
  Thanks,
  Team Inspiron
  `);
  
      sendVerificationEmails(savedUser.email, verificationToken, savedUser.name);
  
      res.send('Please check your email to verify your account.');
    } catch (error) {
      console.error('Failed to create user:', error);
      res
        .status(500)
        .json({ success: false, error: 'An error occurred while creating the user' });
    }
  };
  
  // Function to send a verification email
  const sendVerificationEmails = (email, token, name) => {
    const verificationLink = `${process.env.CLIENT_URL}/thankyouForRegistering_teamInspiron/verify/${token}`;
  
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Replace with your SMTP server hostname
      port: 587, // Replace with the SMTP server port (e.g., 587 for TLS)
      secure: false,
      requireTLS: true, // Set to true if your SMTP server requires a secure connection (TLS)
      auth: {
        user: 'inspiron434580@gmail.com', // Replace with your email address
        pass: 'rogiprjtijqxyedm', // Replace with your email password or application-specific password
      },
    });
  
    const mailOptions = {
      from: 'inspiron434580@gmail.com',
      to: email,
      subject: 'Verify Your Email Address',
      html: `
        <p>Hi ${name},</p>
        <p>Thank you for registering with Inspiron. Please click the following link to verify your email address:</p>
        <a href="${verificationLink}">Verify Email</a>
        <p>Thanks,<br>Team Inspiron</p>`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending verification email:', error);
      } else {
        console.log('Verification email sent:', info.response);
      }
    });
  };
    
    
    
    
    const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    if (user) {
      res.status(200).json({ success: true, message: 'The user is deleted!' });
    } else {
      res.status(404).json({ success: false, message: 'User not found!' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};

// Get the count of users
const getUserCount = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.send({ userCount: userCount });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};
const updateUserByTherapist = async (req, res) => {
  const userId = req.params.id;
  const therapistInput = req.body; // The data filled by the therapist

  try {
    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's name, age, and gender if provided
    user.name = therapistInput.name || user.name;
    user.age = therapistInput.age || user.age;
    user.gender = therapistInput.gender || user.gender;

    // Update 'chief', 'illness', 'socioeconomic', and 'casesummery' fields filled by the therapist
    user.chief = therapistInput.chief || user.chief;
    user.illness = therapistInput.illness || user.illness;
    user.socioeconomic = therapistInput.socioeconomic || user.socioeconomic;
    user.casesummery = therapistInput.casesummery || user.casesummery;

    // Save the updated user
    await user.save();

    // Create a new user object containing the relevant fields for the response
    const updatedUser = {
      _id: user._id,
      name: user.name,
      age: user.age,
      gender: user.gender,
      socioeconomic: user.socioeconomic,
      chief: user.chief,
      illness: user.illness,
      casesummery: user.casesummery,
    };

    return res.json({ message: 'User information updated successfully', user: updatedUser });
  } catch (err) {
    console.error('Error updating user information:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};









const updateStatusBasedOnData = async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;
    const foundAppointment = await Appointment.findById(appointmentId);

    if (!foundAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Update the appointment status
    foundAppointment.status = 'started';
    await foundAppointment.save();

    const updatedAppointment = foundAppointment.toObject();

    res.json({ appointment: updatedAppointment });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ error: 'An error occurred while updating status' });
  }
};



const updateStatusBasedOnDataendthesession = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    const appointmentId = req.params.appointmentId;
    const foundAppointment = await Appointment.findById(appointmentId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!foundAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const { chief, illness } = user;
    const isEnded = chief && chief.length > 0 && illness && illness.length > 0;

    if (isEnded) {
      foundAppointment.status = 'ended';
      foundAppointment.firstsession = 'completed';

      // Set user.israting to false
      user.israting = false;

      await foundAppointment.save();
      await user.save();

      const updatedAppointment = foundAppointment.toObject();
      
      // Include user.israting in the response
      res.json({ appointment: updatedAppointment, israting: user.israting });
    } else {
      foundAppointment.firstsession = 'pending';
      return res.status(400).json({ message: 'Please fill in the first session note before ending the session' });
    }
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ error: 'An error occurred while updating status' });
  }
};



const updateUserTypes = async (req, res) => {
  try {
    const userId = req.params.id;
    const { types } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the types field
    user.types = types;

    // Determine if the type is approved or disapproved
    const isApproved = types === 'approved';
    const isDisapproved = types === 'disapproved';

    // Save the updated user in the database
    const updatedUser = await user.save();

    // Send an email to the user about the approval/disapproval
    if (isApproved) {
      // Create a nodemailer transporter
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', // Replace with your SMTP server hostname
        port: 587, // Replace with the SMTP server port (e.g., 587 for TLS)
        secure: false,
        requireTLS: true, // Set to true if your SMTP server requires a secure connection (TLS)
        auth: {
          user: 'inspiron434580@gmail.com', // Replace with your email address
          pass: 'rogiprjtijqxyedm', // Replace with your email password or application-specific password
        },
      });

      const mailOptions = {
        from: 'inspiron434580@gmail.com',
        to: updatedUser.email,
        subject: 'Profile Approved',
        html: `
          <p>Hi ${updatedUser.name},</p>
          <p>Your profile has been approved. Please log in to book your session with a Therapist.</p>
          <p>Thanks,<br>Team Inspiron</p>`,
      };

      // Send the approval email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Approval email sent:', info.response);
        }
      });
    } else if (isDisapproved) {
      // Create a nodemailer transporter
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', // Replace with your SMTP server hostname
        port: 587, // Replace with the SMTP server port (e.g., 587 for TLS)
        secure: false,
        requireTLS: true, // Set to true if your SMTP server requires a secure connection (TLS)
        auth: {
          user: 'inspiron434580@gmail.com', // Replace with your email address
          pass: 'rogiprjtijqxyedm', // Replace with your email password or application-specific password
        },
      });

      const mailOptions = {
        from: 'inspiron434580@gmail.com',
        to: updatedUser.email,
        subject: 'Profile Disapproved',
        html: `
          <p>Hi ${updatedUser.name},</p>
          <p>Your profile has been disapproved. Please contact HR for further information.</p>
          <p>Thanks,<br>Team Inspiron</p>`,
      };

      // Send the disapproval email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Disapproval email sent:', info.response);
        }
      });
    }
    if (isDisapproved) {
      // Delete the user
      await User.findByIdAndDelete(userId); // This line deletes the user from the database
    }
    res.status(200).json({ message: `User types ${isApproved ? 'approved' : 'disapproved'} successfully`, user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ... (existing code)

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists with the provided email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a random token and save it in the user's database record
    const resetToken = jwt.sign({ userId: user._id }, process.env.secret, {
      expiresIn: '1h', // Token expires in 1 hour
    });
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour in milliseconds
    await user.save();

    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Replace with your SMTP server hostname
      port: 587, // Replace with the SMTP server port (e.g., 587 for TLS)
      secure: false,
      requireTLS: true, // Set to true if your SMTP server requires a secure connection (TLS)
      auth: {
        user: 'inspiron434580@gmail.com', // Replace with your email address
        pass: 'rogiprjtijqxyedm', // Replace with your email password or application-specific password
      },
    });

    const mailOptions = {
      from: 'inspiron434580@gmail.com',
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <p>Hi ${user.name},</p>
        <p>You are receiving this email because you (or someone else) have requested a password reset for your account.</p>
        <p>Please click the following link to reset your password:</p>
        <a href="${process.env.CLIENT_URL}/passwordReset/reset/${resetToken}">Reset Password</a>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        <p>Thanks,<br>Team Inspiron</p>`,
    };

    // Send the password reset email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send password reset email' });
      } else {
        console.log('Password reset email sent:', info.response);
        res.status(200).json({ message: 'Password reset email sent successfully' });
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to initiate password reset' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    // Find the user by the reset token
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update the user's password and reset token fields
    user.passwordHash = bcrypt.hashSync(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Replace with your SMTP server hostname
      port: 587, // Replace with the SMTP server port (e.g., 587 for TLS)
      secure: false,
      requireTLS: true, // Set to true if your SMTP server requires a secure connection (TLS)
      auth: {
        user: 'inspiron434580@gmail.com', // Replace with your email address
        pass: 'rogiprjtijqxyedm', // Replace with your email password or application-specific password
      },
    });

    const mailOptions = {
      from: 'inspiron434580@gmail.com',
      to: user.email,
      subject: 'Password Reset Confirmation',
      html: `
        <p>Hi ${user.name},</p>
        <p>Your password has been successfully reset. If you did not initiate this request, please contact support.</p>
        <p>Thanks,<br>Team Inspiron</p>`,
    };

    // Send the password reset confirmation email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Password reset confirmation email sent:', info.response);
      }
    });

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset password' });
  }
};
// controllers/userController.js


const updateUserProfile = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's profile fields
    if (req.body.name) {
      user.name = req.body.name;
    }
    if (req.body.mobile) {
      user.mobile = req.body.mobile;
    }
    if (req.body.age) {
      user.age = req.body.age;
    }
    if (req.body.diseases) {
      user.diseases = req.body.diseases;
    }
    if (req.body.mediceneyoutake) {
      user.mediceneyoutake = req.body.mediceneyoutake;
    }

    // Save the updated user
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const deleteAllTherapists = async (req, res) => {
  try {
    // Delete all therapists from the database
    await User.deleteMany({});

    res.status(200).json({ message: 'All therapists deleted successfully' });
  } catch (error) {
    console.error('Error deleting therapists:', error);
    res.status(500).json({ error: 'An error occurred while deleting therapists' });
  }
};

const updateUserIsRating =  async (req, res) => {
  try {
    const userId = req.params.id;
   
    const user = await User.findByIdAndUpdate(userId, { israting: true }, { new: true });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    return { success: true, message: 'User israting updated successfully', user };
  } catch (error) {
    console.error('Error updating user israting:', error);
    return { success: false, message: 'Internal Server Error' };
  }
};

module.exports = {
  getUsers,
  getUserById,
  getUsersByGroup,

  registernormalUser,
  verify,
  updateUser,
  loginUser,
  registerUser,
  deleteUser,
  getUserCount,
  updateUserByTherapist,
  
  updateStatusBasedOnData,
  updateStatusBasedOnDataendthesession,
  updateUserTypes,
  forgotPassword, 
  resetPassword,
  updateUserProfile,
  deleteAllTherapists,
  updateUserIsRating
};
