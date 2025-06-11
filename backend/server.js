const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors({
  origin: 'http://localhost:8080',  // Vue 개발 서버 주소 등
}));



app.use(express.json()); // JSON 요청 바디 파싱

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Mysql4344!',
  database: 'np',
});

db.connect((err) => {
  if (err) {
    console.error('❌ DB 연결 실패:', err.message);
  } else {
    console.log('✅ DB 연결 성공!');
  }
});

app.post('/api/store', (req, res) => {
  const { user_id, store_name, biz_number, address, phone, description } = req.body;

  if (!user_id || !store_name || !biz_number || !address || !phone) {
    return res.status(400).json({ message: '필수 항목을 모두 입력해주세요.' });
  }

  const query = `
    INSERT INTO store (user_id, store_name, biz_number, address, phone, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [user_id, store_name, biz_number, address, phone, description], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: '이미 등록된 사업자등록번호입니다.' });
      }
      return res.status(500).json({ message: '서버 오류입니다.' });
    }
    res.json({ message: '상점 등록 성공', storeId: result.insertId });
  });
});

app.get('/api/store/check-biznumber', (req, res) => {
  const bizNumber = req.query.bizNumber;
  if (!bizNumber) {
    return res.status(400).json({ message: '사업자등록번호가 필요합니다.' });
  }

  const query = 'SELECT COUNT(*) AS count FROM store WHERE biz_number = ?';

  db.query(query, [bizNumber], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }

    const count = results[0].count;
    if (count > 0) {
      res.json({ available: false });
    } else {
      res.json({ available: true });
    }
  });
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중`);
});
