const express = require('express');
const router = express.Router();

// const quanLyHocPhanController = require('../app/controllers/QuanLyHocPhanController');
const quanLyHocPhanController = require('../app/controllers/QuanLyControllers');

router.get('/', quanLyHocPhanController.indexHocPhan);

router.get('/delete', quanLyHocPhanController.xoaHocPhan);
router.get('/loadkhoa', quanLyHocPhanController.loadThongTinKhoaHP);
router.get(
  '/loadchuyennganh/:MaKhoa',
  quanLyHocPhanController.loadThongTinChuyenNganhHP
);
router.get(
  '/loadmonhoc/:MaChuyenNganh',
  quanLyHocPhanController.loadTenMonHocHP
);
router.get('/loadmamonhoc/:TenMonHoc', quanLyHocPhanController.loadMaMonHocHP);

router.post('/api', quanLyHocPhanController.themHocPhan);

module.exports = router;
