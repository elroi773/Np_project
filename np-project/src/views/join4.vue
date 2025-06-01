<template>
    <div class="signup-container">
      <div class="step-number">04</div>
  
      <div class="progress-dots">
        <span v-for="(dot, index) in 5" :key="index" :class="['dot', { active: index < 4 }, { current: index === 4 }]"></span>
      </div>
  
      <div class="form-group">
        <label for="username">아이디 입력</label>
        <div class="input-row">
          <input id="username" type="text" v-model="username" />
          <div class="highlight-box"></div>
        </div>
      </div>
  
      <div class="form-group">
        <label for="password">비밀번호 입력</label>
        <input id="password" type="password" v-model="password" />
      </div>
  
      <div class="form-group">
        <label for="confirmPassword">비밀번호 확인</label>
        <input id="confirmPassword" type="password" v-model="confirmPassword" />
      </div>
  
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
      };
    },
    methods: {
      goNext() {
        if (this.password !== this.confirmPassword) {
          alert('비밀번호가 일치하지 않습니다!');
          return;
        }
        // 다음 단계로 이동 로직 (예: 라우터 이동 등)
        alert('다음 단계로 이동합니다!');
      },
    },
  };
  </script>
  
  <style scoped>
  .signup-container {
    background-color: #f9f8f2;
    padding: 40px 20px;
    text-align: center;
    font-family: sans-serif;
  }
  
  .step-number {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  
  .progress-dots {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 40px;
  }
  
  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #ffeedc;
  }
  
  .dot.active {
    background-color: #ffa733;
  }
  
  .dot.current {
    background-color: #ffdcdc;
  }
  
  .form-group {
    margin-bottom: 30px;
  }
  
  label {
    display: block;
    font-size: 18px;
    margin-bottom: 10px;
  }
  
  .input-row {
    display: flex;
    align-items: center;
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
  
  .highlight-box {
    width: 80px;
    height: 50px;
    background-color: #fedcb8;
    border-radius: 6px;
  }
  
  .next-button {
    margin-top: 40px;
    background-color: #ffe0e0;
    color: #333;
    padding: 14px 40px;
    font-size: 18px;
    border: none;
    border-radius: 30px;
    cursor: pointer;
  }
  </style>
  