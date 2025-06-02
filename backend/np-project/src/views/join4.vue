<template>
    <div class="signup-container">
        <h2 class="step-title">회원가입</h2>

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
        <button class="next-button" @click="goNext">다음</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            username: '',
            password: '',
            confirmPassword: '',
            checked: false,
            isAvailable: false,
            checkMessage: ''
        };
    },
    methods: {
        // 중복확인 시뮬레이션 (서버 요청 대신 가짜 아이디 목록 사용)
        checkDuplicate() {
            const existingUsernames = ['admin', 'user1', 'test']; // 기존 아이디 목록
            this.checked = true;

            if (!this.username.trim()) {
                this.checkMessage = '아이디를 입력해주세요.';
                this.isAvailable = false;
                return;
            }

            if (existingUsernames.includes(this.username.trim().toLowerCase())) {
                this.checkMessage = '이미 사용 중인 아이디입니다.';
                this.isAvailable = false;
            } else {
                this.checkMessage = '사용 가능한 아이디입니다.';
                this.isAvailable = true;
            }
        },

        submitForm() {
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

            alert('회원가입 완료!');
            // 실제 API 호출은 여기서 진행
        }
    }
};
function next() {
    if (!selected.value) {
        alert('옵션을 선택해주세요!')
    } else {
        // 선택한 옵션에 따라 다음 페이지로 이동
        router.push('/join4')
    }
}
</script>

<style scoped>
.signup-container {
    background-color: #f9f8f2;
    padding: 40px 20px;
    text-align: center;
    font-family: sans-serif;
}

.step-title {
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 30px;
}

.form-group {
    margin-bottom: 25px;
}

label {
    display: block;
    font-size: 18px;
    margin-bottom: 10px;
}

.input-row {
    display: flex;
    justify-content: center;
    gap: 10px;
}

input {
    padding: 10px;
    width: 180px;
    border: 1px solid #555;
    border-radius: 6px;
    font-size: 16px;
}

.check-button {
    background-color: #fedcb8;
    border: none;
    padding: 10px 16px;
    font-size: 14px;
    border-radius: 6px;
    cursor: pointer;
}

.check-message {
    margin-top: 8px;
    font-size: 14px;
}

.available {
    color: green;
}

.unavailable {
    color: red;
}

.next-button {
    margin-top: 20px;
    background-color: #ffe0e0;
    color: #333;
    padding: 14px 40px;
    font-size: 18px;
    border: none;
    border-radius: 30px;
    cursor: pointer;
}
</style>