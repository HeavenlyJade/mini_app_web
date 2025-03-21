<template>
  <div :style="{ background: bgs }" class="swiper"
       @mousedown="startDrag"
       @touchstart="startDrag"
       @mouseup="endDrag"
       @touchend="endDrag">
    <div class="carousel">
      <div class="list-img" ref="listImg">
        <div class="item" v-for="item in imgList">
          <el-image :src="item" class="elImg"></el-image>
        </div>
      </div>
      <div class="box-info">
        <div class="list-info" ref="listInfo">
          <div class="info" v-for="item in textList">
            <h2>{{ item.title }}</h2>
            <p>{{ item.textContent }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="navigation">
      <span class="prev-btn" @click="prevBtn">&lt;</span>
      <span class="next-btn" @click="nextBtn">&gt;</span>
    </div>
  </div>
  <AwFooter></AwFooter>
</template>

<script setup lang="ts">
import {onUnmounted, ref} from "vue";
import image1 from '@/assets/img/classoc_case/productCase/Alcohol1.png'
import image2 from '@/assets/img/classoc_case/productCase/Alcohol2.png'
import image4 from '@/assets/img/classoc_case/productCase/Alcohol3.png'
import image6 from '@/assets/img/classoc_case/productCase/Alcohol6.png'
import AwFooter from "@/components/public/Footer.vue";

const imgList = ref([image1, image2, image4, image6])

const textList = ref([
  {
    title: "金酱酒·蓝标",
    textContent: "酱香突出，诸味协调，幽雅细腻、回味悠久、空杯留香、幽雅细腻，酒体醇厚"
  },
  {
    title: "金酱酒V15",
    textContent: "酱香突出，诸味协调，幽雅细腻、回味悠久、空杯留香"
  },
  {
    title: "金酱酒·银标",
    textContent: "酒色清澈透明，酒体醇和酱香纯正，酒花丰富，闻香净爽"
  },
  {
    title: "金酱酒·红标",
    textContent: "酱香突出，诸味协调，幽雅细腻、回味悠久、空杯留香、幽雅细腻，酒体醇厚"
  },
])

const index = ref(0)
// const intervalId = setInterval(nextBtn,3000);
const listInfo = ref(null)
const listImg = ref(null)
const bgs = ref('linear-gradient(360deg,#465781,#fff)')
const bgsList = ref([
  "linear-gradient(360deg,#465781,#fff)",
  "linear-gradient(360deg,#fbd8a1,#fff)",
  "linear-gradient(360deg,#43758c,#fff)",
  "linear-gradient(360deg,#6e3031,#fff)"])

const startX = ref(0); // 记录拖动起点
const isDragging = ref(false); // 是否正在拖动

onUnmounted(() => {
  // clearInterval(intervalId);
})


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

function prevBtn() {
  index.value = (index.value > 0) ? index.value - 1 : 3;
  listInfo.value.style.transform = `translateY(${index.value * -25}%)`
  listImg.value.style.transform = `translateY(${index.value * -100}%)`
  bgs.value = bgsList.value[index.value]
}


function nextBtn() {
  index.value = (index.value < 3) ? index.value + 1 : 0;
  listInfo.value.style.transform = `translateY(${index.value * -25}%)`
  listImg.value.style.transform = `translateY(${index.value * -100}%)`
  bgs.value = bgsList.value[index.value]
}
</script>

<style lang="less" scoped>
.swiper {
  width: 100%;
  height: 100%;

  .carousel {
    height: 100%;
    padding: 0 10%;
    overflow: hidden;

    .list-img {
      height: 100%;
      transition: 1s cubic-bezier(0.68, -0.55, 0.265, 1.55);

      .item {
        position: relative;
        top: 7%;
        height: 100%;
        display: flex;
        align-items: center;


        .elImg {
          height: 300px;
          position: absolute;
          right: 0;
          pointer-events: none;
          filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.1));
        }
      }
    }

    .box-info {
      position: absolute;
      top: 45%;
      transform: translateY(-505);
      width: 25%;
      height: 250px;
      overflow: hidden;

      .list-info {
        transition: 1s cubic-bezier(0.68, -0.55, 0.265, 1.55);

        .info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 250px;

          h2 {
            font-size: 50px;
            color: #000;
            line-height: 1;
          }

          p {
            font-size: 16px;
            color: #000;
            margin: 20px 0;
          }
        }
      }

    }
  }

  .navigation {
    position: absolute;
    bottom: 7%;
    left: 50%;
    transform: translateX(-50%);

    span {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 40px;
      background: transparent;
      border: 2px solid #000;
      border-radius: 50%;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      margin: 0 15px;
      font-size: 35px;
      color: #000;
      transition: background-color 0.3s ease, transform 0.3s ease;
    }
  }
}


@media (max-width: 768px) {
  /* 针对手机屏幕调整 */
  .swiper {
    z-index: 2;
    width: 100%;
    height: 100%;

    .carousel {
      height: 100%;
      padding: 0 10%;
      overflow: hidden;

      .list-img {
        height: 100%;
        transition: 1s cubic-bezier(0.68, -0.55, 0.265, 1.55);

        .item {
          position: relative;
          top: -5%;
          height: 100%;
          display: flex;
          align-items: center;

          .elImg {
            height: 40vw; // 使用 vw 来根据屏幕大小设置图片高度
            position: absolute;
            right: 0;
            pointer-events: none;
            filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.1));
          }
        }
      }

      .box-info {
        position: absolute;
        top: 45%;
        transform: translateY(-50%);
        width: 30%;
        height: 250px;
        overflow: hidden;

        .list-info {
          transition: 1s cubic-bezier(0.68, -0.55, 0.265, 1.55);

          .info {
            display: flex;
            flex-direction: column;
            justify-content: center;
            color: #000;
            height: 250px;

            h2 {
              font-size: 5vw; // 设置字体大小为视口宽度的百分比
              line-height: 1;
            }

            p {
              font-size: 3vw; // 同样设置文字内容的字体大小
              margin: 20px 0;
            }
          }
        }

      }
    }

    .navigation {
      position: absolute;
      bottom: 7%;
      left: 50%;
      transform: translateX(-50%);

      span {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 10vw; // 使用 vw 来适配屏幕尺寸
        height: 10vw;
        background: transparent;
        border: 2px solid #000;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        margin: 0 15px;
        font-size: 6vw; // 字体大小也用视口宽度来调整
        color: #000;
        transition: background-color 0.3s ease, transform 0.3s ease;
      }
    }
  }

}

</style>
