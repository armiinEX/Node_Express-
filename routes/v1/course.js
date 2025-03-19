const express = require('express');
const cousrsesController = require('./../../controllers/v1/course');
const authMiddleware = require('./../../middlewares/auth');
const isAdminMiddleware = require('./../../middlewares/isAdmin');
const multer = require('multer');
const multerStorage = require("./../../utils/uploader");
const router = express.Router();

router.route('/')
    .post(
        authMiddleware,
        isAdminMiddleware,
        multer({ storage: multerStorage, limits: { fileSize: 1000000000 } }).single('cover'),
        cousrsesController.create)
    .get(authMiddleware, isAdminMiddleware, cousrsesController.getAll);


router.route("/:id/sessions")
    .post(
        // multer({ storage: multerStorage, limits: { fileSize: 1000000000 } }).single('video'),
        authMiddleware,
        isAdminMiddleware,
        cousrsesController.createSession
    );


router.route("/sessions").get(authMiddleware, isAdminMiddleware, cousrsesController.getAllSessions);

router.route("/related/:href").get(authMiddleware, isAdminMiddleware, cousrsesController.getRelated);

router.route("/pre_sell").get(cousrsesController.pre_sell);

router.route("/popular").get(cousrsesController.popular);

router.route("/:href/:sessionID").get(cousrsesController.getSessionInfo);

router.route("/session/:id").delete(authMiddleware, isAdminMiddleware, cousrsesController.removeSession);

router.route("/:id/register").post(authMiddleware, cousrsesController.register);

router.route("/category/:href").get(cousrsesController.getCoursesByCategory);

router.route("/:href").get(authMiddleware, cousrsesController.getOne);

router.route("/:id").delete(authMiddleware, isAdminMiddleware, cousrsesController.remove);





module.exports = router;