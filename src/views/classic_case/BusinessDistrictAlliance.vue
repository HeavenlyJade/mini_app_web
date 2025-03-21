<template>
  <div id="app" class="force-scroll">
    <FixedImageContainer :imageSrc="backgroundImage" containerClass="custom-container">
      <template #overlay>
        <div class="custom-overlay-content">
          <h1>商圈联盟</h1>
          <p>资源整合组建商盟，商家异业合作，共同行销引流，提升运营与业绩</p>
        </div>
      </template>
    </FixedImageContainer>

    <div class="page-content">
      <div class="center-image-section">
        <div class="center-image-container">
            <div class="image-and-text">
    <div class="image-wrapper">
      <img
        :src="circlediagram"
        alt="智慧商圈营销解决方案"
        class="center-image"
        :class="{ 'loading': isLoading }"
        @load="handleImageLoad"
        @error="handleImageError"
      >
      <div v-if="isLoading" class="loading-spinner"></div>
    </div>
    <div class="image-text-content">
      <h3 class="image-title">智慧商圈营销解决方案</h3>
      <p class="image-description">
        基于云计算管理流程形成生态闭环，实现商圈内部多门店的经营联动。实现信息透明，通过不同门店的联营营运的分析结果，完善商品分析、经营优化、破圈场景门店的运营效果。更贴近客户的需求管理，增强选择的健康收益主旨在服务零售环境。利于顾客需要合理好服务定位。
      </p>
    </div>
  </div>
        </div>
      </div>

      <div class="highlight-section">
        <div class="highlight-box industry-challenges">
          <h2>行业难点</h2>
          <ol>
            <li>为商家搭建智能销售平台并通过体验数据的积累为消费者提供决策。</li>
            <li>为商家不同行业的商家创建互通的桥梁，扩大消费者受众。</li>
            <li>智能整合行业分工资源</li>
            <li>帮助商家引流提升业绩</li>
          </ol>
        </div>
        <div class="highlight-box solutions">
          <h2>解决方案</h2>
          <p>联盟整体化服务（顾客引导、支付、平台管理等）为商家提供资源整合和流量导入的工具，帮助快速增长销售，提高运营效率。利用智能分析功能助力精准营销，提升顾客粘性和满意度。</p>
        </div>
      </div>

      <div class="icon-section">
        <h3 class="icon-section-title">营销场景</h3>
        <div class="icon-grid">
          <div v-for="(icon, index) in marketingIcons"
               :key="index"
               class="icon-box"
               @click="openImageViewer(icon.img)">
            <img :src="icon.img" :alt="icon.text">
            <p>{{ icon.text }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isViewerOpen" class="image-viewer" @click.self="closeImageViewer">
      <img :src="currentImage" alt="Viewed Image" />
      <span class="close-btn" @click="closeImageViewer">&times;</span>
    </div>
    <AwFooter ></AwFooter>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import backgroundImage from '@/assets/img/classoc_case/Tokyo.jpg'
import FixedImageContainer from '@/components/public/FixedImageContainer.vue'
import circlediagram from '@/assets/img/classoc_case/business/circle-diagram.png'
import image1 from '@/assets/img/classoc_case/business/img.png'
import image2 from '@/assets/img/classoc_case/business/img_1.png'
import image3 from '@/assets/img/classoc_case/business/img_2.png'
import image4 from '@/assets/img/classoc_case/business/img_4.png'
import image5 from '@/assets/img/classoc_case/business/img_6.png'
import image6 from '@/assets/img/classoc_case/business/img_3.png'
import image7 from '@/assets/img/classoc_case/business/img_7.png'
import image8 from '@/assets/img/classoc_case/business/img_8.png'
import AwFooter from "@/components/public/Footer.vue";

const marketingIcons = [
  { img: image1, text: '新店开业' },
  { img: image2, text: '节假日营销' },
  { img: image3, text: '周年庆营销' },
  { img: image4, text: '特殊日子营销' },
  { img: image5, text: '闪时营销' },
  { img: image6, text: '会员日营销' },
  { img: image7, text: '品牌宣传' },
  { img: image8, text: '顾客流失营销' }
]

const isMobile = ref(false)
const isViewerOpen = ref(false)
const currentImage = ref('')

onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth <= 768
  }
  checkMobile()
  window.addEventListener('resize', checkMobile)

  return () => {
    window.removeEventListener('resize', checkMobile)
  }
})

const openImageViewer = (imgSrc: string) => {
  currentImage.value = imgSrc
  isViewerOpen.value = true
}

const closeImageViewer = () => {
  isViewerOpen.value = false
  currentImage.value = ''
}
const isLoading = ref(true)

const handleImageLoad = () => {
  isLoading.value = false
}

const handleImageError = () => {
  isLoading.value = false
}
</script>

<style lang="less">
// 重置和基础样式
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}


body {
  background-color: #ffffff;
  color: #333333;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

// 响应式容器
.page-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 15px;
  }
}

// 顶部横幅
.custom-overlay-content {
  color: white;
  text-align: center;
  padding: 20px;

  h1 {
    font-size: clamp(2rem, 5vw, 3rem);
    margin-bottom: 0.5em;
  }

  p {
    font-size: clamp(1rem, 3vw, 1.2rem);
    max-width: 800px;
    margin: 0 auto;
  }
}

// 中间图片部分
.center-image-section {
  background-color: #f5f9ff;
  padding: 40px 0;
  margin: 40px 0;

  @media (max-width: 768px) {
    padding: 20px 0;
  }
}

.image-and-text {
  display: flex;
  gap: 20px;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
}

.center-image {
  width: 100%;
  max-width: 300px;
  height: auto;
  object-fit: contain;

  @media (max-width: 768px) {
    max-width: 200px;
    margin-bottom: 20px;
  }
}
.image-text-content {
  flex: 1;
  min-width: 0;

  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
  }

  .image-title {
    font-size: clamp(1.25rem, 4vw, 1.8rem);
    margin-bottom: 1rem;
    color: #333;
    line-height: 1.3;

    @media (max-width: 768px) {
      font-size: 1.4rem;
    }
  }

  .image-description {
    font-size: clamp(0.875rem, 2vw, 1rem);
    color: #666;
    line-height: 1.6;

    @media (max-width: 768px) {
      font-size: 0.95rem;
      text-align: left;
      padding: 0 0.5rem;
    }
  }
}


// 难点和解决方案部分
.highlight-section {
  display: flex;
  gap: 20px;
  margin: 40px 0;

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.highlight-box {
  flex: 1;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  h2 {
    font-size: clamp(1.2rem, 3vw, 1.5rem);
    margin-bottom: 15px;
  }

  ol li, p {
    font-size: clamp(0.9rem, 2vw, 1rem);
    margin-bottom: 10px;
  }
}

// 图标部分
.icon-section {
  padding: 20px 0;
}

.icon-section-title {
  text-align: center;
  font-size: clamp(1.3rem, 4vw, 1.5rem);
  margin-bottom: 30px;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 20px;
  justify-items: center;
}

.icon-box {
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  img {
    width: 60px;
    height: 60px;
    object-fit: contain;
    margin-bottom: 10px;

    @media (max-width: 768px) {
      width: 50px;
      height: 50px;
    }
  }

  p {
    font-size: clamp(0.8rem, 2vw, 1rem);
    color: #666;
  }
}

// 图片查看器
.image-viewer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  img {
    max-width: 90%;
    max-height: 90vh;
    object-fit: contain;
  }

  .close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    color: white;
    font-size: 40px;
    cursor: pointer;
    z-index: 1001;
  }
}

// 滚动条样式
* {
  scrollbar-width: thin;
  scrollbar-color: #c0c0c0 #f0f0f0;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f0f0f0;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #c0c0c0;
    border-radius: 4px;
  }
}
</style>
