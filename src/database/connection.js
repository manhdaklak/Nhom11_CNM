const database = require("mysql");
// database => connect mysql
var con = database.createConnection({
  host: "hotrosviuh.caiebwsgtvar.ap-southeast-1.rds.amazonaws.com",
  user: "admin",
  port:  '3306',
  password: "manh1234",
  database: "hotrosviuh",
});
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected Success!!!");
});
module.exports = con;

// const env = require("./env.js");

// const Sequelize = require("sequelize");
// const sequelize = new Sequelize(env.database, env.username, env.password, {
//   host: env.host,
//   dialect: env.dialect,
//   operatorsAliases: false,

//   pool: {s
//     max: env.max,
//     min: env.pool.min,
//     acquire: env.pool.acquire,
//     idle: env.pool.idle,
//   },
// });

// const con = {};

// con.Sequelize = Sequelize;
// con.sequelize = sequelize;

// con.SinhVien = require("../app/model/sinhvien.model");

// module.exports = con;
