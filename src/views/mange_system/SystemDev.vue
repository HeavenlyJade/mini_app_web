<template>
  <div id="app">
    <!-- 图片展示在最顶部 -->
    <div class="fixed-image-container">
      <img :src="image6" alt="Fixed Image" class="fixed-image" />
      <div class="image-overlay">软件研发</div>
    </div>

    <!-- 导航栏设置为浮动在图片上 -->
<!--    <div class="header-wrapper"><AwHeader /></div>-->
    <!-- 主内容区域，包括侧边栏和主要内容 -->
    <div class="content-wrapper">
      <!-- 侧边栏 -->
      <aside class="sidebar" v-if="!isMobile">
        <div class="sidebar-header">库存管理系统</div>
      </aside>
      <!-- 主内容 -->
      <main class="main-content">
        <div class="content">
          <h2>进销存管理系统</h2>
          <p>帮助中小企业实现进销存管理规范化</p>
          <div class="product-highlights">
            <div>
              <h3><span class="triangle-label"></span>解决四大难题</h3>
              <ul>
                <li>采购管理</li>
                <li>销售管理</li>
                <li>仓库管理</li>
                <li>资金管理</li>
              </ul>
            </div>
            <div>
              <h3><span class="triangle-label"></span>核心价值</h3>
              <ul>
                <li>出入库流程标准化</li>
                <li>库存检索多功能化</li>
                <li>数据管理可视化</li>
                <li>数据应用智能化</li>
              </ul>
            </div>
          </div>

          <!-- 图片展示部分 -->
          <div class="right-img-box">
            <div
              class="img-box-item"
              v-for="(img, index) in images"
              :key="index"
              @click="openImageViewer(img)"
            >
              <img :src="img" :alt="'Image ' + (index + 1)" />
            </div>
          </div>
        </div>
      </main>
    </div>
    <!-- 图片查看器模态框 -->
    <div v-if="isViewerOpen" class="image-viewer" @click.self="closeImageViewer">
      <img :src="currentImage" alt="Viewed Image" />
      <span class="close-btn" @click="closeImageViewer">&times;</span>
    </div>
     <AwFooter ></AwFooter>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AwHeader from '@/components/public/Header.vue'
import image6 from '@/assets/img/system_dev/resized.jpg'
import image1 from '@/assets/img/system_dev/Inventory_overview.png'
import image2 from '@/assets/img/system_dev/delivery.png'
import image3 from '@/assets/img/system_dev/job.png'
import image4 from '@/assets/img/system_dev/job_type.png'
import AwFooter from "@/components/public/Footer.vue";

const isMobile = ref(false)

onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth <= 768
  }
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

// 图片数组
const images = [image1, image2, image3, image4]

// 控制图片查看器的状态
const isViewerOpen = ref(false)
const currentImage = ref('')

// 打开图片查看器
const openImageViewer = (imgSrc: string) => {
  currentImage.value = imgSrc
  isViewerOpen.value = true
}

// 关闭图片查看器
const closeImageViewer = () => {
  isViewerOpen.value = false
  currentImage.value = ''
}
</script>

<style lang="less">
body {
  background-color: #ffffff;
  margin: 0;
  padding: 0;
  color: #333333;
  font-family: Arial, sans-serif;
  overflow-y: auto; /* 确保页面可以滚动 */
}
/* 针对 Firefox 浏览器 */
* {
  scrollbar-width: thin; /* 使用 "thin" 关键字，使滚动条更细 */
  scrollbar-color: #c0c0c0 #f0f0f0;
}

/* 顶部图片展示 */
.fixed-image-container {
  position: relative;
  width: 100%;
  height: 40vh;
  z-index: 500;

  .fixed-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .image-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 20px;
    font-weight: bold;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
    text-align: center;
    padding: 0 10px;
  }
}

/* 导航栏浮动设置 */
.header-wrapper {
  position: sticky; /* 保持为 sticky */
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.7);
}

/* 内容区域设置 */
.content-wrapper {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  max-width: 800px;
  margin: 0 auto;
  padding-top: 60px; /* 增加顶部填充，防止导航栏遮挡 */
  box-sizing: border-box;
  overflow-y: auto; /* 确保内容区域可以滚动 */
}

/* 侧边栏设置 */
.sidebar {
  flex: 0 0 200px;
  padding: 15px;
  border-right: 1px solid #ddd;
  height: 100%;
}

.sidebar-header {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

/* 主内容设置 */
.main-content {
  flex: 1;
  padding: 15px;
  box-sizing: border-box;
}

/* 产品亮点部分 */
.product-highlights {
  display: flex;
  gap: 20px;
  margin-top: 20px;

  > div {
    border: 1px solid #ddd;
    padding: 20px;
    border-radius: 8px;
    flex: 1 1 calc(50% - 20px);
  }

  h3 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  position: relative;
  padding-left: 30px; /* 增加左侧填充，以便为三角标签腾出空间 */
  }

  ul {
    list-style: disc inside;
    padding: 0;
    color: #333;

    li {
      margin-bottom: 8px;
    }
  }
}

/* 三角标签样式 */
.triangle-label  {
  position: absolute;
  left: 0px; /* 在框图内部偏移一定距离 */
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 10px solid #333; /* 设置三角形颜色为深色 */
}

/* 图片展示盒子 */
.right-img-box {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;

  .img-box-item {
    flex: 1 1 calc(50% - 20px);
    box-sizing: border-box;
    cursor: pointer; /* 鼠标变为手型，提示可以点击 */

    img {
      width: 100%;
      height: auto;
      border-radius: 8px;
      object-fit: cover;
      transition: transform 0.3s;

      &:hover {
        transform: scale(1.05); /* 鼠标悬停时放大效果 */
      }
    }
  }
}

/* 图片查看器模态框 */
.image-viewer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;

  img {
    max-width: 90%;
    max-height: 90%;
    border-radius: 8px;
  }

  .close-btn {
    position: absolute;
    top: 20px;
    right: 30px;
    font-size: 40px;
    color: #fff;
    cursor: pointer;
  }
}

/* 移动设备优化 */
@media (max-width: 768px) {
  .fixed-image-container {
    height: 30vh;
  }

  .content-wrapper {
    flex-direction: column;
    padding: 0 10px;
  }

  .main-content {
    padding-left: 0;
  }
}

@media (max-width: 480px) {
  .product-highlights {
    gap: 10px;
    > div {
      flex: 1 1 calc(50% - 10px);
    }
  }

  .image-overlay {
    font-size: 18px;
  }
}
</style>
