const userModel = require('../../models/user');
const registerValidator = require('../../validators/register');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


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

    const countOfUsers = await userModel.count();
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new userModel({
        email,
        username,
        name,
        phone,
        password: hashedPassword,
        role: countOfUsers > 0 ? "USER" : "ADMIN",
    });

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn: '30d'});

    return res.status(201).json({ user, accessToken });
};
exports.login = async (req, res) => { };
exports.getMe = async (req, res) => { };



