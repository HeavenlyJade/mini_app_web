<template>
  <div id="app" class="force-scroll">
    <FixedImageContainer :imageSrc="backgroundImage" overlayText="Web 3D渲染"/>
    <!--    <div class="header-wrapper"><AwHeader /></div>-->
    <div class="main-content">
      <div class="content">

        <!-- 轮播图-->
        <div
          @mousedown="startDrag"
          @touchstart="startDrag"
          @mouseup="endDrag"
          @touchend="endDrag"
          style="display: flex;justify-content: center">
          <el-carousel
            ref="carouselRef"
            :interval="3000" class="render-swiper" height="600px" motion-blur>
            <el-carousel-item v-for="(item,index) in dashboardImages" :key="item">
              <img class="render-img" :src="item" alt="" @click="openImage(index)">
            </el-carousel-item>
          </el-carousel>
        </div>
        <!-- 在导航栏下方插入描述信息 -->
        <div class="image-description">
          <h2>Web3D渲染小米SU7</h2>

          <p>多个角度感受小米SU7汽车。无需安装，直接体检</p>


          <div style="display: flex;justify-content: center;align-items: center;margin-top: 15px">
            <div class="websiteTest"><a :href="sampleWebsiteUrl" target="_blank"
                                        class="sample-link no-purple-link">样例网站</a></div>
          </div>

          <div class="features">
            <div class="feature">
              <h3>Web3D特点</h3>
              <ul>
                <li>视觉效果</li>
                <li>互动性</li>
                <li>详细参数展示</li>
                <li>沉浸感</li>
              </ul>
            </div>
            <!--            <div class="feature">-->
            <!--              <h3>核心价值</h3>-->
            <!--              <ul>-->
            <!--                <li>出入库流程标准化</li>-->
            <!--                <li>库存检索多功能化</li>-->
            <!--                <li>数据管理可视化</li>-->
            <!--                <li>数据应用智能化</li>-->
            <!--              </ul>-->
            <!--            </div>-->
          </div>
        </div>
        <!--        <router-view/>-->
        <!--        <div class="dashboard">-->
        <!--          <div class="dashboard-item" v-for="(image, index) in dashboardImages" :key="index">-->
        <!--            <img-->
        <!--              :src="image"-->
        <!--              :alt="'Dashboard Image ' + (index + 1)"-->
        <!--              @click="openImage(index)"-->
        <!--            />-->
        <!--          </div>-->
        <!--        </div>-->
      </div>
    </div>
    <ImageViewer v-model:show="showViewer" v-model:currentIndex="currentImageIndex" :images="dashboardImages"/>
    <AwFooter></AwFooter>

  </div>
</template>

<script setup lang="ts">
import AwHeader from '@/components/public/Header.vue'
import FixedImageContainer from '@/components/public/FixedImageContainer.vue'
import ImageViewer from '@/components/public/ImageViewer.vue'
import {ref} from 'vue'
import config from '@/apis/config'
// 导入图片
import image1 from '@/assets/img/classoc_case/render/img.png'
import image2 from '@/assets/img/classoc_case/render/img_1.png'
import image3 from '@/assets/img/classoc_case/render/img_2.png'
import image4 from '@/assets/img/classoc_case/render/img_3.png'
import backgroundImage from '@/assets/img/classoc_case/render/backend.jpeg'
import AwFooter from "@/components/public/Footer.vue"

const sampleWebsiteUrl = config.WebUrl

// Dashboard 图片数组
const dashboardImages = [image1, image2, image3, image4]
const showViewer = ref(false)
const currentImageIndex = ref(0)

// 打开图片查看器
const openImage = (index: number) => {
  currentImageIndex.value = index
  showViewer.value = true
}


const carouselRef = ref(null);

const prevBtn = () => {
  carouselRef.value?.prev(); // 切换到上一张
};

const nextBtn = () => {
  carouselRef.value?.next(); // 切换到下一张
};

const startX = ref(0); // 记录拖动起点
const isDragging = ref(false); // 是否正在拖动


const startDrag = (event) => {
  isDragging.value = true;
  startX.value = event.touches ? event.touches[0].clientX : event.clientX; // 触摸或鼠标
};

const endDrag = (event) => {
  if (!isDragging.value) return;
  isDragging.value = false;
  const endX = event.changedTouches
    ? event.changedTouches[0].clientX
    : event.clientX;
  const deltaX = endX - startX.value;

  if (Math.abs(deltaX) > 50) {
    // 滑动距离大于 50px 触发切换
    if (deltaX > 0) {
      // 向右滑动，显示上一张
      prevBtn()
    } else if (deltaX < 0) {
      // 向左滑动，显示下一张
      nextBtn()
    }
  }
};
</script>

<style scoped lang="less">
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header-wrapper {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.main-content {
  flex: 1;
  padding: 20px;
  background-color: #ffffff;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
}

.image-description {
  margin-top: 20px;
  text-align: center;

  h2 {
    font-size: 36px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  p {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .features {
    display: flex;
    justify-content: center;
    gap: 40px;

    .feature {
      text-align: left;
      width: 100%;

      h3 {
        font-size: 28px;
        font-weight: bold;
        margin-bottom: 10px;
        text-align: center;
      }

      ul {
        display: flex;
        justify-content: space-around;
        width: 100%;

        li {
          font-size: 20px;
          margin-bottom: 5px;
        }
      }
    }
  }
}

.render-swiper {
  width: 100%;
}

.render-img {
  width: 100%;
}

.websiteTest {
  position: relative;
  width: 150px;
  height: 60px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  overflow: hidden; /* 确保子元素不会超出卡片 */
}

.websiteTest::before, .websiteTest::after {
  content: "";
  position: absolute;
  width: 35px;
  height: 6px;
  background: linear-gradient(to right, #007bff, #00d4ff); /* 蓝色渐变 */
  top: 0;
  left: 0;
  border-radius: 0 0 10px 0;
}

.websiteTest::after {
  background: linear-gradient(to right, #ff7700, #ffcc00); /* 橙色渐变 */
  width: 35px;
  height: 6px;
  bottom: 0;
  right: 0;
  top: auto;
  left: auto;
  border-radius: 10px 0 0 0;
}


//.websiteTest {
//  display: flex;
//  justify-content: center;
//  height: 40px;
//  width: 120px;
//  align-items: center;
//  margin: 20px auto;
//  position: relative;
//  border-radius: 15px;
//  box-shadow: rgba(0, 0, 0, 0.12) 0 1px 6px,rgba(0,0,0,0.12) 0 1px 4px;
//}
//
//.websiteTest::before,.websiteTest::after{
//  content: "";
//  position: absolute;
//}

.dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  margin: 40px auto;
  width: 50%;

  .dashboard-item {
    width: 100%;
    display: flex;
    justify-content: center;
    background-color: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    overflow: hidden;

    img {
      max-width: 100%;
      height: auto;
      cursor: pointer;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.02);
      }
    }
  }
}

/* 滚动条样式部分保持不变 */
.force-scroll {
  min-height: 101vh;
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

.no-purple-link {
  color: inherit;
  text-decoration: none;

  &:visited {
    color: inherit;
  }
}

@media (max-width: 1260px) {
  .render-swiper {
    height: 440px !important;
  }
}

@media (max-width: 853px) {
  .render-swiper {
    height: 400px !important;
  }
}


@media (max-width: 767px) {
  .carousel-img {
    width: 380px;
  }

  .feature {
    ul{
      li{
        font-size: 14px !important;
      }
    }
  }


  .render-swiper {
    height: 170px !important;
  }
  //
  //.render-img {
  //  width: 540px;
  //}
}

@media (max-width: 355px) {
  .render-swiper {
    height: 140px !important;
  }
}
</style>
