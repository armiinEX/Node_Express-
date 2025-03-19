const mongoose = require('mongoose');


const Schema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    href: {
        type: String,
        required: true,
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu',
        required: false,
    },
}, {timestamps: true});

const model = mongoose.model('Menu', Schema);

module.exports = model;