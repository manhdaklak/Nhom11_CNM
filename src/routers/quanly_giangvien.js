const express = require('express');
const router = express.Router();

// const quanLyGiangVienController = require('../app/controllers/QuanLyGiangVienController');
const quanLyGiangVienController = require('../app/controllers/QuanLyControllers');

router.get('/', quanLyGiangVienController.indexGiangVien);
router.get('/delete', quanLyGiangVienController.xoaGiangVien);
router.get('/loadkhoa', quanLyGiangVienController.loadThongTinKhoaGV);
router.get(
  '/loadchuyennganh/:MaKhoa',
  quanLyGiangVienController.loadThongTinChuyenNganhGV
);
router.post('/api', quanLyGiangVienController.themgiangvien);
router.get('/delete', quanLyGiangVienController.xoaGiangVien);

module.exports = router;
