const express = require('express');
const menuController = require("../../controllers/v1/menu");
const authMiddleware = require('./../../middlewares/auth');
const isAdminMiddleware = require('./../../middlewares/isAdmin');

const router = express.Router();

router.route("/")
    .get(menuController.getAll)
    .post(authMiddleware, isAdminMiddleware, menuController.create);

router.route("/all")
    .get(authMiddleware, isAdminMiddleware ,menuController.getAllInPanel);

router.route("/:id").delete(authMiddleware, isAdminMiddleware, menuController.remove);

module.exports = router;