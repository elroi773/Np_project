<template>
    <div class="container">
        <div class="step">05</div>

        <div class="dots">
            <span class="dot active"></span>
            <span class="dot active"></span>
            <span class="dot active"></span>
            <span class="dot active"></span>
            <span class="dot active"></span>
        </div>

        <h2 class="title">상점 등록</h2>

        <!-- 사용자 ID -->
        <div class="form-group">
            <label for="userId">사용자 ID</label>
            <input id="userId" type="text" v-model="userId" placeholder="사용자 ID를 입력하세요" autocomplete="username" />
        </div>

        <!-- 상점명 -->
        <div class="form-group">
            <label for="storeName">상점명</label>
            <input id="storeName" type="text" v-model="storeName" placeholder="상점명을 입력하세요"
                autocomplete="organization" />
        </div>

        <!-- 사업자등록번호 -->
        <div class="form-group">
            <label for="bizNumber">사업자등록번호</label>
            <div class="input-row">
                <input id="bizNumber" type="text" v-model="bizNumber" placeholder="예: 123-45-67890"
                    autocomplete="off" />
                <button class="check-button" @click="checkBizNumber">중복확인</button>
            </div>
            <p class="check-message" :class="{ available: isAvailable, unavailable: !isAvailable && checked }">
                {{ checkMessage }}
            </p>
        </div>

        <!-- 주소 -->
        <div class="form-group">
            <label for="address">주소</label>
            <input id="address" type="text" v-model="address" placeholder="주소를 입력하세요" autocomplete="street-address" />
        </div>

        <!-- 전화번호 -->
        <div class="form-group">
            <label for="phone">전화번호</label>
            <input id="phone" type="text" v-model="phone" placeholder="예: 010-1234-5678" autocomplete="tel" />
        </div>

        <!-- 상점 설명 -->
        <div class="form-group">
            <label for="description">상점 설명</label>
            <textarea id="description" v-model="description" placeholder="간단한 소개를 입력하세요" rows="4"
                autocomplete="off"></textarea>
        </div>

        <!-- 등록 버튼 -->
        <button class="next-button" @click="submitStore">등록</button>
    </div>
</template>

<script>
import axios from 'axios';

// API 기본 URL 설정
const API_BASE_URL = 'http://localhost:3000';

export default {
    data() {
        return {
            userId: '',
            storeName: '',
            bizNumber: '',
            address: '',
            phone: '',
            description: '',
            checked: false,
            isAvailable: false,
            checkMessage: ''
        };
    },
    mounted() {
        try {
            const savedUsername = localStorage.getItem('currentUsername');
            if (savedUsername) {
                this.userId = savedUsername;
            }
        } catch (err) {
            console.error('localStorage 접근 실패:', err);
        }
    },
    methods: {
        async checkBizNumber() {
            if (!this.bizNumber.trim()) {
                this.checkMessage = '사업자등록번호를 입력해주세요.';
                this.isAvailable = false;
                this.checked = true;
                return;
            }

            try {
                console.log('중복 확인 요청 시작:', this.bizNumber.trim());

                const response = await axios.get(`${API_BASE_URL}/api/store/check-biznumber`, {
                    params: {
                        bizNumber: this.bizNumber.trim()
                    },
                    timeout: 5000
                });

                console.log('서버 응답:', response.data);

                if (response.data.success) {
                    if (response.data.available) {
                        this.checkMessage = '사용 가능한 사업자등록번호입니다.';
                        this.isAvailable = true;
                    } else {
                        this.checkMessage = '이미 등록된 사업자등록번호입니다.';
                        this.isAvailable = false;
                    }
                } else {
                    this.checkMessage = response.data.message || '확인 중 오류가 발생했습니다.';
                    this.isAvailable = false;
                }

                this.checked = true;
            } catch (error) {
                console.error('사업자번호 중복 확인 오류:', error);
                this.handleError(error, '사업자번호 중복 확인');
                this.isAvailable = false;
                this.checked = true;
            }
        },

        handleError(error, context) {
            let message = '';
            
            if (error.code === 'ECONNREFUSED') {
                message = '서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.';
            } else if (error.response) {
                console.log('에러 응답:', error.response.status, error.response.data);
                message = error.response.data?.message || `서버 오류 (${error.response.status})`;
            } else if (error.request) {
                console.log('요청 오류:', error.request);
                message = '서버로부터 응답을 받을 수 없습니다.';
            } else {
                console.log('설정 오류:', error.message);
                message = '요청 처리 중 오류가 발생했습니다.';
            }

            if (context === '상점 등록') {
                alert(message);
            } else {
                this.checkMessage = message;
            }
        },

        validateForm() {
            const requiredFields = [
                { field: 'userId', name: '사용자 ID' },
                { field: 'storeName', name: '상점명' },
                { field: 'bizNumber', name: '사업자등록번호' },
                { field: 'address', name: '주소' },
                { field: 'phone', name: '전화번호' }
            ];

            for (const { field, name } of requiredFields) {
                if (!this[field] || !this[field].toString().trim()) {
                    alert(`${name}을(를) 입력해주세요.`);
                    return false;
                }
            }

            // 상점 설명은 선택사항으로 처리
            if (!this.description) {
                this.description = '';
            }

            if (!this.checked || !this.isAvailable) {
                alert('사업자등록번호 중복 확인을 해주세요.');
                return false;
            }

            return true;
        },

        async submitStore() {
            if (!this.validateForm()) {
                return;
            }

            try {
                // localStorage에서 username 가져오기 - userId 필드도 확인
                let username = localStorage.getItem('currentUsername') || this.userId;
                
                if (!username || username.trim() === '') {
                    alert('로그인 정보를 찾을 수 없습니다. 사용자 ID를 확인해주세요.');
                    return;
                }

                // 모든 필드 값 검증 및 정리
                const cleanData = {
                    username: username.toString().trim(),
                    store_name: this.storeName.toString().trim(),
                    biz_number: this.bizNumber.toString().trim(),
                    address: this.address.toString().trim(),
                    phone: this.phone.toString().trim(),
                    description: this.description ? this.description.toString().trim() : ''
                };

                // 빈 값 체크
                if (!cleanData.username || !cleanData.store_name || !cleanData.biz_number || 
                    !cleanData.address || !cleanData.phone) {
                    alert('모든 필수 항목을 입력해주세요.');
                    return;
                }

                console.log('전송할 데이터:', cleanData);
                console.log('데이터 타입 확인:', {
                    username: typeof cleanData.username,
                    store_name: typeof cleanData.store_name,
                    biz_number: typeof cleanData.biz_number,
                    address: typeof cleanData.address,
                    phone: typeof cleanData.phone,
                    description: typeof cleanData.description
                });

                // axios 요청 설정
                const axiosConfig = {
                    timeout: 10000,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    validateStatus: function (status) {
                        return status < 500; // 500 미만은 모두 허용
                    }
                };

                const response = await axios.post(`${API_BASE_URL}/api/store`, cleanData, axiosConfig);

                console.log('서버 응답 상태:', response.status);
                console.log('서버 응답 데이터:', response.data);

                if (response.status === 200 && response.data.success) {
                    alert('상점 등록이 완료되었습니다!');
                    this.$router.push({ name: 'JoinCompleteSell' });
                } else {
                    // 400 에러나 기타 에러 처리
                    const errorMessage = response.data?.message || '상점 등록에 실패했습니다.';
                    alert(errorMessage);
                    console.error('서버 에러 상세:', response.data);
                }

            } catch (error) {
                console.error('상점 등록 오류:', error);
                
                if (error.response) {
                    console.error('응답 에러:', error.response.status, error.response.data);
                    alert(error.response.data?.message || `서버 오류 (${error.response.status})`);
                } else {
                    this.handleError(error, '상점 등록');
                }
            }
        }
    },
};
</script>

<style scoped>
.container {
    background-color: #fdfaf6;
    min-height: 100vh;
    padding: 40px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Pretendard', sans-serif;
    max-width: 400px;
    margin: 0 auto;
}

.step {
    font-weight: bold;
    margin-bottom: 10px;
    font-size: 16px;
    color: #666;
}

.dots {
    display: flex;
    gap: 6px;
    margin-bottom: 40px;
}

.dot {
    width: 8px;
    height: 8px;
    background-color: #f9dede;
    border-radius: 50%;
}

.dot.active {
    background-color: #ffa74d;
}

.title {
    text-align: center;
    font-size: 18px;
    margin-bottom: 24px;
    color: #333;
    font-weight: 600;
}

.form-group {
    margin-bottom: 20px;
    width: 100%;
}

label {
    font-size: 15px;
    font-weight: 500;
    margin-bottom: 6px;
    display: block;
    color: #333;
}

.input-row {
    display: flex;
    gap: 10px;
    align-items: center;
}

input,
textarea {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 15px;
    transition: border-color 0.3s, box-shadow 0.3s;
    font-family: 'Pretendard', sans-serif;
}

input:focus,
textarea:focus {
    border-color: #ffa94d;
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 169, 77, 0.1);
}

input::placeholder,
textarea::placeholder {
    color: #999;
}

.check-button {
    padding: 12px 16px;
    background-color: #ffe0ba;
    font-size: 13px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
    white-space: nowrap;
    font-weight: 500;
}

.check-button:hover {
    background-color: #ffc98c;
}

.check-button:active {
    background-color: #ffb366;
}

.check-message {
    margin-top: 6px;
    font-size: 13px;
    min-height: 18px;
    font-weight: 500;
}

.available {
    color: #2ecc71;
}

.unavailable {
    color: #e74c3c;
}

.next-button {
    background-color: #ffa339;
    border: none;
    width: 100%;
    border-radius: 30px;
    padding: 16px;
    font-weight: bold;
    font-size: 16px;
    cursor: pointer;
    margin-top: 40px;
    transition: background-color 0.3s, transform 0.1s;
    color: white;
}

.next-button:hover {
    background-color: #ff9500;
}

.next-button:active {
    transform: translateY(1px);
}

textarea {
    resize: vertical;
    min-height: 80px;
}
</style>