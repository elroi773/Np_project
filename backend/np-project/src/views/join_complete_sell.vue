<template>
    <div class="join-complete-container">
      <div class="card">
        <h1 class="title">가입이 완료되었습니다 🎉</h1>
        <p class="message">오늘의 땡처리를 땡잡으세요!</p>
        <button class="home-button" @click="gologin">땡처리 하러 가기</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'JoinComplete',
    methods: {
      gologin() {
        // 라우터가 설정되어 있다면 home 경로로 이동
        this.$router.push('/Main_sell');
      }
    }
  }
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@400;600&display=swap');
  
  .join-complete-container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #F8F7F2;
    font-family: 'Pretendard', sans-serif;
  }
  
  .card {
    background: white;
    border: 2px solid #ffa339;
    border-radius: 20px;
    padding: 40px 60px;
    text-align: center;
    box-shadow: 0 10px 25px rgba(255, 163, 57, 0.2);
    animation: fadeInUp 1s ease;
  }
  
  .title {
    color: #ffa339;
    font-size: 28px;
    margin-bottom: 16px;
    font-weight: 600;
  }
  
  .message {
    font-size: 16px;
    color: #444;
    margin-bottom: 30px;
  }
  
  .home-button {
    background-color: #ffa339;
    color: white;
    border: none;
    border-radius: 30px;
    padding: 12px 30px;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .home-button:hover {
    background-color: #e69527;
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  </style>
  