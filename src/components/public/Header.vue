<template>
  <div class="headerPage">
    <div class="headerPage-display">
      <div class="logo">
        <router-link to="/home">
          <img src="@/assets/header/logo.png" alt="logo"/>
          <span class="logo-text">Mcrog</span>
        </router-link>
      </div>
      <div class="menu-toggle" :class="{ 'is-open': menuOpen }" @click="menuOpen = !menuOpen">
        <span class="menu-icon">{{ menuOpen ? '×' : '☰' }}</span>
      </div>
      <nav class="headerPage-menu" :class="{ 'menu-open': menuOpen }">
        <div class="menu-wrapper">
          <div
            v-for="(nav, index) in navList"
            :key="index"
            class="menu-item"
            :class="{textColor: textColorIndex === index}"
            @click="pageJump(nav.path, index)"
          >
            {{ nav.title }}
          </div>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
// Script部分保持不变
import { ref, onMounted, watch } from 'vue'
import router from '@/router'
import { useRoute } from 'vue-router'

const route = useRoute()
const navList = ref([
  { title: '首页', path: '/home' },
  { title: '小程序定制', path: '/mini_program_dev' },
  { title: '经典案例', path: '/classic_case' },
  { title: '软件研发', path: '/system_dev' }
])

const textColorIndex = ref(0)
const menuOpen = ref(false)

const getIndexByPath = (path: string) => {
  return navList.value.findIndex(item => item.path === path)
}

onMounted(() => {
  const currentIndex = getIndexByPath(route.path)
  if (currentIndex !== -1) {
    textColorIndex.value = currentIndex
  }
})

watch(
  () => route.path,
  (newPath) => {
    const index = getIndexByPath(newPath)
    if (index !== -1) {
      textColorIndex.value = index
    }
  }
)

const props = defineProps({
  textColor: {
    type: String,
    default: '#000'
  }
})

function pageJump (id, index) {
  router.push(id)
  textColorIndex.value = index
  menuOpen.value = false
}
</script>

<style scoped lang="less">
.headerPage {
  width: 100%;
  height: 60px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  background-color: rgba(34, 34, 34, 0.1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);

  .headerPage-display {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 5%;
    height: 100%;
    margin: 0 auto;
    max-width: 1440px; // 添加最大宽度限制
  }

  .menu-toggle {
    display: none;
    cursor: pointer;
    z-index: 10000;

    .menu-icon {
      font-size: 24px;
      color: #fff;
      transition: transform 0.3s ease;
    }

    &.is-open .menu-icon {
      transform: rotate(180deg);
    }
  }

  .headerPage-menu {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .menu-wrapper {
      display: flex;
      align-items: center;
      gap: 40px; // 增加菜单项之间的间距
    }

    .menu-item {
      color: white;
      font-size: 24px;
      font-weight: 600;
      cursor: pointer;
      padding: 0 10px;
      transition: color 0.3s ease;
      white-space: nowrap; // 防止文字换行

      &:hover {
        color: #66ccff;
      }
    }

    .textColor {
      color: #66ccff;
    }
  }
}

.logo {
  flex: 0 0 auto;
  margin-right: 40px; // 增加logo和菜单之间的距离
  display: flex;
  align-items: center;

  a {
    display: flex;
    align-items: center;
    text-decoration: none;
  }

  img {
    height: 45px;
  }

  .logo-text {
    margin-left: 10px;
    font-size: 24px;
    font-weight: bold;
    color: #fff;
  }
}

@media (max-width: 769px) {
  .headerPage {
    .menu-toggle {
      display: block !important;
    }

    .headerPage-menu {
      display: none !important;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background-color: rgba(34, 34, 34, 0.98);
      padding-top: 60px;

      &.menu-open {
        display: block !important;

        .menu-wrapper {
          display: block; // 移动端改为块级显示

          .menu-item {
            display: block;
            width: 100%;
            padding: 15px 20px;
            font-size: 18px;
            color: #fff;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            text-align: left;
            background: none;

            &:hover {
              color: #66ccff;
              background-color: rgba(255, 255, 255, 0.05);
            }

            &.textColor {
              color: #66ccff;
            }
          }
        }
      }
    }
  }

  :deep(.page-content) {
    padding-top: 60px;
    position: relative;
    z-index: 1;
  }
}
</style>
