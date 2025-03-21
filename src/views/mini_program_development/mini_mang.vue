<template>
  <div class="emptyPage">
    <FixedImageContainer :imageSrc="backgroundImage" overlayText="进销存小程序"/>
    <!-- 轮播图-->
    <div style="display: flex;justify-content: center;padding: 0 10%;margin-top: 15px">
      <div
        @mousedown="startDrag"
        @touchstart="startDrag"
        @mouseup="endDrag"
        @touchend="endDrag"
        style="display: flex;justify-content: center;border: 2px solid #000;width: 100%">
        <el-carousel ref="carouselRef"  :interval="3000" class="render-swiper" height="36vw" motion-blur>
          <el-carousel-item v-for="(item,index) in dashboardImages" :key="item">
            <img class="render-img" :src="item" alt="" @click="openImage(index)">
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
        <span>进销存系统小程序</span>
        <span style="font-size: 24px;margin-bottom: 20px;font-weight: 500">帮助中小企业实现进销存管理规范化</span>
        <div style="display: flex;flex-direction: column;justify-content: left">
          <div v-for="item in features" :key="item.id">
            <p>{{ item.title }}</p>
            <p>{{ item.content }}</p>
          </div>
          <p style="font-size: 0.8rem">适用于：服装鞋帽、化妆品、机械机电、家具装潢、建材行业、快销品、母婴用品、
            办公用品、汽配汽修、生鲜农贸、手机通讯、数码家电、医药用品、制造业、信息技术服务行业等。提供全部无加密服务端和前端源代码，独立部署，不受限制。</p>
        </div>
      </div>
    </div>
<!--    <div class="dashboard">-->
<!--      <div class="dashboard-item" v-for="(image, index) in dashboardImages" :key="index">-->
<!--        <img-->
<!--          :src="image"-->
<!--          :alt="'Dashboard Image ' + (index + 1)"-->
<!--          @click="openImage(index)"-->
<!--        />-->
<!--      </div>-->
<!--    </div>-->
    <ImageViewer v-model:show="showViewer" v-model:currentIndex="currentImageIndex" :images="dashboardImages"/>
    <AwFooter></AwFooter>

  </div>
</template>

<script setup lang="ts">
import FixedImageContainer from '@/components/public/FixedImageContainer.vue'
import ImageViewer from '@/components/public/ImageViewer.vue'
import {ref} from 'vue'
// 导入图片
import image1 from '@/assets/img/system_dev/Inventory_overview.png'
import image2 from '@/assets/img/system_dev/delivery.png'
import image3 from '@/assets/img/system_dev/job.png'
import image4 from '@/assets/img/system_dev/job_type.png'
import image5 from '@/assets/img/system_dev/product.png'
import image6 from '@/assets/img/mini_pro/mini_pro.png'
import backgroundImage from '@/assets/img/system_dev/resized.jpg'
import AwFooter from "@/components/public/Footer.vue";

// Dashboard 图片数组
const dashboardImages = [image6, image1, image2, image3, image4, image5]
const showViewer = ref(false)
const currentImageIndex = ref(0)

// 功能描述数据
const features = [
  {
    id: 1,
    title: "1、采购管理",
    content: "提供购货订单、购货单和购货退货单，可开启审核，支持以销定购、智能补货等功能，能处理采购费用分摊入商品成本，可扫描录单，自定义单据编码规则"
  },
  {
    id: 2,
    title: "2、销售管理",
    content: "提供销货订单、销货单和销货退货单，可开启审核，支持价格记忆、税金计算、销售开票等功能，能同步记录销售费用，为客户代垫费用，可设置自动收款、上传单据附件"
  },
  {
    id: 3,
    title: "3、仓库管理",
    content: "调拨、盘点、组装、拆卸、即时库存查询、库存流水等，提供其他出/入库单、调拨单、组装/拆卸单、成本调整单和普通商品盘点、序列号商品盘点等功能"
  },
  {
    id: 4,
    title: "4、资金管理",
    content: "收/付款单：可处理预收预付，及抵应收应付款；核销单：处理5种常用的往来核销业务；资金转账：存款取款，银行转账，记录企业其他收支类项目"
  },
  {
    id: 5,
    title: "5、移动端订货通",
    content: "通过使用移动端订货通快速开单，后台进行单据审核生成销售单，该进销存系统，为企业搭建专属的订货商城，ERP系统与商城实现了订单管理。(注意：移动端是供客户使用，只有订货功能无进销存管理功能,支持在线支付。)",
    applicableIndustries: "适用于：服装鞋帽、化妆品、机械机电、家具装潢、建材行业、快销品、母婴用品、办公用品、汽配汽修、生鲜农贸、手机通讯、数码家电、医药用品、制造业、信息技术服务行业等。提供全部无加密服务端和前端源代码，独立部署，不受限制。"
  }
]
// 打开图片查看器
const openImage = (index) => {
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

// const container = ref(null);
// const target = ref(null);
// const text = ref(null);
//
// const state = reactive({
//   distanceScroll: 0, // 当前滚动的距离
//   distanceTrigger: 0, // 触发滚动效果的起始点（容器的顶部位置）
//   distanceEdge: 0,    // 滚动结束的距离（容器高度 - 视窗高度）
// });
//
// let observer = null;
//
// function resize() {
//   // if (container.value) {
//   //   const images = container.value.querySelectorAll('img');
//   //   const imageLoadPromises = Array.from(images).map((img) => {
//   //     return new Promise((resolve) => {
//   //       if (img.complete) {
//   //         resolve();
//   //       } else {
//   //         img.onload = resolve;
//   //       }
//   //     });
//   //   });
//   //
//   //   Promise.all(imageLoadPromises).then(() => {
//   //     // 确保图片加载完成后再计算
//   //     state.distanceTrigger = container.value.offsetTop;
//   //     state.distanceEdge = container.value.offsetHeight - window.innerHeight;
//   //   });
//   // }
//
//   if (container.value) {
//     state.distanceTrigger = container.value.offsetTop;
//     state.distanceEdge = container.value.offsetHeight - window.innerHeight;
//   }
// }
//
// function reset() {
//   if (window.scrollY < state.distanceTrigger) {
//     state.distanceScroll = 0;
//   } else {
//     state.distanceScroll = state.distanceEdge;
//   }
//   if (text.value) {
//     text.value.style.strokeDashoffset = `${
//       255 - (state.distanceScroll / state.distanceEdge) * 255
//     }px`;
//   }
// }
//
// function handleScroll() {
//   if (window.scrollY < state.distanceTrigger) {
//     target.value.style = null;
//     reset();
//     return;
//   }
//
//   state.distanceScroll = window.scrollY - state.distanceTrigger;
//   state.distanceScroll = Math.max(0, state.distanceScroll);
//   state.distanceScroll = Math.min(state.distanceEdge, state.distanceScroll);
//   if (state.distanceScroll === state.distanceEdge) {
//     target.value.style.position = "absolute";
//     target.value.style.transform = `translateY(${state.distanceScroll}px)`;
//   } else {
//     target.value.style.position = "fixed";
//     target.value.style.transform = "translateY(0px)";
//   }
//
//   if (text.value) {
//     text.value.style.strokeDashoffset = `${
//       255 - (state.distanceScroll / state.distanceEdge) * 255
//     }px`;
//   }
// }
//
// function observeContainer() {
//   observer = new IntersectionObserver((entries) => {
//     if (entries[0].isIntersecting) {
//       window.addEventListener("scroll", handleScroll);
//       reset();
//     } else {
//       window.removeEventListener("scroll", handleScroll);
//     }
//   });
//   if (container.value) {
//     observer.observe(container.value);
//   }
// }
//
// onMounted(() => {
//   resize();
//   observeContainer();
//   window.addEventListener("resize", resize);
// });
//
// onUnmounted(() => {
//   if (observer && container.value) {
//     observer.unobserve(container.value);
//   }
//   window.removeEventListener("scroll", handleScroll);
//   window.removeEventListener("resize", resize);
// });


</script>

<style scoped lang="less">
#app {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #fff;
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

.render-swiper ::v-deep(.el-carousel__button) {
  background-color: #000;
}

.render-swiper ::v-deep(.el-carousel__arrow) {
  color: #000;
}

.render-swiper {
  width: 100%;
}


.render-img{
  width: 100%;
}
@media (max-width: 768px) {
  .container_box svg text {
    font-size: 48px;
    stroke-dasharray: 300;
  }
  .container_box svg {
    position: absolute;
    width: 20rem;
  }
}
</style>
