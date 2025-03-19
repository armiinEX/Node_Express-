const mongoose = require('mongoose');
const notificationModel = require('../../models/notification');


exports.create = async (req, res) => {
    try {
        const { message, admin } = req.body;

        if (!message || !admin) {
            return res.status(400).json({ message: 'Message and admin are required' });
        }

        const isAdminValidID = mongoose.Types.ObjectId.isValid(admin);
        if (!isAdminValidID) {
            return res.status(409).json({
                message: "AdminID is not valid.",
            });
        }

        const notification = await notificationModel.create({ message, admin });

        return res.status(201).json({ notification });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.get = async (req, res) => {
    const { _id } = req.user;

    const adminNotifications = await notificationModel.find({ admin: _id });

    return res.json({ adminNotifications });
};

exports.seen = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid notification ID" });
    }

    try {
        const notification = await notificationModel.findOneAndUpdate(
            { _id: id },
            { seen: 1 },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        return res.status(200).json({ message: "Notification marked as seen", notification });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getAll = async (req, res) => {
    const notifications = await notificationModel.find({})
        .populate('admin', '-password');

    return res.status(200).json({ notifications });
};

exports.remove = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid notification ID" });
    }

    try {
        const notification = await notificationModel.findByIdAndDelete(id);

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        return res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};