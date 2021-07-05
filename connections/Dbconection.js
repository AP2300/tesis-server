const mysql = require("mysql");

// module.exports = mysql.createPool({
//     connectionLimit : 10,
//     host            : "172.28.153.230",  
//     port            : "3306",
//     user            : 'tesis',
//     password        : 'tucacas',
//     database        : 'tesis'
//   });

module.exports = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  port: "3306",
  user: 'root',
  password: '12345678',
  database: 'tesis'
});

