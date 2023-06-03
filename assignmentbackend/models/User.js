const mongoose  = require("mongoose");
const {Schema} = mongoose

const UserSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true
    },

    address:{
        type: String,
        required: true
    } ,
    role: {
        type: String,
        enum: ['Manufacturer', 'Transporter'],
        required: true
    },  
});

module.exports = mongoose.model("user", UserSchema);