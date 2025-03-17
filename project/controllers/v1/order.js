const mongoose = require("mongoose");
const coureseUserModel = require("../../models/course-user");

exports.getAll = async (req, res) => {
    const orders = await coureseUserModel
        .find({ user: req.user._id })
        .populate("course", "name href")
        .lean();

    return res.json(orders);
};

exports.getOne = async (req, res) => {
    const isObjectValidID = mongoose.Types.ObjectId.isValid(req.params.id);

    if (!isObjectValidID) {
        return res.status(409).json({
            message: "orderID not valid ...",
        })
    }

    const order = await coureseUserModel
        .findOne({ _id: req.params.id })
        .populate("course", "name href")
        .lean();

    return res.json(order);

};