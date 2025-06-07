<!-- 알람 기능 구현 페이지  -->
<template>
    <div class="main-container">
      <!-- 상단바 -->
      <header class="header">
        <h1 class="app-title">내 주변 땡처리</h1>
        <div class="header-right">
          <button @click="toggleNotifications" class="icon-button">
            <span class="material-icons">notifications</span>
          </button>
        </div>
      </header>
  
      <!-- 지도 -->
      <div ref="mapContainer" class="map-container"></div>
  
      <!-- 하단 버튼 -->
      <footer class="footer">
        <button @click="fetchNearbyDeals" class="find-button">
          주변 땡처리 찾기
        </button>
      </footer>
  
      <!-- 알림창 모달 -->
      <div v-if="showNotifications" class="modal-overlay" @click.self="closeNotifications">
        <div class="modal">
          <h2>알림</h2>
          <ul>
            <li v-for="(notification, index) in notifications" :key="index">
              <strong>{{ notification.title }}</strong><br />
              {{ notification.time }}<br />
              {{ notification.content }}
            </li>
          </ul>
          <button @click="closeNotifications" class="close-button">닫기</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "Main",
    data() {
      return {
        map: null,
        showNotifications: false,
        notifications: [
          {
            title: "국가대표 반찬가게의 땡처리!",
            time: "2025년 6월 7일 오후 11시 45분",
            content: "국가대표 반찬가게의 땡처리를 땡 잡았습니다!",
          },
        ],
      };
    },
    mounted() {
      if (window.kakao && window.kakao.maps) {
        this.initMap();
      } else {
        const script = document.createElement("script");
        script.src =
          "https://dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_APPKEY&libraries=services";
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
        this.showNotifications = !this.showNotifications;
      },
      closeNotifications() {
        this.showNotifications = false;
      },
      fetchNearbyDeals() {
        alert("주변 땡처리 정보를 가져옵니다!");
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
    min-height: 100vh;
  }
  
  /* 상단 헤더 */
  .header {
    background-color: #ffffff;
    padding: 1rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
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
    cursor: pointer;
    padding: 0.4rem 0.6rem;
    border-radius: 6px;
    transition: background-color 0.3s ease;
  }
  
  .header-right button:hover {
    background-color: #efefef;
  }
  
  /* 지도 */
  .map-container {
    margin: 1rem 1.5rem;
    flex: 1;
    height: 400px;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  }
  
  /* 하단 버튼 */
  .find-button {
    display: block;
    width: calc(100% - 3rem);
    margin: 1rem 1.5rem;
    padding: 0.75rem;
    background-color: #4caf50;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .find-button:hover {
    background-color: #43a047;
  }
  
  /* 모달 스타일 */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
  }
  
  .modal {
    background-color: #ffffff;
    border-radius: 10px;
    padding: 1rem 1.5rem;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }
  
  .modal h2 {
    font-size: 1rem;
    margin-bottom: 1rem;
  }
  
  .modal ul {
    list-style: none;
  }
  
  .modal li {
    margin-bottom: 1rem;
  }
  
  .close-button {
    margin-top: 1rem;
    background-color: #4caf50;
    color: #ffffff;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
  }
  
  .close-button:hover {
    background-color: #43a047;
  }
  </style>
  