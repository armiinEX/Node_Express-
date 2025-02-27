const express = require('express');
const cousrsesController = require('./../../controllers/v1/course');
const authMiddleware = require('./../../middlewares/auth');
const isAdminMiddleware = require('./../../middlewares/isAdmin');
const multerStorage = require("./../../utils/uploader");
const multer = require('multer');
const router = express.Router();

router.route('/')
    .post(multer({ storage: multerStorage, limits: { fileSize: 1000000000 } }).single('cover'),
        authMiddleware,
        isAdminMiddleware,
        cousrsesController.create
    );


router.route("/:id/sessions")
    .post(
        // multer({ storage: multerStorage, limits: { fileSize: 1000000000 } }).single('video'),
        authMiddleware,
        isAdminMiddleware,
        cousrsesController.createSession
    );


router.route("/sessions").get(authMiddleware, isAdminMiddleware, cousrsesController.getAllSessions);

router.route("/:href/:sessionID").get(cousrsesController.getSessionInfo)


module.exports = router;