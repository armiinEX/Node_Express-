const offModel = require('../../models/off');
const coursesModel = require("../../models/course");
const mongoose = require('mongoose');


exports.getAll = async (req, res) => {
    try {
        const offs = await offModel.find({}, "-__v").populate('course', "name href").populate('creator', "username");
        res.status(200).json(offs);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.setOnOne = async (req, res) => {
    const { code, percent, course, max } = req.body;
    const newOff = await offModel.create(
        {
            code,
            course,
            percent,
            max,
            uses: 0,
            creator: req.user._id,
        }
    );

    return res.status(201).json({ message: "Discount code created successfully.", newOff });
};

exports.setOnAll = async (req, res) => {
    const { discount } = req.body;

    if (discount === undefined || discount === null) {
        return res.status(400).json({ message: "Discount value is required" });
    }

    const coursesDiscount = await coursesModel.updateMany(
        {}, // فیلتر برای انتخاب همه اسناد
        { $set: { discount } } // فیلد discount را به‌روزرسانی می‌کند
    );

    return res.status(200).json({
        message: "Discount set successfully ...",
        coursesDiscount
    });
};

exports.remove = async (req, res) => {
    try {
        const { id } = req.params;

        const off = await offModel.findByIdAndDelete(id);

        if (!off) {
            return res.status(404).json({ message: "Discount code not found." });
        }

        return res.status(200).json({ message: "Discount code deleted successfully." });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred on the server." });
    }
};

exports.getOne = async (req, res) => {
    const { code } = req.params;
    const { course } = req.body;

    if (!mongoose.Types.ObjectId.isValid(course)) {
        return res.status(400).json({ message: "Course ID is not valid." });
    }

    const off = await offModel.findOne({ code, course });

    if (!off) {
        return res.status(404).json({ message: "Discount code not found." });
    } else if (off.uses >= off.max) {
        return res.status(409).json({ message: "Discount code has reached its maximum usage." });
    } else {
        await offModel.findByIdAndUpdate(
            { _id: off._id },
            { uses: off.uses + 1 }
        )
        return res.status(200).json({ message: "Discount code found successfully.", off });
    }
};

// Another way | Needs development === \/

exports.XsetOnOne = async (req, res) => {
    try {
        let { code, percent, course, max } = req.body;
        const creator = req.user._id;

        percent = parseInt(percent, 10);
        max = parseInt(max, 10);
        code = code.replace(/\s+/g, "");

        if (isNaN(max) || max <= 0) {
            return res.status(400).json({ message: "Max usage must be a valid positive number." });
        }

        if (!code || !percent || !max) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (percent <= 0 || percent > 100) {
            return res.status(400).json({ message: "Discount percentage must be between 1 and 100." });
        }

        const existingOff = await offModel.findOne({ code });
        if (existingOff) {
            return res.status(400).json({ message: "This discount code already exists." });
        }

        const off = new offModel({
            code,
            percent,
            course: course || null,
            applyToAll: !course, // اگر `course` مقدار نداشته باشد، این کد برای همه دوره‌ها است.
            max,
            uses: 0,
            creator,
        });

        await off.save();

        const populatedOff = await offModel.findById(off._id)
            .populate('course')
            .populate('creator', "-password");

        return res.status(201).json({ message: "Discount code created successfully.", off: populatedOff });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred on the server." });
    }
};

exports.XsetOnAll = async (req, res) => {
    try {
        let { code, percent, max } = req.body;
        const creator = req.user._id;

        percent = parseInt(percent, 10);
        max = parseInt(max, 10);
        code = code.replace(/\s+/g, "");

        if (isNaN(max) || max <= 0) {
            return res.status(400).json({ message: "Max usage must be a valid positive number." });
        }

        if (!code || !percent || !max) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (percent <= 0 || percent > 100) {
            return res.status(400).json({ message: "Discount percentage must be between 1 and 100." });
        }

        const existingOff = await offModel.findOne({ code });
        if (existingOff) {
            return res.status(400).json({ message: "This discount code already exists." });
        }

        // بررسی اینکه قبلاً یک کد تخفیف عمومی وجود نداشته باشد.
        const existingGlobalOff = await offModel.findOne({ applyToAll: true, percent });
        if (existingGlobalOff) {
            return res.status(400).json({ message: "A global discount code already exists." });
        }

        const off = new offModel({
            code,
            percent,
            max,
            uses: 0,
            applyToAll: true, // این تخفیف برای همه دوره‌ها است.
            creator,
        });

        await off.save();

        return res.status(201).json({ message: "Global discount code created successfully.", off });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred on the server." });
    }
};