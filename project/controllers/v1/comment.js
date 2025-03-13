const commentModel = require("./../../models/comments");
const courseModel = require("./../../models/course");
const mongoose = require("mongoose");


exports.create = async (req, res) => {
    const {body, courseHref, score} = req.body;

    const course = await courseModel.findOne({href: courseHref}).lean();

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

exports.accept = async (req, res) => {
    const acceptedComment = await commentModel.findOneAndUpdate(
        {
            _id: req.params.id,
        },
        {
            isAccept: 1,
        },
        {
            new: true, // در رسپانس بعد از تغیر را میبینی
        }
    );

    if (!acceptedComment) {
        return res.status(404).json({
            message: "comment not found ...",
        })
    }

    return res.status(201).json({
        message: "comment has been accepted successfully!",
        acceptedComment,
    });
};

exports.reject = async (req, res) => {
    const rejectedComment = await commentModel.findOneAndUpdate(
        {
            _id: req.params.id,
        },
        {
            isAccept: 0,
        },
        {
            new: true, // در رسپانس بعد از تغیر را میبینی
        }
    );

    if (!rejectedComment) {
        return res.status(404).json({
            message: "comment not found ...",
        })
    }

    return res.status(201).json({
        message: "comment has been rejected successfully!",
        rejectedComment,
    });
};

exports.answer = async (req, res) => {
    const {body} = req.body;

    const acceptedComment = await commentModel.findOneAndUpdate(
        {_id: req.params.id,},
        {
            isAccept: 1,
        }
    );

    if (!acceptedComment) {
        return res.status(404).json({
            message: "comment not found ...",
        })
    }

    const answerComment = await commentModel.create({
        body,
        course: acceptedComment.course,
        creator: req.user._id,
        isAnswer: 1,
        isAccept: 1, // show as a public
        mainCommentID: req.params.id,
    });

    return res.status(201).json(answerComment)
};

exports.getAll = async (req, res) => {
    try {
        const comments = await commentModel
            .find({})
            .populate("creator", "-password")
            .populate("course")
            .lean();

        // پردازش داده‌ها برای گروه‌بندی پاسخ‌ها
        const commentsMap = {};
        const mainComments = [];

        comments.forEach(comment => {
            // اگر کامنت یک پاسخ باشد، آن را در آرایه‌ی مربوطه ذخیره می‌کنیم
            if (comment.mainCommentID) {
                if (!commentsMap[comment.mainCommentID]) {
                    commentsMap[comment.mainCommentID] = [];
                }
                commentsMap[comment.mainCommentID].push(comment);
            } else {
                // اگر کامنت اصلی است، در آرایه‌ی اصلی ذخیره می‌شود
                mainComments.push(comment);
            }
        });

        // اضافه کردن پاسخ‌ها به کامنت‌های اصلی
        const structuredComments = mainComments.map(comment => ({
            ...comment,
            replies: commentsMap[comment._id] || []  // اضافه کردن پاسخ‌ها
        }));

        return res.status(200).json(structuredComments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
