const express = require('express');
const router = express.Router();

// const quanLyHocKyController = require("../app/controllers/QuanLyHocKyController");
const quanLyHocKyController = require('../app/controllers/QuanLyControllers');

router.post('/themhocky', quanLyHocKyController.themHocKy);
router.get('/chinhsuahocky/:MaHocKy', quanLyHocKyController.chonHocKyChinhSua);
router.post('/chinhsuahocky', quanLyHocKyController.chinhSuaHocKy);
router.get('/xoahocky', quanLyHocKyController.xoaHocKy);
router.get('/', quanLyHocKyController.indexHocKy);

module.exports = router;

//B1: Tạo controller(QuanLyHocKyController)
// B2: Tạo view tương ứng đuôi hbs (QL_HocKy.hbs)
//B3: tạo file router tương ứng (ví dụ như quanly_hocky.js)
//B4: config đường dẫn
//B5 viết phương thức get post... ở trong file QuanLyHocKyController.
//B6: thêm đường dẫn vào file index.js trong thư mục router
