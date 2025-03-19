const express = require('express');
const offControllers = require('../../controllers/v1/off');
const authMiddleware = require('./../../middlewares/auth');
const isAdminMiddleware = require('./../../middlewares/isAdmin');

const router = express.Router();


router.route("/")
    .get(authMiddleware, isAdminMiddleware, offControllers.getAll)
    .post(authMiddleware, isAdminMiddleware, offControllers.setOnOne);

router.route("/all").post(authMiddleware, isAdminMiddleware, offControllers.setOnAll);

router.route("/:code").post(authMiddleware, isAdminMiddleware, offControllers.getOne);

router.route("/:id").delete(authMiddleware, isAdminMiddleware, offControllers.remove);



module.exports = router;