// backend/server.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

const db = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Mysql4344!',
  database: 'np'
});

app.post('/api/consumer/signup', async (req, res) => {
  const { username, password, purchaseLimit } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  try {
    await db.execute(
      'INSERT INTO consumers (username, password, purchase_limit) VALUES (?, ?, ?)',
      [username, hashed, purchaseLimit]
    );
    res.json({ success: true });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
});

app.listen(3000, () => {
  console.log('서버 실행 중: http://localhost:3000');
});
