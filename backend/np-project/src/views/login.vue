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
      <a href="#" @click.prevent="goToLogin_Seller">상인 로그인</a>
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
        const response = await axios.post('http://localhost:3000/api/login', {
          username: this.username,
          password: this.password
        }, { withCredentials: true }); // 쿠키 필요하면 설정

        if (response.data.success) {
          alert('로그인 성공!');
          // 예: 로그인 후 user_id, username, purchase_limit 받아서 로컬 스토리지 저장 가능
          const userData = response.data.data;
          localStorage.setItem('user', JSON.stringify(userData));
          this.$router.push('/main');
        } else {
          alert(response.data.message || '로그인 실패');
        }
      } catch (error) {
        if (error.response) {
          alert(`로그인 실패: ${error.response.data.message || error.response.statusText}`);
          console.error('Response data:', error.response.data);
        } else {
          alert('서버 오류가 발생했습니다.');
        }
      }
    },
    goToFindPassword() {
      this.$router.push('/find-password');  // 실제 비밀번호 찾기 페이지 경로로 변경
    },
    goToLogin_Seller() {
      this.$router.push('/login_sell');
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