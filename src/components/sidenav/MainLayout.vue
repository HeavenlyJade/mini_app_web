<template>
  <div class="layout-container">
    <!-- 左侧导航栏 -->
    <SideNav class="side-nav-component" :is-collapsed="isNavCollapsed" @update:is-collapsed="updateCollapsedState" />

    <!-- 右侧内容区 -->
    <div class="main-content" :class="{ 'content-expanded': isNavCollapsed }">
      <!-- 顶部按钮和标题 -->
      <div class="top-bar">
        <button class="toggle-nav-btn" @click="toggleNav">
          <i :class="['toggle-icon', isNavCollapsed ? 'expand-icon' : 'collapse-icon']"></i>
        </button>
        <div class="page-title">
          {{ pageTitle }}
        </div>
      </div>

      <!-- 页面主要内容 -->
      <div class="page-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import SideNav from '@/components/sidenav/SideNav.vue'

export default {
  name: 'MainLayout',
  components: {
    SideNav
  },
  setup() {
    const route = useRoute()
    const isNavCollapsed = ref(false)

    // 根据路由元数据获取页面标题
    const pageTitle = computed(() => {
      return route.meta.title || '页面'
    })

    // 从本地存储中恢复侧边栏状态
    onMounted(() => {
      const savedState = localStorage.getItem('navCollapsed')
      if (savedState !== null) {
        isNavCollapsed.value = savedState === 'true'
      }
    })

    // 切换侧边栏状态
    const toggleNav = () => {
      isNavCollapsed.value = !isNavCollapsed.value
      localStorage.setItem('navCollapsed', isNavCollapsed.value.toString())
    }

    // 接收子组件的折叠状态更新
    const updateCollapsedState = (newState) => {
      isNavCollapsed.value = newState
      localStorage.setItem('navCollapsed', newState.toString())
    }

    return {
      isNavCollapsed,
      pageTitle,
      toggleNav,
      updateCollapsedState
    }
  }
}
</script>

<style scoped>
.layout-container {
  display: flex;
  width: 100%;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.side-nav-component {
  height: 100vh;
  position: sticky;
  top: 0;
  z-index: 100;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  transition: all 0.3s;
  margin-left: 0;
}

.content-expanded {
  margin-left: -116px; /* 180px - 64px, 侧边栏展开宽度和收缩宽度的差值 */
}

.top-bar {
  display: flex;
  align-items: center;
  padding: 15px 0;
  margin-bottom: 15px;
}

.toggle-nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-right: 15px;
  border: none;
  background-color: #fff;
  cursor: pointer;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toggle-nav-btn:hover {
  background-color: #f9f9f9;
}

.toggle-icon {
  font-size: 16px;
}

.collapse-icon::before {
  content: "◀";
}

.expand-icon::before {
  content: "▶";
}

.page-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.page-content {
  flex: 1;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}
</style>
