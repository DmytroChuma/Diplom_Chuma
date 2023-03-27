let mysql = require('mysql');

let con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: "house",
    password: ""
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