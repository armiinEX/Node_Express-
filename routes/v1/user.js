const express = require('express');
const router = express.Router();
const userController = require('../../controllers/v1/user');
const { routes } = require('../../app');


router.route("/ban/:id").post(userController.banUser);


module.exports = router;