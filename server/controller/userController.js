const { User } = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Therapist } = require('../models/therapist');
const Heading = require('../models/heading');

// Get all users
const getUsers = async (req, res) => {
  try {
    const userList = await User.find().select('-passwordHash');
    res.send(userList);
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

// Get a user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) {
      res.status(500).json({ message: 'The user with the given ID was not found.' });
    } else {
      res.status(200).send(user);
    }
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

const createUser = async (req, res) => {
  try {
    const {
      name,
      age,
      mobile,
      gender,
      email,
      password,
      host,
      intro,
      profile,
      assessmentScore,
    } = req.body;

    const passwordHash = bcrypt.hashSync(password, 10);
const user = new User({
  name,
  age,
  mobile,
  gender,
  email,
  passwordHash,
  host,
  intro,
  profile,
  assessmentScore,
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
        },
        secret,
        { expiresIn: '30d' }
      );

      return res.status(200).send({ user: email, role: 'admin', token: token });
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
          },
          secret,
          { expiresIn: '30d' }
        );

        return res.status(200).send({ user: therapist.email, role: 'therapist', token: token });
      }
    }

    // Check if the user is a regular user
    const user = await User.findOne({ email });

    if (user && bcrypt.compareSync(password, user.passwordHash)) {
      const secret = process.env.secret;
      const token = jwt.sign(
        {
          userId: user.id,
          role: 'user',
        },
        secret,
        { expiresIn: '30d' }
      );

      return res.status(200).send({ user: user.email, role: 'user', token: token });
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
      age,
      mobile,
      gender,
      email,
      password,
      host,
      intro,
      profile,
      assessmentScore,
    } = req.body;

    // Check if the user with the provided email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('User with this email already exists');
    }

    // Hash the password before storing it in the database
    const passwordHash = bcrypt.hashSync(password, 10);

    // Create a new user with the provided data
    const newUser = new User({
      name,
      age,
      mobile,
      gender,
      email,
      passwordHash,
      host,
      intro,
      profile,
      assessmentScore,
    });

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




module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  loginUser,
  registerUser,
  deleteUser,
  getUserCount,
  updateUserByTherapist,
  updateUserSessionNotes
};
