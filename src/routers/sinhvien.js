const express = require("express");
const router = express.Router();
const isAuth = require("../app/middleware/is-auth");
const sinhVienController = require("../app/controllers/SinhVienController");

router.get("/home", sinhVienController.home);
router.get("/thongtincanhan", sinhVienController.thongtincanhan);
router.get("/xemlich", sinhVienController.xemlich);
router.get("/lichmonhoc", sinhVienController.xemlichhoc);
router.get("/ketquahoctap", sinhVienController.ketquahoctap);

router.post("/capnhatmatkhau", sinhVienController.capnhatMatKhau);
router.get("/xemlichhoc/:MaLopHocPhan", sinhVienController.xemlichdadangky);
router.get("/xemlichtrung/:MaHocKy", sinhVienController.kiemtrahocphanbitrung);
router.get(
  "/xemlophocphandangky/:MaHocKy",
  sinhVienController.xemlophocphandangdangky
);

router.post(
  "/huylophocphandangky/",
  sinhVienController.huylophocphandangdangky
);

router.get("/dangkyhocphan", sinhVienController.dangkyhocphan);
router.post("/dangkylophocphan", sinhVienController.dangkylophocphanPost);

router.get(
  "/dangkychitiethp/:MaLopHocPhan",
  sinhVienController.dangkyhocphanCTLopHP
);
router.get("/dangkyhp/:MaHocKy", sinhVienController.dangkyhocphanPost);
router.get("/dangkychonhp/:MaHocPhan", sinhVienController.dangkyhocphanLopHP);
router.get("/hienthihocky", sinhVienController.loadThongTinHocKy);
router.get("/dangxuat", sinhVienController.dangxuat);
router.post("/home", sinhVienController.login);
router.get("/", sinhVienController.loginsv);

module.exports = router;
