<template>
    <div class="container">
        <h2 class="title">상인 로그인</h2>

        <!-- 아이디 -->
        <div class="form-group">
            <label for="username">아이디</label>
            <input id="username" type="text" v-model="username" placeholder="아이디를 입력하세요" autocomplete="username"
                @keyup.enter="login" />
        </div>

        <!-- 비밀번호 -->
        <div class="form-group">
            <label for="password">비밀번호</label>
            <div class="password-input-container">
                <input id="password" :type="showPassword ? 'text' : 'password'" v-model="password"
                    placeholder="비밀번호를 입력하세요" autocomplete="current-password" @keyup.enter="login" />
                <button type="button" class="password-toggle" @click="togglePassword">
                    {{ showPassword ? '🙈' : '👁️' }}
                </button>
            </div>
        </div>

        <!-- 로그인 옵션 -->
        <div class="options-row">
            <label class="checkbox-label">
                <input type="checkbox" v-model="autoLogin" />
                <span class="checkmark"></span>
                자동 로그인
            </label>
            <div class="links">
                <a href="#" @click.prevent="goToFindPassword">비밀번호 찾기</a>
            </div>
        </div>

        <!-- 로그인 버튼 -->
        <button class="login-button" @click="login" :disabled="isLoading">
            {{ isLoading ? '로그인 중...' : '로그인' }}
        </button>

        <!-- 회원가입 링크 -->
        <div class="signup-section">
            <p>아직 계정이 없으신가요?</p>
            <button class="signup-link" @click="goToSignup">회원가입하기</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            username: '',
            password: '',
            autoLogin: false,
            showPassword: false,
            isLoading: false
        };
    },
    methods: {
        togglePassword() {
            this.showPassword = !this.showPassword;
        },

        validateForm() {
            if (!this.username.trim()) {
                alert('아이디를 입력해주세요.');
                return false;
            }

            if (!this.password.trim()) {
                alert('비밀번호를 입력해주세요.');
                return false;
            }

            if (this.password.length < 6) {
                alert('비밀번호는 6자 이상 입력해주세요.');
                return false;
            }

            return true;
        },

        async login() {
            if (!this.validateForm()) {
                return;
            }

            this.isLoading = true;

            try {
                const loginData = {
                    username: this.username.trim(),
                    password: this.password.trim(),
                    autoLogin: this.autoLogin
                };

                console.log('로그인 요청 데이터:', { ...loginData, password: '***' });

                const response = await axios.post('/api/login_seller', { username, password });

                if (response.data.success && response.data.user) {
                    const userInfo = response.data.user;

                    if (!userInfo.username) {
                        throw new Error('서버 응답에 사용자 이름 정보가 없습니다.');
                    }

                    // 저장 로직
                    if (!this.autoLogin) {
                        sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
                    } else {
                        localStorage.setItem('userInfo', JSON.stringify(userInfo));
                        localStorage.setItem('autoLogin', 'true');
                    }

                    alert(`${userInfo.username}님, 환영합니다!`);

                } else {
                    alert(response.data.message || '로그인에 실패했습니다.');
                }


            } catch (error) {
                console.error('로그인 오류:', error);

                if (error.response) {
                    const errorMessage = error.response.data?.message || '로그인 중 오류가 발생했습니다.';
                    alert(errorMessage);
                } else if (error.request) {
                    alert('서버와의 연결에 문제가 발생했습니다.');
                } else {
                    alert('요청 처리 중 오류가 발생했습니다.');
                }
            } finally {
                this.isLoading = false;
            }
        },

        goToFindPassword() {
            this.$router.push('/find-password');
        },

        goToSignup() {
            this.$router.push('/signup');
        }
    },

    mounted() {
        // 자동 로그인 체크
        const autoLoginEnabled = localStorage.getItem('autoLogin');
        const userInfo = localStorage.getItem('userInfo');

        if (autoLoginEnabled && userInfo) {
            try {
                const user = JSON.parse(userInfo);
                console.log('자동 로그인 사용자:', user);

                // 자동 로그인 로직 실행
                if (user.userType === 'seller') {
                    this.$router.push('/seller-main');
                } else {
                    this.$router.push('/main');
                }
            } catch (error) {
                console.error('자동 로그인 오류:', error);
                localStorage.removeItem('autoLogin');
                localStorage.removeItem('userInfo');
            }
        }
    }

};
</script>

<style scoped>
body {
    background-color: #fdfaf6;
}

.container {
    min-height: 100vh;
    padding: 40px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Pretendard', sans-serif;
    max-width: 400px;
    margin: 0 auto;
    margin-top: 50px;
}

.title {
    text-align: center;
    font-size: 18px;
    margin-bottom: 24px;
    color: #333;
    font-weight: 600;
}

.user-type-group {
    margin-bottom: 24px;
    width: 100%;
}

.user-type-buttons {
    display: flex;
    gap: 8px;
    width: 100%;
}

.user-type-button {
    flex: 1;
    padding: 12px 16px;
    border: 2px solid #ffe0ba;
    background-color: #f9f9f9;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
    color: #666;
}

.user-type-button.active {
    background-color: #ffa339;
    border-color: #ffa339;
    color: white;
}

.user-type-button:hover:not(.active) {
    background-color: #ffe0ba;
    border-color: #ffc98c;
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

input[type="text"],
input[type="password"] {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 15px;
    transition: border-color 0.3s, box-shadow 0.3s;
    font-family: 'Pretendard', sans-serif;
}

input[type="text"]:focus,
input[type="password"]:focus {
    border-color: #ffa94d;
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 169, 77, 0.1);
}

input::placeholder {
    color: #999;
}

.password-input-container {
    position: relative;
    display: flex;
    align-items: center;
}

.password-toggle {
    position: absolute;
    right: 12px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    color: #666;
    padding: 0;
    z-index: 1;
}

.password-toggle:hover {
    color: #ffa339;
}

.options-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0;
    font-size: 14px;
}

.checkbox-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    color: #555;
}

.checkbox-label input[type="checkbox"] {
    display: none;
}

.checkmark {
    width: 16px;
    height: 16px;
    border: 2px solid #ddd;
    border-radius: 3px;
    margin-right: 8px;
    display: inline-block;
    position: relative;
    transition: all 0.3s;
}

.checkbox-label input[type="checkbox"]:checked+.checkmark {
    background-color: #ffa339;
    border-color: #ffa339;
}

.checkbox-label input[type="checkbox"]:checked+.checkmark::after {
    content: '✓';
    position: absolute;
    top: -2px;
    left: 2px;
    color: white;
    font-size: 12px;
    font-weight: bold;
}

.links a {
    color: #ffa339;
    text-decoration: none;
    font-size: 14px;
    transition: color 0.3s;
}

.links a:hover {
    color: #e69527;
    text-decoration: underline;
}

.login-button {
    background-color: #ffa339;
    border: none;
    width: 100%;
    border-radius: 30px;
    padding: 16px;
    font-weight: bold;
    font-size: 16px;
    cursor: pointer;
    margin-top: 20px;
    transition: background-color 0.3s, transform 0.1s;
    color: white;
}

.login-button:hover:not(:disabled) {
    background-color: #ff9500;
}

.login-button:active:not(:disabled) {
    transform: translateY(1px);
}

.login-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.signup-section {
    margin-top: 30px;
    text-align: center;
}

.signup-section p {
    margin: 0 0 10px 0;
    color: #666;
    font-size: 14px;
}

.signup-link {
    background: none;
    border: 2px solid #ffa339;
    color: #ffa339;
    padding: 8px 20px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
}

.signup-link:hover {
    background-color: #ffa339;
    color: white;
}
</style>