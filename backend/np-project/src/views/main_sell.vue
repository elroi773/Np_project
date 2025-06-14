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
      markers: [],   // 여러 마커를 저장할 배열
      deals: [],     // 땡처리 물품 데이터 저장
    };
  },
  mounted() {
    this.loadKakaoMap();
    this.fetchDeals();  // 추가: 물품 데이터 가져오기
  },
  methods: {
    loadKakaoMap() {
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
    },

    async fetchDeals() {
      try {
        const res = await fetch("/api/deals");  // 실제 API 주소로 변경 필요
        this.deals = await res.json();
        this.addMarkers();  // 마커 추가 함수 호출
      } catch (error) {
        console.error("땡처리 물품 로딩 실패", error);
      }
    },

    addMarkers() {
      // 기존 마커 삭제
      this.markers.forEach(marker => marker.setMap(null));
      this.markers = [];

      this.deals.forEach(deal => {
        const position = new kakao.maps.LatLng(deal.latitude, deal.longitude);

        // 마커 이미지 만들기 (이미지 있으면 썸네일로)
        let markerImage;
        if (deal.imageUrl) {
          const imageSize = new kakao.maps.Size(40, 40);
          markerImage = new kakao.maps.MarkerImage(deal.imageUrl, imageSize);
        }

        const marker = new kakao.maps.Marker({
          map: this.map,
          position,
          title: deal.name,
          image: markerImage,
        });

        // 클릭 시 인포윈도우(팝업) 띄우기
        const infowindow = new kakao.maps.InfoWindow({
          content: `
          <div style="padding:5px; max-width:200px;">
            <strong>${deal.name}</strong><br/>
            가격: ${deal.price}원<br/>
            연락처: ${deal.contact}<br/>
            <img src="${deal.imageUrl}" alt="${deal.name}" style="width:100%; max-height:100px; object-fit:cover; margin-top:5px;"/>
          </div>
        `
        });

        kakao.maps.event.addListener(marker, 'click', function () {
          infowindow.open(this.map, marker);
        }.bind(this));

        this.markers.push(marker);
      });
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
    goToAddItem() {
      // 물품 추가 페이지로 이동
      this.$router.push('Add');
    }
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