<template>
  <div>
    <div class="footer" :style="{ color: textColor }">
      <div class="footer-sci">
        <div class="home-sci">
          <div class="home-logo">
            <i class="iconfont icon-weixin logo-size" @click="showPhone = !showPhone"></i>
          </div>
          <div class="home-logo">
            <i class="iconfont icon-tianjialianxiren logo-size" @click="showPhone = !showPhone"></i>
          </div>
          <div class="home-logo">
            <i class="iconfont icon-dianhua logo-size" @click="showPhone = !showPhone"></i>
          </div>
        </div>
      </div>
      <div class="about-us">
        <div style="font-size: 24px;font-weight: 600">关于我们</div>
        <div style="font-size: 15px;margin-top: 10px;text-align: center">企业文化</div>
      </div>
      <div class="footer-logo">
        <div class="logo-footer">
          <div>
            <img class="logo-img" src="@/assets/header/logo.png" alt="logo">
          </div>
<!--          <div style="display: flex;flex-direction: column;margin-left: 15px">-->
<!--            <span class="footer-title">起世逸源</span>-->
<!--            <span class="footer-subTitle">MCORG</span>-->
<!--          </div>-->
        </div>
        <div style="display: flex;flex-direction: column">
          <span class="footer-h1">起世逸源&nbsp;网络科技公司</span>
          <span class="footer-h2">辽ICP备16000848号-1</span>
        </div>
      </div>
    </div>
    <el-dialog v-model="showPhone"
               title="微信"
               width="320"
    >
      <div style="display: flex;align-items: center;justify-content: center">
        <img src="@/assets/header/logo.png" style="width: 350px" alt="wx">
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import {ref} from "vue";

// 添加 props 定义
defineProps({
  textColor: {
    type: String,
    default: '#000'  // 默认黑色
  }
});

const showPhone = ref()
</script>

<style scoped lang="less">
.footer {
  background: transparent;
  width: 100%;
  height: 150px;
  display: flex;
  justify-content: space-around;
  align-items: center;

  .footer-logo {
    display: flex;
    align-items: center;
    .logo-footer {
      display: flex;
      margin-right: 15px;

      .logo-img {
        width: 50px;
        height: auto
      }

      .footer-title {
        font-size: 18px !important;
        font-weight: 600
      }

      .footer-subTitle {
        font-size: 15px;
      }

    }
  }


  .footer-h1 {
    font-size: 24px;
    margin: 10px 0;
  }

  .footer-h2 {
    font-size: 18px;
  }


  .footer-sci {
    .home-sci {
      width: 240px;
      display: flex;
      justify-content: space-between;
      overflow: hidden;
    }

    @keyframes streamer {
      100% {
        background-position: -400% 0;
      }
    }

    .home-logo {
      position: relative;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 40px;
      background-color: transparent;
      border: 2px solid #16ccea;
      border-radius: 50%;
      font-size: 36px;
      color: #16ccea;
      text-decoration: none;
      z-index: 2;
      overflow: hidden;

      .logo-size {
        font-size: 24px;
      }
    }

    .home-logo:hover {
      color: #000;
    }

    .home-logo::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 0;
      height: 100%;
      background: #00abf0;
      z-index: -1;
      transition: 0.5s;
    }

    .home-logo:hover::before {
      width: 100%;
    }
  }
}

@media (max-width: 360px) {
  .homepage {
    min-width: 360px !important;
  }
}

@media (max-width: 768px) {
  .footer {
    height: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .home-logo {
      width: 24px !important;
      height: 24px !important;

      .logo-size {
        font-size: 20px !important;
      }
    }

    .about-us {
      display: none;
    }

    .footer-title {
      font-size: 15px;
      font-weight: 600
    }

    .footer-subTitle {
      font-size: 9px;
    }

    .footer-h1 {
      font-size: 12px;
      margin: 10px 0;
    }

    .footer-h2 {
      font-size: 12px;
    }
  }
}
</style>
