const newSinhVien = require('./sinhvien');
const newQuanLy = require('./quanly');

const newQuanLySinhVien = require('./quanly_sinhvien');
const newQuanLyLop = require('./quanly_lop');
const newQuanLyGiangVien = require('./quanly_giangvien');
const newQuanLyKhoa = require('./quanly_khoa');
const newQuanLyChuyenNganh = require('./quanly_chuyennganh');
const newQuanLyMonHoc = require('./quanly_monhoc');
const newQuanLyHocKy = require('./quanly_hocky');
const newQuanLyLopHP = require('./quanly_lophp');
const newQuanLyHocPhan = require('./quanly_hocphan');
const newQuanLyDKHP = require('./quanly_dkhp');

function route(app) {
  app.use('/sinhvien', newSinhVien);
  app.use('/quanly', newQuanLy);

  app.use('/quanly-sinhvien', newQuanLySinhVien);
  app.use('/quanly-lop', newQuanLyLop);
  app.use('/quanly-giangvien', newQuanLyGiangVien);
  app.use('/quanly-khoa', newQuanLyKhoa);
  app.use('/quanly-chuyennganh', newQuanLyChuyenNganh);
  app.use('/quanly-monhoc', newQuanLyMonHoc);
  app.use('/quanly-hocky', newQuanLyHocKy);
  app.use('/quanly-lophp', newQuanLyLopHP);
  app.use('/quanly-hocphan', newQuanLyHocPhan);
  app.use('/quanly-dkhp', newQuanLyDKHP);
}

module.exports = route;
