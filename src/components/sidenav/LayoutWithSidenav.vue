<template>
  <div class="layout-container">
    <!-- 使用已有的左侧导航栏组件 -->
    <SideNav class="side-nav-component" :is-collapsed="isNavCollapsed" />

    <!-- 右侧内容区 -->
    <div class="main-content" :class="{ 'content-expanded': isNavCollapsed }">
      <!-- 顶部按钮和面包屑 -->
      <div class="top-bar">
        <button class="toggle-nav-btn" @click="toggleNav">
          <i :class="['toggle-icon', isNavCollapsed ? 'expand-icon' : 'collapse-icon']"></i>
        </button>
        <!-- 面包屑插槽 -->
        <slot name="breadcrumb"></slot>
      </div>

      <!-- 页面主要内容 -->
      <div class="page-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import SideNav from '@/components/sidenav/SideNav.vue'

export default {
  name: 'LayoutWithSidenav',
  components: {
    SideNav
  },
  setup() {
    const isNavCollapsed = ref(false)

    // 初始化时从本地存储中获取侧边栏状态
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

    return {
      isNavCollapsed,
      toggleNav
    }
  }
}
</script>

<style scoped>
.layout-container {
  display: flex;
  width: 100%;
  min-height: 100vh;
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
  transition: margin-left 0.3s;
  padding: 0 20px;
}

.content-expanded {
  /* 当侧边栏折叠时，可以调整主内容区域的样式 */
}

.top-bar {
  display: flex;
  align-items: center;
  padding: 10px 0;
  margin-bottom: 15px;
}

.toggle-nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-right: 10px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  border-radius: 4px;
}

.toggle-nav-btn:hover {
  background-color: #f0f0f0;
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

.page-content {
  flex: 1;
}
</style>
