const mongoose = require('mongoose');
const moment = require('moment');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  gender: {
    type: String,
    required: true
  },

  bio: {
    type: String,
    required: true
  },

  createdAt: {
    type: String,
    default: moment().format('YYYY-MM-DD hh:mm:ss')
  }

});

module.exports = mongoose.model('users', userSchema);
