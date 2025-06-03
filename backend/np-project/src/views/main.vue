<template>
    <div class="main-container">
      <!-- 상단 바 -->
      <header class="header">
        <div class="header-left">
          <h1>내 주변 땡처리를 땡 잡으세요!</h1>
        </div>
        <div class="header-right">
          <button @click="toggleNotifications" class="icon-button">
            <span class="material-icons">notifications</span>
          </button>
          <button @click="toggleDarkMode" class="icon-button">
            <span class="material-icons">dark_mode</span>
          </button>
        </div>
      </header>
  
      <!-- 카카오맵 API 영역 -->
      <div ref="mapContainer" class="map-container"></div>
  
      <!-- 하단 버튼 -->
      <footer class="footer">
        <button @click="fetchNearbyDeals" class="fetch-button">
          땡 잡기
        </button>
        <span class="material-icons bell-icon">notifications_active</span>
      </footer>
    </div>
  </template>
  
  <script>
export default {
  name: "Main",
  mounted() {
    if (window.kakao && window.kakao.maps) {
      this.initMap();
    } else {
      const script = document.createElement("script");
      // 환경변수 대신 직접 Key 삽입!
      script.src = "https://dapi.kakao.com/v2/maps/sdk.js?appkey=fcef28e18ff805c8b61b547c7ac1f4b8&libraries=services";
      script.onload = () => kakao.maps.load(this.initMap);
      document.head.appendChild(script);
    }
  },
  methods: {
    initMap() {
      const container = document.getElementById("map");
      const options = {
        center: new kakao.maps.LatLng(37.5665, 126.978),
        level: 3,
      };
      const map = new kakao.maps.Map(container, options);
    },
  },
};
</script>
  
  <style scoped>
  .main-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: #f8f7f3;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: #fff;
  }
  
  .header-left h1 {
    font-size: 16px;
    margin: 0;
  }
  
  .header-right .icon-button {
    background: none;
    border: none;
    cursor: pointer;
  }
  
  .map-container {
    flex: 1;
    background: #888;
  }
  
  .footer {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px;
    background: #f8f7f3;
  }
  
  .fetch-button {
    background: #ddd;
    border: none;
    border-radius: 4px;
    padding: 10px 20px;
    margin-right: 8px;
    cursor: pointer;
  }
  
  .bell-icon {
    font-size: 32px;
  }
  </style>
  