<template>
  <div id="app">
    <AwHeader :textColor="headerTextColor" />
    <router-view />
<!--    <AwFooter ></AwFooter>-->
    <el-backtop :bottom="80" :right="20" :visibility-height="280">
      <div style="height: 24px;width: 24px;display: flex;justify-content: center;align-items: center">
        <i class="iconfont icon-tubiao02" style="color: #00abf0;font-size: 24px;"></i>
      </div>
    </el-backtop>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const headerTextColor = ref('#fff') // 默认字体颜色为白色

// 使用 watch 监听路由变化，动态设置导航栏字体颜色
// watch(
//   () => router.currentRoute.value,
//   (newRoute) => {
//     if (newRoute.path === '/system_dev') {
//       headerTextColor.value = '#000' // 系统研发页面，设置字体为黑色
//     } else {
//       headerTextColor.value = '#fff' // 其他页面，设置字体为白色
//     }
//   },
//   { immediate: true }
// )
</script>

<style lang="less">
html, body {
  height: 100%; /* 确保 html 和 body 元素占满整个页面 */
  margin: 0; /* 移除默认的 margin */
  padding: 0; /* 移除默认的 padding */
  //overflow: hidden; /* 防止出现滚动条 */
  transition: background-color 0.5s ease-in-out; /* 平滑过渡效果 */
}

#app {
  height: 100vh; /* 确保根容器占满整个视口 */
}
/* 在线链接服务仅供平台体验和调试使用，平台不承诺服务的稳定性，企业客户需下载字体包自行发布使用并做好备份。 */
@font-face {
  font-family: 'iconfont';  /* Project id 4742490 */
  src: url('//at.alicdn.com/t/c/font_4742490_mdcmlsg256g.woff2?t=1731377718686') format('woff2'),
  url('//at.alicdn.com/t/c/font_4742490_mdcmlsg256g.woff?t=1731377718686') format('woff'),
  url('//at.alicdn.com/t/c/font_4742490_mdcmlsg256g.ttf?t=1731377718686') format('truetype');
}
</style>
