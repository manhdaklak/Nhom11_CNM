const express = require('express');
const router = express.Router();

// const quanLyChuyenNganhController = require("../app/controllers/QuanLyChuyenNganhController");
const quanLyChuyenNganhController = require('../app/controllers/QuanLyControllers');

router.get(
  '/chinhsuachuyennganh',
  quanLyChuyenNganhController.hienthiChuyenNganhChinhSua
);
router.get('/xoachuyennganh', quanLyChuyenNganhController.xoaChuyenNganh);
router.get('/hienthikhoa', quanLyChuyenNganhController.hienThiThongTinKhoa);
router.post('/themchuyennganh', quanLyChuyenNganhController.themChuyenNganh);
router.get('/', quanLyChuyenNganhController.indexChuyenNganh);

module.exports = router;
