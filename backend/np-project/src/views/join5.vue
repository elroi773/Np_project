<template>
    <div class="container">
        <div class="step">05</div>

        <div class="dots">
            <span class="dot active"></span>
            <span class="dot active"></span>
            <span class="dot active"></span>
            <span class="dot active"></span>
            <span class="dot active"></span>
        </div>
        <h2>가입을 환영합니다! {{ username }}님!</h2>
        <br>
        <h2 class="title">모두가 함께 나누는 혜택, 정직한 소비로 지켜주세요!</h2>

        <p class="description">
            이 서비스는 <span class="highlight">선한 소비문화 확산</span>을 위해 만들어졌습니다.<br />
            악용을 방지하고 더 많은 이웃과 나누기 위해<br> <span class="limit">일주일 구매 횟수를 제한</span>합니다.<br />
            양해와 협조 부탁드립니다!
        </p>

        <!-- 구매 횟수 설정 -->
        <div class="purchase-section">
            <p class="purchase-label">일주일 땡처리 구매 횟수</p>
            <div class="counter">
                <button @click="decrease" class="btn">-</button>
                <span class="count">{{ count }}</span>
                <button @click="increase" class="btn">+</button>
                <span class="unit">회</span>
            </div>
        </div>

        <button class="next-button" @click="goNext">회원가입하기</button>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            count: 1,
            username: '',
            user_id: '',
        };
    },
    mounted() {
        const savedUsername = localStorage.getItem('currentUsername');
        this.username = savedUsername || '회원';
    },
    methods: {
        increase() {
            if (this.count < 7) this.count++;
        },
        decrease() {
            if (this.count > 1) this.count--;
        },
        // Vue 컴포넌트의 수정된 goNext 메서드
        async goNext() {
            // 사용자명 검증
            if (!this.username || this.username.trim() === '') {
                alert('사용자 정보가 없습니다. 다시 로그인해주세요.');
                this.$router.push({ name: 'Login' }); // 로그인 페이지로 리다이렉트
                return;
            }

            // 구매 횟수 검증
            if (this.count < 1 || this.count > 7) {
                alert('구매 횟수는 1~7회 사이에서 선택해주세요.');
                return;
            }

            try {
                console.log('전송할 데이터:', {
                    username: this.username,
                    purchase_limit: this.count
                });
                axios.post('/api/test', { test: 'data' });

                const response = await axios.post('/api/consumers/signup', {
                    username: this.username.trim(),
                    purchase_limit: this.count,
                });

                console.log('서버 응답:', response.data);

                if (response.data.success) {
                    alert('구매자 등록이 완료되었습니다!');
                    // localStorage에서 민감한 정보 제거
                    localStorage.removeItem('currentUsername');
                    this.$router.push({ name: 'JoinComplete' });
                } else {
                    alert(response.data.message || '등록 중 오류가 발생했습니다.');
                }

            } catch (err) {
                console.error('요청 실패:', err);

                let errorMessage = '회원가입 중 오류가 발생했습니다.';

                if (err.response) {
                    // 서버에서 응답을 받은 경우
                    const serverMessage = err.response.data?.message;
                    if (serverMessage) {
                        errorMessage = serverMessage;
                    }

                    console.error('서버 오류 상태:', err.response.status);
                    console.error('서버 오류 데이터:', err.response.data);

                    // 특정 상태 코드에 따른 처리
                    if (err.response.status === 404) {
                        errorMessage = '사용자를 찾을 수 없습니다. 다시 로그인해주세요.';
                        this.$router.push({ name: 'Login' });
                        return;
                    }
                } else if (err.request) {
                    // 네트워크 오류
                    errorMessage = '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.';
                    console.error('네트워크 오류:', err.request);
                } else {
                    // 기타 오류
                    console.error('기타 오류:', err.message);
                }

                alert(errorMessage);
            }
        }
    }
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
    font-size: 16px;
    margin-bottom: 24px;
}

.description {
    font-size: 13px;
    color: #333;
    line-height: 1.8;
    margin: 24px auto;
    background-color: #fefefe;
    padding: 20px 24px;
    border-radius: 12px;
    border: 1px solid #e5e5e5;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
    font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
    text-: center;
    max-width: 480px;
}

.description span {
    font-weight: 600;
}

align .highlight {
    background: linear-gradient(transparent 70%, #fff4a3 70%);
    color: #222;
}

.limit {
    color: #d64545;
}

.purchase-section {
    margin-top: 30px;
    margin-bottom: 40px;
}

.purchase-label {
    font-size: 16px;
    margin-bottom: 12px;
}

.counter {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    font-size: 32px;
    font-weight: bold;
    color: #333;
}

.btn {
    font-size: 24px;
    width: 40px;
    height: 40px;
    background-color: transparent;
    border: 1px solid #ccc;
    border-radius: 8px;
    cursor: pointer;
}

.unit {
    font-size: 18px;
    color: #aaa;
    margin-left: 5px;
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
    margin-top: 60px;
}
</style>