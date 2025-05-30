<template>
    <div class="container">
      <img src="@/assets/logo.png" alt="오늘의 땡처리 로고" class="logo">
      <div class="button-group">
        <button class="btn"><a href="#">로그인 하기</a></button>
        <button class="btn" @click="goToJoin">회원가입 하기</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      goToJoin() {
        this.$router.push('/join1');
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

*{
    font-family: 'Pretendard-Regular';
}
.container{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #F8F7F2;
}

.logo{
    width: 200px;
    margin-bottom: 100px;
}

.button-group{
    display: flex;
    flex-direction: column;
    gap:10px;
}

.btn{
    background-color: #ffb866;
    border: none;
    border-radius: 20px;
    padding: 12px;
    width: 180px;
    font-weight: bold;
    cursor: pointer;
}

a {
  color: inherit;
  text-decoration: none;
  font-size: 10px;
}

</style>