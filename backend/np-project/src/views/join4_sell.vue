<template>
    <div class="container">
        <div class="step">04</div>

        <div class="dots">
            <span class="dot active"></span>
            <span class="dot active"></span>
            <span class="dot active"></span>
            <span class="dot active"></span>
            <span class="dot"></span>
        </div>

        <h2 class="title">상점 등록</h2>

        <!-- 사용자 ID -->
        <div class="form-group">
            <label for="userId">사용자 ID</label>
            <input
                id="userId"
                type="text"
                v-model="userId"
                placeholder="사용자 ID를 입력하세요"
                autocomplete="username"
            />
        </div>

        <!-- 상점명 -->
        <div class="form-group">
            <label for="storeName">상점명</label>
            <input
                id="storeName"
                type="text"
                v-model="storeName"
                placeholder="상점명을 입력하세요"
                autocomplete="organization"
            />
        </div>

        <!-- 사업자등록번호 -->
        <div class="form-group">
            <label for="bizNumber">사업자등록번호</label>
            <div class="input-row">
                <input
                    id="bizNumber"
                    type="text"
                    v-model="bizNumber"
                    placeholder="예: 123-45-67890"
                    autocomplete="off"
                />
                <button class="check-button" @click="checkBizNumber">중복확인</button>
            </div>
            <p
                class="check-message"
                :class="{ available: isAvailable, unavailable: !isAvailable && checked }"
            >
                {{ checkMessage }}
            </p>
        </div>

        <!-- 주소 -->
        <div class="form-group">
            <label for="address">주소</label>
            <input
                id="address"
                type="text"
                v-model="address"
                placeholder="주소를 입력하세요"
                autocomplete="street-address"
            />
        </div>

        <!-- 전화번호 -->
        <div class="form-group">
            <label for="phone">전화번호</label>
            <input
                id="phone"
                type="text"
                v-model="phone"
                placeholder="예: 010-1234-5678"
                autocomplete="tel"
            />
        </div>

        <!-- 상점 설명 -->
        <div class="form-group">
            <label for="description">상점 설명</label>
            <textarea
                id="description"
                v-model="description"
                placeholder="간단한 소개를 입력하세요"
                rows="4"
                autocomplete="off"
            ></textarea>
        </div>

        <!-- 등록 버튼 -->
        <button class="next-button" @click="submitStore">등록</button>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            userId: '',  // 사용자가 입력할 수 있도록 빈 문자열로 초기화
            storeName: '',
            bizNumber: '',
            address: '',
            phone: '',
            description: '',
            checked: false,
            isAvailable: false,
            checkMessage: ''
        };
    },
    methods: {
        async checkBizNumber() {
            if (!this.bizNumber.trim()) {
                this.checkMessage = '사업자등록번호를 입력해주세요.';
                this.isAvailable = false;
                this.checked = true;
                return;
            }

            try {
                const response = await axios.get('/api/store/check-biznumber', {
                    params: { bizNumber: this.bizNumber.trim() }
                });

                if (response.data.available) {
                    this.checkMessage = '사용 가능한 사업자번호입니다.';
                    this.isAvailable = true;
                } else {
                    this.checkMessage = '이미 등록된 사업자번호입니다.';
                    this.isAvailable = false;
                }
                this.checked = true;

            } catch (error) {
                console.error('사업자번호 중복 확인 오류:', error);
                this.checkMessage = '중복 확인 중 오류가 발생했습니다.';
                this.isAvailable = false;
                this.checked = false;
            }
        },
        
        validateForm() {
            const requiredFields = [
                { field: 'userId', name: '사용자 ID' },
                { field: 'storeName', name: '상점명' },
                { field: 'bizNumber', name: '사업자등록번호' },
                { field: 'address', name: '주소' },
                { field: 'phone', name: '전화번호' },
                { field: 'description', name: '상점 설명' }
            ];

            for (const { field, name } of requiredFields) {
                if (!this[field].trim()) {
                    alert(`${name}을(를) 입력해주세요.`);
                    return false;
                }
            }

            if (!this.checked || !this.isAvailable) {
                alert('사업자등록번호 중복 확인을 해주세요.');
                return false;
            }

            return true;
        },

        async submitStore() {
            if (!this.validateForm()) {
                return;
            }

            try {
                const storeData = {
                    user_id: this.userId.trim(),
                    store_name: this.storeName.trim(),
                    biz_number: this.bizNumber.trim(),
                    address: this.address.trim(),
                    phone: this.phone.trim(),
                    description: this.description.trim(),
                };

                console.log('전송할 데이터:', storeData);

                const response = await axios.post('/api/store', storeData);
                
                if (response.data.success) {
                    alert('상점 등록이 완료되었습니다!');
                    this.$router.push({ name: 'JoinCompleteSell' });
                } else {
                    alert(response.data.message || '상점 등록에 실패했습니다.');
                }
                
            } catch (error) {
                console.error('상점 등록 오류:', error);
                
                if (error.response) {
                    // 서버에서 응답이 온 경우
                    const errorMessage = error.response.data?.message || '상점 등록 중 오류가 발생했습니다.';
                    alert(errorMessage);
                } else if (error.request) {
                    // 요청은 보냈지만 응답이 없는 경우
                    alert('서버와의 연결에 문제가 발생했습니다.');
                } else {
                    // 요청 설정 중 오류가 발생한 경우
                    alert('요청 처리 중 오류가 발생했습니다.');
                }
            }
        },
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
    max-width: 400px;
    margin: 0 auto;
}

.step {
    font-weight: bold;
    margin-bottom: 10px;
    font-size: 16px;
    color: #666;
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
    color: #333;
    font-weight: 600;
}

.form-group {
    margin-bottom: 20px;
    width: 100%;
}

label {
    font-size: 15px;
    font-weight: 500;
    margin-bottom: 6px;
    display: block;
    color: #333;
}

.input-row {
    display: flex;
    gap: 10px;
    align-items: center;
}

input,
textarea {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 15px;
    transition: border-color 0.3s, box-shadow 0.3s;
    font-family: 'Pretendard', sans-serif;
}

input:focus,
textarea:focus {
    border-color: #ffa94d;
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 169, 77, 0.1);
}

input::placeholder,
textarea::placeholder {
    color: #999;
}

.check-button {
    padding: 12px 16px;
    background-color: #ffe0ba;
    font-size: 13px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
    white-space: nowrap;
    font-weight: 500;
}

.check-button:hover {
    background-color: #ffc98c;
}

.check-button:active {
    background-color: #ffb366;
}

.check-message {
    margin-top: 6px;
    font-size: 13px;
    min-height: 18px;
    font-weight: 500;
}

.available {
    color: #2ecc71;
}

.unavailable {
    color: #e74c3c;
}

.next-button {
    background-color: #ffa339;
    border: none;
    width: 100%;
    border-radius: 30px;
    padding: 16px;
    font-weight: bold;
    font-size: 16px;
    cursor: pointer;
    margin-top: 40px;
    transition: background-color 0.3s, transform 0.1s;
    color: white;
}

.next-button:hover {
    background-color: #ff9500;
}

.next-button:active {
    transform: translateY(1px);
}

textarea {
    resize: vertical;
    min-height: 80px;
}
</style>