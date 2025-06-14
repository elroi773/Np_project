const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();

// 미들웨어 설정
app.use(cors({
    origin: 'http://localhost:5173', // Vite 개발 서버 포트
    credentials: true
}));
app.use(express.json());

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

// ========== 회원가입 관련 API ==========

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
            'SELECT user_id FROM users WHERE username = ?',
            [username]
        );
        
        await connection.end();
        
        console.log('중복 확인 결과:', rows.length > 0 ? '중복됨' : '사용가능');
        
        res.json({
            success: true,
            exists: rows.length > 0,
            message: rows.length > 0 ? '이미 사용 중인 아이디입니다.' : '사용 가능한 아이디입니다.'
        });
        
    } catch (error) {
        console.error('아이디 중복 확인 오류:', error);
        res.status(500).json({ 
            success: false, 
            message: '서버 오류가 발생했습니다.' 
        });
    }
});

// 회원가입 API
app.post('/api/users/add', async (req, res) => {
    console.log('회원가입 요청 받음:', req.body);
    
    try {
        const { username, password, userType = 'seller' } = req.body;
        
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
            'SELECT user_id FROM users WHERE username = ?',
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
        
        // 사용자 추가 (user_type 포함)
        const [result] = await connection.execute(
            'INSERT INTO users (username, password, user_type, created_at) VALUES (?, ?, ?, NOW())',
            [username, hashedPassword, userType]
        );
        
        await connection.end();
        
        console.log('회원가입 성공:', result.insertId);
        
        res.json({
            success: true,
            message: '회원가입이 완료되었습니다.',
            userId: result.insertId,
            username: username,
            userType: userType
        });
        
    } catch (error) {
        console.error('회원가입 오류:', error);
        res.status(500).json({ 
            success: false, 
            message: '회원가입 중 오류가 발생했습니다.' 
        });
    }
});

// 로그인 API
app.post('/api/login', async (req, res) => {
    console.log('로그인 요청 받음:', req.body);
    
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: '아이디와 비밀번호를 입력해주세요.' 
            });
        }

        const connection = await mysql.createConnection(dbConfig);
        
        const [rows] = await connection.execute(
            'SELECT user_id, username, password, user_type FROM users WHERE username = ?',
            [username.trim()]
        );
        
        await connection.end();

        if (rows.length === 0) {
            return res.status(401).json({ 
                success: false, 
                message: '존재하지 않는 아이디입니다.' 
            });
        }

        const user = rows[0];
        
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (!passwordMatch) {
            return res.status(401).json({ 
                success: false, 
                message: '비밀번호가 일치하지 않습니다.' 
            });
        }

        console.log('로그인 성공:', user.username);

        res.json({
            success: true,
            userId: user.user_id,
            username: user.username,
            userType: user.user_type,
            message: '로그인 성공'
        });

    } catch (error) {
        console.error('로그인 오류:', error);
        res.status(500).json({ 
            success: false, 
            message: '서버 오류가 발생했습니다.' 
        });
    }
});

// ========== 상점 관련 API ==========

// 상점 등록 API
app.post('/api/store', async (req, res) => {
    console.log('상점 등록 요청 받음:', req.body);
    
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

        // 상점 등록 (user_id를 문자열로 처리)
        const [result] = await connection.execute(
            'INSERT INTO store (user_id, store_name, biz_number, address, phone, description, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
            [user_id.toString(), store_name, biz_number, address, phone, description || null]
        );
        
        await connection.end();
        
        console.log('상점 등록 성공:', result.insertId);
        
        res.json({ 
            success: true,
            message: '상점 등록 성공', 
            storeId: result.insertId 
        });
        
    } catch (error) {
        console.error('상점 등록 오류:', error);
        res.status(500).json({ 
            success: false,
            message: '서버 오류입니다.' 
        });
    }
});

// 사업자등록번호 중복 확인 API
app.get('/api/store/check-biznumber', async (req, res) => {
    console.log('사업자등록번호 중복 확인 요청:', req.query);
    
    try {
        const bizNumber = req.query.bizNumber;
        
        if (!bizNumber) {
            return res.status(400).json({ 
                success: false,
                message: '사업자등록번호가 필요합니다.' 
            });
        }

        const connection = await mysql.createConnection(dbConfig);
        
        const [rows] = await connection.execute(
            'SELECT store_id FROM store WHERE biz_number = ?',
            [bizNumber]
        );
        
        await connection.end();
        
        console.log('사업자등록번호 중복 확인 결과:', rows.length > 0 ? '중복됨' : '사용가능');
        
        res.json({
            success: true,
            available: rows.length === 0
        });
        
    } catch (error) {
        console.error('사업자등록번호 중복 확인 오류:', error);
        res.status(500).json({ 
            success: false,
            message: '서버 오류가 발생했습니다.' 
        });
    }
});

// 사용자 정보 조회 API
app.get('/api/user/:userId', async (req, res) => {
    console.log('사용자 정보 조회 요청:', req.params.userId);
    
    try {
        const userId = req.params.userId;

        if (!userId) {
            return res.status(400).json({ 
                success: false,
                message: '사용자 ID가 필요합니다.' 
            });
        }

        const connection = await mysql.createConnection(dbConfig);
        
        const [rows] = await connection.execute(
            'SELECT user_id, username, user_type, created_at FROM users WHERE user_id = ?',
            [userId]
        );
        
        await connection.end();

        if (rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: '사용자를 찾을 수 없습니다.' 
            });
        }

        console.log('사용자 정보 조회 성공:', rows[0].username);

        res.json({
            success: true,
            user: {
                id: rows[0].user_id,
                username: rows[0].username,
                user_type: rows[0].user_type,
                created_at: rows[0].created_at
            }
        });
        
    } catch (error) {
        console.error('사용자 조회 오류:', error);
        res.status(500).json({ 
            success: false,
            message: '서버 오류가 발생했습니다.' 
        });
    }
});

// 사용자의 상점 정보 조회 API
app.get('/api/user/:userId/store', async (req, res) => {
    console.log('사용자 상점 정보 조회 요청:', req.params.userId);
    
    try {
        const userId = req.params.userId;

        if (!userId) {
            return res.status(400).json({ 
                success: false,
                message: '사용자 ID가 필요합니다.' 
            });
        }

        const connection = await mysql.createConnection(dbConfig);
        
        const [rows] = await connection.execute(
            'SELECT store_id, store_name, biz_number, address, phone, description, created_at FROM store WHERE user_id = ?',
            [userId]
        );
        
        await connection.end();

        res.json({
            success: true,
            stores: rows
        });
        
    } catch (error) {
        console.error('사용자 상점 조회 오류:', error);
        res.status(500).json({ 
            success: false,
            message: '서버 오류가 발생했습니다.' 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});

module.exports = app;