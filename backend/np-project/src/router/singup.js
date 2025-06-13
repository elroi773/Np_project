// 필요한 모듈 import
const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

// DB 연결
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: 'Mysql4344!',
  database: 'np' 
});

// 회원가입 API
router.post('/api/signup', async (req, res) => {
  const { username, password, userType } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: '필수 항목이 누락되었습니다.' });
  }

  try {
    // 아이디 중복 확인
    const [rows] = await db.promise().query('SELECT * FROM USER WHERE username = ?', [username]);

    if (rows.length > 0) {
      return res.status(409).json({ success: false, message: '이미 사용 중인 아이디입니다.' });
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);

    // INSERT 쿼리 실행
    const [result] = await db.promise().query(
      'INSERT INTO USER (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );

    return res.status(201).json({
      success: true,
      message: '회원가입 성공',
      userId: result.insertId,
      username: username
    });

  } catch (error) {
    console.error('회원가입 오류:', error);
    return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;
