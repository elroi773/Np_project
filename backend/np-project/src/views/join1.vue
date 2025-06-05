<template>
  <div class="container">
    <div class="step">01</div>

    <div class="dots">
      <span class="dot active"></span>
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </div>

    <div class="question">무슨 용도로 사용 하시나요?</div>

    <div class="buttons">
      <button
        :class="['option-button', selected === 'buy' ? 'selected' : '']"
        @click="select('buy')"
      >
        구매를 원해요!
      </button>

      <button
        :class="['option-button', selected === 'sell' ? 'selected' : '']"
        @click="select('sell')"
      >
        판매를 원해요!
      </button>
    </div>

    <button class="next-button" @click="next">다음</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const selected = ref(null)
const router = useRouter()

function select(type) {
  selected.value = type
}

function next() {
  if (!selected.value) {
    alert('옵션을 선택해주세요!')
  } else {
    // 선택한 옵션에 따라 다음 페이지로 이동
    router.push('/join2')
  }
}
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
  background-color: #ddd;
  border-radius: 50%;
}

.dot.active {
  background-color: #ffa74d;
}

.question {
  color: #555;
  margin-bottom: 30px;
  font-size: 14px;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 40px;
  width: 100%;
  max-width: 260px;
}

.option-button {
  background-color: #ffe2bd;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.option-button:hover {
  background-color: #ffd4a3;
}

.option-button.selected {
  box-shadow: 0 0 0 3px #ffa74d inset;
}

.next-button {
  background-color: #fdd8d8;
  border: none;
  width: 100%;
  padding: 12px 40px;
  border-radius: 999px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  
}

.next-button:hover {
  background-color: #fcbaba;
}
</style>
