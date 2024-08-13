const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    birthDate: { type: Date, required: true },
    gender: { type: String, required: true },
    profilePicture: { type: String },
    registrationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);


const User = mongoose.model('User', userSchema);

module.exports = User;
