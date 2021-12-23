const express = require('express');
const router = express.Router();

// const quanLyMonHocController = require('../app/controllers/QuanLyMonHocController');
const quanLyMonHocController = require('../app/controllers/QuanLyControllers');

router.get('/', quanLyMonHocController.indexMonHoc);

router.get('/delete', quanLyMonHocController.xoaMonHoc);
router.get('/loadkhoa', quanLyMonHocController.loadThongTinKhoaMonHoc);
router.get(
  '/loadchuyennganh/:MaKhoa',
  quanLyMonHocController.loadThongTinChuyenNganhMonHoc
);
router.post('/api', quanLyMonHocController.themMonHoc);

module.exports = router;
