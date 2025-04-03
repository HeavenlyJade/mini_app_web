<template>
    <div class="page-container">
      <div class="page-header">
        <h2 class="page-title">分销用户列表</h2>
      </div>
  
      <div class="page-content">
        <!-- 搜索区域 -->
        <div class="search-box">
          <el-form :inline="true" :model="searchForm">
            <el-form-item label="用户信息">
              <el-input 
                v-model="searchForm.keyword" 
                placeholder="用户名/手机号码/SN" 
                clearable
              />
            </el-form-item>
            <el-form-item label="身份">
              <el-select v-model="searchForm.identity" placeholder="全部" clearable>
                <el-option label="全部" value="" />
                <el-option label="普通用户" :value="0" />
                <el-option label="分销员" :value="1" />
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="全部" clearable>
                <el-option label="全部" value="" />
                <el-option label="未审核" :value="0" />
                <el-option label="已审核" :value="1" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button @click="resetSearch">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
  
        <!-- 表格区域 -->
        <el-table
          :data="tableData"
          border
          v-loading="loading"
          style="width: 100%"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="sn" label="编号" width="100" />
          <el-table-column label="用户信息" min-width="200">
            <template #default="scope">
              <div class="user-info">
                <div class="user-detail">
                  <div class="username">{{ scope.row.real_name }}</div>
                  <div class="user-level">{{ scope.row.mobile }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="grade_id" label="等级" width="120" />
          <el-table-column prop="identity" label="身份" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.identity === 1 ? 'success' : 'info'">
                {{ scope.row.identity === 1 ? '分销员' : '普通用户' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ scope.row.status === 1 ? '已审核' : '未审核' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="上级推荐人" width="100">
            <template #default="scope">
              {{ scope.row.parent_name || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="创建时间" width="180">
            <template #default="scope">
              {{ formatTime(scope.row.create_time) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="scope">
              <el-button link type="primary" @click="handleDetail(scope.row)">详情</el-button>
              <el-button link type="primary" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button 
                v-if="scope.row.status === 0"
                link 
                type="success" 
                @click="handleAudit(scope.row)"
              >审核</el-button>
            </template>
          </el-table-column>
        </el-table>
  
        <!-- 分页 -->
        <div class="pagination-box">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[15, 30, 50, 100]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ElMessage } from 'element-plus'
  import http from '@/utils/http'
  
  export default {
    name: 'DistributionUserList',
    data() {
      return {
        loading: false,
        searchForm: {
          keyword: '',
          identity: '',
          status: ''
        },
        tableData: [],
        currentPage: 1,
        pageSize: 15,
        total: 0
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      // 获取列表数据
      async fetchData() {
        this.loading = true
        try {
          const response = await http.get('/api/v1/mini_core/distribution', {
            params: {
              page: this.currentPage,
              size: this.pageSize,
              keyword: this.searchForm.keyword || undefined,
              identity: this.searchForm.identity !== '' ? this.searchForm.identity : undefined,
              status: this.searchForm.status !== '' ? this.searchForm.status : undefined
            }
          })
  
          if (response.data && response.data.code === 200) {
            this.tableData = response.data.data
            this.total = response.data.total
          }
        } catch (error) {
          console.error('获取分销用户列表失败:', error)
          ElMessage.error('获取列表失败')
        } finally {
          this.loading = false
        }
      },
  
      // 获取状态标签类型
      getStatusType(status) {
        return status === 1 ? 'success' : 'warning'
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
  
      // 搜索
      handleSearch() {
        this.currentPage = 1
        this.fetchData()
      },
  
      // 重置搜索
      resetSearch() {
        this.searchForm = {
          keyword: '',
          identity: '',
          status: ''
        }
        this.handleSearch()
      },
  
      // 查看详情
      handleDetail(row) {
        this.$router.push(`/distribution/user/detail/${row.id}`)
      },
  
      // 编辑用户
      handleEdit(row) {
        this.$router.push(`/distribution/user/edit/${row.id}`)
      },
  
      // 审核
      async handleAudit(row) {
        try {
          const response = await http.put(`/api/v1/mini_core/distribution/${row.id}/audit`, {
            status: 1
          })
          if (response.data && response.data.code === 200) {
            ElMessage.success('审核成功')
            this.fetchData()
          }
        } catch (error) {
          console.error('审核失败:', error)
          ElMessage.error('审核失败')
        }
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
    background-color: #fff;
    border-radius: 4px;
    margin-bottom: 16px;
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
  
  .user-level {
    font-size: 12px;
    color: #909399;
  }
  
  .pagination-box {
    padding: 16px;
    display: flex;
    justify-content: flex-end;
  }
  
  :deep(.el-table) {
    width: 100% !important;
  }
  
  :deep(.el-table__body) {
    width: 100% !important;
  }
  </style>