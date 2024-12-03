const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: {type: String},
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);