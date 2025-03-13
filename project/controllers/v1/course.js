const courseModel = require('../../models/course');
const sessionModel = require("./../../models/session");
const commentsModel = require("./../../models/comments");
const categoryModel = require("./../../models/category");
const courseUserModel = require('../../models/course-user');
const mongoose = require("mongoose");


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
        score,
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

exports.getCoursesByCategory = async (req, res) => {
    const {href} = req.params;
    const category = await categoryModel.findOne({href: href});

    if (category) {
        const categoryCourses = await courseModel.find({
            categoryID: category._id,
        });
        return res.json(categoryCourses);
    } else {
        return res.json([]);
    }
};

exports.getOne = async (req, res) => {
    const course = await courseModel
        .findOne({href: req.params.href})
        .populate("creator", "-password")
        .populate("categoryID")
        .lean();

    const sessions = await sessionModel.find({course: course._id})
        .populate("course")
        .lean();

    const comments = await commentsModel.find({course: course._id, isAccept: 1})
        .populate("creator", "-password")
        .lean();

    // const courseStudentsCount = await courseUserModel.find({course: course._id}).count();// منسوخ شده
    const courseStudentsCount = await courseUserModel.countDocuments({course: course._id});

    let isUserRegisteredToThisCourse = !!(await courseUserModel.findOne({
        user: req.user._id,
        course: course._id,
    }));


    const allComments = [];

    comments.forEach((comment) => {
        comments.forEach((answerComment) => {
            if (String(comment._id) === String(answerComment.mainCommentID)) {
                allComments.push({
                    ... comment,
                    course: comment.course.name,
                    creator: comment.creator.name,
                    answerComment,
                })
            }
        });

    });

    return res.json({
        course,
        sessions,
        comments: allComments,
        courseStudentsCount
    });
};

exports.remove = async (req, res) => {
    const isObjectValidID = mongoose.Types.ObjectId.isValid(req.params.id);

    if (!isObjectValidID) {
        return res.status(409).json({
            message: "CourseID not valid ...",
        })
    }

    const deletedCourse = await courseModel.findOneAndDelete({_id: req.params.id});

    if (!deletedCourse) {
        return res.status(404).json({
            message: "Course not found ...",
        })
    }

    return res.json({message: "course has been removed successfully!", deletedCourse});
};

exports.getRelated = async (req, res) => {
    const {href} = req.params;
    const course = await courseModel.findOne({href});

    if (!course) {
        return res.status(404).json({
            message: "Course not found ...",
        })
    }

    let relatedCourses = await courseModel.find({categoryID: course.categoryID});

    relatedCourses = relatedCourses.filter(course => course.href !== href);

    return res.json(relatedCourses); 
};

exports.popular = async (req, res) => {
    try {
        const courses = await courseModel
            .find({})
            .sort({ score: -1 }) // مرتب‌سازی نزولی بر اساس score
            .limit(10) // محدود کردن به ۱۰ مورد برتر
            .populate("creator", "-password") // نمایش اطلاعات سازنده دوره
            .lean();

        return res.json(courses);
    } catch (error) {
        console.error("Error in fetching popular courses:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

exports.pre_sell = async (req, res) => {
    try {
        const pre_sellCourses = await courseModel
            .find({ status: "Pre_sale" }) // فیلتر کردن دوره‌هایی که در پیش‌فروش هستند
            .populate("creator", "-password") // نمایش اطلاعات سازنده دوره
            .lean();

        return res.json(pre_sellCourses);
    } catch (error) {
        console.error("Error in fetching presale courses:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

