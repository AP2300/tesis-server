const mysql = require("mysql");

module.exports = mysql.createPool({
    connectionLimit : 10,
    host            : "172.28.153.230",
    port            : "3306",
    user            : 'root',
    password        : '',
    database        : 'tesis'
  });

  