<template>
  <div class="main-container">
    <!-- 상단 바 + 검색창 -->
    <header class="header">
      <h1 class="app-title">내 주변 땡처리</h1>
      <div class="header-right">
        <button @click="toggleNotifications" class="icon-button">
          <span class="material-icons">notifications</span>
        </button>
        <button @click="toggleDarkMode" class="icon-button">
          <span class="material-icons">dark_mode</span>
        </button>
      </div>
    </header>

    <div class="search-bar">
      <input type="text" v-model="searchQuery" placeholder="검색어를 입력하세요" />
      <button @click="searchDeals" class="search-button">
        <span class="material-icons">search</span>
      </button>
    </div>

    <!-- 카카오맵 -->
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
  data() {
    return {
      searchQuery: "",
    };
  },
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
      this.map = new kakao.maps.Map(container, options);
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
    searchDeals() {
      alert(`검색어: ${this.searchQuery}`);
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
  font-family: sans-serif;
}

/* 상단바 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  padding: 12px 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.app-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.header-right {
  display: flex;
  gap: 8px;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: #555;
  transition: color 0.2s;
}

.icon-button:hover {
  color: #000;
}

/* 검색창 */
.search-bar {
  display: flex;
  padding: 8px 16px;
  background: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.search-bar input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  outline: none;
  font-size: 14px;
}

.search-button {
  background: #4cae4f;
  border: none;
  border-radius: 0 4px 4px 0;
  padding: 0 12px;
  color: #ffffff;
  cursor: pointer;
}

.search-button .material-icons {
  font-size: 24px;
}

/* 지도 영역 */
.map-container {
  flex: 1;
}

/* 하단 버튼 */
.footer {
  padding: 12px 16px;
  background: #ffffff;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.1);
}

.fetch-button {
  width: 100%;
  background: #4cae4f;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 14px 0;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.fetch-button:hover {
  background: #3c9440;
}
</style>
