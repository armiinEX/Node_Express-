const mongoose = require('mongoose');
const contactModel = require('../../models/contact');
const nodemailer = require('nodemailer');
const e = require('express');


exports.getAll = async (req, res) => {
    const contacts = await contactModel.find({});

    return res.status(200).json({ contacts });
};

exports.create = async (req, res) => {
    const { name, email, phone, body } = req.body;
    const contact = await contactModel.create({
        name,
        email,
        phone,
        body,
        answer: 0,
    });

    res.status(201).json({ contact });
};

exports.remove = async (req, res) => {
    const isObjectValidID = mongoose.Types.ObjectId.isValid(req.params.id);

    if (!isObjectValidID) {
        return res.status(409).json({
            message: "commentID not valid ...",
        })
    }

    const deletedContact = await contactModel.findByIdAndDelete(req.params.id); //findByIdAndDelete نیازی به ارسال یک شیء با نام _id ندارد

    if (!deletedContact) {
        return res.status(404).json({
            message: "Contact not found ...",
        });
    }

    return res.status(200).json({
        message: "Contact deleted successfully ...",
        deletedContact,
    });
};

exports.answer = async (req, res) => {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: req.body.email,
        subject: "Answer to your question",
        text: req.body.answer,
    };

    transporter.sendMail(mailOptions, async (err, data) => {
        if (err) {
            return res.status(500).json({
                message: "Internal server error ...",
            });
        } else {
            const contact = await contactModel.findOneAndUpdate(
                { email: req.body.email }, 
                { answer: 1 },
                { new: true }, // برای اینکه اطلاعات جدید برگردانده شود
            );

            return res.status(200).json({
                message: "Email sent successfully ...",
            });
        }
    });
};