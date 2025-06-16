<template>
    <div class="add-item-container">
        <h2>땡처리 물품 추가하기</h2>

        <form @submit.prevent="submitItem">
            <label>
                물품명
                <input type="text" v-model="itemName" required />
            </label>

            <label>
                설명
                <textarea v-model="description" rows="4" required></textarea>
            </label>

            <label>
                가격 (원)
                <input type="number" v-model.number="price" min="0" required />
            </label>

            <label>
                재고량
                <input type="number" v-model.number="inventory" min="0" required />
            </label>

            <label>
                연락처
                <input type="tel" v-model="contact" placeholder="예: 010-1234-5678" required />
            </label>

            <label>
                사진 업로드
                <input type="file" @change="handleFileUpload" accept="image/*" />
            </label>

            <div v-if="imagePreview" class="image-preview">
                <img :src="imagePreview" alt="미리보기" />
            </div>

            <button type="submit" class="submit-button">등록하기</button>
        </form>
    </div>
</template>

<script>

import axios from 'axios';


export default {
    name: "AddItem",
    data() {
        return {
            itemName: "",
            description: "",
            price: null,
            inventory: null,
            contact: "",
            imageFile: null,
            imagePreview: null,
            latitude: null,
            longitude: null,
        };
    },
    mounted() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    this.latitude = position.coords.latitude;
                    this.longitude = position.coords.longitude;
                    console.log("위도:", this.latitude, "경도:", this.longitude);
                },
                error => {
                    console.error("위치 정보를 가져올 수 없습니다:", error);
                }
            );
        } else {
            alert("이 브라우저는 위치 정보를 지원하지 않습니다.");
        }
    },
    methods: {
        async submitItem() {
            if (!this.itemName || !this.description || !this.price || !this.inventory || !this.contact) {
                alert("모든 필드를 채워주세요.");
                return;
            }

            try {
                const formData = new FormData();
                formData.append('itemName', this.itemName);
                formData.append('description', this.description);
                formData.append('price', this.price);
                formData.append('inventory', this.inventory);
                formData.append('contact', this.contact);
                formData.append('image', this.imageFile);
                formData.append('latitude', this.latitude);
                formData.append('longitude', this.longitude);

                // axios 요청
                const response = await axios.post('http://localhost:3000/api/items', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                // 성공 처리
                alert('물품이 성공적으로 등록되었습니다!');
                this.resetForm();
                this.$router.push('/Main_sell');
            } catch (error) {
                console.error(error);
                alert('등록 중 오류가 발생했습니다.');
            }
        },

        resetForm() {
            this.itemName = "";
            this.description = "";
            this.price = null;
            this.inventory = null;
            this.contact = "";
            this.imageFile = null;
            this.imagePreview = null;
        },

        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.imageFile = file;

                // 이미지 미리보기
                const reader = new FileReader();
                reader.onload = e => {
                    this.imagePreview = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        }
    }

};
</script>

<style scoped>
.add-item-container {
    max-width: 500px;
    margin: 2rem auto;
    padding: 1rem 1.5rem;
    background: white;
    border-radius: 10px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
    font-family: 'Pretendard', sans-serif;
}

h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    font-weight: 700;
}

form label {
    display: block;
    margin-bottom: 1rem;
    font-weight: 600;
    color: #333;
}

form input[type="text"],
form input[type="number"],
form input[type="tel"],
form textarea {
    width: 100%;
    padding: 0.5rem;
    margin-top: 0.3rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
    font-family: 'Pretendard', sans-serif;
    resize: vertical;
}

form input[type="file"] {
    margin-top: 0.3rem;
}

.image-preview {
    margin-bottom: 1rem;
    text-align: center;
}

.image-preview img {
    max-width: 100%;
    max-height: 200px;
    border-radius: 6px;
    object-fit: contain;
}

.submit-button {
    width: 100%;
    background-color: #ffa339;
    color: white;
    border: none;
    padding: 0.75rem;
    font-size: 1.1rem;
    font-weight: 700;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}
</style>