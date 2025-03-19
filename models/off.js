const mongoose = require('mongoose');

const schema = mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true, // کدهای تخفیف نباید تکراری باشند.
    },
    percent: {
        type: Number,
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: false, // برای تخفیف‌های عمومی نیاز نیست.
    },
    applyToAll: {
        type: Boolean,
        default: false, // پیش‌فرض فقط برای یک دوره خاص است.
    },
    max: {
        type: Number,
        required: true,
    },
    uses: {
        type: Number,
        default: 0,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

// جلوگیری از همزمان `applyToAll: true` و مقدار داشتن `course`
schema.pre('save', function (next) {
    if (this.applyToAll && this.course) {
        return next(new Error("Discount cannot be applied to all courses and a specific course at the same time."));
    }
    next();
});

const model = mongoose.model('Off', schema);
module.exports = model;
