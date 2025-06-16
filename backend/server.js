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
    origin: 'http://localhost:5173',
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

// 아이디 중복 확인
app.post('/api/check-username', async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ success: false, message: '아이디를 입력해주세요.' });
        }

        const [rows] = await db.query('SELECT user_id FROM USERS WHERE username = ?', [username]);

        res.json({
            success: true,
            exists: rows.length > 0
        });
    } catch (error) {
        console.error('아이디 중복 확인 오류:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
});

// 회원가입 API
app.post('/api/users/add', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: '아이디와 비밀번호를 모두 입력해주세요.' });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: '비밀번호는 6자 이상이어야 합니다.' });
        }

        const [existingUser] = await db.query('SELECT user_id FROM USERS WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(400).json({ success: false, message: '이미 사용 중인 아이디입니다.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query('INSERT INTO USERS (username, password) VALUES (?, ?)', [username, hashedPassword]);

        res.json({ success: true, message: '회원가입이 완료되었습니다.', userId: result.insertId });
    } catch (error) {
        console.error('회원가입 오류:', error);
        res.status(500).json({ success: false, message: '회원가입 중 오류가 발생했습니다.' });
    }
});

// 사업자등록번호 중복 확인
app.get('/api/store/check-biznumber', async (req, res) => {
    try {
        const { bizNumber } = req.query;
        if (!bizNumber) {
            return res.status(400).json({ success: false, message: '사업자등록번호가 필요합니다.' });
        }

        const [results] = await db.query('SELECT COUNT(*) AS count FROM store WHERE biz_number = ?', [bizNumber]);
        res.json({ success: true, available: results[0].count === 0 });
    } catch (error) {
        console.error('사업자등록번호 중복 확인 오류:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
});

// 상점 등록 API
app.post('/api/store', async (req, res) => {
    try {
        const { user_id, store_name, biz_number, address, phone, description } = req.body;

        if (!user_id || !store_name || !biz_number || !address || !phone) {
            return res.status(400).json({ success: false, message: '필수 항목을 모두 입력해주세요.' });
        }

        const [existingStore] = await db.query('SELECT store_id FROM store WHERE biz_number = ?', [biz_number]);
        if (existingStore.length > 0) {
            return res.status(409).json({ success: false, message: '이미 등록된 사업자등록번호입니다.' });
        }

        const [result] = await db.query(
            'INSERT INTO store (user_id, store_name, biz_number, address, phone, description) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, store_name, biz_number, address, phone, description]
        );

        res.json({ success: true, message: '상점 등록이 완료되었습니다.', storeId: result.insertId });
    } catch (error) {
        console.error('상점 등록 오류:', error);
        res.status(500).json({ success: false, message: '상점 등록 중 오류가 발생했습니다.' });
    }
});

app.post('/api/consumers/signup', async (req, res) => {
    console.log('🚀 구매자 등록 API 호출');
    console.log('📝 요청 데이터:', req.body);
    
    const { username, purchase_limit } = req.body;
    
    // 입력 검증
    if (!username || !purchase_limit) {
        console.log('❌ 필수 데이터 누락');
        return res.status(400).json({ 
            success: false, 
            message: '사용자명과 구매 한도를 모두 입력해주세요.' 
        });
    }

    try {
        console.log('🔍 사용자 조회 시작:', username);
        
        // 1. username으로 user_id 조회
        const [userRows] = await db.query(
            'SELECT user_id FROM users WHERE username = ?', 
            [username]
        );
        
        console.log('👤 사용자 조회 결과:', userRows);
        
        if (userRows.length === 0) {
            console.log('❌ 사용자를 찾을 수 없음');
            return res.status(404).json({ 
                success: false, 
                message: '사용자를 찾을 수 없습니다.' 
            });
        }
        
        const user_id = userRows[0].user_id;
        console.log('✅ 찾은 user_id:', user_id);
        
        // 2. 이미 등록된 소비자인지 확인
        console.log('🔍 기존 소비자 정보 확인...');
        const [existingRows] = await db.query(
            'SELECT * FROM consumers WHERE user_id = ?', 
            [user_id]
        );
        
        console.log('📊 기존 소비자 정보:', existingRows);
        
        if (existingRows.length > 0) {
            // 업데이트
            console.log('🔄 기존 소비자 정보 업데이트');
            await db.query(
                'UPDATE consumers SET purchase_limit = ? WHERE user_id = ?',
                [purchase_limit, user_id]
            );
            console.log('✅ 업데이트 완료');
        } else {
            // 새로 삽입
            console.log('➕ 새 소비자 정보 삽입');
            await db.query(
                'INSERT INTO consumers (user_id, purchase_limit) VALUES (?, ?)',
                [user_id, purchase_limit]
            );
            console.log('✅ 삽입 완료');
        }
        
        // 3. 성공 응답
        console.log('🎉 구매자 등록 성공');
        res.status(200).json({
            success: true,
            message: '구매자 등록이 완료되었습니다!',
            data: {
                user_id: user_id,
                username: username,
                purchase_limit: purchase_limit
            }
        });
        
    } catch (error) {
        console.error('💥 오류 발생:', error);
        console.error('오류 코드:', error.code);
        console.error('오류 메시지:', error.message);
        
        let errorMessage = '서버 오류가 발생했습니다.';
        
        if (error.code === 'ECONNREFUSED') {
            errorMessage = '데이터베이스 연결이 거부되었습니다.';
        } else if (error.code === 'ER_NO_SUCH_TABLE') {
            errorMessage = '데이터베이스 테이블을 찾을 수 없습니다.';
        } else if (error.code === 'ER_BAD_FIELD_ERROR') {
            errorMessage = '데이터베이스 필드 오류입니다.';
        }
        
        res.status(500).json({
            success: false,
            message: errorMessage,
            debug: error.message
        });
    }
}); 
  
  


// 로그인 API
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: '아이디와 비밀번호를 모두 입력해주세요.' });
    }

    try {
        const [userRows] = await db.query('SELECT user_id, username, password FROM USERS WHERE username = ?', [username]);
        if (userRows.length === 0) {
            return res.status(401).json({ success: false, message: '존재하지 않는 아이디입니다.' });
        }

        const user = userRows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: '비밀번호가 올바르지 않습니다.' });
        }

        const user_id = user.user_id;

        const [storeRows] = await db.query('SELECT * FROM STORE WHERE user_id = ?', [user_id]);
        const [consumerRows] = await db.query('SELECT * FROM CONSUMERS WHERE user_id = ?', [user_id]);

        let userType = 'unknown';
        if (storeRows.length > 0) userType = 'seller';
        else if (consumerRows.length > 0) userType = 'consumer';

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
    }
});

// 물품 등록
app.post('/api/items', upload.single('image'), async (req, res) => {
    const { itemName, description, price, inventory, contact } = req.body;
    const image = req.file;

    if (!itemName || !description || !price || !inventory || !contact) {
        return res.status(400).json({ success: false, message: '모든 필수 항목을 입력해주세요.' });
    }

    try {
        const imagePath = image ? `/uploads/${image.filename}` : null;

        const sql = `
            INSERT INTO ITEMS (item_name, description, price, inventory, contact, image_path)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(sql, [
            itemName,
            description,
            parseInt(price),
            parseInt(inventory),
            contact,
            imagePath
        ]);

        res.status(201).json({
            success: true,
            message: '물품이 성공적으로 등록되었습니다.',
            itemId: result.insertId
        });
    } catch (error) {
        console.error('물품 등록 오류:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});

module.exports = app;
