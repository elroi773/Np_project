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
  
      <h2 class="title">상점 등록</h2>
  
      <!-- 상점명 -->
      <div class="form-group">
        <label for="storeName">상점명</label>
        <input id="storeName" type="text" v-model="storeName" placeholder="상점명을 입력하세요" />
      </div>
  
      <!-- 사업자등록번호 -->
      <div class="form-group">
        <label for="bizNumber">사업자등록번호</label>
        <div class="input-row">
          <input id="bizNumber" type="text" v-model="bizNumber" placeholder="예: 123-45-67890" />
          <button class="check-button" @click="checkBizNumber">중복확인</button>
        </div>
        <p class="check-message" :class="{ available: isAvailable, unavailable: !isAvailable && checked }">
          {{ checkMessage }}
        </p>
      </div>
  
      <!-- 주소 -->
      <div class="form-group">
        <label for="address">주소</label>
        <input id="address" type="text" v-model="address" placeholder="주소를 입력하세요" />
      </div>
  
      <!-- 전화번호 -->
      <div class="form-group">
        <label for="phone">전화번호</label>
        <input id="phone" type="text" v-model="phone" placeholder="예: 010-1234-5678" />
      </div>
  
      <!-- 상점 설명 -->
      <div class="form-group">
        <label for="description">상점 설명</label>
        <textarea id="description" v-model="description" placeholder="간단한 소개를 입력하세요" rows="4"></textarea>
      </div>
  
      <!-- 다음 버튼 -->
      <button class="next-button" @click="submitStore">등록</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        storeName: '',
        bizNumber: '',
        address: '',
        phone: '',
        description: '',
        checked: false,
        isAvailable: false,
        checkMessage: ''
      };
    },
    methods: {
      checkBizNumber() {
        const usedBizNumbers = ['123-45-67890', '987-65-43210'];
        this.checked = true;
  
        if (!this.bizNumber.trim()) {
          this.checkMessage = '사업자등록번호를 입력해주세요.';
          this.isAvailable = false;
          return;
        }
  
        if (usedBizNumbers.includes(this.bizNumber.trim())) {
          this.checkMessage = '이미 등록된 사업자번호입니다.';
          this.isAvailable = false;
        } else {
          this.checkMessage = '사용 가능한 사업자번호입니다.';
          this.isAvailable = true;
        }
      },
      submitStore() {
        if (!this.storeName || !this.bizNumber || !this.address || !this.phone || !this.description) {
          alert('모든 항목을 입력해주세요.');
          return;
        }
  
        if (!this.checked || !this.isAvailable) {
          alert('사업자등록번호 중복 확인을 해주세요.');
          return;
        }
  
        alert('상점 등록이 완료되었습니다!');
        // 실제 API 연동은 여기서 수행합니다.
      }
    }
  };
  </script>
  
  <style scoped>
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
    width: 100%;
  }
  
  label {
    font-size: 15px;
    font-weight: 500;
    margin-bottom: 6px;
    display: block;
    color: #333;
  }
  
  .input-row {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  
  input,
  textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #bbb;
    border-radius: 8px;
    font-size: 15px;
    transition: border-color 0.3s;
  }
  
  input:focus,
  textarea:focus {
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
  }
  
  .check-button:hover {
    background-color: #ffc98c;
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
    padding: 16px;
    font-weight: bold;
    font-size: 16px;
    cursor: pointer;
    margin-top: 40px;
  }
  </style>
  