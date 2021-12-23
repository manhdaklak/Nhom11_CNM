const path = require('path');
const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const route = require('./routers');
const mahoa = require('crypto-js');
const app = express();

const bcrypt = require('bcryptjs');
var cookieParser = require('cookie-parser');

var flash = require('express-flash');
var session = require('express-session');
var bodyParser = require('body-parser');
const moment = require('moment');

console.log(moment().format('L'));
const { models } = require('mongoose');

const port = 3000;

// cấu hình file tỉnh ( từ các file trong public)
app.use(express.static(path.join(__dirname, 'public')));

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// HTTP logger
app.use(morgan('combined'));

// Template engine
app.engine(
  'hbs',
  handlebars({
    extname: '.hbs',
    helpers: {
      sum: (a, b) => a + b,
      ngay: datee => new Intl.DateTimeFormat('en-AU').format(datee),

      noidung: thongtinMH =>
        mahoa.AES.encrypt(String(thongtinMH), 'manh123').toString(),
    },
  })
);

app.use(
  session({
    secret: '123456cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1800000 }, // session tồn tại 30p
  })
);

// ========== excel
const data = require('./database/db.config');
const con = require('./database/connection');

global.__basedir = __dirname;
// force: true will drop the table if it already exists
data.sequelize.sync({ force: false }).then(() => {
  // console.log("Drop and Resync with { force: false }");
});
// =====

app.use(flash());

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));

route(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}/sinhvien`);
});
