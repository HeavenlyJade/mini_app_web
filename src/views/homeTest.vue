<template>
  <div ref="index" class="index">
    <AwHeader :class="index_header"></AwHeader>
        <div class="banner-wrap">
          <Banner :banner-height="BannerHeight"></Banner>
<!--          <over-lay></over-lay>-->
          <scroll-hint v-scroll-to="{ element: '.wrap-block', duration: 300, easing: 'ease', offset: 1 }"></scroll-hint>
        </div>

<!--    <index-service></index-service>-->
<!--    <AwFooter></AwFooter>-->
  </div>
</template>
<script lang="ts" setup name="Home">
import AwHeader from '@/components/public/Header.vue'
import AwFooter from '@/components/public/Footer.vue'
import IndexService from '@/components/IndexService.vue'
// import image1 from "@/assets/Home/img1.jpg"
// import image2 from "@/assets/Home/img2.jpg"
// import image3 from "@/assets/Home/img3.jpg"
// import image4 from "@/assets/Home/img4.jpg"

import { onMounted, onUnmounted, ref } from 'vue'

import mainStore from '@/store'
import Banner from '@/components/Banner.vue'
import ScrollHint from '@/components/ScrollHint.vue'

const index_header = ref('')
const BannerHeight = ref(0)

const scrollTop = ref(0)

function nextBtn () {
  const lists = document.querySelectorAll('.item')
  console.log(lists)
  document.getElementById('swiper')?.appendChild(lists[0])
}

function prevBtn () {
  const lists = document.querySelectorAll('.item')
  if (lists.length > 0) {
    const swiper = document.getElementById('swiper')
    if (swiper) {
      swiper.insertBefore(lists[lists.length - 1], swiper.firstChild)
    }
  }
}

const images = ref([
  {
    text1: '真正的程序员不会在上午9：00到下午5：00之间工作，',
    text2: '如果你看到他在上午9：00工作，这表现他从昨晚一直干到现在。'
  },
  {
    text1: '优秀的代码是它自己最好的文档，当你考虑要添加一个注释时，',
    text2: '问问自己，如何能改进这段代码，以让它不需要注释？'
  },
  { text1: '程序员是值得尊敬的，程序员的双手是魔术师的双手，', text2: '他们把枯燥无味的代码变成了丰富多彩的软件。' },
  {
    text1: '理论是你知道是这样，但它却不好用。实践是它很好用，但你不知道是为什么。',
    text2: '程序员将理论和实践结合到一起：既不好用，也不知道是为什么。'
  }
])

// const activeIndex = ref(0);
// let isThrottled = false;
//
// function handleScroll(event: WheelEvent){
//   if (isThrottled) return;
//   isThrottled = true;
//
//   if (event.deltaY > 0 && activeIndex.value < images.value.length - 1) {
//     // Scroll down, move to the next image if not at the end
//     activeIndex.value++;
//   } else if (event.deltaY < 0 && activeIndex.value > 0) {
//     // Scroll up, move to the previous image if not at the beginning
//     activeIndex.value--;
//   }
//   setTimeout(() => (isThrottled = false), 800); // Throttle delay for smooth transition
// }
//
// function getTransformStyle(index: number){
//   const offset = (index - activeIndex.value) * 100;
//   return {
//     transform: `translateY(${offset}%)`,
//     zIndex: index === activeIndex.value ? 1 : 0, // Ensure the active image is always on top
//     transition: 'transform 0.8s ease'
//   };
// }

// const intervalId = setInterval(nextBtn,3000);

onMounted(() => {
  window.addEventListener('resize', setBannerHeight)
  setBannerHeight()
  window.addEventListener('scroll', scrollHandle)
  // window.addEventListener("wheel", handleScroll);
})

onUnmounted(() => {
  window.removeEventListener('resize', setBannerHeight)
  window.removeEventListener('scroll', scrollHandle)
  // window.removeEventListener("wheel", handleScroll);
  // clearInterval(intervalId);
})

function setBannerHeight () {
  BannerHeight.value = window.innerHeight
  mainStore.commit('setBannerHeight', {
    bannerHeight: BannerHeight.value
  })
}

function scrollHandle () {
  scrollTop.value = document.documentElement.scrollTop ||
    window.pageYOffset ||
    document.body.scrollTop
  if (scrollTop.value <= BannerHeight.value - 35) {
    mainStore.commit('setHeaderLogo', {
      headerLogoShow: true
    })
    mainStore.commit('setShadowActive', {
      headerShadowActive: false
    })
    mainStore.commit('setNavDarkActive', {
      navDarkActive: false
    })
  } else {
    mainStore.commit('setHeaderLogo', {
      headerLogoShow: false
    })
    mainStore.commit('setShadowActive', {
      headerShadowActive: true
    })
    mainStore.commit('setNavDarkActive', {
      navDarkActive: true
    })
  }
}
</script>
<style lang="less" scoped>
.index {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
  color: #fff;
}

.container {
  width: 100%;
  overflow: hidden;
  position: relative;
  height: 100vh;
  color: white;
}

.img-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  background-attachment: fixed;
  background-size: cover;
  background-position: center center;
  font-size: 50px;
  font-weight: 600;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 1;
}

.test1 {
  transform: translateX(-100%);
  transition: transform 0.8s ease;
}

.img-box.active .test1 {
  transform: translateX(0);
}

.test2 {
  transform: translateX(100%);
  transition: transform 0.8s ease;
}

.img-box.active .test2 {
  transform: translateX(0);
}

//.img1 {
//  background-image: url(@/assets/Home/img1.jpg);
//}

//.img2 {
//  background-image: url(@/assets/Home/img2.jpg);
//}

//.img3 {
//  background-image: url(@/assets/Home/img3.jpg);
//}

//.img4 {
//  background-image: url(@/assets/Home/img4.jpg);
//}

.swiper-list {
  width: 100%;
  height: 100%;
}

.swiper-container {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 1000px;
  height: 600px;
  padding: 50px;
  border-radius: 20px;
  box-shadow: 0 30px 50px #dbdbdb;
}

#swiper {
  width: max-content;
  margin-top: 50px;
}

.item {
  width: 200px;
  height: 300px;
  background-color: #ff6f24;
  background-position: 50% 50%;
  display: inline-block;
  transition: 0.5s;
  background-size: cover;
  position: absolute;
  z-index: 6;
  top: 50%;
  transform: translate(0, -50%);
  border-radius: 20px;
  box-shadow: 0 30px 50px #505050;
}

.item:nth-child(1),
.item:nth-child(2) {
  left: 0;
  top: 0;
  transform: translate(0, 0);
  border-radius: 20px;
  width: 100%;
  height: 100%;
  box-shadow: none;
}

.item:nth-child(3) {
  left: 50%;
}

.item:nth-child(4) {
  left: calc(50% + 220px);
}

.item:nth-child(5) {
  left: calc(50% + 440px);
  font-weight: normal;
}

.item:nth-child(n+6) {
  left: calc(50% + 660px);
}

.content {
  position: absolute;
  top: 50%;
  left: 100px;
  width: 300px;
  text-align: left;
  padding: 0;
  color: #eee;
  transform: translate(0, -50%);
  display: none;
  font-family: system-ui;
}

.item:nth-child(2)  .content {
  display: block;
  z-index: 6;
}

.blurb {
  margin: 20px 0;
  font-weight: bold;
  opacity: 0;
  animation: showcontent 1s ease-in-out 0.3s 1 forwards;
}

.title {
  font-size: 40px;
  font-weight: bold;
  opacity: 0;
  animation: showcontent 1s ease-in-out 1 forwards;
}

.item-buy{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 45px;
  padding: 10px 20px;
  background-color: #00abf0;
  border-radius: 20px;
  opacity: 0;
  animation: showcontent 1s ease-in-out 0.0s 1 forwards;
  cursor: pointer;
}

@keyframes showcontent {
  from {
    opacity: 0;
    transform: translate(0, 100px);
    filter: blur(33px);
  }
  to {
    opacity: 1;
    transform: translate(0, 0);
    filter: blur(0);
  }
}

.homeBtn {
  position: relative;
  bottom: -480px;
  left: 90%;
  display: flex;
  justify-content: space-between;
  width: 345px;
  height: 50px;
  z-index: 7;

  div {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 150px;
    height: 100%;
    background: #00abf0;
    border: 2px solid #00abf0;
    border-radius: 8px;
    font-size: 19px;
    color: #000;
    //装饰线样式
    text-decoration: none;
    font-weight: 600;
    //字体间距
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
    background-color: #000;
    color: #00abf0;
  }

  div:nth-child(2):hover {
    color: #000;
  }

  div:nth-child(2)::before {
    background: #00abf0;
  }

  div::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background: #000;
    z-index: -1;
    transition: 0.5s;
  }

  div:hover::before {
    width: 100%;
  }
}

.banner-wrap {
  overflow: hidden;
  position: relative;
}

.overlay {
  z-index: 8;
}

.wrap-block {
  position: relative;
  padding-top: 54px;
}
</style>
