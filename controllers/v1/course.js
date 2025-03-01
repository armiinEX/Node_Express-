const courseModel = require('../../models/course');
const sessionModel = require("./../../models/session");
const courseUserModel = require('../../models/course-user');


exports.create = async (req, res) => {
    const {
        name,
        description,
        support,
        href,
        price,
        status,
        discount,
        categoryID,
        creator,
    } = req.body;

    const course = await courseModel.create({
        name,
        description,
        creator: req.user._id,
        categoryID,
        support,
        price,
        href,
        status,
        discount,
        cover: req.file.filename,
    });

    const mainCourse = await courseModel
        .findById(course._id)
        .populate("creator", "-password");

    return res.status(201).json(mainCourse);
};

exports.createSession = async (req, res) => {
    const {title, time, free} = req.body;
    const {id} = req.params;

    const session = await sessionModel.create({
        title,
        time,
        free,
        video: "video.mp4",
        course: id,
    });

    return res.status(201).json(session);
};

exports.getAllSessions = async (req, res) => {
    const sessions = await sessionModel.find({}).populate("course", "name").lean();

    return res.json(sessions);
};

exports.getSessionInfo = async (req, res) => {
    const course = await courseModel.findOne({href: req.params.href}).lean();
    const session = await sessionModel.findOne({_id: req.params.sessionID});
    const sessions = await sessionModel.find({course: course._id});

    return res.json({session, sessions})
};

exports.removeSession = async (req, res) => {
    const deletedCourse = await sessionModel.findOneAndDelete({_id: req.params.id});

    if (!deletedCourse) {
        return res.status(404).json({
            message: "Course not found ..."
        });
    }

    return res.json(deletedCourse);
};

exports.register = async (req, res) => {
    const isUserAlreadyRegister = await courseUserModel
        .findOne({
            user: req.user._id,
            course: req.params.id,
        }).lean();

    if (isUserAlreadyRegister) {
        return res.status(409).json({
            message: "User already registered in this course!",
        });
    }

    const register = await courseUserModel.create({
        user: req.user._id,
        course: req.params.id,
        price: req.body.price,
    });

    return res.status(201).json({
        message: "you are registered successfully :))",
    });
};