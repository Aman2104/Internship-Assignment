const mongoose = require("mongoose");

const { Schema } = mongoose
const messageSchema = new Schema({
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    Manufacturerusername: { 
      type: String,
      required: true
    },
    to: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true 
    },
    price: {
        type: Number,
    },
    transporter:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    Transporterusername: { 
      type: String,
      required: true
    }
});

module.exports = mongoose.model("message", messageSchema);