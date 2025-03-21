<template>
  <div ref="index" class="index">
    <div class="layout-container">
      <!-- 左侧导航栏 -->
      <SideNav class="side-nav-component" :is-collapsed="isNavCollapsed" />

      <!-- 右侧内容区 -->
      <div class="main-content">
        <AwHeader :class="index_header"></AwHeader>
        <div class="banner-wrap">
          <Banner :banner-height="BannerHeight"></Banner>
          <scroll-hint v-scroll-to="{ element: '.wrap-block', duration: 300, easing: 'ease', offset: 1 }"></scroll-hint>
        </div>

        <!-- Dashboard Content -->
        <div class="dashboard-content wrap-block">
          <!-- Top Navigation -->
          <div class="top-nav">
            <div class="nav-title">
              <!-- 添加一个折叠/展开侧边栏的按钮 -->
              <button class="toggle-nav-btn" @click="toggleNav">
                <i :class="['toggle-icon', isNavCollapsed ? 'expand-icon' : 'collapse-icon']"></i>
              </button>
              仪表盘
            </div>
            <div class="user-avatar">
              <img src="/api/placeholder/40/40" alt="user avatar" class="avatar-img" />
            </div>
          </div>

          <!-- Dashboard Cards -->
          <div class="dashboard-cards">
            <div class="card-section">
              <div class="section-title">学习教程</div>
              <div class="cards-container">
                <div class="dashboard-card">
                  <div class="card-title">学习教程</div>
                  <div class="card-content">
                    <a href="#" class="card-link">mall学习教程</a>
                  </div>
                </div>
                <div class="dashboard-card">
                  <div class="card-title">视频教程</div>
                  <div class="card-content">
                    <a href="#" class="card-link">mall视频教程（2023）</a>
                  </div>
                </div>
                <div class="dashboard-card">
                  <div class="card-title">点Star支持项目</div>
                  <div class="card-content">
                    <a href="#" class="card-link">mall项目</a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Order and Sales Summary -->
            <div class="card-section">
              <div class="cards-container">
                <div class="dashboard-card">
                  <div class="card-content">
                    <div class="icon-container">
                      <i class="order-icon"></i>
                    </div>
                    <div class="stat-content">
                      <div class="stat-title">今日订单总数</div>
                      <div class="stat-value">200</div>
                    </div>
                  </div>
                </div>
                <div class="dashboard-card">
                  <div class="card-content">
                    <div class="icon-container">
                      <i class="sales-icon"></i>
                    </div>
                    <div class="stat-content">
                      <div class="stat-title">今日销售总额</div>
                      <div class="stat-value">¥ 5000.00</div>
                    </div>
                  </div>
                </div>
                <div class="dashboard-card">
                  <div class="card-content">
                    <div class="icon-container">
                      <i class="yesterday-icon"></i>
                    </div>
                    <div class="stat-content">
                      <div class="stat-title">昨日销售总额</div>
                      <div class="stat-value">¥ 5000.00</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pending Tasks -->
            <div class="card-section">
              <div class="section-title">待处理事务</div>
              <div class="tasks-container">
                <div class="task-row">
                  <div class="task-item">
                    <span class="task-name">待付款订单</span>
                    <span class="task-count">(10)</span>
                  </div>
                  <div class="task-item">
                    <span class="task-name">已完成订单</span>
                    <span class="task-count">(10)</span>
                  </div>
                  <div class="task-item">
                    <span class="task-name">待确认收货订单</span>
                    <span class="task-count">(10)</span>
                  </div>
                </div>
                <div class="task-row">
                  <div class="task-item">
                    <span class="task-name">待发货订单</span>
                    <span class="task-count">(10)</span>
                  </div>
                  <div class="task-item">
                    <span class="task-name">新缺货登记</span>
                    <span class="task-count">(10)</span>
                  </div>
                  <div class="task-item">
                    <span class="task-name">待处理退款申请</span>
                    <span class="task-count">(10)</span>
                  </div>
                </div>
                <div class="task-row">
                  <div class="task-item">
                    <span class="task-name">已发货订单</span>
                    <span class="task-count">(10)</span>
                  </div>
                  <div class="task-item">
                    <span class="task-name">待处理退货订单</span>
                    <span class="task-count">(10)</span>
                  </div>
                  <div class="task-item">
                    <span class="task-name">广告位即将到期</span>
                    <span class="task-count">(10)</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Product and User Statistics -->
            <div class="stats-container">
              <div class="stats-card">
                <div class="card-title">商品总览</div>
                <div class="stats-grid">
                  <div class="stat-item">
                    <div class="stat-value product-value">100</div>
                    <div class="stat-label">已下架</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value product-value">400</div>
                    <div class="stat-label">已上架</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value product-value">50</div>
                    <div class="stat-label">库存紧张</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value product-value">500</div>
                    <div class="stat-label">全部商品</div>
                  </div>
                </div>
              </div>

              <div class="stats-card">
                <div class="card-title">用户总览</div>
                <div class="stats-grid">
                  <div class="stat-item">
                    <div class="stat-value user-value">100</div>
                    <div class="stat-label">今日新增</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value user-value">200</div>
                    <div class="stat-label">昨日新增</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value user-value">1000</div>
                    <div class="stat-label">本月新增</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value user-value">5000</div>
                    <div class="stat-label">会员总数</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Order Statistics -->
            <div class="card-section">
              <div class="section-title">订单统计</div>
              <div class="order-stats-container">
                <div class="order-stats-summary">
                  <div class="order-stat-item">
                    <div class="stat-label">本月订单总数</div>
                    <div class="stat-value">10000</div>
                    <div class="stat-change positive">+10% 同比上月</div>
                  </div>
                  <div class="order-stat-item">
                    <div class="stat-label">本周订单总数</div>
                    <div class="stat-value">1000</div>
                    <div class="stat-change negative">-10% 同比上周</div>
                  </div>
                  <div class="order-stat-item">
                    <div class="stat-label">本月销售总额</div>
                    <div class="stat-value">100000</div>
                    <div class="stat-change positive">+10% 同比上月</div>
                  </div>
                  <div class="order-stat-item">
                    <div class="stat-label">本周销售总额</div>
                    <div class="stat-value">50000</div>
                    <div class="stat-change negative">-10% 同比上周</div>
                  </div>
                </div>
                <div class="chart-container">
                  <div class="date-range">
                    <span>2018-11-01</span>
                    <span>至</span>
                    <span>2018-11-08</span>
                  </div>
                  <div class="order-chart">
                    <!-- Chart would go here, using a placeholder for now -->
                    <div class="chart-placeholder"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="Home">
import { onMounted, onUnmounted, ref } from 'vue'
import mainStore from '@/store'
import SideNav from '@/components/sidenav/SideNav.vue' // 导入 SideNav 组件

const index_header = ref('')
const BannerHeight = ref(0)
const scrollTop = ref(0)
const isNavCollapsed = ref(false) // 侧边栏折叠状态

// 切换侧边栏折叠状态
function toggleNav () {
  isNavCollapsed.value = !isNavCollapsed.value
  // 可以选择是否将折叠状态保存到 localStorage
  localStorage.setItem('navCollapsed', isNavCollapsed.value.toString())
}
onMounted(() => {
  // 从 localStorage 恢复侧边栏折叠状态
  const savedCollapsedState = localStorage.getItem('navCollapsed')
  if (savedCollapsedState !== null) {
    isNavCollapsed.value = savedCollapsedState === 'true'
  }

  window.addEventListener('resize', setBannerHeight)
  setBannerHeight()
  window.addEventListener('scroll', scrollHandle)

  loadDashboardData()
})

onUnmounted(() => {
  window.removeEventListener('resize', setBannerHeight)
  window.removeEventListener('scroll', scrollHandle)
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

// 加载仪表盘数据
function loadDashboardData () {
  // 这里可以调用API获取实际数据
  console.log('Loading dashboard data...')
}
</script>

<style lang="less" scoped>
.index {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f7fa;
}

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
  overflow-x: hidden;
  transition: margin-left 0.3s;
}

.banner-wrap {
  position: relative;
  width: 100%;
}

.dashboard-content {
  padding: 20px;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
}

.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.nav-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  color: #333;
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

  &:hover {
    background-color: #f0f0f0;
  }
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

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #e1e1e1;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dashboard-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.dashboard-card {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 15px;
}

.card-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.card-content {
  display: flex;
  align-items: center;
}

.card-link {
  color: #1890ff;
  text-decoration: none;
  font-size: 14px;
}

.card-link:hover {
  text-decoration: underline;
}

.icon-container {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e6f7ff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.order-icon::before {
  content: "📋";
}

.sales-icon::before {
  content: "💰";
}

.yesterday-icon::before {
  content: "📊";
}

.stat-content {
  flex: 1;
}

.stat-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.tasks-container {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 15px;
}

.task-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 15px;
}

.task-row:last-child {
  margin-bottom: 0;
}

.task-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.task-name {
  color: #333;
  font-size: 14px;
}

.task-count {
  color: #ff4d4f;
  font-size: 14px;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.stats-card {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 15px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  text-align: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.product-value {
  color: #1890ff;
}

.user-value {
  color: #52c41a;
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}

.order-stats-container {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 15px;
  display: flex;
}

.order-stats-summary {
  width: 30%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: 20px;
  border-right: 1px solid #f0f0f0;
}

.order-stat-item {
  margin-bottom: 15px;
}

.order-stat-item:last-child {
  margin-bottom: 0;
}

.stat-change {
  font-size: 12px;
  margin-top: 5px;
}

.positive {
  color: #52c41a;
}

.negative {
  color: #ff4d4f;
}

.chart-container {
  flex: 1;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
}

.date-range {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 5px;
  margin-bottom: 15px;
  font-size: 12px;
  color: #666;
}

.chart-placeholder {
  height: 300px;
  background: linear-gradient(180deg, rgba(24, 144, 255, 0.1) 0%, rgba(31, 222, 130, 0.1) 100%);
  border-radius: 4px;
  position: relative;
}

.chart-placeholder::after {
  content: "订单数据图表";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #999;
  font-size: 14px;
}

@media (max-width: 992px) {
  .cards-container {
    grid-template-columns: repeat(2, 1fr);
  }

  .task-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .stats-container {
    grid-template-columns: 1fr;
  }

  .order-stats-container {
    flex-direction: column;
  }

  .order-stats-summary {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #f0f0f0;
    padding-right: 0;
    padding-bottom: 15px;
    margin-bottom: 15px;
  }

  .chart-container {
    padding-left: 0;
  }
}

@media (max-width: 768px) {
  .cards-container {
    grid-template-columns: 1fr;
  }

  .task-row {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
