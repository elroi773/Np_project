<template>
  <div class="main-container">
    <!-- 상단바 -->
    <header class="header">
      <h1 class="app-title">내 주변 땡처리 땡잡기!</h1>
      <div class="header-icons">
        <button @click="toggleNotifications" class="icon-button">
          <span class="material-icons">notifications</span>
        </button>
        <button @click="toggleDarkMode" class="icon-button">
          <span class="material-icons">dark_mode</span>
        </button>
      </div>
    </header>

    <!-- 지도 -->
    <div ref="mapContainer" class="map-container"></div>

    <!-- 하단 버튼 -->
    <footer class="footer">
      <button @click="fetchNearbyDeals" class="fetch-button">
        주변 땡처리 찾기
      </button>
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
      script.src = "https://dapi.kakao.com/v2/maps/sdk.js?appkey=fcef28e18ff805c8b61b547c7ac1f4b8&libraries=services";
      script.onload = () => kakao.maps.load(this.initMap);
      document.head.appendChild(script);
    }
  },
  methods: {
    initMap() {
      const container = this.$refs.mapContainer;
      const options = {
        center: new kakao.maps.LatLng(37.5665, 126.978),
        level: 3,
      };
      new kakao.maps.Map(container, options);
    },
    toggleNotifications() {
      alert("알림 기능은 준비 중입니다!");
    },
    toggleDarkMode() {
      alert("다크 모드는 준비 중입니다!");
    },
    fetchNearbyDeals() {
      alert("주변 땡처리 정보를 가져옵니다!");
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

/* 상단바 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  padding: 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}

.app-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.header-icons {
  display: flex;
  gap: 8px;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #555;
  font-size: 24px;
  transition: color 0.2s;
}

.icon-button:hover {
  color: #000;
}

/* 지도 */
.map-container {
  flex: 1;
  background: #e0e0e0;
}

/* 하단 버튼 */
.footer {
  background: #ffffff;
  padding: 16px;
  box-shadow: 0 -1px 4px rgba(0,0,0,0.1);
  display: flex;
  justify-content: center;
}

.fetch-button {
  background: #4cae4f;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.fetch-button:hover {
  background: #3c9440;
}
</style>
