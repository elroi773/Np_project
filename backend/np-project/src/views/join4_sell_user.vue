<template>
    <div class="container">
        <div class="step">04</div>

        <div class="dots">
            <span class="dot active"></span>
            <span class="dot active"></span>
            <span class="dot active"></span>
            <span class="dot active"></span>
            <span class="dot"></span>
        </div>

        <h2 class="title">회원 가입</h2>

        <!-- 아이디 입력 -->
        <div class="form-group">
            <label for="username">아이디 입력</label>
            <div class="input-row">
                <input id="username" type="text" v-model="username" placeholder="아이디를 입력하세요" />
                <button class="check-button" @click="checkDuplicate">중복확인</button>
            </div>
            <p class="check-message" :class="{ available: isAvailable, unavailable: !isAvailable && checked }">
                {{ checkMessage }}
            </p>
        </div>

        <!-- 비밀번호 입력 -->
        <div class="form-group">
            <label for="password">비밀번호 입력</label>
            <input id="password" type="password" v-model="password" placeholder="비밀번호를 입력하세요" />
        </div>

        <!-- 비밀번호 확인 -->
        <div class="form-group">
            <label for="confirmPassword">비밀번호 확인</label>
            <input id="confirmPassword" type="password" v-model="confirmPassword" placeholder="비밀번호를 다시 입력하세요" />
        </div>
        
        <!-- 다음 버튼 -->
        <button class="next-button" @click="goNext" :disabled="isLoading">
            {{ isLoading ? '처리중...' : '다음' }}
        </button>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            username: '',
            password: '',
            confirmPassword: '',
            checked: false,
            isAvailable: false,
            checkMessage: '',
            isLoading: false
        };
    },
    methods: {
        // 아이디 중복 확인 (DB 조회)
        async checkDuplicate() {
            if (!this.username.trim()) {
                this.checkMessage = '아이디를 입력해주세요.';
                this.isAvailable = false;
                this.checked = true;
                return;
            }

            try {
                // API 호출로 DB에서 중복 확인
                const response = await axios.post('/api/check-username', {
                    username: this.username.trim()
                });

                this.checked = true;
                if (response.data.exists) {
                    this.checkMessage = '이미 사용 중인 아이디입니다.';
                    this.isAvailable = false;
                } else {
                    this.checkMessage = '사용 가능한 아이디입니다.';
                    this.isAvailable = true;
                }
            } catch (error) {
                console.error('중복 확인 오류:', error);
                this.checkMessage = '중복 확인 중 오류가 발생했습니다.';
                this.isAvailable = false;
                this.checked = true;
            }
        },

        // 회원가입 처리
        async goNext() {
            // 유효성 검사
            if (!this.username || !this.password || !this.confirmPassword) {
                alert('모든 항목을 입력해주세요.');
                return;
            }

            if (!this.checked || !this.isAvailable) {
                alert('아이디 중복 확인을 해주세요.');
                return;
            }

            if (this.password !== this.confirmPassword) {
                alert('비밀번호가 일치하지 않습니다.');
                return;
            }

            // 비밀번호 강도 검사 (선택사항)
            if (!this.validatePassword(this.password)) {
                alert('비밀번호는 8자 이상, 영문자와 숫자를 포함해야 합니다.');
                return;
            }

            this.isLoading = true;

            try {
                // 회원가입 API 호출
                const response = await axios.post('/api/signup', {
                    username: this.username.trim(),
                    password: this.password,
                    userType: 'seller' // 판매자로 가입
                });

                if (response.data.success) {
                    // 회원가입 성공 시 USER_ID를 로컬스토리지에 저장
                    // JOIN4_SELL.VUE에서 사용할 수 있도록
                    const userId = response.data.userId;
                    localStorage.setItem('currentUserId', userId);
                    localStorage.setItem('currentUsername', this.username.trim());
                    
                    alert('회원가입이 완료되었습니다!');
                    
                    // 다음 단계로 이동 (상점 등록 페이지)
                    this.$router.push('/join5-sell');
                } else {
                    alert('회원가입 중 오류가 발생했습니다.');
                }
            } catch (error) {
                console.error('회원가입 오류:', error);
                alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
            } finally {
                this.isLoading = false;
            }
        },

        // 비밀번호 유효성 검사
        validatePassword(password) {
            const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
            return regex.test(password);
        }
    }
};
</script>

<style scoped>
.container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
}

.step {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
}

.dots {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
}

.dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #ddd;
    margin: 0 5px;
}

.dot.active {
    background-color: #007bff;
}

.title {
    text-align: center;
    margin-bottom: 30px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

.input-row {
    display: flex;
    gap: 10px;
}

.input-row input {
    flex: 1;
}

input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
}

.check-button {
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    white-space: nowrap;
}

.check-button:hover {
    background-color: #0056b3;
}

.check-message {
    margin-top: 5px;
    font-size: 14px;
}

.check-message.available {
    color: green;
}

.check-message.unavailable {
    color: red;
}

.next-button {
    width: 100%;
    padding: 15px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
}

.next-button:hover:not(:disabled) {
    background-color: #218838;
}

.next-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
</style>