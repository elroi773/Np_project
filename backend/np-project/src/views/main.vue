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
          <span class="material-icons">profile</span>
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

    <!-- KakaoMap 컴포넌트 -->
    <KakaoMap :stores="stores" @claim-deal="handleClaimDeal" />

    <!-- 하단 버튼 -->
    <footer class="footer">
      <button @click="fetchNearbyDeals" class="find-button">
        주변 땡처리 땡잡기
      </button>
    </footer>
  </div>
</template>

<script>
import KakaoMap from "@/components/KakaoMap.vue"; // 경로는 상황에 맞게 조정

export default {
  name: "Main",
  components: { KakaoMap },
  data() {
    return {
      searchQuery: "",
      stores: [], // 서버에서 받은 매장 데이터 및 아이템 리스트
    };
  },
  methods: {
    toggleNotifications() {
      this.$router.push("/Notifications");
    },
    goToProfile() {
      this.$router.push("/Profile");
    },
    searchDeals() {
      alert(`검색어: ${this.searchQuery}`);
      // TODO: 검색 API 호출 후 this.stores 업데이트
    },
    async fetchNearbyDeals() {
      try {
        // 실제 API 호출
        const response = await fetch("http://localhost:3000/api/deals");
        const deals = await response.json();
        const storesMap = new Map();

        deals.forEach((deal) => {
          // 좌표 기준으로 매장 그룹핑 (간단히 lat+lng 키로)
          const key = `${deal.latitude}_${deal.longitude}`;
          if (!storesMap.has(key)) {
            storesMap.set(key, {
              id: key,
              storeName: "가게 정보 없음", // 실제 매장명 API가 있으면 변경 필요
              latitude: deal.latitude,
              longitude: deal.longitude,
              items: [],
            });
          }
          storesMap.get(key).items.push({
            id: deal.id,
            name: deal.name,
            price: deal.price,
          });
        });

        this.stores = Array.from(storesMap.values());
      } catch (error) {
        alert("주변 땡처리 정보를 불러오는데 실패했습니다.");
        console.error(error);
      }
    },
    async handleClaimDeal(dealId) {
      try {
        console.log("땡잡기 시도 dealId:", dealId);

        const res = await fetch(`http://localhost:3000/api/deals/${dealId}/claim`, {
          method: "POST",
        });

        const data = await res.json(); // 올바른 변수명으로 받아오기
        console.log("서버 응답:", res.status, data);

        if (data.success) {
          alert(data.message);
          await this.fetchNearbyDeals(); // 재고 변동 반영
        } else {
          alert(data.message || "땡잡기 실패");
        }
      } catch (error) {
        alert("땡잡기 중 오류가 발생했습니다.");
        console.error(error);
      }
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

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: #555;
  padding: 0.5rem;
  transition: background-color 0.2s ease;
  border-radius: 50%;
}

.icon-button:hover {
  background-color: #f0f0f0;
}
</style>