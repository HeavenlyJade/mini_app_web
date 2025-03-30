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
        <h1 class="page-title">{{ pageTitle }}</h1>
        <div class="user-dropdown">
          <button class="user-btn" @click="toggleUserMenu">
            {{ userName }}
            <i class="dropdown-icon" :class="{ 'dropdown-open': isUserMenuOpen }"></i>
          </button>

          <!-- 下拉菜单 -->
          <div class="dropdown-menu" v-show="isUserMenuOpen">
            <router-link to="/" class="menu-item">首页</router-link>
            <router-link to="/profile" class="menu-item">修改密码</router-link>
            <div class="menu-item logout" @click="logout">切换账号</div>
            <div class="menu-item logout" @click="logout">退出</div>
          </div>
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
import { useRoute, useRouter } from 'vue-router'
import SideNav from '@/components/sidenav/SideNav.vue'

export default {
  name: 'MainLayout',
  components: {
    SideNav
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const isNavCollapsed = ref(false)
    const isUserMenuOpen = ref(false)
    const userInfo = localStorage.getItem('userInfo')
    const parsedUserInfo = userInfo ? JSON.parse(userInfo) : { username: '用户名' }
    const userName = ref(parsedUserInfo.username)
    
    const toggleUserMenu = () => {
      isUserMenuOpen.value = !isUserMenuOpen.value
    }
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
      document.addEventListener('click', (e) => {
        const userDropdown = document.querySelector('.user-dropdown')
        if (userDropdown && !userDropdown.contains(e.target) && isUserMenuOpen.value) {
          isUserMenuOpen.value = false
        }
      })
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
    // 退出登录
    const logout = () => {
      // 实现登出逻辑，例如清除token、重定向到登录页等
      console.log('用户登出')
      // 清理所有认证相关信息
      localStorage.removeItem('token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('isLogin')
      localStorage.removeItem('userInfo')
      
      // 关闭下拉菜单
      isUserMenuOpen.value = false
      
      // 使用router进行导航
      router.push('/login')
    }

    return  {
        isNavCollapsed,
        pageTitle,
        toggleNav,
        updateCollapsedState,
        isUserMenuOpen,
        userName,
        toggleUserMenu,
        logout
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
  margin-left: 0;
  /* 180px - 64px, 侧边栏展开宽度和收缩宽度的差值 */
}

.top-bar {
  display: flex;
  align-items: center;
  padding: 15px 0;
  margin-bottom: 15px;
  justify-content: space-between;
  /* 修改为两端对齐 */

}

.toggle-nav-btn {
  position: relative;
  /* 添加相对定位 */
  z-index: 101;
  /* 确保按钮在最上层，高于侧边栏 */

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


.user-dropdown {
  position: relative;
  margin-left: auto;
  /* 将用户按钮推到右侧 */
}


.user-btn {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 12px;
  font-size: 14px;
  color: #333;
  border-radius: 4px;
}

.user-btn:hover {
  background-color: #f0f0f0;
}

.dropdown-icon {
  margin-left: 5px;
  border: solid #666;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(45deg);
  transition: transform 0.2s;
}

.dropdown-icon.dropdown-open {
  transform: rotate(-135deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  width: 150px;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
  z-index: 1000;
}

.menu-item {
  display: block;
  padding: 12px 16px;
  color: #333;
  text-decoration: none;
  font-size: 14px;
  text-align: center;
  transition: background 0.2s;
}

.menu-item:hover {
  background-color: #f7f7f7;
}

.logout {
  color: #f56c6c;
  cursor: pointer;
}
</style>
