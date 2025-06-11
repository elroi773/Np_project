<template>
  <div class="container">
    <div class="step">03</div>

    <div class="dots">
      <span class="dot active"></span>
      <span class="dot active"></span>
      <span class="dot active"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </div>

    <h2 class="title">위치 권환 요청</h2>

    <section class="map-section">
      <h2>내 주변 위치 확인</h2>
      <br />
      <transition name="fade">
        <div v-if="showLocationMessage" class="location-message">
          <p>
            <strong>📍 위치 권한을 허용해주세요!</strong><br />
            <br />
            이 서비스는 내 주변의<br />
            당일 생산/폐기 상품을<br />
            제공하는 매장을 추천해 드립니다.
          </p>
          <button @click="requestLocationPermission" class="permission-btn">
            위치 권한 요청하기
          </button>
        </div>
      </transition>

      <div v-show="!showLocationMessage" class="mini-map" ref="miniMap"></div>
    </section>
    <button class="next-button" @click="goNext">다음</button>

  </div>

</template>

<script>
export default {
  name: "KakaoMapMobile",
  data() {
    return {
      showLocationMessage: true,
      userLat: null,
      userLng: null,
    };
  },
  mounted() {
    if (window.kakao && window.kakao.maps) {
      console.log("카카오맵 객체 있음!");
      // autoload=false이므로 load 호출 필요!
      window.kakao.maps.load(() => {
        console.log("카카오맵 SDK 로드 완료");
      });
    } else {
      const script = document.createElement("script");
      script.onload = () => {
        console.log("카카오맵 SDK 로드 완료");
        window.kakao.maps.load(() => {
          console.log("카카오맵 실제 로딩 완료");
        });
      };
      script.src =
        "https://dapi.kakao.com/v2/maps/sdk.js?appkey=5b7a047034c2cd477e680ad35bbb6862&autoload=false";
      document.head.appendChild(script);
    }
  },

  methods: {
    requestLocationPermission() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.userLat = position.coords.latitude;
            this.userLng = position.coords.longitude;
            this.showLocationMessage = false;

            // ✅ 위치 정보를 localStorage에 저장
            localStorage.setItem("user_latitude", this.userLat);
            localStorage.setItem("user_longitude", this.userLng);

            this.loadMapScript();
          },
          (error) => {
            console.error("위치 가져오기 실패:", error);
            alert("위치 권한이 필요합니다!");
          }
        );
      } else {
        alert("이 브라우저는 위치 정보를 지원하지 않습니다.");
      }
    }
    ,
    loadMapScript() {
      if (window.kakao && window.kakao.maps) {
        this.initMap();
      } else {
        window.kakao.maps.load(() => {
          this.initMap();
        });
      }
    },
    initMap() {
      const container = this.$refs.miniMap;
      const options = {
        center: new kakao.maps.LatLng(this.userLat, this.userLng),
        level: 3,
      };
      const map = new kakao.maps.Map(container, options);

      const markerPosition = new kakao.maps.LatLng(this.userLat, this.userLng);
      const marker = new kakao.maps.Marker({
        position: markerPosition,
      });
      marker.setMap(map);
    },
    goNext() {
      this.$router.push({ name: 'Join4' });
    }
  },
};
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

.title {
  text-align: center;
  font-size: 18px;
  margin-bottom: 24px;
}


/* 지도 섹션 전체 스타일 */
.map-section {
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  margin: 1rem;
}

/* 위치 권한 안내 메시지 */
.location-message {
  background-color: #ffffff;
  padding: 1rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  font-size: 0.8rem;
  color: #333;
}

/* 위치 권한 요청 버튼 */
.permission-btn {
  margin-top: 0.8rem;
  padding: 0.6rem 1.2rem;
  background-color: #ffe2bd;
  /* 연보라색 버튼 */
  color: rgb(67, 56, 45);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.permission-btn:hover {
  background-color: #ffe2bd;
}

/* 지도 컨테이너 */
.mini-map {
  width: 100%;
  height: 200px;
  margin-top: 1rem;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #ddd;
}

/* 페이드 인/아웃 전환 효과 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.next-button {
  background-color: #ffa339;
  border: none;
  width: 100%;
  border-radius: 30px;
  width: 100%;
  padding: 16px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  margin-top: 90px;

}
</style>