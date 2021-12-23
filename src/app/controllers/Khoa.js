const db = require('../../database/connection');

var listKhoa = function(){
    var sql = 'SELECT *FROM khoa';
    db.query(sql, (error, results, fields) => {
        if (error) {
          return console.error(error.message);
        }
        console.log(results);
      });
}
module.exports = listKhoa;
