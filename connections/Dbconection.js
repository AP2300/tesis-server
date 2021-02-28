const mysql = require("mysql");

module.exports = mysql.createPool({
    connectionLimit : 10,
    host            : "remotemysql.com",
    port            : "3306",
    user            : 'c786Qnenb0',
    password        : '8QCA1Lm6p9',
    database        : 'c786Qnenb0'
  });