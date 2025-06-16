// db.js 파일 - 연결 테스트 포함
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Mysql4344!',
    database: 'np',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 연결 테스트
async function testConnection() {
    try {
        console.log('DB 연결 테스트 중...');
        const [rows] = await pool.execute('SELECT 1 as test');
        console.log('✅ DB 연결 성공:', rows);
        
        // 테이블 존재 확인
        const [tables] = await pool.execute('SHOW TABLES');
        console.log('📋 사용 가능한 테이블:', tables);
        
        return true;
    } catch (error) {
        console.error('❌ DB 연결 실패:', error.message);
        return false;
    }
}

// 서버 시작시 연결 테스트
testConnection();

module.exports = pool;