const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const cors = require('cors');
const db = require('./db');
const path = require('path');
const multer = require('multer');



const app = express();

// 미들웨어 설정
app.use(cors({
    origin: 'http://localhost:5173', // Vite 개발 서버 포트
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// multer 설정
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'uploads'),
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });
  const upload = multer({ storage });

// 테스트용 라우트
app.get('/', (req, res) => {
    res.json({ message: '서버가 정상적으로 작동중입니다!' });
});

// MySQL 연결 설정
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Mysql4344!',
    database: 'np'
};

// 아이디 중복 확인 API
app.post('/api/check-username', async (req, res) => {
    console.log('중복 확인 요청 받음:', req.body);
    
    try {
        const { username } = req.body;
        
        if (!username) {
            return res.status(400).json({ 
                success: false, 
                message: '아이디를 입력해주세요.' 
            });
        }

        const connection = await mysql.createConnection(dbConfig);
        
        const [rows] = await connection.execute(
            'SELECT user_id FROM USERS WHERE username = ?',
            [username]
        );
        
        await connection.end();
        
        console.log('중복 확인 결과:', rows.length > 0 ? '중복됨' : '사용가능');
        
        res.json({
            success: true,
            exists: rows.length > 0
        });
        
    } catch (error) {
        console.error('아이디 중복 확인 오류:', error);
        res.status(500).json({ 
            success: false, 
            message: '서버 오류가 발생했습니다.' 
        });
    }
});

// 회원가입 API users
app.post('/api/users/add', async (req, res) => {
    console.log('회원가입 요청 받음:', req.body);
    
    try {
        const { username, password } = req.body;
        
        // 입력값 검증
        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: '아이디와 비밀번호를 모두 입력해주세요.' 
            });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ 
                success: false, 
                message: '비밀번호는 6자 이상이어야 합니다.' 
            });
        }

        const connection = await mysql.createConnection(dbConfig);
        
        // 아이디 중복 확인
        const [existingUser] = await connection.execute(
            'SELECT user_id FROM USERS WHERE username = ?',
            [username]
        );
        
        if (existingUser.length > 0) {
            await connection.end();
            return res.status(400).json({ 
                success: false, 
                message: '이미 사용 중인 아이디입니다.' 
            });
        }
        
        // 비밀번호 해싱
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // 사용자 추가
        const [result] = await connection.execute(
            'INSERT INTO USERS (username, password) VALUES (?, ?)',
            [username, hashedPassword]
        );
        
        await connection.end();
        
        console.log('회원가입 성공:', result.insertId);
        
        res.json({
            success: true,
            message: '회원가입이 완료되었습니다.',
            userId: result.insertId
        });
        
    } catch (error) {
        console.error('회원가입 오류:', error);
        res.status(500).json({ 
            success: false, 
            message: '회원가입 중 오류가 발생했습니다.' 
        });
    }
});

// 사업자등록번호 중복 확인 API (async/await로 수정)
app.get('/api/store/check-biznumber', async (req, res) => {
    try {
        const bizNumber = req.query.bizNumber;
        
        if (!bizNumber) {
            return res.status(400).json({ 
                success: false,
                message: '사업자등록번호가 필요합니다.' 
            });
        }

        const connection = await mysql.createConnection(dbConfig);
        
        const [results] = await connection.execute(
            'SELECT COUNT(*) AS count FROM store WHERE biz_number = ?',
            [bizNumber]
        );
        
        await connection.end();

        const count = results[0].count;
        
        res.json({ 
            success: true,
            available: count === 0
        });
        
    } catch (error) {
        console.error('사업자등록번호 중복 확인 오류:', error);
        res.status(500).json({ 
            success: false,
            message: '서버 오류가 발생했습니다.' 
        });
    }
});

// 상점 등록 API
app.post('/api/store', async (req, res) => {
    try {
        const { user_id, store_name, biz_number, address, phone, description } = req.body;

        if (!user_id || !store_name || !biz_number || !address || !phone) {
            return res.status(400).json({ 
                success: false,
                message: '필수 항목을 모두 입력해주세요.' 
            });
        }

        const connection = await mysql.createConnection(dbConfig);
        
        // 사업자등록번호 중복 확인
        const [existingStore] = await connection.execute(
            'SELECT store_id FROM store WHERE biz_number = ?',
            [biz_number]
        );
        
        if (existingStore.length > 0) {
            await connection.end();
            return res.status(409).json({ 
                success: false,
                message: '이미 등록된 사업자등록번호입니다.' 
            });
        }

        // 상점 등록 (수정된 SQL 문)
        const [result] = await connection.execute(
            'INSERT INTO store (user_id, store_name, biz_number, address, phone, description) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, store_name, biz_number, address, phone, description]
        );
        
        await connection.end();
        
        console.log('상점 등록 성공:', result.insertId);
        
        res.json({ 
            success: true,
            message: '상점 등록이 완료되었습니다.', 
            storeId: result.insertId 
        });
        
    } catch (error) {
        console.error('상점 등록 오류:', error);
        res.status(500).json({ 
            success: false,
            message: '상점 등록 중 오류가 발생했습니다.' 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});



//user 구매 횟수 
app.post('/api/consumer/signup', async (req, res) => {
    const { user_id, purchase_limit } = req.body;
  
    // 예시: MySQL 사용 시 DB 연결 필요
    try {
      const sql = 'INSERT INTO consumer (user_id, purchase_limit) VALUES (?, ?)';
      await db.execute(sql, [user_id, purchase_limit]);
  
      res.status(200).json({ message: '구매자 등록 성공' });
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        res.status(409).json({ message: '이미 등록된 사용자입니다.' });
      } else {
        console.error('DB 오류:', err);
        res.status(500).json({ message: '서버 오류' });
      }
    }
  });
  

//로그인 api
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: '아이디와 비밀번호를 모두 입력해주세요.' });
    }

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);

        // 사용자 확인
        const [userRows] = await connection.execute(
            'SELECT user_id, username, password FROM users WHERE username = ?',
            [username]
        );

        if (userRows.length === 0) {
            return res.status(401).json({ success: false, message: '존재하지 않는 아이디입니다.' });
        }

        const user = userRows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: '비밀번호가 올바르지 않습니다.' });
        }

        const user_id = user.user_id;

        // 유저 타입 확인
        const [storeRows] = await connection.execute(
            'SELECT * FROM store WHERE user_id = ?',
            [user_id]
        );

        const [consumerRows] = await connection.execute(
            'SELECT * FROM consumers WHERE user_id = ?',
            [user_id]
        );

        let userType = 'unknown';

        if (storeRows.length > 0) {
            userType = 'seller';
        } else if (consumerRows.length > 0) {
            userType = 'consumer';
        }

        res.json({
            success: true,
            data: {
                user_id,
                username: user.username,
                userType,
                storeInfo: storeRows[0] || null,
                purchase_limit: consumerRows[0]?.purchase_limit ?? null
            }
        });

    } catch (err) {
        console.error('로그인 오류:', err);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    } finally {
        if (connection) await connection.end();
    }
});



//item 물품 추가 오늘의 땡처리 물품 추가 ㅎ 

app.post('/api/items', upload.single('image'), (req, res) => {
    console.log('POST /api/items 요청 받음');

    const { itemName, description, price, inventory, contact } = req.body;
    const image = req.file;
  
    console.log('등록된 물품:', { itemName, description, price, inventory, contact, image });
  
    res.status(201).json({ message: '물품 등록 성공' });
  });
  
module.exports = app;