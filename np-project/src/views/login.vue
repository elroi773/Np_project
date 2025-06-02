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
            password: this.password,
            autoLogin: this.autoLogin,
          });
  
          if (response.data.success) {
            alert('로그인 성공!');
            this.$router.push('/home');
          } else {
            alert(response.data.message || '로그인 실패');
          }
        } catch (error) {
          alert('서버 오류가 발생했습니다.');
          console.error(error);
        }
      },
      goToFindPassword() {
        this.$router.push('/find-password');
      }
    }
  };
  </script>
  
  <style scoped>
  .login-container {
    background-color: #f9f8f2;
    padding: 40px 20px;
    text-align: center;
    font-family: sans-serif;
  }
  
  .login-title {
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 30px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  label {
    display: block;
    font-size: 16px;
    margin-bottom: 8px;
  }
  
  input[type="text"],
  input[type="password"] {
    padding: 10px;
    width: 220px;
    border: 1px solid #555;
    border-radius: 6px;
    font-size: 16px;
  }
  
  .options-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 15px 0;
    padding: 0 10px;
    font-size: 14px;
  }
  
  .options-row a {
    color: #555;
    text-decoration: underline;
    cursor: pointer;
  }
  
  .login-button {
    background-color: #ffe0e0;
    color: #333;
    padding: 14px 40px;
    font-size: 18px;
    border: none;
    border-radius: 30px;
    cursor: pointer;
  }
  </style>
  