// server.js
const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// MySQL 연결 설정
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Mysql4344!',
  database: 'np'
});

// DB 연결 시도
db.connect((err) => {
  if (err) {
    console.error('❌ DB 연결 실패:', err.message);
  } else {
    console.log('✅ DB 연결 성공!');
  }
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중`);
});
