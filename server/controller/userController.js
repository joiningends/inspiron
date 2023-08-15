const { User } = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Therapist } = require('../models/therapist');
const Heading = require('../models/heading');
const Client = require('../models/client');
const nodemailer = require('nodemailer'); 

const getUsers = async (req, res) => {
  try {
    const userListWithoutGroupId = await User.find({ groupid: { $exists: false } }).select('-passwordHash');
    const approvedUserListWithGroupId = await User.find({ types: 'approve', groupid: { $exists: true } }).select('-passwordHash');
    
    const allUsers = [...userListWithoutGroupId, ...approvedUserListWithGroupId];
    
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






const registernormalUser = async (req, res) => {
  try {
    const {
      name,
     
      mobile,
     
      email,
      password,
     
    } = req.body;

    const passwordHash = bcrypt.hashSync(password, 10);
const user = new User({
  name,
  
  mobile,
 
  email,
  passwordHash,
  
  
  
});

const savedUser = await user.save();

if (!savedUser) {
  return res.status(400).send('The user could not be created!');
}

res.send(savedUser);
} catch (error) {
console.error('Failed to create user:', error);
res
  .status(500)
  .json({ success: false, error: 'An error occurred while creating the user' });
}
};

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
    
    if (user && bcrypt.compareSync(password, user.passwordHash)) {
      let role = 'user'; // Default role is user
      let groupid = null;
      let empid = null;

      if (user.groupid) {
        if (user.types === 'approve') {
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

      return res.status(200).send({ user: user.email, role: role, token: token, groupid: groupid, empid: empid });
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
    
        const generatedGroupId = req.params.generatedGroupId; // Extracted from the URL
    
        console.log('Generated Group ID:', generatedGroupId); // Debugging
    
        // Check if the user with the provided email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).send('User with this email already exists');
        }
    
        // Hash the password before storing it in the database
        const passwordHash = bcrypt.hashSync(password, 10);
    
        // Your existing code to find matchingClient based on generatedGroupId
        const matchingClient = await Client.findOne({ groupid: generatedGroupId });
    
        if (!matchingClient) {
          return res.status(404).send('No matching corporate found for this group');
        }
    
        // Create a new user with the provided data and the extracted groupid
        const newUser = new User({
          name,
          mobile,
          email,
          passwordHash,
          empid,
          groupid: generatedGroupId,
          corporate: matchingClient.name, // Associate with the corporate
        });
    
        console.log('New User:', newUser); // Debugging
    
        // Save the user in the database
        const savedUser = await newUser.save();
    
        if (!savedUser) {
          return res.status(400).send('Failed to register the user');
        }
    
        // Send the registered user data in the response
        res.status(201).json(savedUser);
      } catch (error) {
        res.status(500).json({ error: 'Failed to register the user' });
      }
    };
    
    
    
    
// Delete a user
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






const updateUserSessionNotes = async (req, res) => {
  try {
    const { id } = req.params;
    const { sessionnotes } = req.body;

    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the sessionnotes if provided in the request body
    if (sessionnotes && Array.isArray(sessionnotes.option)) {
      user.sessionnotes.option = sessionnotes.option;
    }

    // Save the updated user
    const updatedUser = await user.save();

    // Extract the required fields for the result
    const { _id, name, Sessionnumber, date, time } = updatedUser;

    // Prepare the result JSON
    const result = {
      userid: _id,
      name,
      Sessionnumber,
      date,
      time,
      sessionnotes
    };

    res.json(result);
  } catch (error) {
    console.error('Error updating user session notes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



const updateStatusBasedOnData = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { chief, illness } = user;
    const isEnded =  chief && chief.length > 0 && illness && illness.length > 0;
    user.status = isEnded ? 'ended' : 'started'; // Fix the status assignment here
    await user.save();

    const updatedUser = user.toObject();

    res.json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating user status:', error);
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
    const isApproved = types === 'approve';
    const isDisapproved = types === 'disapprove';

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

    res.status(200).json({ message: `User types ${isApproved ? 'approved' : 'disapproved'} successfully`, user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




module.exports = {
  getUsers,
  getUserById,
  getUsersByGroup,

  registernormalUser,
  updateUser,
  loginUser,
  registerUser,
  deleteUser,
  getUserCount,
  updateUserByTherapist,
  updateUserSessionNotes,
  updateStatusBasedOnData,
  updateUserTypes

};
