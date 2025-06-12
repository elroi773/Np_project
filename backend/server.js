const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt'); // 비밀번호 암호화용
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

// ========== 회원가입 관련 API ==========

// 아이디 중복 확인 API
app.post('/api/check-username', (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ 
      exists: false, 
      message: '아이디를 입력해주세요.' 
    });
  }

  const query = 'SELECT COUNT(*) as count FROM users WHERE username = ?';
  
  db.query(query, [username.trim()], (err, results) => {
    if (err) {
      console.error('아이디 중복 확인 오류:', err);
      return res.status(500).json({ 
        exists: false, 
        message: '서버 오류가 발생했습니다.' 
      });
    }

    const count = results[0].count;
    res.json({
      exists: count > 0,
      message: count > 0 ? '이미 사용 중인 아이디입니다.' : '사용 가능한 아이디입니다.'
    });
  });
});

// 회원가입 API
app.post('/api/signup', async (req, res) => {
  const { username, password, userType = 'seller' } = req.body;

  // 필수 항목 검증
  if (!username || !password) {
    return res.status(400).json({ 
      success: false, 
      message: '아이디와 비밀번호를 입력해주세요.' 
    });
  }

  try {
    // 비밀번호 암호화
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 사용자 정보 DB에 저장
    const insertQuery = `
      INSERT INTO users (username, password, user_type, created_at) 
      VALUES (?, ?, ?, NOW())
    `;

    db.query(insertQuery, [username.trim(), hashedPassword, userType], (err, result) => {
      if (err) {
        console.error('회원가입 오류:', err);
        
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ 
            success: false, 
            message: '이미 존재하는 아이디입니다.' 
          });
        }
        
        return res.status(500).json({ 
          success: false, 
          message: '회원가입 중 오류가 발생했습니다.' 
        });
      }

      const userId = result.insertId;
      
      res.json({
        success: true,
        userId: userId,
        username: username.trim(),
        message: '회원가입이 완료되었습니다.'
      });
    });

  } catch (error) {
    console.error('비밀번호 암호화 오류:', error);
    res.status(500).json({ 
      success: false, 
      message: '서버 오류가 발생했습니다.' 
    });
  }
});

// 로그인 API (추가 기능)
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ 
      success: false, 
      message: '아이디와 비밀번호를 입력해주세요.' 
    });
  }

  const query = 'SELECT id, username, password, user_type FROM users WHERE username = ?';
  
  db.query(query, [username.trim()], async (err, results) => {
    if (err) {
      console.error('로그인 조회 오류:', err);
      return res.status(500).json({ 
        success: false, 
        message: '서버 오류가 발생했습니다.' 
      });
    }

    if (results.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: '존재하지 않는 아이디입니다.' 
      });
    }

    const user = results[0];
    
    try {
      const passwordMatch = await bcrypt.compare(password, user.password);
      
      if (!passwordMatch) {
        return res.status(401).json({ 
          success: false, 
          message: '비밀번호가 일치하지 않습니다.' 
        });
      }

      res.json({
        success: true,
        userId: user.id,
        username: user.username,
        userType: user.user_type,
        message: '로그인 성공'
      });

    } catch (error) {
      console.error('비밀번호 비교 오류:', error);
      res.status(500).json({ 
        success: false, 
        message: '서버 오류가 발생했습니다.' 
      });
    }
  });
});

// ========== 기존 상점 관련 API ==========

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
      console.error('상점 등록 오류:', err);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: '이미 등록된 사업자등록번호입니다.' });
      }
      return res.status(500).json({ message: '서버 오류입니다.' });
    }
    res.json({ 
      success: true,
      message: '상점 등록 성공', 
      storeId: result.insertId 
    });
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
      console.error('사업자등록번호 중복 확인 오류:', err);
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

// 사용자 정보 조회 API (상점 등록 시 사용자 확인용)
app.get('/api/user/:userId', (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ message: '사용자 ID가 필요합니다.' });
  }

  const query = 'SELECT id, username, user_type, created_at FROM users WHERE id = ?';
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('사용자 조회 오류:', err);
      return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    res.json({
      success: true,
      user: results[0]
    });
  });
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중`);
});