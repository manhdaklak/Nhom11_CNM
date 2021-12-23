const express = require('express');
const router = express.Router();
// const quanLyDangKyHocPhan = require('../app/controllers/QuanLyDangKyHocPhan');
const quanLyDangKyHocPhan = require('../app/controllers/QuanLyControllers');

router.get('/dssv', quanLyDangKyHocPhan.dssv);
router.get('/dangkyhp', quanLyDangKyHocPhan.dangkyhp);
router.get('/thongtinhocky', quanLyDangKyHocPhan.loadThongTinHocKy);

router.post('/dangkylophocphan', quanLyDangKyHocPhan.dangKyLopHocPhan);
router.get('/xemlichhoc/:MaLopHocPhan', quanLyDangKyHocPhan.loadXemLichHoc);
router.post('/huylophocphandangky', quanLyDangKyHocPhan.huyLopHocPhanDaDangKy);
router.get(
  '/hienthilophocphandangky/:MaHocKy',
  quanLyDangKyHocPhan.loadLopHocPhanDangky
);
router.get(
  '/hienthichitietlophocphan/:MaLopHocPhan',
  quanLyDangKyHocPhan.loadChiTietLopHocPhan
);
router.get(
  '/hienthihocphan/:MaHocKy',
  quanLyDangKyHocPhan.loadHocPhanTrongHocKy
);
router.get(
  '/hienthilophocphan/:MaHocPhan',
  quanLyDangKyHocPhan.loadLopHocPhanTrongHocKy
);
router.get(
  '/thongtinsinhvien/:MaSinhVien',
  quanLyDangKyHocPhan.loadThongTinSinhVien
);
router.get('/diem-so', quanLyDangKyHocPhan.diemso);
router.get('/', quanLyDangKyHocPhan.indexDKHP);

module.exports = router;
