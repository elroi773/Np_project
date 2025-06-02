<template>
    <div class="container">
      <div class="step">02</div>
  
      <div class="progress">
        <span class="dot active"></span>
        <span class="dot active"></span>
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
  
      <h2 class="title">가입을 위한 동의가 필요해요!</h2>
  
      <div class="checkboxes">
        <label class="checkbox-label">
          <input type="checkbox" v-model="allChecked" @change="toggleAll"> 전체동의
        </label>
        <label class="checkbox-label" v-for="(item, index) in agreements" :key="index">
          <input type="checkbox" v-model="item.checked" @change="checkIndividual"> {{ item.label }}
        </label>
      </div>
  
      <button class="next-button" @click="goNext">다음</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        allChecked: false,
        agreements: [
          { label: "이용약관 동의", checked: false },
          { label: "개인정보수집 및 이용동의", checked: false },
          { label: "위치 기반 서비스 이용약관", checked: false },
          { label: "마케팅 목적 개인정보 수집 및 이용 동의", checked: false }
        ]
      }
    },
    methods: {
      toggleAll() {
        this.agreements.forEach(item => item.checked = this.allChecked);
      },
      checkIndividual() {
        this.allChecked = this.agreements.every(item => item.checked);
      },
      goNext() {
        // 필수 동의 항목 확인 예시 (앞 3개만 필수라고 가정할 경우)
        const requiredAgreements = this.agreements.slice(0, 3);
        const allRequiredChecked = requiredAgreements.every(item => item.checked);
        if (!allRequiredChecked) {
          alert("필수 항목에 모두 동의해주세요.");
          return;
        }
        this.$router.push('/join3');
      }
    }
  }
  </script>
  
  <style scoped>
  @font-face {
    font-family: 'Pretendard-Regular';
    src: url('https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
  }
  
  * {
    font-family: 'Pretendard-Regular';
  }
  
  .container {
    background-color: #FFFCF8;
    height: 100vh;
    padding: 40px 24px;
    box-sizing: border-box;
  }
  
  .step {
    text-align: center;
    font-weight: bold;
    font-size: 20px;
    margin-bottom: 10px;
    color: #444;
  }
  
  .progress {
    display: flex;
    justify-content: center;
    gap: 6px;
    margin-bottom: 24px;
  }
  
  .dot {
    width: 10px;
    height: 10px;
    background-color: #FFE3DC;
    border-radius: 50%;
  }
  
  .dot.active {
    background-color: #FFA64D;
  }
  
  .title {
    text-align: center;
    font-size: 18px;
    margin-bottom: 24px;
  }
  
  .checkboxes {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 40px;
  }
  
  .checkbox-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ddd;
    padding-bottom: 4px;
    font-size: 15px;
  }
  
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: #FFA64D;
  }
  
  .next-button {
    background-color: #FFDADA;
    border: none;
    border-radius: 30px;
    width: 100%;
    padding: 16px;
    font-weight: bold;
    font-size: 16px;
    cursor: pointer;
  }
  </style>
  