const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

module.exports = async (req, res, next) => {
    const authHeader = req.header('Authorization')?.split(" ");
    if (authHeader?.length !== 2) {
        return res.status(403)
        .json("this route is protected and you can't have access to it ...");
    };

    const token = authHeader[1];

    try {
        const jwtpayload = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await userModel.findById(jwtpayload.id).lean();
        
        Reflect.deleteProperty(user, 'password')

        req.user = user;

        next();
    } catch (error) {
        return res.json(error);
    };
};