// models/Account.js
const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId() // Automatically generate ObjectId
  }
});

// Create and export the model
const Account = mongoose.model('Account', AccountSchema);
module.exports = Account;
