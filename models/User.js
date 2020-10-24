const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  study: {
    type: String,
    default: true
  },
  occupation: {
    type: String,
    default: true
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;