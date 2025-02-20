const express = require('express');
const userController = require('./../../controllers/v1/user');
const authMiddleware = require('./../../middlewares/auth');
const isAdminMiddleware = require('./../../middlewares/isAdmin');

const router = express.Router();

router
  .route("/")
  .get(authMiddleware, isAdminMiddleware, userController.getAllUsers);

router
  .route("/:id")
  .delete(userController.removeUser);
  

router
  .route("/ban/:id")
  .post(authMiddleware, isAdminMiddleware, userController.banUser);


module.exports = router;