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
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="검색어를 입력하세요"
        @keyup.enter="searchDeals"
      />
      <button @click="searchDeals" class="search-button">
        <span class="material-icons">search</span>
      </button>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>땡처리 물품을 불러오는 중...</p>
    </div>

    <!-- 카카오맵 -->
    <div v-else class="map-wrapper">
      <KakaoMap 
        :deals="filteredDeals" 
        @claim-deal="handleClaimDeal"
        @marker-click="handleMarkerClick"
      />
      
      <!-- 물품 개수 표시 -->
      <div class="deals-count">
        총 {{ filteredDeals.length }}개의 땡처리 물품
      </div>
    </div>

    <!-- 물품 추가 버튼 -->
    <div class="add-item-container">
      <button @click="goToAddItem" class="add-item-button">
        <span class="material-icons">add</span>
        물품 추가하기
      </button>
    </div>

    <!-- 새로고침 버튼 -->
    <div class="refresh-container">
      <button @click="refreshDeals" class="refresh-button" :disabled="loading">
        <span class="material-icons">refresh</span>
        새로고침
      </button>
    </div>
  </div>
</template>

<script>
import KakaoMap from "@/components/KakaoMap.vue";

export default {
  name: "Main_sell",
  components: {
    KakaoMap
  },
  data() {
    return {
      searchQuery: "",
      deals: [],
      loading: false,
      error: null
    };
  },
  computed: {
    // 검색어에 따른 필터링된 deals
    filteredDeals() {
      if (!this.searchQuery.trim()) {
        return this.deals;
      }
      
      const query = this.searchQuery.toLowerCase().trim();
      return this.deals.filter(deal => 
        deal.name.toLowerCase().includes(query) ||
        deal.description.toLowerCase().includes(query) ||
        deal.contact.toLowerCase().includes(query)
      );
    }
  },
  async mounted() {
    await this.fetchDeals();
  },
  methods: {
    async fetchDeals() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await fetch("/api/deals");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // 서버에서 에러 응답을 보낸 경우
        if (data.success === false) {
          throw new Error(data.message || '데이터를 불러오는데 실패했습니다.');
        }
        
        this.deals = Array.isArray(data) ? data : [];
        console.log(`${this.deals.length}개의 땡처리 물품을 불러왔습니다.`);
        
      } catch (error) {
        console.error("땡처리 물품 로딩 실패:", error);
        this.error = error.message;
        this.deals = [];
        
        // 사용자에게 에러 알림
        alert(`땡처리 물품을 불러오는데 실패했습니다: ${error.message}`);
      } finally {
        this.loading = false;
      }
    },
    
    async refreshDeals() {
      await this.fetchDeals();
    },
    
    goToAddItem() {
      this.$router.push("/add");
    },
    
    goToProfile() {
      this.$router.push("/profile");
    },
    
    toggleNotifications() {
      this.$router.push("/notifications");
    },
    
    searchDeals() {
      // 검색은 computed property로 실시간 처리되므로
      // 여기서는 검색 관련 이벤트만 처리
      console.log(`검색어: ${this.searchQuery}`);
      
      if (this.filteredDeals.length === 0 && this.searchQuery.trim()) {
        alert(`'${this.searchQuery}' 검색 결과가 없습니다.`);
      }
    },
    
    // 땡잡기 처리
    handleClaimDeal(deal) {
      console.log('땡잡기 처리:', deal);
      
      // 여기서 실제 땡잡기 API 호출
      this.claimDeal(deal.id);
    },
    
    // 마커 클릭 처리
    handleMarkerClick(deal) {
      console.log('마커 클릭:', deal);
    },
    
    // 실제 땡잡기 API 호출
    async claimDeal(dealId) {
      try {
        const response = await fetch(`/api/deals/${dealId}/claim`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          alert('땡잡기 성공!');
          // 데이터 새로고침
          await this.fetchDeals();
        } else {
          throw new Error('땡잡기 실패');
        }
      } catch (error) {
        console.error('땡잡기 오류:', error);
        alert('땡잡기 처리 중 오류가 발생했습니다.');
      }
    }
  },
  
  // 라우터 복귀 시 다시 deals를 불러오기
  async beforeRouteEnter(to, from, next) {
    next(async vm => {
      await vm.fetchDeals();
    });
  },
  
  // 다른 라우트로 이동했다가 돌아올 때
  async activated() {
    await this.fetchDeals();
  }
};
</script>

<style scoped>
/* 초기화 및 폰트 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Pretendard', sans-serif;
}

.main-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background-color: #f4f4f4;
  color: #333;
}

/* 상단 헤더 */
.header {
  background-color: #ffffff;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.app-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #ffa339;
}

.header-right {
  display: flex;
  gap: 0.5rem;
}

.icon-button {
  background: none;
  border: none;
  color: #666;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-button:hover {
  background-color: #f0f0f0;
  color: #ffa339;
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
  padding: 0.8rem;
  border: none;
  outline: none;
  font-size: 0.9rem;
}

.search-container input::placeholder {
  color: #999;
}

.search-button {
  background-color: #ffa339;
  color: #ffffff;
  border: none;
  padding: 0 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-button:hover {
  background-color: #ff951c;
}

/* 로딩 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #ffa339;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 맵 래퍼 */
.map-wrapper {
  margin: 0 1.5rem;
  flex: 1;
  position: relative;
}

.deals-count {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(255, 163, 57, 0.9);
  color: white;
  padding: 0.5rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 버튼 컨테이너 */
.add-item-container, .refresh-container {
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: center;
}

.add-item-button, .refresh-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.add-item-button {
  background-color: #ffa339;
  color: white;
}

.add-item-button:hover {
  background-color: #ff951c;
  box-shadow: 0 6px 12px rgba(255, 149, 28, 0.3);
}

.refresh-button {
  background-color: #6c757d;
  color: white;
}

.refresh-button:hover:not(:disabled) {
  background-color: #5a6268;
}

.refresh-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.add-item-button:active, .refresh-button:active {
  transform: translateY(1px);
}

/* 반응형 */
@media (max-width: 768px) {
  .header {
    padding: 0.8rem 1rem;
  }
  
  .search-container {
    margin: 0.8rem 1rem;
  }
  
  .map-wrapper {
    margin: 0 1rem;
  }
  
  .add-item-container, .refresh-container {
    padding: 0.8rem 1rem;
  }
  
  .app-title {
    font-size: 1.1rem;
  }
}
</style>