<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">分销用户详情</h2>
      <div class="header-actions">
        <el-button @click="goBack">返回列表</el-button>
        <el-button type="primary" @click="handleEdit">编辑</el-button>
      </div>
    </div>

    <div class="page-content" v-loading="loading">
      <!-- 用户基本信息卡片 -->
      <div class="info-card">
        <div class="user-profile">
          <el-avatar :size="64" :src="userInfo.avatar || defaultAvatar"></el-avatar>
          <div class="user-basic-info">
            <h3 class="user-name">{{ userInfo.real_name || '未设置姓名' }}</h3>
            <div class="user-status">
              <el-tag :type="userInfo.identity === 1 ? 'success' : 'info'">
                {{ userInfo.identity === 1 ? '分销员' : '普通用户' }}
              </el-tag>
              <el-tag :type="userInfo.status === 1 ? 'success' : 'warning'" class="status-tag">
                {{ userInfo.status === 1 ? '已审核' : '未审核' }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>

      <!-- 财务统计卡片 -->
      <div class="stats-card">
        <el-row :gutter="20">
          <el-col :span="4">
            <div class="stat-item">
              <div class="stat-value">¥{{ stats.totalCommission || '0.00' }}</div>
              <div class="stat-label">全部佣金</div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="stat-item">
              <div class="stat-value">¥{{ stats.pendingCommission || '0.00' }}</div>
              <div class="stat-label">待提现佣金</div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="stat-item">
              <div class="stat-value">¥{{ stats.withdrawnCommission || '0.00' }}</div>
              <div class="stat-label">已提现佣金</div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="stat-item">
              <div class="stat-value">¥{{ stats.settledCommission || '0.00' }}</div>
              <div class="stat-label">待结算佣金</div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="stat-item">
              <div class="stat-value">{{ stats.orderCount || '0' }}</div>
              <div class="stat-label">收入笔数</div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="stat-item">
              <div class="stat-value">{{ stats.teamCount || '0' }}</div>
              <div class="stat-label">粉丝数量</div>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 用户详细信息 -->
      <el-tabs v-model="activeTab" class="detail-tabs">
        <el-tab-pane label="基本信息" name="basic">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="用户ID">{{ userInfo.id }}</el-descriptions-item>
            <el-descriptions-item label="SN编号">{{ userInfo.sn }}</el-descriptions-item>
            <el-descriptions-item label="真实姓名">{{ userInfo.real_name }}</el-descriptions-item>
            <el-descriptions-item label="手机号">{{ userInfo.mobile }}</el-descriptions-item>
            <el-descriptions-item label="等级">{{ userInfo.grade_name }}</el-descriptions-item>
            <el-descriptions-item label="身份">
              {{ userInfo.identity === 1 ? '分销员' : '普通用户' }}
            </el-descriptions-item>
            <el-descriptions-item label="状态">
              {{ userInfo.status === 1 ? '已审核' : '未审核' }}
            </el-descriptions-item>
            <el-descriptions-item label="上级ID">
              {{ userInfo.user_father_id || '无上级' }}
            </el-descriptions-item>
            <el-descriptions-item label="备注">{{ userInfo.remark || '-' }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">
              {{ formatTime(userInfo.create_time) }}
            </el-descriptions-item>
            <el-descriptions-item label="审核时间">
              {{ userInfo.audit_time ? formatTime(userInfo.audit_time) : '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="更新时间">
              {{ formatTime(userInfo.update_time) }}
            </el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>

        <el-tab-pane label="粉丝列表" name="team">
          <div class="team-list">
            <el-tabs v-model="teamTab" class="team-tabs">
              <el-tab-pane label="一级粉丝" name="level1"></el-tab-pane>
              <el-tab-pane label="二级粉丝" name="level2"></el-tab-pane>
            </el-tabs>

            <el-table
              :data="teamList"
              border
              v-loading="teamLoading"
              style="width: 100%"
            >
              <el-table-column type="index" label="序号" width="80" />
              <el-table-column label="用户信息" min-width="180">
                <template #default="scope">
                  <div class="user-info">
                    <el-avatar :size="30" :src="scope.row.avatar || defaultAvatar"></el-avatar>
                    <div class="user-detail">
                      <div class="username">{{ scope.row.real_name }}</div>
                      <div class="user-mobile">{{ scope.row.mobile }}</div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="identity" label="身份" width="100">
                <template #default="scope">
                  <el-tag :type="scope.row.identity === 1 ? 'success' : 'info'">
                    {{ scope.row.identity === 1 ? '分销员' : '普通用户' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="pending_commission" label="待提现佣金" width="120" />
              <el-table-column prop="order_count" label="订单数" width="100" />
              <el-table-column prop="create_time" label="加入时间" width="180">
                <template #default="scope">
                  {{ formatTime(scope.row.create_time) }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120" fixed="right">
                <template #default="scope">
                  <el-button link type="primary" @click="viewTeamMember(scope.row)">查看</el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="pagination-box">
              <el-pagination
                v-model:current-page="teamPage"
                v-model:page-size="teamPageSize"
                :page-sizes="[10, 20, 50]"
                :total="teamTotal"
                layout="total, sizes, prev, pager, next"
                @size-change="handleTeamSizeChange"
                @current-change="handleTeamPageChange"
              />
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="佣金记录" name="commission">
          <div class="commission-list">
            <el-table
              :data="commissionList"
              border
              v-loading="commissionLoading"
              style="width: 100%"
            >
              <el-table-column type="index" label="序号" width="80" />
              <el-table-column prop="order_no" label="订单编号" min-width="180" />
              <el-table-column prop="amount" label="佣金金额" width="120">
                <template #default="scope">
                  <span class="amount">¥{{ scope.row.amount }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" width="100">
                <template #default="scope">
                  <el-tag :type="getCommissionStatusType(scope.row.status)">
                    {{ getCommissionStatusText(scope.row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="level" label="等级" width="100">
                <template #default="scope">
                  {{ scope.row.level === 1 ? '一级佣金' : '二级佣金' }}
                </template>
              </el-table-column>
              <el-table-column prop="create_time" label="创建时间" width="180">
                <template #default="scope">
                  {{ formatTime(scope.row.create_time) }}
                </template>
              </el-table-column>
              <el-table-column prop="settle_time" label="结算时间" width="180">
                <template #default="scope">
                  {{ scope.row.settle_time ? formatTime(scope.row.settle_time) : '-' }}
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注" min-width="150" />
            </el-table>

            <!-- 分页 -->
            <div class="pagination-box">
              <el-pagination
                v-model:current-page="commissionPage"
                v-model:page-size="commissionPageSize"
                :page-sizes="[10, 20, 50]"
                :total="commissionTotal"
                layout="total, sizes, prev, pager, next"
                @size-change="handleCommissionSizeChange"
                @current-change="handleCommissionPageChange"
              />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import http from '@/utils/http'

export default {
  name: 'DistributionUserDetail',
  data() {
    return {
      loading: false,
      userId: this.$route.params.id,
      userInfo: {},
      defaultAvatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      
      // 统计数据
      stats: {
        totalCommission: '0.00',
        pendingCommission: '0.00',
        withdrawnCommission: '0.00',
        settledCommission: '0.00',
        orderCount: 0,
        teamCount: 0
      },
      
      // 标签页
      activeTab: 'basic',
      
      // 团队数据
      teamTab: 'level1',
      teamList: [],
      teamLoading: false,
      teamPage: 1,
      teamPageSize: 10,
      teamTotal: 0,
      
      // 佣金记录
      commissionList: [],
      commissionLoading: false,
      commissionPage: 1,
      commissionPageSize: 10,
      commissionTotal: 0
    }
  },
  created() {
    this.fetchUserInfo()
    this.fetchUserStats()
  },
  watch: {
    teamTab() {
      this.teamPage = 1
      this.fetchTeamList()
    },
    activeTab(newVal) {
      if (newVal === 'team') {
        this.fetchTeamList()
      } else if (newVal === 'commission') {
        this.fetchCommissionList()
      }
    }
  },
  methods: {
    // 获取用户基本信息
    async fetchUserInfo() {
      this.loading = true
      try {
        const response = await http.get(`/api/v1/mini_core/distribution/${this.userId}`)
        if (response.data && response.data.code === 200) {
          this.userInfo = response.data.data
        } else {
          ElMessage.error('获取用户信息失败')
        }
      } catch (error) {
        console.error('获取用户信息失败:', error)
        ElMessage.error('获取用户信息失败')
      } finally {
        this.loading = false
      }
    },
    
    // 获取用户统计数据
    async fetchUserStats() {
      try {
        const response = await http.get(`/api/v1/mini_core/distribution/${this.userId}/stats`)
        if (response.data && response.data.code === 200) {
          this.stats = response.data.data
        }
      } catch (error) {
        console.error('获取统计数据失败:', error)
      }
    },
    
    // 获取团队列表
    async fetchTeamList() {
      this.teamLoading = true
      try {
        const level = this.teamTab === 'level1' ? 1 : 2
        const response = await http.get(`/api/v1/mini_core/distribution/${this.userId}/team`, {
          params: {
            level,
            page: this.teamPage,
            size: this.teamPageSize
          }
        })
        
        if (response.data && response.data.code === 200) {
          this.teamList = response.data.data
          this.teamTotal = response.data.total
        }
      } catch (error) {
        console.error('获取团队列表失败:', error)
        ElMessage.error('获取团队列表失败')
      } finally {
        this.teamLoading = false
      }
    },
    
    // 获取佣金记录
    async fetchCommissionList() {
      this.commissionLoading = true
      try {
        const response = await http.get(`/api/v1/mini_core/distribution/${this.userId}/commission`, {
          params: {
            page: this.commissionPage,
            size: this.commissionPageSize
          }
        })
        
        if (response.data && response.data.code === 200) {
          this.commissionList = response.data.data
          this.commissionTotal = response.data.total
        }
      } catch (error) {
        console.error('获取佣金记录失败:', error)
        ElMessage.error('获取佣金记录失败')
      } finally {
        this.commissionLoading = false
      }
    },
    
    // 格式化时间
    formatTime(timeStr) {
      if (!timeStr) return '-'
      try {
        const date = new Date(timeStr)
        return date.toLocaleString()
      } catch (e) {
        return timeStr
      }
    },
    
    // 获取佣金状态类型
    getCommissionStatusType(status) {
      const typeMap = {
        0: 'info',    // 待结算
        1: 'success', // 已结算
        2: 'warning', // 待提现
        3: 'primary'  // 已提现
      }
      return typeMap[status] || 'info'
    },
    
    // 获取佣金状态文本
    getCommissionStatusText(status) {
      const textMap = {
        0: '待结算',
        1: '已结算',
        2: '待提现',
        3: '已提现'
      }
      return textMap[status] || '未知状态'
    },
    
    // 查看团队成员
    viewTeamMember(row) {
      this.$router.push(`/distribution/user/detail/${row.id}`)
    },
    
    // 团队列表分页大小变化
    handleTeamSizeChange(val) {
      this.teamPageSize = val
      this.teamPage = 1
      this.fetchTeamList()
    },
    
    // 团队列表页码变化
    handleTeamPageChange(val) {
      this.teamPage = val
      this.fetchTeamList()
    },
    
    // 佣金记录分页大小变化
    handleCommissionSizeChange(val) {
      this.commissionPageSize = val
      this.commissionPage = 1
      this.fetchCommissionList()
    },
    
    // 佣金记录页码变化
    handleCommissionPageChange(val) {
      this.commissionPage = val
      this.fetchCommissionList()
    },
    
    // 返回列表
    goBack() {
      this.$router.push('/distribution/users')
    },
    
    // 编辑用户
    handleEdit() {
      this.$router.push(`/distribution/user/edit/${this.userId}`)
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
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  padding: 20px;
}

.info-card {
  margin-bottom: 20px;
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 20px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-basic-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.user-name {
  margin: 0 0 10px 0;
  font-size: 20px;
}

.user-status {
  display: flex;
  gap: 10px;
}

.status-tag {
  margin-left: 8px;
}

.stats-card {
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.stat-item {
  text-align: center;
  padding: 10px;
}

.stat-value {
  font-size: 22px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

.detail-tabs {
  margin-top: 20px;
}

.team-list, .commission-list {
  margin-top: 10px;
}

.team-tabs {
  margin-bottom: 20px;
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
}

.user-mobile {
  font-size: 12px;
  color: #909399;
}

.amount {
  color: #f56c6c;
  font-weight: bold;
}

.pagination-box {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-descriptions) {
  margin-bottom: 20px;
}

:deep(.el-descriptions__label) {
  width: 120px;
}
</style>