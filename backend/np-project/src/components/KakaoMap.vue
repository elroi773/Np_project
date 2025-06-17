<template>
    <div>
        <div ref="mapContainer" class="map-container"></div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: "KakaoMap",
    data() {
        return {
            map: null,
            markers: [],
            infowindow: null,
            isMapReady: false,
            deals: [],    // API에서 받아올 데이터
        };
    },
    mounted() {
        this.loadKakaoMap();
    },
    beforeUnmount() {
        this.clearMarkers();
        if (this.infowindow) {
            this.infowindow.close();
        }
    },
    methods: {
        async fetchDeals() {
            try {
                const res = await axios.get('/api/deals');
                this.deals = res.data;
                if (this.isMapReady) {
                    this.addMarkers();
                }
            } catch (err) {
                console.error('데이터 불러오기 실패:', err);
            }
        },
        loadKakaoMap() {
            if (window.kakao && window.kakao.maps) {
                kakao.maps.load(() => {
                    this.initMap();
                });
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://dapi.kakao.com/v2/maps/sdk.js?appkey=5b7a047034c2cd477e680ad35bbb6862&autoload=false&libraries=services';
            script.onload = () => {
                kakao.maps.load(() => {
                    this.initMap();
                });
            };
            document.head.appendChild(script);
        },
        initMap() {
            if (!this.$refs.mapContainer) {
                setTimeout(() => this.initMap(), 50);
                return;
            }
            const container = this.$refs.mapContainer;
            const options = {
                center: new kakao.maps.LatLng(37.5665, 126.9780),
                level: 3
            };
            this.map = new kakao.maps.Map(container, options);
            this.infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
            this.isMapReady = true;

            // 데이터 불러오기 & 마커 추가
            this.fetchDeals();
        },
        clearMarkers() {
            this.markers.forEach(marker => marker.setMap(null));
            this.markers = [];
        },
        addMarkers() {
            this.clearMarkers();

            if (!this.deals.length) return;

            const bounds = new kakao.maps.LatLngBounds();

            this.deals.forEach(deal => {
                if (
                    typeof deal.latitude === 'number' &&
                    typeof deal.longitude === 'number' &&
                    deal.latitude !== 0 &&
                    deal.longitude !== 0
                ) {
                    const markerPosition = new kakao.maps.LatLng(deal.latitude, deal.longitude);
                    bounds.extend(markerPosition);

                    let markerOptions = { position: markerPosition };

                    if (deal.imageUrl) {
                        markerOptions.image = new kakao.maps.MarkerImage(
                            deal.imageUrl,
                            new kakao.maps.Size(40, 40),
                            { offset: new kakao.maps.Point(20, 40) }
                        );
                    }

                    const marker = new kakao.maps.Marker(markerOptions);
                    marker.setMap(this.map);
                    this.markers.push(marker);

                    kakao.maps.event.addListener(marker, 'click', () => {
                        const btnId = `claimBtn-${deal.id}`;
                        const content = `
                            <div style="padding:10px; max-width:260px;">
                                <strong style="font-size:16px;">${deal.name}</strong><br/>
                                ${deal.imageUrl ? `<img src="${deal.imageUrl}" alt="${deal.name}" style="width:100%; margin:5px 0; border-radius:5px;">` : ''}
                                <p style="margin:5px 0;">${deal.description}</p>
                                <p><strong>가격:</strong> ${deal.price.toLocaleString()}원</p>
                                <p><strong>재고:</strong> ${deal.inventory}개</p>
                                <p><strong>연락처:</strong> ${deal.contact}</p>
                                <button id="${btnId}" style="margin-top:8px; padding:6px 12px; background:#0078ff; color:#fff; border:none; border-radius:4px; cursor:pointer;">땡잡기!</button>
                            </div>
                        `;
                        this.infowindow.setContent(content);
                        this.infowindow.open(this.map, marker);

                        setTimeout(() => {
                            const btn = document.getElementById(btnId);
                            if (btn) {
                                btn.onclick = async () => {
                                    btn.disabled = true;
                                    btn.textContent = '처리 중...';
                                    try {
                                        const res = await fetch(`/api/deals/${deal.id}/claim`, { method: 'POST' });
                                        const result = await res.json();
                                        if (result.success) {
                                            alert(result.message);
                                            deal.inventory = result.remainingInventory;
                                            this.infowindow.close();
                                            this.addMarkers(); // 마커 업데이트
                                        } else {
                                            alert(result.message);
                                            btn.disabled = false;
                                            btn.textContent = '땡잡기!';
                                        }
                                    } catch (e) {
                                        alert("서버 오류");
                                        btn.disabled = false;
                                        btn.textContent = '땡잡기!';
                                    }
                                };
                            }
                        }, 100);
                    });
                }
            });

            if (!bounds.isEmpty()) {
                this.map.setBounds(bounds);
            }
        }
    }
};
</script>


<style scoped>
.map-container {
    width: 100%;
    height: 400px;
    border-radius: 10px;
    border: 1px solid #ddd;
    background-color: #f8f9fa;
    position: relative;
}
</style>