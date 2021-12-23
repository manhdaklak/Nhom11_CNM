const express = require('express');
const router = express.Router();

const quanLyController = require('../app/controllers/QuanLyControllers');

router.get('/home', quanLyController.index);
router.get('/dangxuat', quanLyController.dangxuat);
router.post('/', quanLyController.loginQuanLy);
router.get('/', quanLyController.loginql);

// // =========CHUYEN NGANG=======
// router.get(
//   '/quanly-chuyennganh/chinhsuachuyennganh',
//   quanLyController.hienthiChuyenNganhChinhSua
// );
// router.get(
//   '/quanly-chuyennganh/xoachuyennganh',
//   quanLyController.xoaChuyenNganh
// );
// router.get(
//   '/quanly-chuyennganh/hienthikhoa',
//   quanLyController.hienThiThongTinKhoa
// );
// router.post(
//   '/quanly-chuyennganh/themchuyennganh',
//   quanLyController.themChuyenNganh
// );
// router.get('/quanly-chuyennganh/', quanLyController.indexChuyenNganh);

module.exports = router;
