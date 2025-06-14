// backend/db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Mysql4344!',
  database: 'np'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('✅ DB 연결 성공');
});

module.exports = connection;
