const express = require('express');
const router = express.Router();

// const quanLyLopHPController = require('../app/controllers/QuanLyLopHPController');
const quanLyLopHPController = require('../app/controllers/QuanLyControllers');

router.get('/dssv/:MaLopHP', quanLyLopHPController.dssv);
router.get('/dangkyhp', quanLyLopHPController.dangkyhp);
router.get('/diem-so', quanLyLopHPController.diemso);
router.get('/', quanLyLopHPController.indexLopHP);
router.get('/trangthai', quanLyLopHPController.capnhattrangthai);
router.get('/delete', quanLyLopHPController.xoaLopHP);
router.get(
  '/loadlop/:MaChuyenNganh',
  quanLyLopHPController.loadThongTinLopLopHP
);
router.get(
  '/loadhocphan/:MaChuyenNganh',
  quanLyLopHPController.loadThongTinHocPhanLopHP
);
router.get(
  '/loadmahocphan/:TenHocPhan',
  quanLyLopHPController.loadChangeHocPhanLopHP
);
router.get(
  '/loadgiangvien/:MaChuyenNganh',
  quanLyLopHPController.loadThongTinGiangVienLopHP
);
router.get(
  '/loadmagiangvien/:TenGiangVien',
  quanLyLopHPController.loadChangeGiangVienLopHP
);
router.get(
  '/loaddaynha/:CoSo',
  quanLyLopHPController.loadThongTinPhongHocLopHP
);
router.get(
  '/loadphonghoc/:DayNha',
  quanLyLopHPController.loadChangePhongHocLopHP
);
router.get('/loadkhoa', quanLyLopHPController.loadThongTinKhoaLopHP);
router.get(
  '/loadchuyennganh/:MaKhoa',
  quanLyLopHPController.loadThongTinChuyenNganhLopHP
);
router.post('/api', quanLyLopHPController.themlophocphan);

module.exports = router;
