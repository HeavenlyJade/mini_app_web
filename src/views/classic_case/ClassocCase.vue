<template>
  <div id="app" class="force-scroll">
    <FixedImageContainer :imageSrc="backgroundImage" overlayText="经典案例"/>
    <div class="main-content">
      <div class="content">
        <div class="content-card" v-for="(item, index) in contentList" :key="index">
          <img :src="item.image" :alt="item.title"/>
          <div class="card-info">
            <h3>
              <router-link
                v-if="item.path"
                :to="item.path"
                class="no-purple-link"
              >
                {{ item.title }}
              </router-link>
              <span v-else class="no-purple-link">{{ item.title }}</span>
            </h3>
            <p>{{ item.date }}</p>
          </div>
        </div>
      </div>
    </div>
    <AwFooter></AwFooter>

  </div>
</template>

<script setup lang="ts">
import FixedImageContainer from '@/components/public/FixedImageContainer.vue'
import {onMounted, ref} from 'vue'
import backgroundImage from '@/assets/img/classoc_case/beij.jpg'
import image1 from '@/assets/img/classoc_case/img.png'
import image2 from '@/assets/img/classoc_case/img_4.png'
import image4 from '@/assets/img/classoc_case/img_1.png'
import image6 from '@/assets/img/classoc_case/img_5.png'
import image7 from '@/assets/img/classoc_case/img_6.png'
import AwFooter from "@/components/public/Footer.vue";

// Example content data
const contentList = ref([
  {
    image: image1,
    title: '起源案例 | 进销库一体方案',
    date: '2023-03-17',
    path: '/warehouse_system'
  },
  {
    image: image4,
    title: '起源案例 | Web3D动态渲染',
    date: '2024-11-14',
    path: '/web_render'
  },
  {
    image: image2,
    title: '起源案例 | 商圈联盟一体化流量解决方案',
    date: '20224-10-25',
    path: '/business_district_alliance'
  },
  // {
  //   image: image3,
  //   title: '起源案例 | 我的世界游戏开发',
  //   date: '2023-11-25',
  //   path: '/game_dev'
  // },
  // {
  //   image: image5,
  //   title: '起源案例 | 智能自动化生产实操',
  //   date: '2024-10-25',
  //   path: '/automation'
  // },
  {
    image: image6,
    title: '起源案例 | 轮播图展示',
    date: '2024-10-25',
    path: '/productCase'
  },
  {
    image: image7,
    title: '起源案例 | 轮播图展示',
    date: '2024-10-25',
    path: '/productCaseTwo'
  },
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
  //overflow-x: hidden;
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
