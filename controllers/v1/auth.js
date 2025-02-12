const userModel = require('../../models/user');
const registerValidator = require('../../validators/register');

exports.register = async (req, res) => {
    const validationResult = registerValidator(req.body);
    if (validationResult != true) {
        return res.status(422).json({
            message: "Validation failed",
            errors: validationResult
        });
    };

    const { name, username, email, phone, password } = req.body;
    const isUserExist = await userModel.findOne({
        $or: [{ username }, { email }],
    });
    if (isUserExist) {
        return res.status(409).json({
            message: "username or email already exist",
        });
    };
};
exports.login = async (req, res) => { };
exports.getMe = async (req, res) => { };



