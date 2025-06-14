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

      <h2 class="title">회원 가입</h2>

      <!-- 아이디 입력 -->
      <div class="form-group">
          <label for="username">아이디 입력</label>
              <div class="input-row">
              <input 
                  id="username" 
                  type="text" 
                  v-model="username" 
                  placeholder="아이디를 입력하세요"
                  @input="resetCheck" 
              />
              <button class="check-button" @click="checkDuplicate" :disabled="isCheckingDuplicate">
                  {{ isCheckingDuplicate ? '확인중...' : '중복확인' }}
              </button>
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
          isCheckingDuplicate: false,
          isLoading: false
      };
  },
  methods: {
      resetCheck() {
          this.checked = false;
          this.isAvailable = false;
          this.checkMessage = '';
      },

      async checkDuplicate() {
          if (!this.username.trim()) {
              this.checkMessage = '아이디를 입력해주세요.';
              this.isAvailable = false;
              this.checked = true;
              return;
          }

          this.isCheckingDuplicate = true;

          try {
              const response = await axios.post('http://localhost:3000/api/check-username', {
                  username: this.username.trim()
              }, {
                  timeout: 5000,
                  headers: { 'Content-Type': 'application/json' }
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
          } finally {
              this.isCheckingDuplicate = false;
          }
      },

      async goNext() {
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

          if (this.password.length < 6) {
              alert('비밀번호는 6자 이상 입력해주세요.');
              return;
          }

          this.isLoading = true;

          try {
              // 변경: /api/signup 대신 /api/users/add 호출
              const response = await axios.post('http://localhost:3000/api/users/add', {
                  username: this.username.trim(),
                  password: this.password,
                  userType: 'buyer' // 필요 시 변경 가능
              });

              if (response.data.success) {
                  const userId = response.data.userId;
                  const username = this.username.trim();
                  
                  localStorage.setItem('currentUserId', userId);
                  localStorage.setItem('currentUsername', username);
                  localStorage.setItem('userType', 'buyer');
                  
                  alert('회원가입이 완료되었습니다!');
                  this.$router.push('/join5'); // 다음 회원가입 단계로 이동
              } else {
                  alert(response.data.message || '회원가입 중 오류가 발생했습니다.');
              }
          } catch (error) {
              console.error('회원가입 오류:', error);
              if (error.response && error.response.data) {
                  alert(error.response.data.message || '회원가입 중 오류가 발생했습니다.');
              } else {
                  alert('서버 연결에 실패했습니다. 다시 시도해주세요.');
              }
          } finally {
              this.isLoading = false;
          }
      }
  }
};
</script>


<style scoped>
body {
  background-color: #f9f8f2;
  font-family: 'Helvetica Neue', sans-serif;
}

.container {
background-color: #fdfaf6;
min-height: 100vh;
padding: 40px 20px;
display: flex;
flex-direction: column;
align-items: center;
font-family: 'Pretendard', sans-serif;
}

.step {
font-weight: bold;
margin-bottom: 10px;
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
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 6px;
  display: block;
  color: #333;
}
p{
  color: #525252;
  font-size: 12px;
  margin-bottom: 10px;
}
.input-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #bbb;
  border-radius: 8px;
  font-size: 15px;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #ffa94d;
  outline: none;
}

.check-button {
  padding: 10px 14px;
  background-color: #ffe0ba;
  font-size: 13px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
  white-space: nowrap;
}

.check-button:hover:not(:disabled) {
  background-color: #ffc98c;
}

.check-button:disabled {
  background-color: #f0f0f0;
  cursor: not-allowed;
}

.check-message {
  margin-top: 6px;
  font-size: 13px;
  min-height: 18px;
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
width: 100%;
padding: 16px;
font-weight: bold;
font-size: 16px;
cursor: pointer;
margin-top: 90px;
transition: background-color 0.3s;
}

.next-button:hover:not(:disabled) {
  background-color: #ff9020;
}

.next-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>