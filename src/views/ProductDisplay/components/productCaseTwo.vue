<template>
  <div class="product-case-two" :style="{ background: currentBackgroundColor }"
       @mousedown="startDrag"
       @touchstart="startDrag"
       @mouseup="endDrag"
       @touchend="endDrag">
    <div class="carousel">
      <div class="img-box">
        <div class="img-list">
          <div class="img-slider" :style="sliderStyle">
            <div
              v-for="(image, index) in images"
              :key="index"
              :class="['img-item', { active: index === activeIndex }]"
              :style="{'--i': index}"
            >
              <div class="item" :style="itemStyle">
                <img :src="image" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 产品信息展示部分 -->
      <div class="info-box">
        <div v-for="(info, index) in infoItems" :key="index" class="info-item"
             :class="{ active: index === activeIndex }">
          <h2>{{ info.color }}</h2>
          <h2>{{ info.price }}</h2>
          <div class="colors">
          <span
            v-for="(color, colorIndex) in info.colors"
            :key="colorIndex"
            :style="{ backgroundColor: color }"
            :class="{ active: colorIndex === activeIndex }"
          ></span>
          </div>
          <p>{{ info.description }}</p>
          <span class="btn" @click="showProductInformation(index)">Buy Now</span>
        </div>
      </div>
    </div>
    <el-dialog v-model="showBuy"
               title="购买信息"
               width="320"
    >
      <div style="display: flex;align-items: center;justify-content: center">
        购买信息
        这是第{{ ProductIndex + 1}}张
      </div>
    </el-dialog>
    <!-- 导航按钮 -->
    <div class="navigation">
      <span class="prev-btn" @click="prevBtn">&lt;</span>
      <span class="next-btn" @click="nextBtn">&gt;</span>
    </div>
  </div>
  <AwFooter></AwFooter>
</template>
<script setup>
import {ref, computed} from "vue";
import image1 from '@/assets/img/classoc_case/productCase/Alcohol1.png'
import image2 from '@/assets/img/classoc_case/productCase/Alcohol2.png'
import image3 from '@/assets/img/classoc_case/productCase/Alcohol3.png'
import image4 from '@/assets/img/classoc_case/productCase/Alcohol4.png'
import image5 from '@/assets/img/classoc_case/productCase/Alcohol5.png'
import image6 from '@/assets/img/classoc_case/productCase/Alcohol6.png'
import AwFooter from "@/components/public/Footer.vue";

// 图片数组
const images = [image1, image2, image3, image4, image5, image6];

const startX = ref(0); // 记录拖动起点
const isDragging = ref(false); // 是否正在拖动

// 产品信息数组
const infoItems = [
  {
    color: "金酱酒·蓝标",
    price: "价格1",
    colors: ["#43527c", "#fbd8a2", "#3c6b7f", "#a68558", "#fc6f6e", "#723233"],
    description: "酱香突出，诸味协调，幽雅细腻、回味悠久、空杯留香、幽雅细腻，酒体醇厚"
  },
  {
    color: "金酱酒V15",
    price: "价格2",
    colors: ["#43527c", "#fbd8a2", "#3c6b7f", "#a68558", "#fc6f6e", "#723233"],
    description: "酱香突出，诸味协调，幽雅细腻、回味悠久、空杯留香、幽雅细腻，酒体醇厚"
  },
  {
    color: "金酱酒·银标",
    price: "价格3",
    colors: ["#43527c", "#fbd8a2", "#3c6b7f", "#a68558", "#fc6f6e", "#723233"],
    description: "酱香突出，诸味协调，幽雅细腻、回味悠久、空杯留香、幽雅细腻，酒体醇厚"
  },
  {
    color: "金酱酒·慢工金酱",
    price: "价格4",
    colors: ["#43527c", "#fbd8a2", "#3c6b7f", "#a68558", "#fc6f6e", "#723233"],
    description: "酱香突出，诸味协调，幽雅细腻、回味悠久、空杯留香、幽雅细腻，酒体醇厚"
  },
  {
    color: "金酱酒·慢道金酱",
    price: "价格5",
    colors: ["#43527c", "#fbd8a2", "#3c6b7f", "#a68558", "#fc6f6e", "#723233"],
    description: "酱香突出，诸味协调，幽雅细腻、回味悠久、空杯留香、幽雅细腻，酒体醇厚"
  },
  {
    color: "金酱酒·红标",
    price: "价格6",
    colors: ["#43527c", "#fbd8a2", "#3c6b7f", "#a68558", "#fc6f6e", "#723233"],
    description: "酱香突出，诸味协调，幽雅细腻、回味悠久、空杯留香、幽雅细腻，酒体醇厚"
  },
];

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

// 当前活动的索引
const activeIndex = ref(0);
// 旋转角度索引
const indexSlider = ref(0);

// 图片旋转样式
const sliderStyle = computed(() => {
  return {
    transform: `rotate(${indexSlider.value * 60}deg)`
  };
});
const itemStyle = computed(() => {
  return {
    transform: `rotate(${indexSlider.value * -60}deg)`
  };
});

const backgroundColors = [
  "#43527c", // 初始颜色
  "#fbd8a2", // 颜色2
  "#3c6b7f", // 颜色3
  "#a68558", // 颜色4
  "#fc6f6e", // 颜色5
  "#723233", // 颜色6
];
const currentBackgroundColor = ref(backgroundColors[0]);

// 切换到上一张
function prevBtn() {
  indexSlider.value--;
  activeIndex.value = (activeIndex.value - 1 + images.length) % images.length;
  currentBackgroundColor.value = backgroundColors[(activeIndex.value) % backgroundColors.length];
}

// 切换到下一张
function nextBtn() {
  indexSlider.value++;
  activeIndex.value = (activeIndex.value + 1) % images.length;
  currentBackgroundColor.value = backgroundColors[(activeIndex.value) % backgroundColors.length];
}



const showBuy = ref(false)
const ProductIndex = ref()

function showProductInformation(index){
  showBuy.value = !showBuy.value
  ProductIndex.value = index
}

</script>
<style scoped lang="less">
.product-case-two {
  background: #43527c;
  min-height: 100vh;
  overflow: hidden;
}

.product-case-two::before{
  content: "";
  position: absolute;
  left: 3.5%;
  top: 50%;
  transform: translateY(-50%);
  width: 35vw;
  height: 35vw;
  background: #fff;
  border-radius: 50%;
  filter: blur(200px);
}

.carousel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100vh;
}

.img-box {
  transform: translateX(-50%); /* 将 div 向右移动 50% 宽度，使其一半超出屏幕 */
  width: 60vw;
  height: 60vw;
}

.img-list {
  height: inherit;
  transform: rotate(180deg);
}

.img-slider {
  height: inherit;
  transition: transform 1s ease;
}

.img-item {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%) rotate(calc(-360deg / 6 * var(--i))) scale(0.8);
  transform-origin: 30vw;
  transition: transform 1s ease;
}

.img-item.active {
  transform: translateY(-50%) rotate(calc(-360deg / 6 * var(--i))) scale(1) translateX(-30%);
  z-index: 1;
}

.item {
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 1s ease;
}

.item img {
  width: 25vw;
  height: auto;
  transform: rotate(calc(360deg / 6 * var(--i))) rotate(180deg);
  filter: blur(8px);
  transition: transform 1s ease;
}

.img-item.active .item img {
  filter: blur(0);
}

.info-box {
  position: absolute;
  right: 0;
  padding: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 540px;
  height: 580px;
  overflow: hidden;
}

.info-box .info-item {
  position: absolute;
  width: 91%;
  height: 90%;
  border-radius: 40px 0 0 40px;
  padding-left: 25px;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transform: translateX(100%);
  opacity: 0;
  box-shadow: none;
  transition: transform 1s ease, opacity 1s ease, box-shadow 1s ease;
}

.info-box .info-item.active {
  transform: translateX(0);
  opacity: 1;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}

.colors span {
  display: inline-block;
  width: 30px;
  height: 30px;
  background: red;
  border-radius: 50%;
  margin-right: 15px;
}

.colors span.active {
  outline: 3px solid #fff;
}

.info-item p {
  font-size: 16px;
  margin: 20px 0 25px;
}

.info-item .btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 180px;
  height: 47px;
  background: #fff;
  border-radius: 40px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  font-size: 16px;
  color: #333;
  text-decoration: none;
  font-weight: 600;
}

.navigation {
  position: absolute;
  left: 50%;
  bottom: 7%;
  transform: translateX(-50%);
  width: 200px;
  display: flex;
  justify-content: space-between;
  z-index: 3;
}

.navigation span {
  text-align: center;
  line-height: 70px;
  width: 70px;
  height: 70px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  cursor: pointer;
  font-size: 55px;
  color: #fff;
}

@media (max-width: 921px) {
  .product-case-two::before {
    content: "";
    position: absolute;
    left: 15.5%;
    top: 50%;
    transform: translateY(-50%);
    width: 180px;
    height: 180px;
    background: #fff;
    border-radius: 50%;
    filter: blur(70px);
  }
  .info-box {
    width: 440px;
    height: 380px;
  }
}
@media (max-width: 768px) {
  .product-case-two::before {
    content: "";
    position: absolute;
    left: 14.5%;
    top: 50%;
    transform: translateY(-50%);
    width: 150px;
    height: 180px;
    background: #fff;
    border-radius: 50%;
    filter: blur(50px);
  }
}
@media (max-width: 767px) {
  .product-case-two::before{
    content: "";
    position: absolute;
    left: 3.5%;
    top: 50%;
    transform: translateY(-50%);
    width: 150px;
    height: 180px;
    background: #fff;
    border-radius: 50%;
    filter: blur(50px);
  }

  .info-box {
    width: 200px;
    height: 350px;
  }

  .info-box .info-item{
    width: 83%;
  }

  .info-item {
    font-size: 18px;
    padding-left: 18px;

    h2 {
      font-size: 18px;
    }

    .btn {
      width: 90px;
      height: 30px;
      background: #fff;
      border-radius: 20px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      font-size: 14px;
    }
  }
  .img-box {
    width: 64vw;
    height: 64vw;
  }

  .img-item {
    transform-origin: 32vw;
  }


  .item img{
    width: 240px;
  }
  .colors span {
    display: inline-block;
    width: 18px;
    height: 18px;
    background: red;
    border-radius: 50%;
    margin-right: 15px;
  }

  .navigation span {
    text-align: center;
    line-height: 40px;
    width: 40px;
    height: 40px;
    font-size: 32px;
  }

}
</style>
