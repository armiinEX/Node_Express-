const mongoose = require('mongoose');

const schema = mongoose.Schema(
    {
        departmentID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Department',
            required: true,
        },
        departmentSubID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DepartmentSub',
            required: true,
        },
        priority: {
            type: Number,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        answer: {
            type: Number,
            // required: true,
            default: 0,
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: false,
        },
        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ticket',
            required: false,
        },
        isAnswer: {
            type: Number,
            required: true,
        }
    },
    { timestamps: true });

const model = mongoose.model('Ticket', schema);

module.exports = model;