const express = require('express');
const notificationControllers = require('../../controllers/v1/notification');
const authMiddleware = require('./../../middlewares/auth');
const isAdminMiddleware = require('./../../middlewares/isAdmin');

const router = express.Router();

router.route('/')
    .post(authMiddleware, isAdminMiddleware, notificationControllers.create)
    .get(authMiddleware, isAdminMiddleware, notificationControllers.getAll);

router.route('/:id')
    .delete(authMiddleware, isAdminMiddleware, notificationControllers.remove);

router.route('/admin').get(authMiddleware, isAdminMiddleware, notificationControllers.get);

router.route('/:id/seen').put(authMiddleware, isAdminMiddleware, notificationControllers.seen);


module.exports = router;