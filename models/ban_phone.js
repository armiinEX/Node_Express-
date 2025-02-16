const e = require('express');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
  },
},
  { timestamps: true }
);

const model = mongoose.model('BanUser', userSchema);

module.exports = model;