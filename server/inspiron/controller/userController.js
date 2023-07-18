const { User } = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

// Create a new user
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

// Update a user
const updateUser = async (req, res) => {
  try {
    const userExist = await User.findById(req.params.id);
    let newPassword;
    if (req.body.password) {
      newPassword = bcrypt.hashSync(req.body.password, 10);
    } else {
      newPassword = userExist.passwordHash;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        firstname: req.body.firstname,
        middlename: req.body.middlename,
        lastname: req.body.lastname,
        mobile: req.body.mobile,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        host: req.body.host,
        intro: req.body.intro,
        profile: req.body.profile,
        isAdmin: req.body.isAdmin,
        assessmentScore: req.body.assessmentScore,
      },
      { new: true }
    );

    if (!user) {
      return res.status(400).send('the user cannot be created!');
    }

    res.send(user);
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

// User login
const loginUser = async (req, res) => {
  const { email, password, assessmentScore } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send('The user not found');
    }

    if (user && bcrypt.compareSync(password, user.passwordHash)) {
      const secret = process.env.secret;
      const token = jwt.sign(
        {
          userId: user.id,
          isAdmin: user.isAdmin,
        },
        secret,
        { expiresIn: '30d' }
      );

      user.assessmentScore = assessmentScore;
      await user.save();

      res.status(200).send({ user: user.email, token: token });
    } else {
      res.status(400).send('Password is wrong!');
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to log in' });
  }
};

// Register a new user
const registerUser = async (req, res) => {
  try {
    let user = new User({
      firstname: req.body.firstname,
      middlename: req.body.middlename,
      lastname: req.body.lastname,
      mobile: req.body.mobile,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
      host: req.body.host,
      intro: req.body.intro,
      profile: req.body.profile,
      isAdmin: req.body.isAdmin,
      assessmentScore: req.body.assessmentScore,
    });
    user = await user.save();

    if (!user) {
      return res.status(400).send('the user cannot be created!');
    }

    res.send(user);
  } catch (error) {
    res.status(500).json({ success: false });
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

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  loginUser,
  registerUser,
  deleteUser,
  getUserCount,
};
