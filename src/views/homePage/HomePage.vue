<template>
  <home-header></home-header>
  <div class="homepage">
    <div class="introduce">
      <div class="homeTitle">{{ homePage.homeTitle }}</div>
      <div class="homeSubtitle">{{ homePage.homeSubtitle }}</div>
      <div class="homeBlurb">{{ homePage.homeBlurb }}</div>
      <div class="homeBtn">
        <div class="homeBtn-left" style="cursor: pointer;font-size: 1.2vw" @click="goClass">小程序定制</div>
        <div class="homeBtn-right" style="cursor: pointer;font-size: 1.2vw" @click="goWare">经典案例</div>
      </div>
    </div>
    <div class="homeLogo"
         :style="{ opacity: opacity }"
         @mouseenter="handleMouseEnter"
         @mouseleave="handleMouseLeave"
    >
      <img src="@/assets/header/logo.png" alt="logo" style="width: 100%;height: auto">
    </div>
<AwFooter class="home-footer" textColor="#ffffff"></AwFooter>

  </div>
</template>

<script setup>
import {ref} from 'vue'
import AwFooter from "@/components/public/Footer.vue";
import router from "@/router";
import HomeHeader from "@/views/homePage/components/homeHeader.vue";

const homePage = ref({
  homeTitle: '起世逸源',
  homeSubtitle: '网络科技公司',
  homeBlurb: '起世逸源网络科技公司是一家专业服务于IT行业的开发公司，已有10余年历史，业务涵盖范围：网页、小程序、后台管理系统、app、web3d开发，美术构建等相关领域；具有极强的专业性和美术能力，能助您的企业在网络时代更具权威性，更富影响力和更多曝光度！'
})



function goClass(){
  router.push("/mini_program_dev")
}
function goWare(){
  router.push("/classic_case")
}

const opacity = ref(1) // 初始透明度

const handleMouseEnter = () => {
  opacity.value = 0.4 // 鼠标滑入时设置透明度
}

const handleMouseLeave = () => {
  opacity.value = 1 // 鼠标滑出时恢复透明度
}
</script>

<style scoped lang="less">

.homepage {
  width: 100%;
  height: 100%;
  background-color:  #000;
  color: #fff;
  display: flex;
  justify-content: center; /* 确保页面内容水平居中 */
  align-items: center; /* 确保页面内容垂直居中 */
  position: relative;
  overflow: hidden;
}

.introduce {
  position: absolute;
  top: 40%; /* 垂直居中 */
  left: 25%; /* 水平居中 */
  width: 30%;
  height: auto;
  transform: translate(-50%, -50%); /* 精确居中 */

  @keyframes slideRight {
    from {
      left: 0; /* 动画起始时，伪元素完全遮住文字 */
    }
    to {
      left: 100%; /* 动画结束时，伪元素完全移出，露出文字 */
    }
  }

  .homeTitle {
    font-weight: bold;
    font-size: 2.4vw;
    position: relative;
    overflow: hidden;
  }

  .homeTitle::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #000; /* 黑色遮罩层 */
    animation: slideRight 1.5s ease forwards; /* 动画效果 */
  }

  .homeSubtitle {
    font-size: 1.8vw;
    font-weight: normal;
    color: #00abf0;
    padding: 10px 0;
    position: relative;
    overflow: hidden;
  }

  .homeSubtitle::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color:  #000; /* 黑色遮罩层 */
    animation: slideRight 1.5s ease forwards; /* 动画效果 */
  }

  .homeBlurb {
    font-size: 1.5vw;
    overflow: hidden;
    position: relative;
    padding-bottom: 15px;
  }

  .homeBlurb::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color:  #000; /* 黑色遮罩层 */
    animation: slideRight 1.5s ease forwards; /* 动画效果 */
  }

  .homeBtn {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 10px;
    position: relative;
    overflow: hidden;

    div {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 30%;
      background: #00abf0;
      padding: 5px 0;
      border: 2px solid #00abf0;
      border-radius: 5px;
      font-size: 1.8vw;
      color: #000;
      text-decoration: none;
      font-weight: 700;
      letter-spacing: 1px;
      z-index: 1;
      position: relative;
      overflow: hidden;
      transition: 0.5s;
    }

    div:hover {
      color: #00abf0;
    }

    div:nth-child(2) {
      width: 40%;
    }


    div::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 0;
      height: 100%;
      background:  #000;
      z-index: -1;
      transition: 0.5s;
    }

    div:hover::before {
      width: 100%;
    }
  }

  .homeBtn::before {
    content: "";
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color:  #000; /* 黑色遮罩层 */
    animation: slideRight 1.5s ease forwards; /* 动画效果 */
  }
}

.homeLogo {
  position: absolute;
  top: 40%; /* 垂直居中 */
  left: 75%; /* 水平居中 */
  width: 30%;
  height: auto;
  transform: translate(-50%, -50%); /* 精确居中 */
  transition: opacity 1s ease; /* 设置过渡效果 */
  overflow: hidden;
}

.homeLogo::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color:  #000;
  animation: slideRight 1.5s ease forwards;
  animation-delay: 1s;
  z-index: 2;
}
.home-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #000;
  overflow: hidden;
  z-index: 4; /* 添加这行，确保文字在遮罩层之上 */
}

.home-footer::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  //background-color: #000;
  animation: slideRight 3s ease forwards;
  z-index: 3;
}
@media (max-width: 360px){
  .homepage {
    min-width: 360px !important; /* 移除最小宽度限制 */
  }
}

@media (max-width: 768px) {
  /* 针对手机屏幕调整 */
  .homepage {
    flex-direction: column; /* 让内容垂直排列 */
    min-width: unset; /* 移除最小宽度限制 */
    min-height: unset;
  }

  .introduce {
    left: 50%; /* 左右居中 */
    top: 40%; /* 垂直居中 */
    width: 80%;
    transform: translateX(-50%); /* 水平居中 */
  }

  .homeLogo {
    left: 50%; /* 水平居中 */
    top: 8%; /* 调整图片的位置，移到文字上方 15px */
    width: 260px;
    transform: translateX(-50%); /* 水平居中 */
  }

  .homeTitle {
    font-size: 24px !important; /* 设置更小的字体大小 */
  }

  .homeSubtitle {
    font-size: 18px !important; /* 设置更小的字体大小 */
  }

  .homeBlurb {
    font-size: 14px !important; /* 设置更小的字体大小 */
  }

  .homeBtn div {
    font-size: 1rem !important; /* 设置为更小的字体大小，使用 rem 单位 */
  }

}


</style>
