<template>
  <div id="map" style="width: 100%; height: 400px;"></div>
</template>

<script>
export default {
  name: "KakaoMap",
  mounted() {
  console.log("KakaoMap 컴포넌트 mounted됨!");
  if (window.kakao && window.kakao.maps) {
    console.log("카카오맵 객체 있음. 바로 initMap 실행!");
    this.initMap();
  } else {
    console.log("카카오맵 객체 없음. 스크립트 추가 중!");
    const script = document.createElement("script");
    script.onload = () => {
      console.log("카카오맵 스크립트 로드됨! kakao.maps.load 실행");
      window.kakao.maps.load(this.initMap);
    };
    script.onerror = (e) => {
      console.error("카카오맵 스크립트 로드 실패! 앱키 혹은 경로 문제입니다.");
      console.error("에러 이벤트:", e);
    };
    script.src = "https://dapi.kakao.com/v2/maps/sdk.js?appkey=5b7a047034c2cd477e680ad35bbb6862&autoload=false";
    document.head.appendChild(script);
  }
},

  methods: {
    initMap() {
      console.log("카카오맵 initMap 실행!");
      const container = document.getElementById("map");
      const options = {
        center: new kakao.maps.LatLng(33.450701, 126.570667),
        level: 3,
      };
      new kakao.maps.Map(container, options);
    }
  }
};
</script>
