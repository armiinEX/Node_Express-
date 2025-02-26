const courseModel = require('../../models/course');


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