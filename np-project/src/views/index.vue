<template>
    <div class="container">
        <img src="@/assets/logo.png" alt="오늘의 땡처리 로고" class = "logo">
        <div class="button-group">
            <button class="btn">로그인 하기 </button>
            <button class="btn">회원가입 하기</button>
        </div>
    </div>
</template>


<style scoped>

@font-face {
    font-family: 'ChosunGu';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@1.0/ChosunGu.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}
*{
    font-family: 'ChosunGu';
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
</style>