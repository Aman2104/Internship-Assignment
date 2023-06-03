const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const fetchUser = require('../middleware/fetchuser');
const jwtoken = 'thisisassignment@!N^#rn'
// Registration route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password,address, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(role);
    const user = await User.create({ username, email, password: hashedPassword, address, role });
    console.log(user)
    const token = jwt.sign({ userId: user._id }, jwtoken);
    // res.status(201).json({ user });
    res.status(201).send({role:role, token })
  } catch (error) {
    console.log(error)
    res.status(500).send({ error: 'Registration failed' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    console.log(user);
    const token = jwt.sign({ userId: user._id }, jwtoken);
    res.json({role:user.role, token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// User Authentication using Authentication Token
router.post("/getuser", fetchUser, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select("-password");
      res.send(user);
  } catch (error) {
      res.status(500).send("Internal Server Error Occured");
      console.log(error.message);
  }
})


module.exports = router;

