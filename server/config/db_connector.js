let mysql = require('mysql');
const config = require('./config');

let con = mysql.createConnection({
    host: config.DB_HOST,
    user: config.DB_USER,
    database: config.DB_NAME,
    password: config.DB_PASSWORD
  });

  function execute(sql){
    return new Promise((resolve, reject) => {
      con.query(sql, (err, result) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(JSON.parse(JSON.stringify(result)));
        }
      });
    });
  }

  module.exports = con;
  module.exports.execute = execute;