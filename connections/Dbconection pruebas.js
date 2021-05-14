const mysql = require("mysql");

module.exports = mysql.createPool({
    connectionLimit : 10,
    host            : "localhost",
    port            : "3306",
    user            : 'root',
    password        : '',
    database        : 'tesis'
  });

  