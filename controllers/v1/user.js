const userModule = require('./../../models/user');
const banUserModule = require('./../../models/ban_phone');
const { default: mongoose } = require('mongoose');



exports.banUser = async (req, res) => {
    const mainUser = await userModule.findOne({ _id: req.params.id }).lean();
    const banUserResult = banUserModule.create({ phone: mainUser.phone });
    if (banUserResult) {
        return res.status(200).json({ message: 'User has banned successfuly ... :)' });
    };

    return res.status(500).json({ message: 'server ERROR ... :(' });
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userModule.find({}).lean();
        users.forEach(user => {
            delete user.password; // حذف  پسورد از هر کاربر
        });

        return res.status(200).json({ users });
    } catch (error) {
        return res.status(500).json({ message: 'server ERROR ... :(', error: error.message });
    }
};

exports.removeUser = async (req, res) => {
    const isValidUserID = mongoose.Types.ObjectId.isValid(req.params.id);   // بررسی اینکه آیا آیدی وارد شده معتبر است یا خیر
    
    if (!isValidUserID) {
        return res.status(409 ).json({ message: 'Invalid user ID ... :(' });
    };

    const removeUser = await userModule.findByIdAndDelete({ _id: req.params.id });

    if (!removeUser) {
        return res.status(404).json({ message: 'User not found ... :(' });
    };
    
    return res.status(200).json({ message: 'User removed successfuly ... :)' });
};