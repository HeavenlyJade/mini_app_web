<template>
  <div id="app" class="force-scroll">
    <FixedImageContainer :imageSrc="backgroundImage" overlayText=""/>
    <!-- 轮播图-->
    <div
      style="display: flex;justify-content: center;padding: 0 15%;margin-top: 15px;flex-direction: column;align-items: center">
      <span class="showText">小程序展示</span>
      <div class="pe-show">
        <div
          @mousedown="startDragPe"
          @touchstart="startDragPe"
          @mouseup="endDragPe"
          @touchend="endDragPe"
          style="display: flex;justify-content: center;border: 2px solid #000;width: 100%">
          <el-carousel ref="carouselPeRef" :interval="3000" class="render-swiper1" height="500px" motion-blur>
            <el-carousel-item v-for="(item,index) in dashboardImages" :key="item">
              <div style="display: flex;justify-content: center;align-items: center">
                <img class="render-img1" :src="item" alt="" @click="openImage(index)">
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
      <div class="pc-show">
        <div
          style="display: flex;justify-content: center;border: 2px solid #000;width: 100%">
          <el-carousel ref="carouselRef" :interval="3000" class="render-swiper1" height="500px" motion-blur type="card">
            <el-carousel-item v-for="(item,index) in dashboardImages" :key="item">
              <div style="display: flex;justify-content: center;align-items: center">
                <img class="render-img1" :src="item" alt="" @click="openImage(index)">
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>

    </div>
    <div
      style="display: flex;justify-content: center;padding: 0 15%;margin-top: 15px;flex-direction: column;align-items: center">
      <span class="showText">后台管理展示</span>
      <div
        @mousedown="startDrag"
        @touchstart="startDrag"
        @mouseup="endDrag"
        @touchend="endDrag"
        style="display: flex;justify-content: center;border: 2px solid #000;width: 100%">
        <el-carousel ref="carouselRef" :interval="3000" class="render-swiper2" height="36vw" motion-blur>
          <el-carousel-item v-for="(item,index) in imgList" :key="item">
            <div style="display: flex;justify-content: center;align-items: center">
              <img class="render-img2" :src="item" alt="" @click="openImageList(index)">
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
    <div class="container" ref="container">
      <div class="container_box" ref="target">
        <svg viewBox="0 0 170 80">
          <text x="50%" y="50" text-anchor="middle" font-size="24" class="container_box_text" ref="text">Mcrog</text>
        </svg>
      </div>
      <div class="container_contents">
        <span>在线购物商城电商</span>
        <span style="font-size: 24px;margin-bottom: 20px;font-weight: 500">拥有强大的店铺管理、自定义模板、多端支付(微信支付宝)、多规格商品、运费模板、多地区邮费、库存管理、全端分享等功能。</span>
        <div style="display: flex;flex-direction: column;justify-content: left">
          <div v-for="item in features" :key="item.id">
            <p>{{ item.id }}、{{ item.title }}</p>
            <p>{{ item.content }}</p>
          </div>
        </div>
      </div>
    </div>
    <!--    <div class="main-content">-->
    <!--      <div class="content">-->
    <!--        <div class="image-description">-->
    <!--          <h2>在线购物商城电商</h2>-->
    <!--          <p>拥有强大的店铺管理、自定义模板、多端支付(微信支付宝)、多规格商品、运费模板、多地区邮费、库存管理、全端分享等功能。</p>-->
    <!--        </div>-->
    <!--        &lt;!&ndash; 功能描述部分 &ndash;&gt;-->
    <!--        <div class="features-section">-->
    <!--          <div class="feature-item" v-for="feature in features" :key="feature.id">-->
    <!--            <div class="feature-title">-->
    <!--              {{ feature.id }}、{{ feature.title }}-->
    <!--            </div>-->
    <!--            <div class="feature-content">-->
    <!--              {{ feature.content }}-->
    <!--            </div>-->
    <!--            <div v-if="feature.applicableIndustries" class="feature-industries">-->
    <!--              {{ feature.applicableIndustries }}-->
    <!--            </div>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--        <router-view/>-->
    <!--    <div class="dashboard">-->
    <!--      <div class="dashboard-item" v-for="(image, index) in dashboardImages" :key="index">-->
    <!--        <img :src="image" :alt="'Dashboard Image ' + (index + 1)" @click="openImage(index)"-->
    <!--        />-->
    <!--      </div>-->
    <!--    </div>-->
    <!--      </div>-->
    <!--    </div>-->
    <ImageViewer v-model:show="showViewer" v-model:currentIndex="currentImageIndex" :images="dashboardImages"/>
    <ImageViewer v-model:show="showViewer2" v-model:currentIndex="currentImageIndex2" :images="imgList"/>
    <AwFooter></AwFooter>

  </div>
</template>

<script setup lang="ts">
import FixedImageContainer from '@/components/public/FixedImageContainer.vue'
import ImageViewer from '@/components/public/ImageViewer.vue'
import {ref} from 'vue'
// 导入图片
import image1 from '@/assets/img/mini_pro/mini_shop/IMG_1177.jpg'
import image2 from '@/assets/img/mini_pro/mini_shop/IMG_1173.jpg'
import image3 from '@/assets/img/mini_pro/mini_shop/IMG_1175.jpg'
import image4 from '@/assets/img/mini_pro/mini_shop/IMG_1176.jpg'
import image7 from '@/assets/img/mini_pro/mini_shop/i1.jpg'
import image8 from '@/assets/img/mini_pro/mini_shop/i2.jpg'
import image9 from '@/assets/img/mini_pro/mini_shop/i3.jpg'
import image10 from '@/assets/img/mini_pro/mini_shop/i4.jpg'
import backgroundImage from '@/assets/img/mini_pro/mini_shop/BaijiuDisplay.png'
import AwFooter from "@/components/public/Footer.vue";


// Dashboard 图片数组
const dashboardImages = [image1, image2, image3, image4]
const imgList = [image7, image8, image9, image10]
const showViewer = ref(false)
const showViewer2 = ref(false)
const currentImageIndex = ref(0)
const currentImageIndex2 = ref(0)

// 功能描述数据
const features = [
  {
    id: 1,
    title: '首页管理',
    content: '可自定义前端呈现排版、自定义商品组广告魔方、弹框提醒'
  },
  {
    id: 2,
    title: '销售管理',
    content: '提供销货订单、销货单和销货退货单，可开启审核，支持价格记忆、税金计算、销售开票等功能，能同步记录销售费用，为客户代垫费用，可设置自动收款、上传单据附件'
  },
  {
    id: 3,
    title: '消息通知',
    content: '在各自场景下，向客户发送消息通知（支持短信、小程序、公众号、邮箱）'
  },
  {
    id: 4,
    title: '数据统计',
    content: '订单实时统计并且实时查询订单排行榜，可随时进行数据对比'
  },
  {
    id: 5,
    title: '物流跟踪',
    content: '对接各类快递、实时获取物流信息',
    applicableIndustries: ''
  },
  {
    id: 6,
    title: '多平台覆盖',
    content: '多平台覆盖微信公众号、微信小程序、H5网页、抖音小程序',
    applicableIndustries: ''
  }
]

// 打开图片查看器
const openImage = (index: number) => {
  currentImageIndex.value = index
  showViewer.value = true
}
const openImageList = (index: number) => {
  currentImageIndex2.value = index
  showViewer2.value = true
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


const carouselPeRef = ref(null);


const prevBtnPe = () => {
  carouselPeRef.value?.prev(); // 切换到上一张
};

const nextBtnPe = () => {
  carouselPeRef.value?.next(); // 切换到下一张
};

const startPeX = ref(0); // 记录拖动起点
const isDraggingPe = ref(false); // 是否正在拖动

const startDragPe = (event) => {
  isDraggingPe.value = true;
  startPeX.value = event.touches ? event.touches[0].clientX : event.clientX; // 触摸或鼠标
};

const endDragPe = (event) => {
  if (!isDraggingPe.value) return;
  isDraggingPe.value = false;
  const endX = event.changedTouches
    ? event.changedTouches[0].clientX
    : event.clientX;
  const deltaX = endX - startPeX.value;

  if (Math.abs(deltaX) > 50) {
    // 滑动距离大于 50px 触发切换
    if (deltaX > 0) {
      // 向右滑动，显示上一张
      prevBtnPe()
    } else if (deltaX < 0) {
      // 向左滑动，显示下一张
      nextBtnPe()
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

.container {
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 5rem;
}

.container_box {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 1;
}

@keyframes draw {
  from {
    stroke-dashoffset: 255;
  }
  to {
    stroke-dashoffset: 0;
  }
}

.container_box svg {
  position: absolute;
  width: 40rem;
}

.container_box svg text {
  font-family: sans-serif;
  font-size: 40px;
  font-weight: bold;
  fill: none;
  stroke: #66ccff;
  stroke-width: 1;
  stroke-dasharray: 255;
  stroke-dashoffset: 255;
  animation: draw 5s linear forwards; /* 动画持续2秒，线性播放 */
}
.showText{
  font-size: 24px;
  margin-bottom: 15px;
}

.container_contents {
  z-index: 2;
  width: 70%;
  display: flex;
  margin-top: 15px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.container_contents span {
  font-family: sans-serif;
  font-weight: 600;
  font-size: 2rem;
  color: #000;
  margin-bottom: 0.5rem;
  //opacity: 0.2;
}

.container_contents p {
  font-family: sans-serif;
  font-size: 1.2rem;
  color: #000;
  //margin-bottom: 0.1rem;
  //opacity: 0.2;
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
}

// 新增功能描述样式
.features-section {
  margin: 40px 0;
  padding: 0 20px;

  .feature-item {
    margin-bottom: 24px;

    .feature-title {
      font-size: 16px;
      font-weight: 500;
      color: #333;
      margin-bottom: 8px;
    }

    .feature-content {
      font-size: 16px;
      color: #666;
      line-height: 1.6;
      margin-bottom: 8px;
    }

    .feature-industries {
      font-size: 14px;
      color: #666;
      margin-top: 12px;
    }
  }
}

.dashboard {
  display: flex;
  flex-direction: row; // 改为横向排列
  flex-wrap: wrap; // 允许换行
  justify-content: center; // 居中对齐
  gap: 20px; // 图片间距
  margin: 30px auto;
  width: 90%; // 扩大容器宽度以适应多列

  .dashboard-item {
    flex: 0 1 auto; // 允许缩放但保持原始尺寸
    max-width: 350px; // 设置最大宽度
    min-width: 250px; // 设置最小宽度
    display: flex;
    justify-content: center;
    background-color: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    overflow: hidden;

    img {
      width: 100%;
      height: auto;
      cursor: pointer;
      transition: transform 0.3s ease;
      object-fit: contain; // 保持图片比例

      &:hover {
        transform: scale(1.02);
      }
    }
  }
}


.render-swiper1 ::v-deep(.el-carousel__button) {
  background-color: #000;
}

.render-swiper1 ::v-deep(.el-carousel__arrow) {
  color: #000;
}

.render-swiper1 {
  width: 100%;
}

.render-swiper2 ::v-deep(.el-carousel__button) {
  background-color: #000;
}

.render-swiper2 ::v-deep(.el-carousel__arrow) {
  color: #000;
}

.render-swiper2 {
  width: 100%;
}


.render-img1 {
  height: 500px;
  //width: 100%;
}

.render-img2 {
  width: 100%;
}

.pc-show {
  display: block;
  width: 100%;
}
.pe-show {
  display: none;
}


//@media (max-width: 1260px) {
//  .render-swiper2 {
//    height: 440px !important;
//  }
//}
//
//@media (max-width: 1260px) {
//  .render-swiper2 {
//    height: 350px !important;
//  }
//}
//
//@media (max-width: 853px) {
//  .render-swiper2 {
//    height: 325px !important;
//  }
//}

// 响应式布局
@media screen and (max-width: 768px) {
  .dashboard {
    .dashboard-item {
      max-width: 100%; // 在小屏幕上占满宽度
      min-width: unset;
    }
  }

  .container_box svg text {
    font-size: 48px;
    stroke-dasharray: 300;
  }

  .container_box svg {
    position: absolute;
    width: 20rem;
  }


  .pe-show {
    display: block;
    width: 100%;
  }
  .pc-show {
    display: none;
  }

  //.render-swiper2 {
  //  height: 170px !important;
  //}
}


//@media (max-width: 355px) {
//  .render-swiper2 {
//    height: 140px !important;
//  }
//}

// 添加响应式布局
@media screen and (max-width: 1200px) {
  .dashboard {
    width: 45%;
  }
}

@media screen and (max-width: 480px) {
  .dashboard {
    width: 90%;
  }
}

//* 滚动条样式 *
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
</style>
