<template>
    <div class="container">
      <h2 class="step-number">05</h2>
  
      <!-- 페이지 indicator -->
      <div class="dots">
        <span v-for="n in 5" :key="n" class="dot" :class="{ active: n <= 5 }" />
      </div>
  
      <div class="title">모두가 함께 나누는 혜택, 정직한 소비로 지켜주세요!</div>
      <p class="description">
        이 서비스는 <span class="highlight">선한 소비문화 확산</span>을 위해 만들어졌습니다.<br />
        악용을 방지하고 더 많은 이웃과 나누기 위해 일주일 구매 횟수를 제한합니다.<br />
        양해와 협조 부탁드려요!
      </p>
  
      <!-- 구매 횟수 설정 -->
      <div class="purchase-section">
        <p class="purchase-label">일주일 땡처리 구매 횟수</p>
        <div class="counter">
          <button @click="decrease" class="btn">-</button>
          <span class="count">{{ count }}</span>
          <button @click="increase" class="btn">+</button>
          <span class="unit">회</span>
        </div>
      </div>
  
      <button class="next-button" @click="goNext">다음</button>
    </div>
  </template>
  
  <script>
import axios from 'axios';

export default {
  data() {
    return {
      count: 1,
      username: '',
      password: '',
      purchaseLimit: 1
    };
  },
  methods: {
    increase() {
      if (this.count < 7) this.count++;
    },
    decrease() {
      if (this.count > 1) this.count--;
    },
    goNext() {
      alert(`선택한 횟수: ${this.count}회`);
      // 예: this.$router.push('/join6')
    },
    async submitSignup() {
      try {
        await axios.post('http://localhost:3000/api/consumer/signup', {
          username: this.username,
          password: this.password,
          purchaseLimit: this.purchaseLimit
        });
        alert('회원가입 성공!');
        this.$router.push('/login');
      } catch (error) {
        console.error('회원가입 실패:', error);
        alert('에러가 발생했어요.');
      }
    }
  }
};
</script>

  
  <style scoped>
  .container {
    background-color: #fefdf8;
    padding: 40px 20px;
    text-align: center;
    font-family: sans-serif;
  }
  
  .step-number {
    font-size: 18px;
    margin-bottom: 20px;
  }
  
  .dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 25px;
  }
  
  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #ffe4c2;
    opacity: 0.6;
  }
  
  .dot.active {
    background-color: #ff9900;
    opacity: 1;
  }
  
  .title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 12px;
  }
  
  .description {
    font-size: 14px;
    color: #555;
    line-height: 1.5;
    margin-bottom: 40px;
  }
  
  .highlight {
    font-weight: bold;
    color: #333;
  }
  
  .purchase-section {
    margin-bottom: 40px;
  }
  
  .purchase-label {
    font-size: 16px;
    margin-bottom: 12px;
  }
  
  .counter {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    font-size: 32px;
    font-weight: bold;
    color: #333;
  }
  
  .btn {
    font-size: 24px;
    width: 40px;
    height: 40px;
    background-color: transparent;
    border: 1px solid #ccc;
    border-radius: 8px;
    cursor: pointer;
  }
  
  .unit {
    font-size: 18px;
    color: #aaa;
    margin-left: 5px;
  }
  
  .next-button {
    background-color: #ffdcdc;
    color: #333;
    width: 100%;
    padding: 14px 40px;
    font-size: 18px;
    border: none;
    border-radius: 30px;
    cursor: pointer;
  }
  </style>
  