const connection = require("../../database/connection");
const bcrypt = require("bcryptjs");
// const { render } = require("node-sass");
const con = require("../../database/connection");
const { query } = require("express");

class SinhVienController {
  // [GET] /sinhvien/
  loginsv(req, res) {
    res.render("Login/SV_Login");
  }

  // [POST] /sinhvien/home
  async login(req, res, next) {
    let mssv = req.body.MaSinhVien;
    let matkhau = req.body.MatKhau;
    let sql = "SELECT * FROM vw_thongtinsv WHERE MaSinhVien = ?";
    connection.query(sql, mssv, (err, rows) => {
      if (rows.length <= 0) {
        req.flash("error", "Thông tin đăng nhập không đúng!");
        res.redirect("/sinhvien/");
        return;
      }
      if (rows[0].MaQuyen != "SV") {
        req.flash("error", "Thông tin đăng nhập không đúng!");
        res.redirect("/sinhvien/");
        return;
      }
      let user = rows[0];
      let pass_fromdb = user.MatKhau;
      var kq = bcrypt.compareSync(matkhau, pass_fromdb);
      if (kq) {
        var sess = req.session; //initialize session variable
        sess.isAuth = true;
        sess.MaSinhVien = user.MaSinhVien;
        sess.TenSinhVien = user.TenSinhVien;
        sess.MaChuyenNganh = user.MaChuyenNganh;
        if (sess.back) {
          res.redirect(sess.back);
        } else {
          res.render("SV_Home", {
            ttsv: rows[0],
            tens: req.session.TenSinhVien,
          });
        }
      } else {
        req.flash("error", "Thông tin đăng nhập không đúng!");
        res.redirect("/sinhvien/");
      }
    });
  }

  // update

  capnhatMatKhau(req, res) {
    if (req.session.isAuth) {
      var matkhaucu = req.body.old_password;
      var matkhaumoi = req.body.confirm_password; //1234567

      var matkhauMaHoa = bcrypt.hashSync(matkhaumoi, 10); //l12sss
      var MaSinhVien = req.session.MaSinhVien;

      var sqlSelectNguoiDung = "SELECT * FROM nguoidung where MaSinhVien =?"; //1800004
      var sqlUpdateMatKhau =
        " UPDATE nguoidung SET MatKhau= ? where MaSinhVien = ?";
      connection.query(sqlSelectNguoiDung, MaSinhVien, (err, result) => {
     
        var kq = bcrypt.compareSync(matkhaucu, result[0].MatKhau);
        if (kq) {
          connection.query(
            sqlUpdateMatKhau,
            [matkhauMaHoa, MaSinhVien],
            (err, rows) => {
              res.send(rows);
            }
          );
        }
      });
    } else {
      req.session.back = "/sinhvien/xemlich";
      res.redirect("/sinhvien/");
    }
  }
  //Đăng xuẩt
  dangxuat(req, res) {
    req.session.destroy();
    res.redirect("/sinhvien/");
  }

  // [GET] /sinhvien/home
  home(req, res, next) {
    if (req.session.isAuth) {
      let sql = "SELECT * FROM vw_thongtinsv WHERE MaSinhVien = ?";
      connection.query(sql, req.session.MaSinhVien, (err, rows) => {
        res.render("SV_Home", {
          ttsv: rows[0],
          tens: req.session.TenSinhVien,
        });
      });
    } else {
      req.session.back = "/sinhvien/home";
      res.redirect("/sinhvien/");
    }
  }

  // hiển thị thông tin học kỳ
  loadThongTinHocKy(req, res) {
    var sqlSelectHocKy = " SELECT * FROM hocky order by Nam desc";
    connection.query(sqlSelectHocKy, (err, result) => {
      res.send(result);
    });
  }

  // [GET] /sinhvien/thongtincanhan
  thongtincanhan(req, res) {
    let sql = "SELECT * FROM  vw_thongtinsv where MaSinhVien = ?";
    if (req.session.isAuth) {
      connection.query(sql, req.session.MaSinhVien, (err, rs) => {
        res.render("SV_ThongTinCaNhan", {
          ttall: rs[0],
          tens: req.session.TenSinhVien,
        });
      });
    } else {
      req.session.back = "/sinhvien/thongtincanhan";
      res.redirect("/sinhvien/");
    }
  }
  // [GET] /sinhvien/xemlich
  xemlich(req, res) {
    if (req.session.isAuth) {
      res.render("SV_XemLich", { tens: req.session.TenSinhVien });
    } else {
      req.session.back = "/sinhvien/xemlich";
      res.redirect("/sinhvien/");
    }
  }
  xemlichhoc(req, res) {
    if (req.session.isAuth) {
      connection.query(
        // "SELECT * FROM  vw_thoikhoabieu where MaSinhVien = ?",
        "select * from vw_thoikhoabieu where TenHocKy = 'Học kỳ 1' and Nam = '2020-2021' and MaSinhVien = ?",
        req.session.MaSinhVien,
        (err, data) => {
          var arrTimeList = { Sang: {}, Chieu: {} };
          for (let item of data) {
            var dayofweek = "T" + item.Thu;
            if (!arrTimeList.Sang[dayofweek]) {
              arrTimeList.Sang[dayofweek] = [];
            }
            if (!arrTimeList.Chieu[dayofweek]) {
              arrTimeList.Chieu[dayofweek] = [];
            }
            if (
              item.TietHoc == "1 - 3" ||
              item.TietHoc == "4 - 6" ||
              item.TietHoc == "1 - 2" ||
              item.TietHoc == "3 - 4" ||
              item.TietHoc == "5 - 6" ||
              item.TietHoc == "1 - 6"
            ) {
              arrTimeList.Sang[dayofweek].push(item);
            } else {
              arrTimeList.Chieu[dayofweek].push(item);
            }
          }

          res.send(JSON.stringify(arrTimeList));
        }
      );
    } else {
      req.session.back = "/sinhvien/xemlich";
      res.redirect("/sinhvien/");
    }
  }
  // [GET] /sinhvien/ketquahoctap
  ketquahoctap(req, res) {
    if (req.session.isAuth) {
      let hockys = [];
      let TongSoChi = 0;
      let TongDiemHe10 = 0;
      let TongDiemHe4 = 0;
      let TongChiRot = 0;
      var mssv = req.session.MaSinhVien;
      var sql = `select TenHocKy, Nam  from vw_ketquahoctap where MaSinhVien = ? group by TenHocKy,Nam`;
      connection.query(sql, mssv, (err, data) => {
        if (err) throw err;
        hockys.push(data);
        console.log(hockys);
      });
      connection.query(
        "SELECT * FROM  vw_ketquahoctap where MaSinhVien = ?",
        mssv,
        (err, data) => {
          for (let item of data) {
            TongSoChi += item.SoTC;
            TongDiemHe10 += item.DiemTongHe10 * item.SoTC;
            TongDiemHe4 += item.DiemTongHe4 * item.SoTC;
            if (item.GhiChu === "Học lại") {
              TongChiRot += item.SoTC;
            }
          }
          let DiemHe10 = (TongDiemHe10 / TongSoChi).toFixed(2);
          let DiemHe4 = (TongDiemHe4 / TongSoChi).toFixed(2);
          let TongChiDat = TongSoChi - TongChiRot;
          let XepLoai = "";
          if (Number(DiemHe10) < 5) {
            XepLoai = "Yếu";
          } else if (Number(DiemHe10) < 6.5) {
            XepLoai = "Trung Bình";
          } else if (Number(DiemHe10) < 8.0) {
            XepLoai = "Khá";
          } else if (Number(DiemHe10) < 9.0) {
            XepLoai = "Giỏi";
          } else {
            XepLoai = "Xuất sắc";
          }

          res.render("SV_KetQuaHocTap", {
            ketquahoctaps: data,
            TongSoChi: TongSoChi,
            DiemHe10: DiemHe10,
            DiemHe4: DiemHe4,
            TongChiDat: TongChiDat,
            TongChiRot: TongChiRot,
            XepLoai: XepLoai,
            tens: req.session.TenSinhVien,
          });
        }
      );
    } else {
      req.session.back = "/sinhvien/xemlich";
      res.redirect("/sinhvien/");
    }
  }

  // [GET] /sinhvien/dangkyhocphan
  dangkyhocphan(req, res) {
    if (req.session.isAuth) {
      var sql = "SELECT * FROM hocky ORDER BY Nam ASC";
      const loadhocky = function (callback) {
        connection.query(sql, (err, result) => {
          res.render("SV_DangKyHocPhan", {
            hockys: result,
            tens: req.session.TenSinhVien,
          });
        });
      };
      loadhocky();
    } else {
      req.session.back = "/sinhvien/dangkyhocphan";
      res.redirect("/sinhvien/");
    }
  }
  // hiển thị học phần tương ứng với machuyennganh + mahocky
  async dangkyhocphanPost(req, res) {
    var resp = {
      IsSuccess: true,
      Data: [],
    };
    if (req.session.isAuth) {
      var mahocky = req.params.MaHocKy;

      var queryHocPhan =
        "select *from hotrosviuh.monhoc mh join hotrosviuh.hocphan hp on" +
        " mh.MaMonHoc = hp.MaMonHoc join hotrosviuh.hocky hk on hk.MaHocKy = hp.MaHocKy  " +
        " where (mh.MaChuyenNganh = ? or mh.GhiChu = 'Chung') and hp.MaHocKy = ? " +
        " and hp.MaHocPhan NOT IN(" +
        "SELECT lhp.MaHocPhan FROM hotrosviuh.lophocphan lhp " +
        "join hotrosviuh.dangkyhocphan dkhp on dkhp.MaLopHP = lhp.MaLopHP " +
        "join hotrosviuh.hocphan hp on hp.MaHocPhan = lhp.MaHocPhan)";
      if (mahocky != null) {
        connection.query(
          queryHocPhan,
          [req.session.MaChuyenNganh, mahocky],
          (err, rows) => {
            resp.Data = rows;
            res.send(resp);
          }
        );
      } else {
        resp.IsSuccess = false;
      }
    } else {
      req.session.back = "/sinhvien/dangkyhocphan";
      res.redirect("/sinhvien/");
    }
  }

  // hiển thị lớp học phần đã chọn (với input là mahocphan)
  async dangkyhocphanLopHP(req, res) {
    if (req.session.isAuth) {
      var mahocphan = req.params.MaHocPhan;
      var sqlLopHocPhan = "select *from vw_lophocphan where MaHocPhan =?";
      connection.query(sqlLopHocPhan, mahocphan, (err, rs) => {
        res.send(rs);
      });
    } else {
      req.session.back = "/sinhvien/dangkyhocphan";
      res.redirect("/sinhvien/");
    }
  }
  // hiển thị chi tiết lớp học phần
  async dangkyhocphanCTLopHP(req, res) {
    if (req.session.isAuth) {
      var malophocphan = req.params.MaLopHocPhan;

      var sqlLopHocPhan = "select *from  vw_ctlophocphan where MaLopHP=?";
      connection.query(sqlLopHocPhan, malophocphan, (err, rs) => {
        res.send(rs);
      });
    } else {
      req.session.back = "/sinhvien/dangkyhocphan";
      res.redirect("/sinhvien/");
    }
  }
  // thêm lớp học phần đã đăng ký
  async dangkylophocphanPost(req, res) {
    if (req.session.isAuth) {
      var malophocphan = req.body.malophocphan;
      var TrangThai = "Đăng ký mới";
      var today = new Date();
      var NgayDangKy =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      var sqlInsertLopHocPhanDangKy =
        "INSERT INTO dangkyhocphan (MaSinhVien, MaLopHP,NgayDangKy,TrangThai) VALUES (?,?,?,?)";
      con.query(
        sqlInsertLopHocPhanDangKy,
        [req.session.MaSinhVien, malophocphan, NgayDangKy, TrangThai],
        (err, rows) => {
          // // cách check nếu IsSuccess =true thì send data
          var respp = { IsSuccess: err == null ? true : false, data: rows };
          res.send(respp);
          // res.send(rows);
        }
      );
    } else {
      req.session.back = "/sinhvien/dangkyhocphan";
      res.redirect("/sinhvien/");
    }
  }
  // xem lớp học phần đã đăng ký theo mã sinh viên và theo từng kỳ
  async xemlophocphandangdangky(req, res) {
    if (req.session.isAuth) {
      var mahocky = req.params.MaHocKy;

      var sqlXemLopHocPhanDKy =
        " select *from vw_xemlophpdky where MaSinhVien = ? and MaHocKy = ?";
      connection.query(
        sqlXemLopHocPhanDKy,
        [req.session.MaSinhVien, mahocky],
        (err, rows) => {
          res.send(rows);
        }
      );
    } else {
      req.session.back = "/sinhvien/dangkyhocphan";
      res.redirect("/sinhvien/");
    }
  }
  // xem lịch học đã đăng ký
  async xemlichdadangky(req, res) {
    if (req.session.isAuth) {
      var MaLopHP = req.params.MaLopHocPhan;

      var sqlXemLichHocPhanDKy =
        "SELECT * FROM hotrosviuh.vw_ctlophocphan where MaLopHP= ?";
      connection.query(sqlXemLichHocPhanDKy, MaLopHP, (err, rows) => {
        res.send(rows);
      });
    } else {
      req.session.back = "/sinhvien/dangkyhocphan";
      res.redirect("/sinhvien/");
    }
  }
  // hủy lớp học phần đã đăng ký
  async huylophocphandangdangky(req, res) {
    if (req.session.isAuth) {
      var MaDangKy = req.body.MaDangKy;
      var sqlHuyHocPhan = "DELETE FROM dangkyhocphan WHERE MaDK = ?";
      connection.query(sqlHuyHocPhan, MaDangKy, (err, rs) => {
        var respp = { IsSuccess: err == null ? true : false, data: rs };
        res.send(respp);
      });
    } else {
      req.session.back = "/sinhvien/dangkyhocphan";
      res.redirect("/sinhvien/");
    }
  }

  // kiếm tra học phần có bị trùng với học phần khác ??
  async kiemtrahocphanbitrung(req, res) {
    if (req.session.isAuth) {
      var mahocky = req.params.MaHocKy;
      var querySelectLichTrung =
        "SELECT *FROM hotrosviuh.vw_xemlichtrung where MaHocKy = ?";

      connection.query(querySelectLichTrung, mahocky, (err, result) => {
        // console.log(result);
        if (err) console.log(err);
        res.send(result);
      });
    } else {
      req.session.back = "/sinhvien/dangkyhocphan";
      res.redirect("/sinhvien/");
    }
  }
}
module.exports = new SinhVienController();
