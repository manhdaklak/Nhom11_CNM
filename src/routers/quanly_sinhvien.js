const express = require('express');
const router = express.Router();
let upload = require('../database/multer.config');
// const quanLySinhVienController = require("../app/controllers/QuanLySinhVienController");
const quanLySinhVienController = require('../app/controllers/QuanLyControllers');

router.get('/edit/:MaSinhVien', quanLySinhVienController.editSinhVien);

router.get('/delete', quanLySinhVienController.xoaSinhVien);
router.get('/loadkhoa', quanLySinhVienController.loadThongTinKhoaSinhVien);

router.get('/loakhoahoc', quanLySinhVienController.loadKhoaHocSinhVien);
router.get(
  '/loadchuyennganh/:MaKhoa',
  quanLySinhVienController.loadThongTinChuyenNganhSinhVien
);
router.get(
  '/loaddanhsachsinhvien',
  quanLySinhVienController.loadDanhSachSinhVien
);

router.get(
  '/loadlop/:MaChuyenNganh',
  quanLySinhVienController.loadThongTinLopSinhVien
);
router.post('/api', quanLySinhVienController.themsinhvien);
router.get('/', quanLySinhVienController.indexSinhVien);

router.post(
  '/upload/api',
  upload.single('file'),
  quanLySinhVienController.uploadFile
);

module.exports = router;
