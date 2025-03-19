const express = require('express');
const searchControllers = require('../../controllers/v1/search');

const router = express.Router();

router.route('/:keyword').get(searchControllers.get);   

module.exports = router;