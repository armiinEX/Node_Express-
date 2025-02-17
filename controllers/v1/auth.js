const userModel = require('../../models/user');
const registerValidator = require('../../validators/register');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const banUserModule = require('./../../models/ban_phone');


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

  const isUserBan = await banUserModule.find({ phone: phone });

  if (isUserBan.length) {
    return res.status(409).json({
      message: "this phone number is banned",
    });
  };

  const countOfUsers = await userModel.countDocuments();
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await userModel.create({
    email,
    username,
    name,
    phone,
    password: hashedPassword,
    role: countOfUsers > 0 ? "USER" : "ADMIN",
  });

  const userObject = user.toObject();
  Reflect.deleteProperty(userObject, "password");

  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30 day' });

  return res.status(201).json({ user: userObject, accessToken });
};

exports.login = async (req, res) => {
  const { identifier, password } = req.body;
  const user = await userModel.findOne({
    $or: [{ username: identifier }, { email: identifier }],
  });
  if (!user){
    return res.status(401).json({ message: "ther is no user with email or username." });
  };
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "password is not correct." });
  };

  const accessToken = jwt.sign({ _id: user._id}, process.env.JWT_SECRET, { expiresIn: '30 day' });

  return res.json({accessToken});
};

exports.getMe = async (req, res) => { };




