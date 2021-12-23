const connection = require('../../database/connection');
const bcrypt = require('bcryptjs');
var sesionTenQuanLy = '';

var _ = require('lodash');
const data = require('../../database/db.config');
const readXlsxFile = require('read-excel-file/node');
const Student = data.Student;

class QuanLyController {
  // [GET] /quanly/
  loginql(req, res) {
    res.render('Login/QL_Login');
  }

  // [POST] /quanly/
  loginQuanLy(req, res, next) {
    var manguoidung = req.body.MaGiangVien;
    var matkhau = req.body.MatKhau;

    var sqlSelectADMIN =
      'SELECT * FROM hotrosviuh.nguoidung nd join hotrosviuh.giangvien gv ' +
      ' on nd.MaGiangVien = gv.MaGiangVien where nd.MaGiangVien = ?';

    connection.query(sqlSelectADMIN, manguoidung, (err, result) => {
      if (result.length <= 0) {
        req.flash('error', 'Thông tin đăng nhập không đúng!');
        res.redirect('/quanly/');
        return;
      }
      if (result[0].MaQuyen != 'ADMIN') {
        req.flash('error', 'Thông tin đăng nhập không đúng!');
        res.redirect('/quanly/');
        return;
      }
      let user = result[0];
      let pass_fromdb = user.MatKhau;
      var kq = bcrypt.compareSync(matkhau, pass_fromdb);
      if (kq) {
        var sess = req.session; //initialize session variable
        sess.isAuth = true;
        sess.MaGiangVien = user.MaGiangVien;
        sess.TenGiangVien = user.TenGiangVien;
        sess.MaChuyenNganh = user.MaChuyenNganh;
        if (sess.back) {
          res.redirect(sess.back);
        } else {
          res.render('QL_Home', { tennds: req.session.TenGiangVien });
        }
      } else {
        req.flash('error', 'Thông tin đăng nhập không đúng!');
        res.redirect('/quanly/');
      }
    });
  }

  
  // [GET] /quanly/home
  index(req, res, next) {
    // res.render('QL_Home');
    if (req.session.isAuth) {
      let sql = 'SELECT * FROM vw_giangvien WHERE MaGiangVien = ?';
      connection.query(sql, req.session.MaGiangVien, (err, rows) => {
        res.render('QL_Home', {
          tennds: req.session.TenGiangVien,
        });
      });
    } else {
      req.session.back = '/quanly/home';
      res.redirect('/quanly/');
    }
  }
  // cap nhat mat khau
  capnhatMatKhau(req, res) {
    if (req.session.isAuth) {
      var matkhaucu = req.body.old_password;
      var matkhaumoi = req.body.confirm_password;

      var matkhauMaHoa = bcrypt.hashSync(matkhaumoi, 10);
      var MaGiangVien = req.session.MaGiangVien;

      var sqlSelectNguoiDung = "SELECT * FROM nguoidung where MaGiangVien =?";
      var sqlUpdateMatKhau =
        " UPDATE nguoidung SET MatKhau= ? where MaGiangVien = ?";
      connection.query(sqlSelectNguoiDung, MaGiangVien, (err, result) => {
        //  console.log( + "dday la mat khau");
        var kq = bcrypt.compareSync(matkhaucu, result[0].MatKhau);
        if (kq) {
          connection.query(sqlUpdateMatKhau,[matkhauMaHoa, MaGiangVien],(err, rows) => {
              res.send(rows);
            });
        }
      });
    } else {
     // req.session.back = "/quanly/xemlich";
      res.redirect("/quanly/");
    }
  }
  // dang xuat
  dangxuat(req, res) {
    req.session.destroy();
    res.redirect('/quanly/');
  }

  // ========= CHUYÊN NGÀNH =========
  // hiển thị chuyên ngành cần chỉnh sửa
  hienthiChuyenNganhChinhSua(req, res) {
    if (req.session.isAuth) {
      var machuyennganh = req.params.MaChuyenNganh;

      var sqlSelectChuyenNganh =
        'SELECT * FROM chuyennganh where MaChuyenNganh = ?';
      connection.query(sqlSelectChuyenNganh, machuyennganh, (err, result) => {
        res.render('QL_ChuyenNganh', {
          chuyennganhchon: result[0],
          tennds: req.session.TenGiangVien,
        });
      });
    } else {
      req.session.back = '/quanly/quanly-chuyennganh';
      res.redirect('/quanly/');
    }
  }

  // xoa chuyên ngành theo mã chuyên ngành
  xoaChuyenNganh(req, res) {
    var machuyennganh = req.query.MaChuyenNganh;

    if (machuyennganh != 'undefined') {
      var sqlDeleteChuyenNganh =
        'DELETE FROM chuyennganh WHERE MaChuyenNganh = ?';
      connection.query(sqlDeleteChuyenNganh, machuyennganh, (err, result) => {
        res.redirect('/quanly-chuyennganh/');
      });
    }
  }

  // thêm chuyên ngành mới theo khoa
  themChuyenNganh(req, res) {
    var makhoa = req.body.MaKhoa;
    var machuyennganh = req.body.MaChuyenNganh;
    var tenchuyennganh = req.body.TenChuyenNganh;
    var ngaytao = new Date();

    var sqlInsertChuyenNganh =
      'INSERT INTO chuyennganh (MaChuyenNganh, TenChuyenNganh,NgayTao,MaKhoa) ' +
      ' VALUES (?,?,?,?)';

    connection.query(
      sqlInsertChuyenNganh,
      [machuyennganh, tenchuyennganh, ngaytao, makhoa],
      (err, result) => {
        res.send(result);
      }
    );
  }

  // hiển thị thông tin khoa
  hienThiThongTinKhoa(req, res) {
    var sqlSelectKhoa = 'select *from khoa';
    connection.query(sqlSelectKhoa, (err, result) => {
      res.send(result);
    });
  }

  // [GET] /quanly-chuyennganh/home
  indexChuyenNganh(req, res) {
    if (req.session.isAuth) {
      var sql = `SELECT * FROM vw_chuyennganh`;
      connection.query(sql, (err, data) => {
        if (err) throw err;
        res.render('QL_ChuyenNganh', {
          chuyennganhs: data,
          tennds: req.session.TenGiangVien,
        });
      });
    } else {
      req.session.back = '/quanly-chuyennganh';
      res.redirect('/quanly/');
    }
  }

  // ========= DANG KY HOC PHAN =========
  dangkyhp(req, res) {
    if (req.session.isAuth) {
      res.render('DK_HocPhan', { tennds: req.session.TenGiangVien });
    } else {
      req.session.back = '/quanly-dkhp';
      res.redirect('/quanly/');
    }
  }
  // hiển thị học phần tương ứng ( input MaChuyenNganh + MaHocKy)
  loadHocPhanTrongHocKy(req, res) {
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
    //  req.session.back = "/sinhvien/dangkyhocphan";
      res.redirect("/quanly/");
    }
  }

  // hiển thị thông tin sinh viên (input massv)
  loadThongTinSinhVien(req, res) {
    var mssv = req.params.MaSinhVien;
    var sqlSelectSinhVien = 'SELECT * FROM vw_thongtinsv WHERE MaSinhVien = ?';
    connection.query(sqlSelectSinhVien, mssv, (err, result) => {
      if (result.length > 0) {
        var sess = req.session; //initialize session variable
        sess.MaChuyenNganh = result[0].MaChuyenNganh;
        sess.MaSinhVien = result[0].MaSinhVien;
      }
      res.send(result);
    });
  }

  // hiển thị thông tin học kỳ
  loadThongTinHocKy(req, res) {
    var sqlSelectHocKy = ' SELECT * FROM hocky order by Nam desc';
    connection.query(sqlSelectHocKy, (err, result) => {
      res.send(result);
    });
  }
  // hiển thị học phần tương ứng ( input MaChuyenNganh + MaHocKy)
  loadHocPhanTrongHocKy(req, res) {
    var MaHocKy = req.params.MaHocKy;
    var MaChuyenNganh = req.session.MaChuyenNganh;
    var resp = {
      IsSuccess: true,
      Data: [],
    };
    if (req.session.isAuth) {
      var queryHocPhan =
        'select *from hotrosviuh.monhoc mh join hotrosviuh.hocphan hp on' +
        ' mh.MaMonHoc = hp.MaMonHoc join hotrosviuh.hocky hk on hk.MaHocKy = hp.MaHocKy  ' +
        " where (mh.MaChuyenNganh = ? or mh.GhiChu = 'Chung') and hp.MaHocKy = ? " +
        ' and hp.MaHocPhan NOT IN(' +
        'SELECT lhp.MaHocPhan FROM hotrosviuh.lophocphan lhp ' +
        'join hotrosviuh.dangkyhocphan dkhp on dkhp.MaLopHP = lhp.MaLopHP ' +
        'join hotrosviuh.hocphan hp on hp.MaHocPhan = lhp.MaHocPhan)';
      if (MaHocKy != null) {
        connection.query(
          queryHocPhan,
          [MaChuyenNganh, MaHocKy],
          (err, rows) => {
            resp.Data = rows;
            res.send(resp);
          }
        );
      } else {
        resp.IsSuccess = false;
      }
    } else {
      req.session.back = '/quanly-dkhp';
      res.redirect('/quanly/');
    }
  }

  // hiển thị lớp học phần tương ứng với học phần đã chọn
  loadLopHocPhanTrongHocKy(req, res) {
    var mahocphan = req.params.MaHocPhan;
    var sqlLopHocPhan = 'select *from vw_lophocphan where MaHocPhan =?';
    connection.query(sqlLopHocPhan, mahocphan, (err, rs) => {
      res.send(rs);
    });
  }

  // hiển thị chi tiết lớp học phần
  loadChiTietLopHocPhan(req, res) {
    var malophocphan = req.params.MaLopHocPhan;
    var sqlLopHocPhan = 'select *from  vw_ctlophocphan where MaLopHP=?';
    connection.query(sqlLopHocPhan, malophocphan, (err, rs) => {
      res.send(rs);
    });
  }

  // hiển thị lớp học phần đă đăng ký trong học kì (input mahocky + msssv)
  loadLopHocPhanDangky(req, res) {
    var mahocky = req.params.MaHocKy;
    var massv = req.session.MaSinhVien;
    var sqlXemLopHocPhanDKy =
      ' select *from vw_xemlophpdky where MaSinhVien = ? and MaHocKy = ?';
    connection.query(sqlXemLopHocPhanDKy, [massv, mahocky], (err, result) => {
      res.send(result);
    });
  }
  // hiển thị thông tin lịch học tương ứng với lớp học phần đã đăng ký
  loadXemLichHoc(req, res) {
    var MaLopHP = req.params.MaLopHocPhan;
    var sqlXemLichHocPhanDKy =
      'SELECT * FROM hotrosviuh.vw_ctlophocphan where MaLopHP= ?';
    connection.query(sqlXemLichHocPhanDKy, MaLopHP, (err, result) => {
      res.send(result);
    });
  }
  // đăng ký lớp học phần
  async dangKyLopHocPhan(req, res) {
    var malophocphan = req.body.malophocphan;
    var TrangThai = 'Đăng ký mới';
    var today = new Date();
    var NgayDangKy =
      today.getFullYear() +
      '-' +
      (today.getMonth() + 1) +
      '-' +
      today.getDate();
    var sqlInsertLopHocPhanDangKy =
      'INSERT INTO dangkyhocphan (MaSinhVien, MaLopHP,NgayDangKy,TrangThai) VALUES (?,?,?,?)';
    connection.query(
      sqlInsertLopHocPhanDangKy,
      [req.session.MaSinhVien, malophocphan, NgayDangKy, TrangThai],
      (err, rows) => {
        // // cách check nếu IsSuccess =true thì send data
        var respp = { IsSuccess: err == null ? true : false, data: rows };
        res.send(respp);
      }
    );
  }
  // hùy lớp học phần đã đăng ký
  huyLopHocPhanDaDangKy(req, res) {
    var MaDangKy = req.body.MaDangKy;
    var sqlHuyHocPhan = 'DELETE FROM dangkyhocphan WHERE MaDK = ?';
    connection.query(sqlHuyHocPhan, MaDangKy, (err, rs) => {
      var respp = { IsSuccess: err == null ? true : false, data: rs };
      res.send(respp);
    });
  }

  diemso(req, res) {
    // res.render('LopHP_DiemSo');
    if (req.session.isAuth) {
      res.render('LopHP_DiemSo', { tennds: req.session.TenGiangVien });
    } else {
      req.session.back = '/quanly-dkhp';
      res.redirect('/quanly/');
    }
  }
  dssv(req, res) {
    if (req.session.isAuth) {
      res.render('LopHP_DSSV', { tennds: req.session.TenGiangVien });
    } else {
      req.session.back = '/quanly-dkhp';
      res.redirect('/quanly/');
    }
  }
  indexDKHP(req, res) {
    // res.render('DK_HocPhan');
    if (req.session.isAuth) {
      res.render('DK_HocPhan', { tennds: req.session.TenGiangVien });
    } else {
      req.session.back = '/quanly-dkhp';
      res.redirect('/quanly/');
    }
  }

  //========= GIANG VIEN =========
  // [GET] /quanly-giangvien/home
  indexGiangVien(req, res) {
    var sql = 'SELECT * FROM vw_giangvien';
    var sqlNguoidung = 'SELECT * FROM nguoidung';
    if (req.session.isAuth) {
      connection.query(sql, (err, rows) => {
        if (err) {
          console.log(err);
        } else {
          res.render('QL_GiangVien', {
            giangviens: rows,
            tennds: req.session.TenGiangVien,
          });
          const svTrung = [];
          const allND = [];
          const allGV = [];
          let ndChuaThem = [];

          connection.query(sqlNguoidung, (errs, data) => {
            if (errs) {
              console.log(errs);
            } else {
              for (const item of data) {
                if (item.MaGiangVien != null) {
                  allND.push(item.MaGiangVien);
                }
              }
            }
            for (const item of rows) {
              allGV.push(item.MaGiangVien);
              for (var i = 0; i < allND.length; i++) {
                if (item.MaGiangVien === allND[i]) {
                  svTrung.push(item.MaGiangVien);
                }
              }
            }
            ndChuaThem = _.difference(allGV, svTrung);
            for (const item of ndChuaThem) {
              var sqlThemNguoidung = `INSERT INTO nguoidung (MaGiangVien, MatKhau, MaQuyen) VALUES (${item}, '$2a$12$ESzhmCr1zHoBFBBE52pfK.YS7Sw9g3XjxYiJrj/uQcXCv0D56gB3q', 'GV')`;

              connection.query(sqlThemNguoidung, (errs, data) => {
                if (errs) {
                  console.log(errs);
                } else {
                  console.log('*Them thanh cong nguoi dung giang vien: ', item);
                }
              });
            }
          });
        }
      });
    } else {
      req.session.back = '/quanly-giangvien';
      res.redirect('/quanly/');
    }
  }

  // hien thi thong tin khoa
  loadThongTinKhoaGV(req, res) {
    var sqlSelectKhoa = 'SELECT * FROM khoa';
    connection.query(sqlSelectKhoa, (err, rows) => {
      console.log(rows);
      res.send(rows);
    });
  }

  //hien thi thong tin chuyen nganh ứng với khoa đã chọn
  loadThongTinChuyenNganhGV(req, res) {
    var MaKhoa = req.params.MaKhoa;
    if (MaKhoa != null) {
      var sqlSelectChuyenNganh = 'SELECT * FROM chuyennganh where MaKhoa = ?';
      connection.query(sqlSelectChuyenNganh, MaKhoa, (err, rows) => {
        res.send(rows);
      });
    }
  }

  // thêm sinh viên
  themgiangvien(req, res) {
    var tengiangvien = '';
    var gioitinh = '';
    var namsinh = '';

    tengiangvien = req.body.tengiangvien;
    gioitinh = req.body.gioitinh;
    namsinh = req.body.namsinh;
    var trinhdo = req.body.trinhdo;
    var noisinh = req.body.noisinh;
    var ngayvaotruong = req.body.ngayvaotruong;
    var khoa = req.body.khoa;
    var chuyennganh = req.body.chuyennganh;
    var dantoc = req.body.dantoc;
    var tongiao = req.body.tongiao;
    var anh = req.body.anh;
    var socmnd = req.body.socmnd;
    var ngaycap = req.body.ngaycap;
    var noicap = req.body.noicap;
    var sdt = req.body.sdt;
    var email = req.body.email;
    var ngayvaodoan = req.body.ngayvaodoan;
    var ngayvaodang = req.body.ngayvaodang;
    var diachilienhe = req.body.diachilienhe;
    var hokhau = req.body.hokhau;
    var today = new Date();
    var ngaytao =
      today.getFullYear() +
      '-' +
      (today.getMonth() + 1) +
      '-' +
      today.getDate();
    var ngaythaydoi = null;
    var sqlInsertGiangVien =
      'INSERT INTO giangvien ' +
      '(TenGiangVien, GioiTinh, DiaChi, NoiSinh, NamSinh, SDT, Email, MaKhoa, MaChuyenNganh, NgayTao, NgayThayDoi, TrinhDo, NgayVaoTruong, DanToc, HinhAnh, SoCMND, NgayCap, NoiCap, NgayVaoDoan, NgayVaoDang, HoKhauThuongTru, TonGiao) ' +
      ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    if (req.session.isAuth) {
      connection.query(
        sqlInsertGiangVien,
        [
          tengiangvien,
          gioitinh,
          diachilienhe,
          noisinh,
          namsinh,
          sdt,
          email,
          khoa,
          chuyennganh,
          ngaytao,
          ngaythaydoi,
          trinhdo,
          ngayvaotruong,
          dantoc,
          anh,
          socmnd,
          ngaycap,
          noicap,
          ngayvaodoan,
          ngayvaodang,
          hokhau,
          tongiao,
        ],
        (err, rows) => {
          if (err) console.log(err);
          console.log(rows);
          res.send(rows);
        }
      );
    } else {
      req.session.back = '/quanly-giangvien';
      res.redirect('/quanly/');
    }
  }

  xoaGiangVien(req, res) {
    var maGV = req.query.MaGiangVien;
    var sqlSelectNguoidung = 'SELECT * FROM nguoidung WHERE MaGiangVien = ?';
    var deleteNguoiDung = 'DELETE FROM nguoidung WHERE MaNguoiDung = ?';
    var deleteGiangVien = 'DELETE FROM giangvien WHERE MaGiangVien = ?';

    // tìm sinh viên trong bảng người dùng với where msss lấy từ views
    if (req.session.isAuth) {
      connection.query(sqlSelectNguoidung, maGV, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          // xóa người dùng với mã người dùng thông qua câu query sqlSelectNguoidung (lấy ra mã người dùng để xóa)
          connection.query(
            deleteNguoiDung,
            result[0].MaNguoiDung,
            (err, rows) => {
              if (err) {
                console.log(err);
              } else {
                console.log(result[0].MaNguoiDung);
                //  gọi lại  func xóa sinh viên trong bảng sinhviens
                xoaGiangVienChon(maGV);
              }
            }
          );
        }
      });
    } else {
      req.session.back = '/quanly-giangvien';
      res.redirect('/quanly/');
    }

    // xóa sinh viên trong bảng sinhviens
    function xoaGiangVienChon(MaGiangVienXoa) {
      connection.query(deleteGiangVien, MaGiangVienXoa, (err, rs) => {
        res.redirect('/quanly-giangvien/');
      });
    }
  }

  //========= HOC KY =========

  // thêm một học kỳ mới
  themHocKy(req, res) {
    var mahocky = req.body.MaHocKy;
    var tenhocky = req.body.TenHocKy;
    var nam = req.body.Nam;
    if (req.session.isAuth) {
      var sqlInsertHocKy =
        'INSERT INTO hocky (MaHocKy, TenHocKy,Nam) ' + ' VALUES (?,?,?)';
      connection.query(
        sqlInsertHocKy,
        [mahocky, tenhocky, nam],
        (err, result) => {
          res.send(result);
        }
      );
    } else {
      req.session.back = '/quanly-hocky';
      res.redirect('/quanly/');
    }
  }
  xoaHocKy(req, res) {
    var mahocky = req.query.MaHocKy;
    var sqlDeleteHocKy = 'DELETE FROM hocky WHERE MaHocKy = ?';
    if (req.session.isAuth) {
      if (mahocky != 'undefined') {
        connection.query(sqlDeleteHocKy, mahocky, (err, result) => {
          res.redirect('/quanly-hocky/');
        });
      }
    } else {
      req.session.back = '/quanly-hocky';
      res.redirect('/quanly/');
    }
  }
  chonHocKyChinhSua(req, res) {
    var mahocky = req.params.MaHocKy;

    var sqlSelectHocKy = 'SELECT *FROM hocky  where MaHocKy = ?';
    if (req.session.isAuth) {
      connection.query(sqlSelectHocKy, mahocky, (err, result) => {
        res.render('QL_HocKy', {
          chonhockys: result[0],
          tennds: req.session.TenGiangVien,
        });
      });
    } else {
      req.session.back = '/quanly-hocky';
      res.redirect('/quanly/');
    }
  }
  chinhSuaHocKy(req, res) {
    var mahocky = req.body.MaHocKy;
    var tenhocky = req.body.TenHocKy;
    var nam = req.body.Nam;

    var sqlUpdateHocKy =
      'UPDATE hocky SET TenHocky = ?, Nam = ? where MaHocKy = ? ';
    if (req.session.isAuth) {
      connection.query(
        sqlUpdateHocKy,
        [tenhocky, nam, mahocky],
        (err, result) => {
          res.send(result);
        }
      );
    } else {
      req.session.back = '/quanly-hocky';
      res.redirect('/quanly/');
    }
  }
  // [GET] /quanly-hocky/home
  indexHocKy(req, res) {
    var sqlSelectHocKy = 'SELECT * FROM hocky';
    if (req.session.isAuth) {
      connection.query(sqlSelectHocKy, (err, result) => {
        res.render('QL_HocKy', {
          hockys: result,
          tennds: req.session.TenGiangVien,
        });
      });
    } else {
      req.session.back = '/quanly-hocky';
      res.redirect('/quanly/');
    }
  }

  //========= HOC PHAN =========
  // [GET] /quanly-hocphan/home
  indexHocPhan(req, res) {
    var sql = `SELECT * FROM vw_hocphanmonhoc`;
    if (req.session.isAuth) {
      connection.query(sql, (err, data) => {
        if (err) throw err;
        res.render('QL_HocPhan', {
          hocphans: data,
          tennds: req.session.TenGiangVien,
        });
      });
    } else {
      req.session.back = '/quanly-hocphan';
      res.redirect('/quanly/');
    }
  }

  // hien thi thong tin khoa
  loadThongTinKhoaHP(req, res) {
    var sqlSelectKhoa = 'SELECT * FROM khoa';
    connection.query(sqlSelectKhoa, (err, rows) => {
      console.log(rows);
      res.send(rows);
    });
  }

  //hien thi thong tin chuyen nganh ứng với khoa đã chọn
  loadThongTinChuyenNganhHP(req, res) {
    var MaKhoa = req.params.MaKhoa;
    if (MaKhoa != null) {
      var sqlSelectChuyenNganh = 'SELECT * FROM chuyennganh where MaKhoa = ?';
      connection.query(sqlSelectChuyenNganh, MaKhoa, (err, rows) => {
        res.send(rows);
      });
    }
  }

  // hiển thị thông tin lớp ứng với chuyên ngành đã chọn
  loadTenMonHocHP(req, res) {
    var MaChuyenNganh = req.params.MaChuyenNganh;
    if (MaChuyenNganh != null) {
      var sqlSelectLop = 'SELECT * FROM monhoc where MaChuyenNganh = ?';
      connection.query(sqlSelectLop, MaChuyenNganh, (err, rows) => {
        res.send(rows);
      });
    }
  }
  loadMaMonHocHP(req, res) {
    var TenMonHoc = req.params.TenMonHoc;

    var sql = 'SELECT * FROM monhoc where TenMonHoc = ?';
    connection.query(sql, TenMonHoc, (err, rows) => {
      console.log(rows);
      res.send(rows);
    });
  }

  // thêm sinh viên
  themHocPhan(req, res) {
    var mamonhoc = req.body.mamonhoc;
    var tenhocky = req.body.tenhocky;
    var nam = req.body.nam;
    var mahocky = [];

    var sqlInsertHocPhan =
      'INSERT INTO hocphan (MaHocKy, MaMonHoc) VALUES (?, ?)';
    var sqlMaHK = 'SELECT * FROM hocky where TenHocKy = ? and Nam = ?';
    if (req.session.isAuth) {
      connection.query(sqlMaHK, [tenhocky, nam], (err, data) => {
        if (err) {
          console.log(err);
        } else {
          for (const item of data) {
            if (item.MaHocKy != null) {
              mahocky.push(item.MaHocKy);
            }
          }
        }
        connection.query(
          sqlInsertHocPhan,
          [mahocky[0], mamonhoc],
          (err, rows) => {
            if (err) console.log(err);
            console.log(rows);
            res.send(rows);
          }
        );
      });
    } else {
      req.session.back = '/quanly-hocphan';
      res.redirect('/quanly/');
    }
  }

  xoaHocPhan(req, res) {
    var MaHocPhan = req.query.MaHocPhan;
    var sqlXoaHocPhan = 'DELETE FROM hocphan WHERE MaHocPhan = ?';
    if (req.session.isAuth) {
      connection.query(sqlXoaHocPhan, MaHocPhan, (err, rs) => {
        res.redirect('/quanly-hocphan/');
      });
    } else {
      req.session.back = '/quanly-hocphan';
      res.redirect('/quanly/');
    }
  }

  //========= KHOA =========
  // themkhoa
  themkhoa(req, res) {
    var makhoa = req.body.MaKhoa;
    var tenkhoa = req.body.TenKhoa;
    var khoavien = req.body.KhoaVien;
    var ngaytao = new Date();
    var sqlInsertKhoa =
      'INSERT INTO khoa (MaKhoa, TenKhoa, KhoaVien,NgayTao) ' +
      ' VALUES (?,?,?,?)';
    if (req.session.isAuth) {
      connection.query(
        sqlInsertKhoa,
        [makhoa, tenkhoa, khoavien, ngaytao],
        (err, result) => {
          res.send(result);
        }
      );
    } else {
      req.session.back = '/quanly-khoa';
      res.redirect('/quanly/');
    }
  }
  // xóa khoa theo mã
  xoaKhoa(req, res) {
    var MaKhoa = req.query.MaKhoa;
    var sqlDeleteKhoa = 'DELETE FROM khoa WHERE MaKhoa = ?';
    if (req.session.isAuth) {
      connection.query(sqlDeleteKhoa, MaKhoa, (err, result) => {
        res.redirect('/quanly-khoa/');
      });
    } else {
      req.session.back = '/quanly-khoa';
      res.redirect('/quanly/');
    }
  }

  khoaChinhSua(req, res) {
    var MaKhoa = req.params.MaKhoa;

    var sqlSelectKhoa = 'select *from khoa where MaKhoa = ?';

    connection.query(sqlSelectKhoa, MaKhoa, (err, result) => {
      // if(result.length >0){

      res.render('QL_Khoa', { khoaChinhSua: result[0] });
      //}
    });
  }
  updateKhoa(req, res) {
    var makhoa = req.body.MaKhoa;
    var tenkhoa = req.body.TenKhoa;
    var khoavien = req.body.KhoaVien;
    var ngaythaydoi = new Date();
    if (req.session.isAuth) {
      var sqlUpdate =
        'UPDATE khoa SET TenKhoa = ?, KhoaVien = ?, NgayThayDoi = ? where MaKhoa = ? ';
      connection.query(
        sqlUpdate,
        [tenkhoa, khoavien, ngaythaydoi, makhoa],
        (err, result) => {
          res.send(result);
        }
      );
    } else {
      req.session.back = '/quanly-khoa';
      res.redirect('/quanly/');
    }
  }
  // [GET] /quanly-khoa/home
  indexKhoa(req, res) {
    var sql = `SELECT * FROM khoa`;
    if (req.session.isAuth) {
      connection.query(sql, (err, data) => {
        if (err) throw err;
        res.render('QL_Khoa', {
          khoas: data,
          tennds: req.session.TenGiangVien,
        });
      });
    } else {
      req.session.back = '/quanly-khoa';
      res.redirect('/quanly/');
    }
  }

  //========= LOP =========
  dssv(req, res) {
    if (req.session.isAuth) {
      res.render('DSLop_DSSV', { tennds: req.session.TenGiangVien });
    } else {
      req.session.back = '/quanly-lop';
      res.redirect('/quanly/');
    }
  }
  // [GET] /quanly-lop/home
  indexLop(req, res) {
    if (req.session.isAuth) {
      res.render('QL_Lop', { tennds: req.session.TenGiangVien });
    } else {
      req.session.back = '/quanly-lop';
      res.redirect('/quanly/');
    }
  }

  //========= LOP HOC PHAN=========
  dangkyhpLopHP(req, res) {
    if (req.session.isAuth) {
      res.render('DK_HocPhan', { tennds: req.session.TenGiangVien });
    } else {
      req.session.back = '/quanly-lophp';
      res.redirect('/quanly/');
    }
  }
  diemsoLopHP(req, res) {
    if (req.session.isAuth) {
      res.render('LopHP_DiemSo', { tennds: req.session.TenGiangVien });
    } else {
      req.session.back = '/quanly-lophp';
      res.redirect('/quanly/');
    }
  }
  dssvLopHP(req, res) {
    var maLopHPDSSV = req.params.MaLopHP;
    var sqlLopHPDSSV = 'SELECT * FROM vw_qllophp_dssv WHERE MaLopHP = ?';
    if (req.session.isAuth) {
      connection.query(sqlLopHPDSSV, maLopHPDSSV, (err, data) => {
        if (err) throw err;
        res.render('LopHP_DSSV', {
          dssv: data,
          tt: data[0],
          tennds: req.session.TenGiangVien,
        });
      });
    } else {
      req.session.back = '/quanly-lophp';
      res.redirect('/quanly/');
    }
  }
  // [GET] /quanly-lophp
  indexLopHP(req, res) {
    var sql = `SELECT * FROM vw_ql_lophocphan`;
    if (req.session.isAuth) {
      connection.query(sql, (err, data) => {
        if (err) throw err;
        res.render('QL_LopHP', {
          qllophocphans: data,
          tennds: req.session.TenGiangVien,
        });
      });
    } else {
      req.session.back = '/quanly-lophp';
      res.redirect('/quanly/');
    }
  }

  capnhattrangthai(req, res) {
    var malophpchinhsua = req.query.MaLopHP;
    var sqlTrangThai =
      "UPDATE lophocphan SET TrangThai = 'Chấp nhận mở lớp' WHERE MaLopHP = ?";
    if (req.session.isAuth) {
      connection.query(sqlTrangThai, malophpchinhsua, (err, rs) => {
        res.redirect('/quanly-lophp/');
      });
    } else {
      req.session.back = '/quanly-lophp';
      res.redirect('/quanly/');
    }
  }

  xoaLopHP(req, res) {
    var maLopHPXoa = req.query.MaLopHP;
    var sqlLopHP = 'DELETE FROM lophocphan WHERE MaLopHP = ?';
    if (req.session.isAuth) {
      connection.query(sqlLopHP, maLopHPXoa, (err, rs) => {
        res.redirect('/quanly-lophp/');
      });
    } else {
      req.session.back = '/quanly-lophp';
      res.redirect('/quanly/');
    }
  }

  // hien thi thong tin khoa
  loadThongTinKhoaLopHP(req, res) {
    var sqlSelectKhoa = 'SELECT * FROM khoa';
    connection.query(sqlSelectKhoa, (err, rows) => {
      console.log(rows);
      res.send(rows);
    });
  }

  //hien thi thong tin chuyen nganh ứng với khoa đã chọn
  loadThongTinChuyenNganhLopHP(req, res) {
    var MaKhoa = req.params.MaKhoa;
    if (MaKhoa != null) {
      var sqlSelectChuyenNganh = 'SELECT * FROM chuyennganh where MaKhoa = ?';
      connection.query(sqlSelectChuyenNganh, MaKhoa, (err, rows) => {
        res.send(rows);
      });
    }
  }

  // hiển thị thông tin lớp ứng với chuyên ngành đã chọn
  loadThongTinLopLopHP(req, res) {
    var MaChuyenNganh = req.params.MaChuyenNganh;
    if (MaChuyenNganh != null) {
      var sqlSelectLop = 'SELECT * FROM hotrosviuh.lop where MaChuyenNganh = ?';
      connection.query(sqlSelectLop, MaChuyenNganh, (err, rows) => {
        res.send(rows);
      });
    }
  }

  // hiển thị thông tin học phân ứng với chuyên ngành đã chọn
  loadThongTinHocPhanLopHP(req, res) {
    var MaChuyenNganh = req.params.MaChuyenNganh;
    if (MaChuyenNganh != null) {
      var sqlSelectHocPhan =
        'SELECT * FROM vw_hocphanmonhoc where MaChuyenNganh = ?';
      connection.query(sqlSelectHocPhan, MaChuyenNganh, (err, rows) => {
        res.send(rows);
      });
    }
  }
  // hiển thị thông tin mã học phân ứng với học phần đã chọn
  loadChangeHocPhanLopHP(req, res) {
    var TenHocPhan = req.params.TenHocPhan;
    if (TenHocPhan != null) {
      var sqlSelectHocPhan =
        'SELECT * FROM vw_hocphanmonhoc where TenMonHoc = ?';
      connection.query(sqlSelectHocPhan, TenHocPhan, (err, rows) => {
        res.send(rows);
      });
    }
  }

  // hiển thị thông tin học phân ứng với chuyên ngành đã chọn
  loadThongTinGiangVienLopHP(req, res) {
    var MaChuyenNganh = req.params.MaChuyenNganh;
    if (MaChuyenNganh != null) {
      var sqlSelectGV = 'SELECT * FROM giangvien where MaChuyenNganh = ?';
      connection.query(sqlSelectGV, MaChuyenNganh, (err, rows) => {
        res.send(rows);
      });
    }
  }
  // hiển thị thông tin mã học phân ứng với học phần đã chọn
  loadChangeGiangVienLopHP(req, res) {
    var TenGiangVien = req.params.TenGiangVien;
    if (TenGiangVien != null) {
      var sqlSelectGV = 'SELECT * FROM giangvien where TenGiangVien = ?';
      connection.query(sqlSelectGV, TenGiangVien, (err, rows) => {
        res.send(rows);
      });
    }
  }
  // hiển thị thông tin học phân ứng với chuyên ngành đã chọn
  loadThongTinPhongHocLopHP(req, res) {
    var CoSo = req.params.CoSo;
    if (CoSo != null) {
      var sqlSelectGV = 'SELECT * FROM phonghoc where CoSo = ?';
      connection.query(sqlSelectGV, CoSo, (err, rows) => {
        res.send(rows);
      });
    }
  }
  // hiển thị thông tin mã học phân ứng với học phần đã chọn
  loadChangePhongHocLopHP(req, res) {
    var DayNha = req.params.DayNha;
    if (DayNha != null) {
      var sqlSelectGV = 'SELECT * FROM phonghoc where MaPhongHoc = ?';
      connection.query(sqlSelectGV, DayNha, (err, rows) => {
        res.send(rows);
      });
    }
  }

  // thêm lớp học phần
  themlophocphan(req, res) {
    var thoigianbatdau = '';
    var thoigianketthuc = '';

    var tenlophp = req.body.tenLopHPDuKien;
    var slsinhvien = req.body.siSo;
    var trangthai = req.body.trangThai;
    var mahocphan = req.body.maHocPhan;

    var malophocphan;
    var matkb = req.body.bacdaotao;
    var maphonghoc = req.body.loaihinhdaotao;
    var magiangvien = req.body.khoa;
    thoigianbatdau = req.body.chuyennganh;
    thoigianketthuc = req.body.lop;

    var sqlThemLopHocPhan =
      'INSERT INTO lophocphan ' +
      '(TenLopHP, SoLuongSV, TrangThai, MaHocPhan) ' +
      ' VALUES (?, ?, ?, ?)';
    var sqlThemChiTietLopHocPhan =
      'INSERT INTO ctlophocphan (MaLopHocPhan, MaTKB, MaPhongHoc, MaGiangVien, ThoiGianBatDau, ThoiGianKetThuc) ' +
      ' VALUES (?, ?, ?, ?, ?, ?)';
    if (req.session.isAuth) {
      db.query(
        sqlThemLopHocPhan,
        [tenlophp, slsinhvien, trangthai, mahocphan],
        (err, rows) => {
          if (err) console.log(err);
          console.log('tenlophp', tenlophp);
          console.log('slsinhvien', slsinhvien);
          console.log('trangthai', trangthai);
          console.log('mahocphan', mahocphan);
          console.log(rows);

          res.send(rows);
          // db.query(
          //   sqlThemChiTietLopHocPhan,
          //   [
          //     malophocphan,
          //     matkb,
          //     maphonghoc,
          //     magiangvien,
          //     thoigianbatdau,
          //     thoigianketthuc,
          //   ],
          //   (err, rows) => {
          //     if (err) console.log(err);
          //     console.log(rows);
          //     res.send(rows);
          //   }
          // );
        }
      );
    } else {
      req.session.back = '/quanly-lophp';
      res.redirect('/quanly/');
    }
  }

  //========= MON HOC =========
  // [GET] /quanly-monhoc/home
  indexMonHoc(req, res) {
    var sql = `SELECT * FROM vw_monhoc_chuyennganh`;
    if (req.session.isAuth) {
      connection.query(sql, (err, data) => {
        if (err) throw err;
        res.render('QL_MonHoc', {
          monhocs: data,
          tennds: req.session.TenGiangVien,
        });
      });
    } else {
      req.session.back = '/quanly-monhoc';
      res.redirect('/quanly/');
    }
  }

  // hien thi thong tin khoa
  loadThongTinKhoaMonHoc(req, res) {
    var sqlSelectKhoa = 'SELECT * FROM khoa';
    connection.query(sqlSelectKhoa, (err, rows) => {
      console.log(rows);
      res.send(rows);
    });
  }

  //hien thi thong tin chuyen nganh ứng với khoa đã chọn
  loadThongTinChuyenNganhMonHoc(req, res) {
    var MaKhoa = req.params.MaKhoa;
    if (MaKhoa != null) {
      var sqlSelectChuyenNganh = 'SELECT * FROM chuyennganh where MaKhoa = ?';
      connection.query(sqlSelectChuyenNganh, MaKhoa, (err, rows) => {
        res.send(rows);
      });
    }
  }

  // thêm sinh viên
  themMonHoc(req, res) {
    var tenmonhoc = req.body.tenmonhoc;
    var sotinchi = req.body.sotinchi;
    var sotietlt = Number(req.body.sotietlt);
    var sotietth = Number(req.body.sotietth);
    var ghichu = req.body.ghichu;
    var machuyennganh = req.body.machuyennganh;
    var sotiet = sotietlt + sotietth;
    var ghichuChung;
    ghichu === 'Chung' ? (ghichuChung = ghichu) : (ghichuChung = null);
    var sqlInsertMonHoc =
      'INSERT INTO monhoc ' +
      '(TenMonHoc, SoTC , SoTiet, SoTietLyThuyet, SoTietThucHanh, MaChuyenNganh, GhiChu) ' +
      ' VALUES (?, ?, ?, ?, ?, ?, ?)';
    if (req.session.isAuth) {
      connection.query(
        sqlInsertMonHoc,
        [
          tenmonhoc,
          sotinchi,
          sotiet,
          sotietlt,
          sotietth,
          machuyennganh,
          ghichuChung,
        ],
        (err, rows) => {
          if (err) console.log(err);
          console.log(rows);
          res.send(rows);
        }
      );
    } else {
      req.session.back = '/quanly-monhoc';
      res.redirect('/quanly/');
    }
  }

  xoaMonHoc(req, res) {
    var MaMonHoc = req.query.MaMonHoc;
    var sqlXoaMonHoc = 'DELETE FROM monhoc WHERE MaMonHoc = ?';
    if (req.session.isAuth) {
      connection.query(sqlXoaMonHoc, MaMonHoc, (err, rs) => {
        res.redirect('/quanly-monhoc/');
      });
    } else {
      req.session.back = '/quanly-monhoc';
      res.redirect('/quanly/');
    }
  }

  //========= SINH VIÊN =========
  // [GET] /quanly-sinhvien/

  indexSinhVien(req, res) {
    var sql = 'SELECT * FROM vw_sinhvien';
    var sqlNguoidung = 'SELECT * FROM nguoidung';
    console.log(req.session.TenGiangVien + 'sssssss');
    if (req.session.isAuth) {
      connection.query(sql, (err, rows) => {
        if (err) {
          console.log(err);
        } else {
          res.render('QL_SinhVien', {
            sinhviens: rows,
            tennds: req.session.TenGiangVien,
          });
          const svTrung = [];
          const allND = [];
          const allSV = [];
          let ndChuaThem = [];

          connection.query(sqlNguoidung, (errs, data) => {
            if (errs) {
              console.log(errs);
            } else {
              for (const item of data) {
                if (item.MaSinhVien != null) {
                  allND.push(item.MaSinhVien);
                }
              }
            }
            for (const item of rows) {
              allSV.push(item.MaSinhVien);
              for (var i = 0; i < allND.length; i++) {
                if (item.MaSinhVien === allND[i]) {
                  svTrung.push(item.MaSinhVien);
                }
              }
            }
            ndChuaThem = _.difference(allSV, svTrung);
            for (const item of ndChuaThem) {
              var sqlThemNguoidung = `INSERT INTO nguoidung (MaSinhVien, MatKhau, MaQuyen) VALUES (${item}, '$2a$12$ESzhmCr1zHoBFBBE52pfK.YS7Sw9g3XjxYiJrj/uQcXCv0D56gB3q', 'SV')`;

              connection.query(sqlThemNguoidung, (errs, data) => {
                if (errs) {
                  console.log(errs);
                } else {
                  console.log('*Them thanh cong nguoi dung sinh vien: ', item);
                }
              });
            }
          });
        }
      });
    } else {
      req.session.back = '/quanly-sinhvien';
      res.redirect('/quanly/');
    }
  }

  // hien thi thong tin khoa
  loadThongTinKhoaSinhVien(req, res) {
    var sqlSelectKhoa = 'SELECT * FROM khoa';
    connection.query(sqlSelectKhoa, (err, rows) => {
      res.send(rows);
    });
  }

  //hien thi thong tin chuyen nganh ứng với khoa đã chọn
  loadThongTinChuyenNganhSinhVien(req, res) {
    var MaKhoa = req.params.MaKhoa;
    if (MaKhoa != null) {
      var sqlSelectChuyenNganh = 'SELECT * FROM chuyennganh where MaKhoa = ?';
      connection.query(sqlSelectChuyenNganh, MaKhoa, (err, rows) => {
        res.send(rows);
      });
    }
  }

  // hiển thị thông tin lớp ứng với chuyên ngành đã chọn
  loadThongTinLopSinhVien(req, res) {
    var MaChuyenNganh = req.params.MaChuyenNganh;
    if (MaChuyenNganh != null) {
      var sqlSelectLop = 'SELECT * FROM hotrosviuh.lop where MaChuyenNganh = ?';
      connection.query(sqlSelectLop, MaChuyenNganh, (err, rows) => {
        res.send(rows);
      });
    }
  }
  loadDanhSachSinhVien(req, res) {
    var sql = 'SELECT * FROM vw_sinhvien';
    connection.query(sql, (err, rows) => {
      console.log(rows);
      res.send(rows);
    });
  }
  //hiển thị thông tin khóa học
  loadKhoaHocSinhVien(req, res) {
    var sqlSelectKhoaHoc = 'SELECT * FROM hocky';
    connection.query(sqlSelectKhoaHoc, (err, rows) => {
      res.send(rows);
    });
  }

  // thêm sinh viên
  themsinhvien(req, res) {
    var tensinhvien = '';
    var gioitinh = '';
    var namsinh = '';
    tensinhvien = req.body.tensinhvien;
    // if (tensinhvien == "" || gioitinh == "" || namsinh == "") {
    //   return;
    // }
    gioitinh = req.body.gioitinh;
    namsinh = req.body.namsinh;
    var trangthai = req.body.trangthai;
    var coso = req.body.coso;
    var bacdaotao = req.body.bacdaotao;
    var loaihinhdaotao = req.body.loaihinhdaotao;
    var khoa = req.body.khoa;
    var chuyennganh = req.body.chuyennganh;
    var lop = req.body.lop;
    var khoahoc = req.body.khoahoc;
    var dantoc = req.body.dantoc;
    var tongiao = req.body.tongiao;
    var anh = req.body.anh;
    var socmnd = req.body.socmnd;
    var ngaycap = req.body.ngaycap;
    var noicap = req.body.noicap;
    var khucvuc = req.body.khucvuc;
    var doituong = req.body.doituong;
    var dienchinhsach = req.body.dienchinhsach;
    var sdt = req.body.sdt;
    var email = req.body.email;
    var noisinh = req.body.noisinh;
    var ngayvaodoan = req.body.ngayvaodoan;
    var ngayvaodang = req.body.ngayvaodang;
    var diachilienhe = req.body.diachilienhe;
    var hokhau = req.body.hokhau;
    var today = new Date();
    var ngaytao =
      today.getFullYear() +
      '-' +
      (today.getMonth() + 1) +
      '-' +
      today.getDate();
    var ngaythaydoi = null;
    var massv = '';
    var matkhau =
      '$2a$12$ESzhmCr1zHoBFBBE52pfK.YS7Sw9g3XjxYiJrj/uQcXCv0D56gB3q';
    var MaQuyen = 'SV';
    var sqlInsertSinhVien =
      'INSERT INTO sinhviens ' +
      '(TenSinhVien, GioiTinh, HoKhauThuongTru, NoiSinh, NamSinh, SDT, Email, TrangThai, MaKhoa, MaChuyenNganh, MaLop, DanToc, TonGiao, HinhAnh, SoCMND, NgayCap, NoiCap, KhuVuc, DoiTuong, DienChinhSach, NgayVaoDoan, NgayVaoDang, DiaChiLienHe, BacDaoTao, LoaiHinhDaoTao, CoSo, createdAt, updatedAt) ' +
      ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    var sqlInsertNguoiDung =
      'INSERT INTO nguoidung (MaSinhVien, MatKhau, MaQuyen) ' +
      ' VALUES (?,?,?)';
    if (req.session.isAuth) {
      connection.query(
        sqlInsertSinhVien,
        [
          tensinhvien,
          gioitinh,
          hokhau,
          noisinh,
          namsinh,
          sdt,
          email,
          trangthai,
          khoa,
          chuyennganh,
          lop,
          dantoc,
          tongiao,
          anh,
          socmnd,
          ngaycap,
          noicap,
          khucvuc,
          doituong,
          dienchinhsach,
          ngayvaodoan,
          ngayvaodang,
          diachilienhe,
          bacdaotao,
          loaihinhdaotao,
          coso,
          ngaytao,
          ngaythaydoi,
        ],
        (err, rows) => {
          if (err) console.log(err);
          res.send(rows);
        }
      );
    } else {
      req.session.back = '/quanly-sinhvien';
      res.redirect('/quanly/');
    }
  }
  // =======================================//
  // [GET] /quanly-sinhvien/edit
  editSinhVien(req, res) {
    if (req.session.isAuth) {
      connection.query(
        'SELECT *FROM sinhviens sv join lop l on sv.MaLop = l.MaLop join khoa k on sv.MaKhoa = k.MaKhoa where MaSinhVien = ?',
        req.params.MaSinhVien,
        (err, row) => {
          if (err) console.log(err);
          res.render('QL_SinhVien', { svs: row[0] });
        }
      );
    } else {
      req.session.back = '/quanly-sinhvien';
      res.redirect('/quanly/');
    }
  }
  // xóa sinh viên
  xoaSinhVien(req, res) {
    var masinhvienxoa = req.query.MaSinhVien;
    var sqlSelectNguoidung = 'SELECT *FROM  nguoidung WHERE MaSinhVien = ?';
    var deleteNguoiDung = 'DELETE FROM nguoidung WHERE MaNguoiDung = ?';
    var deleteSinhVien = 'DELETE FROM sinhviens WHERE MaSinhVien = ?';
    if (req.session.isAuth) {
      // tìm sinh viên trong bảng người dùng với where msss lấy từ views
      connection.query(sqlSelectNguoidung, masinhvienxoa, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          // xóa người dùng với mã người dùng thông qua câu query sqlSelectNguoidung (lấy ra mã người dùng để xóa)
          connection.query(
            deleteNguoiDung,
            result[0].MaNguoiDung,
            (err, rows) => {
              if (err) {
                console.log(err);
              } else {
                //  gọi lại  func xóa sinh viên trong bảng sinhviens
                xoaSinhVienChon(masinhvienxoa);
              }
            }
          );
        }
      });
    } else {
      req.session.back = '/quanly-sinhvien';
      res.redirect('/quanly/');
    }

    // xóa sinh viên trong bảng sinhviens
    function xoaSinhVienChon(MaSinhVienXoa) {
      connection.query(deleteSinhVien, MaSinhVienXoa, (err, rs) => {
        res.redirect('/quanly-sinhvien/');
      });
    }
  }

  uploadFile(req, res) {
    if (req.session.isAuth) {
      try {
        let filePath = __basedir + '/uploads/' + req.file.filename;

        readXlsxFile(filePath).then(rows => {
          // `rows` is an array of rows
          // each row being an array of cells.
          console.log(rows);

          // Remove Header ROW
          rows.shift();

          const sinhviens = [];

          let length = rows.length;

          for (let i = 0; i < length; i++) {
            let sinhvien = {
              MaSinhVien: rows[i][0],
              TenSinhVien: rows[i][1],
              GioiTinh: rows[i][2],
              HoKhauThuongTru: rows[i][3],
              NoiSinh: rows[i][4],
              NamSinh: rows[i][5],
              SDT: rows[i][6],
              Email: rows[i][7],
              TrangThai: rows[i][8],
              MaKhoa: rows[i][9],
              MaChuyenNganh: rows[i][10],
              MaLop: rows[i][11],
              DanToc: rows[i][12],
              TonGiao: rows[i][13],
              HinhAnh: rows[i][14],
              SoCMND: rows[i][15],
              NgayCap: rows[i][16],
              NoiCap: rows[i][17],
              KhuVuc: rows[i][18],
              DoiTuong: rows[i][19],
              DienChinhSach: rows[i][20],
              NgayVaoDoan: rows[i][21],
              NgayVaoDang: rows[i][22],
              DiaChiLienHe: rows[i][23],
              BacDaoTao: rows[i][24],
              LoaiHinhDaoTao: rows[i][25],
              CoSo: rows[i][26],
            };

            sinhviens.push(sinhvien);
          }

          Student.bulkCreate(sinhviens).then(() => {
            const result = {
              status: 'ok',
              filename: req.file.originalname,
              message: 'Thêm thành công sinh viên từ file excel: ',
            };

            res.json(result);
          });
        });
      } catch (error) {
        const result = {
          status: 'fail',
          filename: req.file.originalname,
          message: 'Upload Error! message = ' + error.message,
        };
        res.json(result);
      }
    } else {
      req.session.back = '/quanly-sinhvien';
      res.redirect('/quanly/');
    }
  }
}

module.exports = new QuanLyController();
