const mysql = require("mysql");

module.exports = mysql.createPool({
    connectionLimit : 10,
    host            : "remotemysql.com",
    port            : "3306",
    user            : 'c786Qnenb0',
    password        : '15u3xNdNjc',
    database        : 'c786Qnenb0'
  });