let mysql = require('mysql');

let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'catatan_kebaktian_db'
});

connection.connect()

module.exports = connection; 