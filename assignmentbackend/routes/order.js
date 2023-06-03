const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')

const fetchUser = require('../middleware/fetchuser');
const User = require('../models/User');
const Message = require('../models/Message');

// Get all the Transporters
router.get('/transporter', async (req, res) => {
  try {
    const transporter = await User.find({ role: 'Transporter' });
    res.json({ transporter });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});


// Get all the Message for a user having authentication token
router.get('/messages', fetchUser, async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log(userId);
    const messages = await Message.find({ $or: [{ user1: userId }, { transporter: userId }] });
    console.log(messages)
    res.status(200).send({ messages });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});



// Send Message by authenticating user which give user details (Address , Username, etc.)
router.post('/messages', fetchUser, async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log(userId);
    const user = await User.findById(userId);
    const address = user.address;
    const Manufacturerusername = user.username
    const { to, from, quantity, transporter } = req.body;
    console.log(to, from, quantity);

    const transporterData = await User.findOne({ username: transporter });
    const Transporterusername = transporterData.username
    console.log(transporterData);

    if (!transporterData) {
      return res.status(400).json({ error: 'Transporter not found' });
    }

    const message = await Message.create({
      user1: userId,
      Manufacturerusername,
      to,
      from,
      address,
      quantity,
      transporter: transporterData._id,
      Transporterusername
    });
    console.log(message)
    res.status(201).json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create message' });
  }
});


// Send Reply to the message by Manufacturer
router.post('/messages/reply/:orderId', fetchUser, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { price } = req.body;

    const message = await Message.findById(orderId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    message.price = price;
    await message.save();

    res.json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to reply to message' });
  }
});


// Get message by orderId
router.get('/messages/:orderId', fetchUser, async (req, res) => {
  try {
    const { orderId } = req.params;

    const message = await Message.findById(orderId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to reply to message' });
  }
});


// Searching Messages
router.get('/search/messages', async (req, res) => {
  const { orderId, to, from } = req.query;

  const query = {};

  if (orderId  ) {
    if(orderId.length === 24 && /^[0-9a-fA-F]+$/.test(orderId)){
      query._id = mongoose.Types.ObjectId.createFromHexString(orderId);
    }
    else{
      return res.status(400).send({ error: 'Message not found' })
    }
  }
  
  if (to) {
    query.to = to;
  }
  
  if (from) {
    query.from = from;
  }
  try {

    const messages = await Message.find(query);
    console.log(messages)
    if (!messages) {
      return res.status(400).send({ error: 'Message not found' });
    }
    res.json(messages);
  } catch (error) {
    console.error('Failed to search messages:', error);
    res.status(500).json({ error: 'Failed to search messages' });
  }
});



module.exports = router;
