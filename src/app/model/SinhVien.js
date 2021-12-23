const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SinhVien = new Schema({
  MaSinhVien: { type: Number },
  TenSinhVien: { type: String },
  GioiTinh: { type: String },
  HoKhauThuongTru: { type: String },
  NoiSinh: { type: String },
  NamSinh: { type: Date },
  SDT: { type: String },
  Email: { type: String },
  TrangThai: { type: Boolean },
  MaKhoa: { type: String },
  MaChuyenNganh: { type: String },
  MaLop: { type: Number },
  DanToc: { type: String },
  TonGiao: { type: String },
  HinhAnh: { type: String },
  SoCMND: { type: String },
  NgayCap: { type: Date },
  NoiCap: { type: String },
  KhuVuc: { type: String },
  DoiTuong: { type: String },
  DienChinhSach: { type: String },
  NgayVaoDoan: { type: Date },
  NgayVaoDang: { type: Date },
  DiaChiLienHe: { type: String },
  BacDaoTao: { type: String },
  LoaiHinhDaoTao: { type: String },
  CoSo: { type: String },
});
module.exports = mongoose.model("SinhVien", SinhVien);
