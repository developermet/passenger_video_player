const mongoose = require('mongoose');

const ConnectedUserSchema = new mongoose.Schema({
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

const ConnectedUser = mongoose.model('ConnectedUser', ConnectedUserSchema);

module.exports = ConnectedUser;