<template>
  <div class="login-container">
    <h2 class="login-title">로그인</h2>

    <div class="form-group">
      <label for="username">아이디</label>
      <input id="username" type="text" v-model="username" placeholder="아이디 입력" />
    </div>

    <div class="form-group">
      <label for="password">비밀번호</label>
      <input id="password" type="password" v-model="password" placeholder="비밀번호 입력" />
    </div>

    <div class="options-row">
      <label><input type="checkbox" v-model="autoLogin" /> 자동 로그인</label>
      <a href="#" @click.prevent="goToFindPassword">비밀번호 찾기</a>
    </div>

    <button class="login-button" @click="login">로그인</button>
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
    };
  },
  methods: {
    async login() {
      if (!this.username || !this.password) {
        alert('아이디와 비밀번호를 모두 입력해주세요.');
        return;
      }

      try {
        const response = await axios.post('/api/login', {
          username: this.username,
          password: this.password
        });

        if (response.data.success) {
          const userData = response.data.data;
          console.log('로그인 성공:', userData);

          // ✅ 자동 로그인 저장 (선택 사항)
          if (this.autoLogin) {
            localStorage.setItem('autoLogin', JSON.stringify(userData));
          }

          //유저 타입에 따라 분기 처리
          if (userData.userType === 'seller') {
            this.$router.push('/main_sell');
          } else if (userData.userType === 'consumer') {
            this.$router.push('/main');
          } else {
            alert('유저 타입을 확인할 수 없습니다.');
          }

        } else {
          alert('로그인 실패: ' + response.data.message);
        }
      } catch (error) {
        console.error('로그인 요청 오류:', error);
        alert('서버 오류가 발생했습니다.');
      }
    },
    goToFindPassword() {
      this.$router.push('/find-password');  // 실제 비밀번호 찾기 페이지로 수정
    },
    goToLogin_Seller() {
      this.$router.push('/login_sell');
    }
  },
  created() {
    const saved = localStorage.getItem('autoLogin');
    if (saved) {
      const user = JSON.parse(saved);
      this.$router.push(user.userType === 'seller' ? '/main_sell' : '/main');
    }
  }
};
</script>



<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@400;600&display=swap');

body {
  margin: 0;
  font-family: 'Pretendard', sans-serif;
  background-color: #f9f8f2;
}

.login-container {
  max-width: 360px;
  margin: 100px auto;
  background-color: white;
  border-radius: 20px;
  padding: 40px 30px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.login-title {
  font-size: 26px;
  font-weight: 600;
  color: #333;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  display: block;
  font-size: 15px;
  margin-bottom: 6px;
  color: #444;
}

input[type="text"],
input[type="password"] {
  padding: 12px 14px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 15px;
  transition: border-color 0.3s ease;
}

input:focus {
  border-color: #ffa339;
  outline: none;
}

.options-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  margin: 20px 0 10px;
  color: #555;
}

.options-row a {
  color: #ffa339;
  text-decoration: none;
  transition: color 0.3s;
}

.options-row a:hover {
  color: #e18c25;
}

.login-button {
  background-color: #ffa339;
  color: white;
  border: none;
  border-radius: 30px;
  width: 100%;
  padding: 14px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 40px;
}

.login-button:hover {
  background-color: #e69527;
}
</style>