<template>
  <div id="app" class="force-scroll">
    <FixedImageContainer
  :imageSrc="backgroundImage"
  overlayText="小程序研发"/>
    <div class="main-content">
      <div class="content">
        <div class="content-card" v-for="(item, index) in contentList" :key="index">
          <img :src="item.image" :alt="item.title" />
          <div class="card-info">
            <h3>
              <router-link v-if="item.path" :to="item.path" class="no-purple-link">
                {{ item.title }}
              </router-link>
              <span v-else class="no-purple-link">{{ item.title }}</span>
            </h3>
            <p>{{ item.date }}</p>
          </div>
        </div>
      </div>
    </div>
        <AwFooter class="home-footer"></AwFooter>

  </div>
</template>

<script setup lang="ts">
import FixedImageContainer from '@/components/public/FixedImageContainer.vue'
import { onMounted, ref } from 'vue'
import backgroundImage from '@/assets/img/classoc_case/business/img_10.png'
import image2 from '@/assets/img/mini_pro/img_2.png'
import image3 from '@/assets/img/mini_pro/shop_app.jpg'
import image4 from '@/assets/img/mini_pro/1-495x400.png'
import image5 from '@/assets/img/mini_pro/45-495x400.jpg'
import AwFooter from "@/components/public/Footer.vue";
// Example content data
const contentList = ref([
  {
    image: image2,
    title: '订货及进销存一体的管理系统，订货系统+进销存管理系统',
    date: '2023-03-17',
    path: '/mini_mange'
  },
  {
    image: image3,
    title: '起源商城，后台管理,微信小程序一体管理系统',
    date: '2024-11-20',
    path: '/app_shop'
  },
  {
    image: image4,
    title: '起源餐厅，中英文扫码点餐外卖系统小程序、web网页及APP，支持扫码点餐、自取、外卖',
    date: '2024-12-26',
    path: '/app_bee'
  },
    {
    image: image5,
    title: '微信小程序扫码点餐',
    date: '2024-12-26',
    path: '/app_noodle_shop'
  }
])

onMounted(() => {
  const images = document.querySelectorAll('img')
  images.forEach(img => {
    img.onload = () => window.dispatchEvent(new Event('resize'))
  })
})
</script>
<style scoped>

#app {
  font-family: Arial, sans-serif;
}

.custom-overlay-style {
  font-size: 36px;
  color: #ffd700;
}
.main-content {
  display: flex;
  flex-direction: column;
  margin: 40px 20px;
  overflow-x: hidden;
}

.content {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}
.content-card {
  min-width: 300px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
  flex: 0 0 auto;
}

.content-card:hover {
  transform: translateY(-10px);
}

.content-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-bottom: 1px solid #ddd;
}

.card-info {
  padding: 15px;
}

.card-info h3 {
  font-size: 1.2em;
  margin: 0;
}

.card-info p {
  color: #666;
  font-size: 0.9em;
  margin-top: 8px;
}

.no-purple-link {
  color: inherit;
  text-decoration: none;
}

.no-purple-link:visited {
  color: inherit;
}

.force-scroll {
  min-height: 101vh;
  overflow-y: scroll;
}

html {
  overflow-y: scroll;
}
* {
  scrollbar-width: thin;
  scrollbar-color: #c0c0c0 #f0f0f0;
}
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-thumb {
  background-color: #c0c0c0;
  border-radius: 10px;
}

::-webkit-scrollbar-track {
  background-color: #f0f0f0;
}
</style>
