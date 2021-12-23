const express = require('express');
const router = express.Router();

// const quanLyLopController = require("../app/controllers/QuanLyLopController");
const quanLyLopController = require('../app/controllers/QuanLyControllers');

router.get('/dssv', quanLyLopController.dssv);
router.get('/', quanLyLopController.indexLop);

module.exports = router;
