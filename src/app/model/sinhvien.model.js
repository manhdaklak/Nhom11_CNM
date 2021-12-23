module.exports = (sequelize, Sequelize) => {
  const Student = sequelize.define("sinhvien", {
    MaSinhVien: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    TenSinhVien: {
      type: Sequelize.STRING,
    },
    GioiTinh: {
      type: Sequelize.STRING,
    },
    HoKhauThuongTru: {
      type: Sequelize.STRING,
    },
    NoiSinh: {
      type: Sequelize.STRING,
    },
    NamSinh: {
      type: Sequelize.DATE,
    },
    SDT: {
      type: Sequelize.STRING,
    },
    Email: {
      type: Sequelize.STRING,
    },
    TrangThai: {
      type: Sequelize.STRING,
    },
    MaKhoa: {
      type: Sequelize.STRING,
    },
    MaChuyenNganh: {
      type: Sequelize.STRING,
    },
    MaLop: {
      type: Sequelize.INTEGER,
    },
    DanToc: {
      type: Sequelize.STRING,
    },
    TonGiao: {
      type: Sequelize.STRING,
    },
    HinhAnh: {
      type: Sequelize.STRING,
    },
    SoCMND: {
      type: Sequelize.STRING,
    },
    NgayCap: {
      type: Sequelize.DATE,
    },
    NoiCap: {
      type: Sequelize.STRING,
    },
    KhuVuc: {
      type: Sequelize.STRING,
    },
    DoiTuong: {
      type: Sequelize.STRING,
    },
    DienChinhSach: {
      type: Sequelize.STRING,
    },
    NgayVaoDoan: {
      type: Sequelize.DATE,
    },
    NgayVaoDang: {
      type: Sequelize.DATE,
    },
    DiaChiLienHe: {
      type: Sequelize.STRING,
    },
    BacDaoTao: {
      type: Sequelize.STRING,
    },
    LoaiHinhDaoTao: {
      type: Sequelize.STRING,
    },
    CoSo: {
      type: Sequelize.STRING,
    },
  });

  return Student;
};
