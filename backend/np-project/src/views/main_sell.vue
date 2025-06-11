<template>
    <div class="main-container">
      <!-- 상단 바 + 검색창 -->
      <header class="header">
        <h1 class="app-title">내 주변 땡처리</h1>
        <div class="header-right">
          <button @click="toggleNotifications" class="icon-button">
            <span class="material-icons">notifications</span>
          </button>
          <button @click="goToProfile" class="icon-button">
            <span class="material-icons">account_circle</span>
          </button>
        </div>
      </header>
  
      <!-- 검색창 -->
      <div class="search-container">
        <input type="text" v-model="searchQuery" placeholder="검색어를 입력하세요" />
        <button @click="searchDeals" class="search-button">
          <span class="material-icons">search</span>
        </button>
      </div>
  
      <!-- 카카오맵 -->
      <div ref="mapContainer" class="map-container"></div>
  
      <!-- 하단 버튼 -->
      <footer class="footer">
        <button @click="fetchNearbyDeals" class="find-button">
          주변 땡처리 땡잡기
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
        map: null,            // 카카오맵 객체
        marker: null,         // 마커 객체
      };
    },
    mounted() {
      if (window.kakao && window.kakao.maps) {
        this.$nextTick(() => {
          this.initMap();
        });
      } else {
        const script = document.createElement("script");
        script.src = "https://dapi.kakao.com/v2/maps/sdk.js?appkey=5b7a047034c2cd477e680ad35bbb6862&autoload=false&libraries=services";
        script.onload = () => {
          kakao.maps.load(() => {
            this.$nextTick(() => {
              this.initMap();
            });
          });
        };
        document.head.appendChild(script);
      }
    }
  
    ,
    methods: {
      initMap() {
        const container = this.$refs.mapContainer;
        const options = {
          center: new kakao.maps.LatLng(37.5665, 126.978), // 기본 중심 좌표
          level: 3,
        };
        this.map = new kakao.maps.Map(container, options);
  
        // 기본 마커
        this.marker = new kakao.maps.Marker({
          position: this.map.getCenter(),
        });
        this.marker.setMap(this.map);
  
        // 현재 위치 가져오기
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              const locPosition = new kakao.maps.LatLng(lat, lng);
  
              this.map.setCenter(locPosition);
              this.marker.setPosition(locPosition);
            },
            () => {
              alert("위치 정보가 필요합니다!");
            }
          );
        }
      },
      toggleNotifications() {
        router.push('./notifications')
      },
      goToProfile() {
        this.$router.push('./profile');
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
  
  <style>
  /* 초기화 및 폰트 */
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Pretendard', sans-serif;
  }
  
  body {
    background-color: #f4f4f4;
    color: #333;
  }
  
  .main-container {
    display: flex;
    flex-direction: column;
    /* min-height: 100vh; */
    width: 100%;
    height: 400px;
  }
  
  /* 상단 헤더 */
  .header {
    background-color: #ffffff;
    padding: 1rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
  
  .header h1 {
    font-size: 1.2rem;
    font-weight: 700;
  }
  
  .header-right button {
    background: none;
    border: none;
    color: #666;
    font-size: 0.9rem;
    margin-left: 0.5rem;
    cursor: pointer;
    padding: 0.4rem 0.6rem;
    border-radius: 6px;
    transition: background-color 0.3s ease;
  }
  
  .header-right button:hover {
    background-color: #efefef;
  }
  
  /* 검색창 */
  .search-container {
    display: flex;
    margin: 1rem 1.5rem;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .search-container input {
    flex: 1;
    padding: 0.7rem;
    border: none;
    outline: none;
  }
  
  .search-container button {
    background-color: #ffa339;
    color: #ffffff;
    border: none;
    padding: 0 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .search-container button:hover {
    background-color: #ff951c;
  }
  
  /* 카카오맵 */
  .map-container {
    margin: 1rem 1.5rem;
    flex: 1;
    height: 400px;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  }
  
  /* 하단 버튼 */
  .find-button {
    display: block;
    width: calc(100% - 3rem);
    margin: 1rem 1.5rem;
    padding: 0.75rem;
    background-color: #ffa339;
    color: #ffffff;
    text-align: center;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .find-button:hover {
    background-color: #ff951c;
  }
  
  
  
  </style>
  