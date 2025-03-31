<template>
  <div class="dashboard">
    <!-- 顶部页面信息 -->
    <div class="dashboard-header">
      <h2 class="page-title">仪表盘</h2>
    </div>

    <!-- Dashboard Cards -->
    <div class="dashboard-cards">
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
</template>

<script lang="ts" setup name="Dashboard">
import { onMounted } from 'vue'

// 加载仪表盘数据
function loadDashboardData () {
  // 这里可以调用API获取实际数据
  console.log('Loading dashboard data...')
}

onMounted(() => {
  loadDashboardData()
})
</script>

<style lang="less" scoped>
.dashboard {
  width: 100%;
}

.dashboard-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
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
