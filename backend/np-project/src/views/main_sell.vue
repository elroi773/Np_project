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

    <!-- 물품 추가 버튼 -->
    <div class="add-item-container">
      <button @click="goToAddItem" class="add-item-button">
        + 물품 추가하기
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Main",
  data() {
    return {
      searchQuery: "",
      map: null,
      markers: [],
      deals: [], // 땡처리 물품 데이터
      infowindow: null, // 인포윈도우 재사용
    };
  },
  mounted() {
    this.loadKakaoMap();
    // 라우터 내비게이션 가드 추가 (router/index.js 또는 main.js 등)
    this.$router.afterEach((to, from) => {
      if (to.name === 'Main_sell') {
        // 메인 페이지 컴포넌트 인스턴스가 있으면 fetchDeals 재호출
        const mainComponent = this.$root.$children.find(c => c.$options.name === 'Main');
        if (mainComponent) {
          mainComponent.fetchDeals();
        }
      }
    });

  },
  methods: {
    loadKakaoMap() {
      if (window.kakao && window.kakao.maps) {
        this.$nextTick(() => {
          this.initMap();
        });
      } else {
        const script = document.createElement("script");
        script.src =
          "https://dapi.kakao.com/v2/maps/sdk.js?appkey=5b7a047034c2cd477e680ad35bbb6862&autoload=false&libraries=services";
        script.onload = () => {
          kakao.maps.load(() => {
            this.$nextTick(() => {
              this.initMap();
            });
          });
        };
        document.head.appendChild(script);
      }
    },

    initMap() {
      // 기본 중심 좌표: 서울시청 (위도, 경도)
      const center = new kakao.maps.LatLng(37.5665, 126.978);
      this.map = new kakao.maps.Map(this.$refs.mapContainer, {
        center,
        level: 5,
      });

      // 인포윈도우 하나만 만들어 재사용 (마커 클릭 시 교체)
      this.infowindow = new kakao.maps.InfoWindow({ removable: true });

      // 마커 추가
      this.addMarkers();
    },

    async fetchDeals() {
      try {
        const res = await fetch("/api/deals"); // 실제 API 주소 사용
        this.deals = await res.json();

        // 마커 업데이트
        if (this.map) {
          this.addMarkers();
        }
      } catch (error) {
        console.error("땡처리 물품 로딩 실패", error);
      }
    },

    addMarkers() {
      // 기존 마커 모두 삭제
      this.markers.forEach((marker) => marker.setMap(null));
      this.markers = [];

      this.deals.forEach((deal) => {
        // 위도, 경도 없으면 스킵
        if (!deal.latitude || !deal.longitude) return;

        const position = new kakao.maps.LatLng(deal.latitude, deal.longitude);

        // 마커 이미지가 있으면 썸네일 크기로 지정
        let markerImage = null;
        if (deal.imageUrl) {
          const imageSize = new kakao.maps.Size(40, 40);
          markerImage = new kakao.maps.MarkerImage(deal.imageUrl, imageSize);
        }

        const marker = new kakao.maps.Marker({
          map: this.map,
          position,
          title: deal.name,
          image: markerImage || undefined,
        });

        // 마커 클릭 시 인포윈도우에 정보 표시
        kakao.maps.event.addListener(marker, "click", () => {
          const content = `
            <div style="padding:10px; max-width:220px;">
              <strong style="font-size:1.1rem;">${deal.name}</strong><br/>
              가격: ${deal.price.toLocaleString()}원<br/>
              연락처: ${deal.contact}<br/>
              <div style="margin-top:8px;">
                ${deal.imageUrl
              ? `<img src="${deal.imageUrl}" alt="${deal.name}" style="width:100%; max-height:120px; object-fit:cover; border-radius:6px;" />`
              : `<div style="color:#aaa; font-size:0.9rem; text-align:center;">이미지 없음</div>`
            }
              </div>
            </div>
          `;

          this.infowindow.setContent(content);
          this.infowindow.open(this.map, marker);
        });

        this.markers.push(marker);
      });
    },

    toggleNotifications() {
      this.$router.push("./notifications");
    },

    goToProfile() {
      this.$router.push("./profile");
    },

    searchDeals() {
      alert(`검색어: ${this.searchQuery}`);
      // 필요 시 API 요청하여 검색 결과로 deals 갱신 후 addMarkers() 호출
    },

    goToAddItem() {
      this.$router.push("Add");
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

.add-item-button {
  align-items: center;
  display: inline-block;
  padding: 0.6rem 1.2rem;
  background-color: #ffa339;
  /* 브랜드 컬러 주황 */
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(255, 163, 57, 0.3);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.add-item-button:hover {
  background-color: #ff951c;
  box-shadow: 0 6px 12px rgba(255, 149, 28, 0.5);
}

.add-item-button:active {
  background-color: #e57a00;
  box-shadow: 0 2px 4px rgba(229, 122, 0, 0.7);
  transform: translateY(1px);
}
</style>
