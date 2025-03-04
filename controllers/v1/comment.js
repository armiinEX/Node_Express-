const commentModel = require("./../../models/comments");
const courseModel = require("./../../models/course");
const mongoose = require("mongoose");


exports.create = async (req, res) => {
    const {body, courseHref, score} = req.body;

    const course = await courseModel.findOne({ href: courseHref }).lean();

    const comment = await commentModel.create({
        body,
        course: course._id,
        creator: req.user._id,
        score,
        isAnswer: 0,
        isAccept: 0, // show as a public
    });

    return res.status(201).json(comment);
};

exports.remove = async (req, res) => {
    const isObjectValidID = mongoose.Types.ObjectId.isValid(req.params.id);

    if (!isObjectValidID) {
        return res.status(409).json({
            message: "commentID not valid ...",
        })
    }

    const deletedComment = await commentModel.findOneAndDelete({
        _id: req.params.id,
    });

    if (!deletedComment) {
        return res.status(404).json({
            message: "comment not found ...",
        })
    }

    return res.status(201).json({
        message: "comment has been removed successfully!",
        deletedComment,
    });
};