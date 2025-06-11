<template>
    <div class="profile-container">
      <!-- 뒤로가기 -->
      <button class="back-button" @click="goBack">← 뒤로가기</button>
  
      <!-- 프로필 카드 -->
      <div class="profile-card">
        <div class="avatar-section">
          <img
            class="avatar"
            :src="user.profileImg || defaultProfile"
            alt="profile image"
          />
        </div>
        <div class="info-section">
          <h2 class="username">{{ user.id }}</h2>
          <p class="count">
            🧲 남은 땡잡기 기회: <strong>{{ user.catchCount }}회</strong>
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        user: {
          id: "todaydeal_user",
          profileImg: "", // 이미지 없으면 기본 이미지로
          catchCount: 7,
        },
        defaultProfile: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
      };
    },
    methods: {
      goBack() {
        this.$router.push('./main');
      },
    },
  };
  </script>
  
  <style scoped>
  .profile-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #ffe259, #ffa751);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem 1rem;
    position: relative;
  }
  
  .back-button {
    position: absolute;
    top: 1rem;
    left: 1rem;
    font-size: 1.5rem;
    cursor: pointer;
  }
  
  .profile-card {
    background: white;
    border-radius: 1.5rem;
    padding: 2rem;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    width: 90%;
    max-width: 400px;
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
  
  .avatar-section {
    flex-shrink: 0;
  }
  
  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .info-section {
    flex-grow: 1;
  }
  
  .username {
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  .count {
    font-size: 1rem;
    color: #555;
  }
  </style>
  