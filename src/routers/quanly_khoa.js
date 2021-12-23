const express = require('express');
const router = express.Router();

// const quanLyKhoaController = require("../app/controllers/QuanLyKhoaController");
const quanLyKhoaController = require('../app/controllers/QuanLyControllers');

router.get('/chinhsua/:MaKhoa', quanLyKhoaController.khoaChinhSua);
router.post('/chinhsua', quanLyKhoaController.updateKhoa);

router.get('/delete', quanLyKhoaController.xoaKhoa);
router.post('/themkhoa', quanLyKhoaController.themkhoa);
router.get('/', quanLyKhoaController.indexKhoa);

module.exports = router;
