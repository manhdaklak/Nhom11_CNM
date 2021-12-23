const env = {
  database: "hotrosviuh",
  username: "admin",
  password: "manh1234",
  host: "hotrosviuh.caiebwsgtvar.ap-southeast-1.rds.amazonaws.com",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

module.exports = env;
