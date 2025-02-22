const userModule = require('./../../models/user');
const banUserModule = require('./../../models/ban_phone');
const { default: mongoose, isValidObjectId} = require('mongoose');

exports.banUser = async (req, res) => {
    const mainUser = await userModule.findOne({ _id: req.params.id }).lean();
    const banUserResult = await banUserModule.create({ phone: mainUser.phone });
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
    const isValidUserID = mongoose.Types.ObjectId.isValid(req.params.id);
    
    if (!isValidUserID) {
        return res.status(409 ).json({ message: 'Invalid user ID ... :(' });
    };

    const removeUser = await userModule.findByIdAndDelete({ _id: req.params.id });

    if (!removeUser) {
        return res.status(404).json({ message: 'User not found ... :(' });
    };
    
    return res.status(200).json({ message: 'User removed successfuly ... :)' });
};

exports.changeRole = async (req, res) => {
    const { id } = req.body;
    const isValidUserID = isValidObjectId(id);
    console.log(isValidUserID);
    
    if (!isValidUserID) {
        return res.status(409).json({ message: 'Invalid user ID ... :(' });
    };

    const user = await userModule.findOne({ _id: id });
    let newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    console.log(newRole);
    const updatedUser = await userModule.findByIdAndUpdate({ _id: id }, { role: newRole });

    if (updatedUser) {
        return res.status(200).json({ message: 'User role changed successfuly ... :)' });
    };
};