<template>
    <div class="container">
      <div class="step">03</div>
  
      <div class="dots">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot active"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
  
      <div class="map-box">
        <div id="map" class="map"></div>
        <p class="coords" v-if="latitude && longitude">
          📍 내 위치<br />
          {{ latitude }}, {{ longitude }}
        </p>
      </div>
  
      <button class="next-button" @click="goNext">다음</button>
    </div>
    <div id="map" style="width: 100%; height: 350px"></div>
  </template>
  
  <script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const latitude = ref(null)
const longitude = ref(null)
const router = useRouter()

onMounted(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        latitude.value = position.coords.latitude
        longitude.value = position.coords.longitude
        loadKakaoMap()
      },
      (error) => {
        alert('위치 권한이 필요합니다!')
        console.error(error)
      }
    )
  } else {
    alert('이 브라우저는 위치를 지원하지 않아요!')
  }
})

function loadKakaoMap() {
  if (window.kakao && window.kakao.maps) {
    kakao.maps.load(() => {
      const container = document.getElementById('map')
      if (!container) {
        console.error('지도 컨테이너를 찾을 수 없습니다.')
        return
      }

      const options = {
        center: new kakao.maps.LatLng(latitude.value, longitude.value),
        level: 3
      }

      const map = new kakao.maps.Map(container, options)

      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(latitude.value, longitude.value)
      })
      marker.setMap(map)
    })
  } else {
    console.error('Kakao Map SDK가 로드되지 않았습니다.')
  }
}

function goNext() {
  if (!latitude.value || !longitude.value) {
    alert('위치 정보를 불러올 수 없습니다.')
  } else {
    router.push({
      path: '/join4',
      query: {
        lat: latitude.value,
        lng: longitude.value
      }
    })
  }
}

function next() {
  if (!selected.value) {
    alert('옵션을 선택해주세요!')
  } else {
    // 선택한 옵션에 따라 다음 페이지로 이동
    router.push('/join4')
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
    background-color: #f9dede;
    border-radius: 50%;
  }
  
  .dot.active {
    background-color: #ffa74d;
  }
  
  .map-box {
    width: 260px;
    height: 200px;
    border-radius: 12px;
    background-color: #ddd;
    overflow: hidden;
    margin-bottom: 40px;
    position: relative;
  }
  
  .map {
    width: 100%;
    height: 100%;
  }
  
  .coords {
    position: absolute;
    bottom: 8px;
    left: 8px;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 6px 10px;
    font-size: 12px;
    border-radius: 6px;
  }
  
  .next-button {
    background-color: #fdd8d8;
    border: none;
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
  