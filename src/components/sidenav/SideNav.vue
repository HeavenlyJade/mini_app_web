<template>
  <div class="sidebar-container" :class="{ 'collapsed': isCollapsed }">
    <div class="sidebar-menu">
      <!-- 所有菜单项使用统一的渲染方式 -->
      <div v-for="(menuItem, index) in menuItems" :key="index" class="menu-group">
        <div class="menu-group-title" @click="toggleSubmenu(index)">
          <div class="title-content">
            <i :class="['nav-icon', menuItem.icon]"></i>
            <span>{{ menuItem.title }}</span>
          </div>
          <!-- 使用Unicode字符的箭头实现 -->
          <span class="arrow-container" v-if="menuItem.children && menuItem.children.length > 0">
            <span class="arrow" :class="{ 'arrow-down': submenuOpen[index] }"></span>
          </span>
        </div>

        <div class="submenu" v-show="submenuOpen[index] && menuItem.children && menuItem.children.length > 0">
          <div v-for="(subItem, subIndex) in menuItem.children" :key="subIndex" class="submenu-item"
            :class="{ 'active': currentPath === subItem.path }" @click="navigateTo(subItem.path)">
            <i :class="['nav-icon', subItem.icon]"></i>
            <span>{{ subItem.title }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 接收父组件传递的折叠状态
const props = defineProps({
  isCollapsed: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()
const route = useRoute()

// 组件内部的折叠状态（如果没有接收到props）
const localCollapsed = ref(false)

// 计算实际使用的折叠状态（优先使用props）
const actualCollapsed = computed(() => {
  return props.isCollapsed !== undefined ? props.isCollapsed : localCollapsed.value
})

// 监听props变化，同步到本地状态
watch(() => props.isCollapsed, (newVal) => {
  if (newVal !== undefined) {
    localCollapsed.value = newVal
  }
})

// Track which submenus are open
const submenuOpen: Record<string | number, boolean> = reactive({})

// Current active path
const currentPath = computed(() => route.path)

// Menu data structure - 修改为符合截图的菜单结构
const menuItems = ref([
  {
    title: '首页',
    icon: 'home-icon',
    path: '/', // 首页直接作为一个链接，没有子菜单
    children: [{
      title: '仪表盘',
      icon: 'dashboard-icon',
      path: '/home' // 仪表盘也直接作为一个链接
    }
    ] // 没有子菜单
  },

  {
    title: '商品',
    icon: 'product-icon',
    children: [
    {
        title: 'Banner管理',
        icon: 'list-icon',
        path: '/marketing/banner'
      },
      {
        title: '门店分类管理',
        icon: 'list-icon',
        path: '/shop/store_category/list'
      },
      {
        title: '门店管理',
        icon: 'list-icon',
        path: '/shop/store/list'
      },
      {
        title: '门店新增',
        icon: 'list-icon',
        path: '/shop/store/add'
      },

      {
        title: '商品列表',
        icon: 'list-icon',
        path: '/shop/products/list'
      },
      {
        title: '添加商品',
        icon: 'add-icon',
        path: '/shop/products/add'
      },
      {
        title: '商品分类',
        icon: 'category-icon',
        path: '/shop/products/categories'
      },
      {
        title: '规格尺寸',
        icon: 'type-icon',
        path: '/shop/products/specification_size'
      },
      // {
      //   title: '品牌管理',
      //   icon: 'brand-icon',
      //   path: '/products/brands'
      // }
    ]
  },
  {
    title: '订单',
    icon: 'order-icon',
    children: [
      {
        title: '订单列表',
        icon: 'list-icon',
        path: '/orders/list'
      },
      {
        title: '订单设置',
        icon: 'setting-icon',
        path: '/orders/settings'
      },
      {
        title: '退货申请处理',
        icon: 'return-icon',
        path: '/orders/returns'
      },
      {
        title: '退货原因设置',
        icon: 'reason-icon',
        path: '/orders/return-reasons'
      }
    ]
  },
  {
    title: '分销管理',
    icon: 'marketing-icon',
    children: [
      {
        title: '分销列表',
        icon: 'flash-icon',
        path: '/distribution/user_list'
      },
      {
        title: '分销等级',
        icon: 'coupon-icon',
        path: '/distribution/levels'
      },
      {
        title: '分销配置',
        icon: 'recommend-icon',
        path: '/distribution/config'
      },
      {
        title: '分销收入',
        icon: 'popular-icon',
        path: '/distribution/income'
      }
    ]
  },
  // {
  //   title: '营销',
  //   icon: 'marketing-icon',
  //   children: [
  //     {
  //       title: '秒杀活动列表',
  //       icon: 'flash-icon',
  //       path: '/marketing/flash-sale'
  //     },
  //     {
  //       title: '优惠券列表',
  //       icon: 'coupon-icon',
  //       path: '/marketing/coupons'
  //     },
  //     {
  //       title: '品牌推荐',
  //       icon: 'recommend-icon',
  //       path: '/marketing/brand-recommend'
  //     },
  //     {
  //       title: '新品推荐',
  //       icon: 'new-icon',
  //       path: '/marketing/new-product'
  //     },
  //     {
  //       title: '人气推荐',
  //       icon: 'popular-icon',
  //       path: '/marketing/popular'
  //     },
  //     {
  //       title: '专题推荐',
  //       icon: 'special-icon',
  //       path: '/marketing/special'
  //     },
  //     {
  //       title: '广告列表',
  //       icon: 'ad-icon',
  //       path: '/marketing/ads'
  //     }
  //   ]
  // },
  {
    title: '权限',
    icon: 'permission-icon',
    children: [
    {
        title: '员工列表',
        icon: 'user-icon',
        path: '/permissions/staff'
      },
      {
        title: '用户列表',
        icon: 'user-icon',
        path: '/employee/manage'
      },
      {
        title: '用户地址',
        icon: 'user-icon',
        path: '/permissions/users_address'
      },
      {
        title: '角色列表',
        icon: 'role-icon',
        path: '/permissions/roles'
      },
      // {
      //   title: '菜单列表',
      //   icon: 'menu-icon',
      //   path: '/permissions/menus' 
      // },
      // {
      //   title: '资源列表',
      //   icon: 'resource-icon',
      //   path: '/permissions/resources'
      // },
      {
        title: '名片管理',
        icon: 'resource-icon',
        path: '/employee/namecards'
      },
    ]
  }
])

// 定义emit事件，用于向父组件通知折叠状态变化
const emit = defineEmits(['update:isCollapsed'])

// Toggle sidebar collapse state
function toggleCollapse() {
  if (props.isCollapsed !== undefined) {
    // 如果使用props，则通过emit更新
    emit('update:isCollapsed', !props.isCollapsed)
  } else {
    // 否则更新本地状态
    localCollapsed.value = !localCollapsed.value
  }
}

// Toggle submenu open/close state
function toggleSubmenu(index: any) {
  // 如果菜单项有子菜单，则切换展开状态
  if (menuItems.value[index].children && menuItems.value[index].children.length > 0) {
    submenuOpen[index] = !submenuOpen[index]
  } else {
    // 如果没有子菜单，直接导航到该菜单项的路径
    navigateTo(menuItems.value[index].path)
  }
}

// Navigate to a route
function navigateTo(path: any) {
  router.push(path)
}

// 初始化子菜单展开状态
onMounted(() => {
  // 检查当前路径是否在任何子菜单中，如果是，则展开对应父菜单
  menuItems.value.forEach((item, index) => {
    // 检查当前路径是否与菜单项的路径匹配
    if (item.path === currentPath.value) {
      // 高亮显示当前菜单项，如果需要的话
    }

    // 检查子菜单
    if (item.children && item.children.length > 0) {
      const hasActiveChild = item.children.some(child => currentPath.value === child.path);
      if (hasActiveChild) {
        submenuOpen[index] = true;
      }
    }
  });
})
</script>

<style lang="less" scoped>
.sidebar-container {
  display: flex;
  flex-direction: column;
  width: 180px;
  height: 100vh;
  background-color: #283142;
  color: #a6b4cd;
  overflow-y: auto;
  transition: width 0.3s;

  &.collapsed {
    width: 64px;

    .sidebar-header span,
    .menu-group-title span,
    .submenu-item span,
    .arrow-container {
      display: none;
    }

    .submenu {
      padding-left: 0;
    }
  }
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 60px;
  padding: 0 16px;
  background-color: #283142;
  border-bottom: 1px solid #1c2433;

  .collapse-icon {
    cursor: pointer;
    font-size: 16px;

    &::before {
      content: "❮";
    }
  }
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.menu-group {
  display: flex;
  flex-direction: column;
}

.menu-group-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 0 16px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #232b3a;
  }

  .title-content {
    display: flex;
    align-items: center;
  }

  .nav-icon {
    margin-right: 10px;
    font-size: 16px;
  }
}

/* 箭头容器样式 */
.arrow-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

/* 使用SVG字符实现箭头 - 避免任何渲染问题 */
.arrow-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  pointer-events: none;
  /* 防止鼠标悬停效果 */
}

.arrow {
  font-size: 12px;
  color: #a6b4cd;
  transition: transform 0.3s ease;
  display: inline-block;
}

.arrow:after {
  content: '▶';
  /* 使用Unicode右箭头字符 */
  display: block;
}

/* 箭头展开状态 */
.arrow.arrow-down {
  transform: rotate(90deg);
  /* 旋转90度指向下方 */
}

.submenu {
  display: flex;
  flex-direction: column;
  padding-left: 16px;
}

.submenu-item {
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 16px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;

  &:hover {
    color: #fff;
    background-color: #1e2736;
  }

  &.active {
    color: #409eff;
    background-color: #1e2736;
  }

  .nav-icon {
    margin-right: 10px;
    font-size: 16px;
  }
}

// Icon styles
.nav-icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

.dashboard-icon::before {
  content: "⚙️";
}

.tutorial-icon::before {
  content: "📚";
}

.document-icon::before {
  content: "📄";
}

.video-icon::before {
  content: "🎬";
}

.product-icon::before {
  content: "📦";
}

.list-icon::before {
  content: "📋";
}

.add-icon::before {
  content: "➕";
}

.category-icon::before {
  content: "🗂️";
}

.type-icon::before {
  content: "🏷️";
}

.brand-icon::before {
  content: "🏢";
}

.order-icon::before {
  content: "📝";
}

.setting-icon::before {
  content: "⚙️";
}

.return-icon::before {
  content: "↩️";
}

.reason-icon::before {
  content: "❓";
}

.marketing-icon::before {
  content: "📢";
}

.flash-icon::before {
  content: "⚡";
}

.coupon-icon::before {
  content: "🎟️";
}

.recommend-icon::before {
  content: "👍";
}

.new-icon::before {
  content: "🆕";
}

.popular-icon::before {
  content: "🔥";
}

.special-icon::before {
  content: "🌟";
}

.ad-icon::before {
  content: "📣";
}

.permission-icon::before {
  content: "🔒";
}

.user-icon::before {
  content: "👤";
}

.role-icon::before {
  content: "👥";
}

.menu-icon::before {
  content: "📑";
}

.resource-icon::before {
  content: "📁";
}

.home-icon::before {
  content: "🏠";
}
</style>
