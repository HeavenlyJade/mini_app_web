<template>
    <div class="page-container">
      <div class="page-header">
        <h2 class="page-title">分销收入记录</h2>
      </div>
  
      <div class="page-content">
        <!-- 搜索区域 -->
        <div class="search-box">
          <el-form :inline="true" :model="searchForm">
            <el-form-item label="订单信息">
              <el-input 
                v-model="searchForm.orderInfo" 
                placeholder="请输入订单号/编号" 
                clearable
              />
            </el-form-item>
            <el-form-item label="买家信息">
              <el-input 
                v-model="searchForm.buyerInfo" 
                placeholder="用户账号/姓名/手机号码" 
                clearable
              />
            </el-form-item>
            <el-form-item label="分销商信息">
              <el-input 
                v-model="searchForm.distributorInfo" 
                placeholder="分销商姓名/账号/手机号码" 
                clearable
              />
            </el-form-item>
            <el-form-item label="商品信息">
              <el-input 
                v-model="searchForm.productInfo" 
                placeholder="商品名称/编码" 
                clearable
              />
            </el-form-item>
            <el-form-item label="佣金状态">
              <el-select v-model="searchForm.status" placeholder="全部" clearable>
                <el-option label="全部" value="" />
                <el-option label="待结算" value="pending" />
                <el-option label="已结算" value="settled" />
                <el-option label="已提现" value="withdrawn" />
                <el-option label="已失效" value="invalid" />
              </el-select>
            </el-form-item>
            <el-form-item label="下单时间">
              <el-date-picker
                v-model="searchForm.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                :shortcuts="dateShortcuts"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button @click="resetSearch">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
  
        <!-- 统计卡片区域 -->
        <div class="stats-cards">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="6">
              <div class="stat-card">
                <div class="stat-title">总佣金</div>
                <div class="stat-value">¥{{ stats.totalCommission || '0.00' }}</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6">
              <div class="stat-card">
                <div class="stat-title">已结算佣金</div>
                <div class="stat-value">¥{{ stats.settledCommission || '0.00' }}</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6">
              <div class="stat-card">
                <div class="stat-title">待结算佣金</div>
                <div class="stat-value">¥{{ stats.pendingCommission || '0.00' }}</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6">
              <div class="stat-card">
                <div class="stat-title">订单总数</div>
                <div class="stat-value">{{ stats.totalOrders || '0' }}</div>
              </div>
            </el-col>
          </el-row>
        </div>
  
        <!-- 表格区域 -->
        <div class="table-container">
          <el-table
            :data="tableData"
            border
            v-loading="loading"
            style="width: 100%"
          >
            <el-table-column label="买家信息" min-width="140">
              <template #default="scope">
                <div class="user-info">
                  <el-avatar :size="30" :src="scope.row.buyer_avatar"></el-avatar>
                  <div class="user-detail">
                    <div class="username">{{ scope.row.buyer_name }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="order_no" label="订单编号" min-width="180" />
            <el-table-column label="商品信息" min-width="200">
              <template #default="scope">
                <div class="product-info">
                  <div class="product-image">
                    <el-image 
                      :src="scope.row.product_image" 
                      :preview-src-list="[scope.row.product_image]"
                      fit="cover"
                      style="width: 50px; height: 50px;">
                    </el-image>
                  </div>
                  <div class="product-detail">
                    <div class="product-name">{{ scope.row.product_name }}</div>
                    <div class="product-price">¥{{ scope.row.product_price }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="quantity" label="购买数量" width="100" align="center" />
            <el-table-column label="分销等级" width="120">
              <template #default="scope">
                <el-tag :type="scope.row.level === '一级分销' ? 'primary' : 'success'">
                  {{ scope.row.level }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="分销商信息" min-width="140">
              <template #default="scope">
                <div class="user-info">
                  <el-avatar :size="30" :src="scope.row.distributor_avatar"></el-avatar>
                  <div class="user-detail">
                    <div class="username">{{ scope.row.distributor_name }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="commission_ratio" label="佣金比例(%)" width="120" align="center" />
            <el-table-column prop="commission_amount" label="佣金金额" width="120" align="center">
              <template #default="scope">
                <span class="commission-amount">¥{{ scope.row.commission_amount }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100" align="center">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)">
                  {{ getStatusText(scope.row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="create_time" label="创建时间" min-width="160" />
          </el-table>
  
          <!-- 分页 -->
          <div class="pagination-box">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[10, 20, 50, 100]"
              :total="total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ElMessage } from 'element-plus'
  import http from '@/utils/http'
  
  export default {
    name: 'DistributionIncome',
    data() {
      return {
        // 搜索表单
        searchForm: {
          orderInfo: '',
          buyerInfo: '',
          distributorInfo: '',
          productInfo: '',
          status: '',
          dateRange: []
        },
        
        // 日期快捷选项
        dateShortcuts: [
          {
            text: '最近一周',
            value: () => {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              return [start, end]
            }
          },
          {
            text: '最近一个月',
            value: () => {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              return [start, end]
            }
          },
          {
            text: '最近三个月',
            value: () => {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              return [start, end]
            }
          }
        ],
        
        // 统计数据
        stats: {
          totalCommission: '0.00',
          settledCommission: '0.00',
          pendingCommission: '0.00',
          totalOrders: 0
        },
        
        // 表格数据
        loading: false,
        tableData: [],
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    },
    created() {
      this.fetchStats()
      this.fetchData()
    },
    methods: {
      // 获取统计数据
      async fetchStats() {
        try {
          const response = await http.get('/api/v1/mini_core/distribution/income/stats', {
            params: this.buildSearchParams()
          })
          
          if (response.data && response.data.code === 200) {
            this.stats = response.data.data
          }
        } catch (error) {
          console.error('获取统计数据失败:', error)
        }
      },
      
      // 构建搜索参数
      buildSearchParams() {
        const params = {
          page: this.currentPage,
          size: this.pageSize
        }
        
        if (this.searchForm.orderInfo) {
          params.order_info = this.searchForm.orderInfo
        }
        
        if (this.searchForm.buyerInfo) {
          params.buyer_info = this.searchForm.buyerInfo
        }
        
        if (this.searchForm.distributorInfo) {
          params.distributor_info = this.searchForm.distributorInfo
        }
        
        if (this.searchForm.productInfo) {
          params.product_info = this.searchForm.productInfo
        }
        
        if (this.searchForm.status) {
          params.status = this.searchForm.status
        }
        
        if (this.searchForm.dateRange && this.searchForm.dateRange.length === 2) {
          params.start_date = this.searchForm.dateRange[0]
          params.end_date = this.searchForm.dateRange[1]
        }
        
        return params
      },
      
      // 获取表格数据
      async fetchData() {
        this.loading = true
        try {
          const response = await http.get('/api/v1/mini_core/distribution/income', {
            params: this.buildSearchParams()
          })
          
          if (response.data && response.data.code === 200) {
            this.tableData = response.data.data
            this.total = response.data.total
          } else {
            ElMessage.error('获取数据失败')
          }
        } catch (error) {
          console.error('获取分销收入记录失败:', error)
          ElMessage.error('获取数据失败')
        } finally {
          this.loading = false
        }
      },
      
      // 获取状态类型
      getStatusType(status) {
        const statusMap = {
          'pending': 'warning',
          'settled': 'success',
          'withdrawn': 'primary',
          'invalid': 'danger'
        }
        return statusMap[status] || 'info'
      },
      
      // 获取状态文本
      getStatusText(status) {
        const statusMap = {
          'pending': '待结算',
          'settled': '已结算',
          'withdrawn': '已提现',
          'invalid': '已失效'
        }
        return statusMap[status] || '未知'
      },
      
      // 搜索处理
      handleSearch() {
        this.currentPage = 1
        this.fetchStats()
        this.fetchData()
      },
      
      // 重置搜索
      resetSearch() {
        this.searchForm = {
          orderInfo: '',
          buyerInfo: '',
          distributorInfo: '',
          productInfo: '',
          status: '',
          dateRange: []
        }
        this.handleSearch()
      },
      
      // 分页大小变化
      handleSizeChange(val) {
        this.pageSize = val
        this.currentPage = 1
        this.fetchData()
      },
      
      // 页码变化
      handleCurrentChange(val) {
        this.currentPage = val
        this.fetchData()
      }
    }
  }
  </script>
  
  <style scoped>
  .page-container {
    width: 100%;
  }
  
  .page-header {
    margin-bottom: 20px;
  }
  
  .page-title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin: 0;
  }
  
  .page-content {
    background-color: #fff;
    border-radius: 4px;
  }
  
  .search-box {
    padding: 16px;
    background-color: #f8f9fa;
    border-radius: 4px;
    margin-bottom: 20px;
  }
  
  .stats-cards {
    margin-bottom: 20px;
  }
  
  .stat-card {
    background-color: #fff;
    border-radius: 4px;
    padding: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    text-align: center;
  }
  
  .stat-title {
    font-size: 14px;
    color: #606266;
    margin-bottom: 10px;
  }
  
  .stat-value {
    font-size: 24px;
    font-weight: bold;
    color: #409EFF;
  }
  
  .table-container {
    padding: 0 16px 16px;
  }
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .user-detail {
    display: flex;
    flex-direction: column;
  }
  
  .username {
    font-weight: bold;
    line-height: 1.2;
  }
  
  .product-info {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .product-detail {
    display: flex;
    flex-direction: column;
  }
  
  .product-name {
    font-weight: bold;
    line-height: 1.2;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .product-price {
    font-size: 12px;
    color: #f56c6c;
  }
  
  .commission-amount {
    color: #f56c6c;
    font-weight: bold;
  }
  
  .pagination-box {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
  
  @media (max-width: 768px) {
    .search-box {
      padding: 10px;
    }
    
    :deep(.el-form--inline .el-form-item) {
      display: block;
      margin-right: 0;
      width: 100%;
    }
    
    .stat-card {
      padding: 15px;
    }
    
    .stat-value {
      font-size: 20px;
    }
    
    .table-container {
      padding: 0 10px 10px;
      overflow-x: auto;
    }
  }
  </style>