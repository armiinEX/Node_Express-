const express = require("express");
const router = express.Router();
const authMiddleware = require("./../../middlewares/auth");
const commentController = require("./../../controllers/v1/comment");
const isAdminMiddleware = require("./../../middlewares/isAdmin");

router.route("/").post(authMiddleware, commentController.create);

router.route("/:id").delete(authMiddleware, isAdminMiddleware, commentController.remove);


module.exports = router;
