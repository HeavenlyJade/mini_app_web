<template>
  <div class="page-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <h2 class="page-title">门店管理</h2>
    </div>
    <!-- 搜索和操作区域 -->
    <div class="page-content">
      <!-- 搜索表单 -->
      <div class="search-container">
        <div class="search-form">
          <div class="form-row">
            <div class="form-item">
              <label>门店分类</label>
              <select v-model="searchForm.category" class="form-select">
                <option value="">全部</option>
                <option v-for="item in categoryOptions" :key="item.value" :value="item.value">
                  {{ item.label }}
                </option>
              </select>
            </div>
            <div class="form-item">
              <label>门店ID</label>
              <input type="text" v-model="searchForm.storeId" class="form-input" placeholder="请输入门店ID">
            </div>
            <div class="form-item">
              <label>状态</label>
              <select v-model="searchForm.status" class="form-select">
                <option value="">全部</option>
                <option value="normal">正常</option>
                <option value="disabled">停用</option>
              </select>
            </div>
            <div class="form-item">
              <label>门店类型</label>
              <select v-model="searchForm.type" class="form-select">
                <option value="">全部</option>
                <option v-for="item in typeOptions" :key="item.value" :value="item.value">
                  {{ item.label }}
                </option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-item">
              <label>门店名称</label>
              <input type="text" v-model="searchForm.name" class="form-input" placeholder="请输入门店名称">
            </div>
            <div class="form-item">
              <label>地址</label>
              <input type="text" v-model="searchForm.address" class="form-input" placeholder="请输入地址关键词">
            </div>
            <div class="form-item date-range">
              <label>创建时间</label>
              <div class="date-inputs">
                <input type="datetime-local" v-model="searchForm.startDate" class="form-input">
                <span class="date-separator">至</span>
                <input type="datetime-local" v-model="searchForm.endDate" class="form-input">
              </div>
            </div>
            <div class="form-item action-buttons">
              <button class="btn btn-primary" @click="handleSearch">搜索</button>
              <button class="btn btn-default" @click="resetSearch">重置</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-container">
        <div class="left-actions">
          <button class="btn btn-success" @click="handleAdd">
            <i class="icon-add"></i> 添加门店
          </button>
          <button class="btn btn-danger" @click="handleBatchDelete" :disabled="!hasSelected">
            <i class="icon-delete"></i> 批量删除
          </button>
          <button class="btn btn-info" @click="handleExport">
            <i class="icon-export"></i> 导出数据
          </button>
        </div>
        <div class="right-actions">
          <button class="btn btn-default" @click="refreshData">
            <i class="icon-refresh"></i> 刷新
          </button>
        </div>
      </div>

      <!-- 数据表格 -->
      <div class="table-container">
        <table class="data-table">
          <thead>
          <tr>
            <th width="40">
              <input type="checkbox" v-model="selectAll" @change="handleSelectAll">
            </th>
            <th width="80">ID</th>
            <th width="100">门店编号</th>
            <th width="180">门店名称</th>
            <th width="120">门店分类</th>
            <th width="120">门店类型</th>
            <th width="200">地址</th>
            <th width="120">联系电话</th>
            <th width="100">状态</th>
            <th width="160">创建时间</th>
            <th width="160">操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="loading">
            <td colspan="11" class="loading-cell">
              <div class="loading-spinner"></div>
              <span>数据加载中...</span>
            </td>
          </tr>
          <tr v-else-if="tableData.length === 0">
            <td colspan="11" class="empty-cell">暂无数据</td>
          </tr>
          <tr v-else v-for="item in tableData" :key="item.id">
            <td>
              <input type="checkbox" v-model="selectedItems" :value="item.id">
            </td>
            <td>{{ item.id }}</td>
            <td>{{ item.store_code }}</td>
            <td>
              <div class="store-name">
                <img v-if="item.logo" :src="item.logo" class="store-logo" alt="店铺图标">
                <span>{{ item.name }}</span>
              </div>
            </td>
            <td>{{ getCategoryName(item.store_category) }}</td>
            <td>{{ getTypeName(item.item) }}</td>
            <td class="address-cell">{{ item.address }}</td>
            <td>{{ item.contact_phone }}</td>
            <td>
                <span :class="['status-tag', item.status ]">
                  {{ item.status }}
                </span>
            </td>
            <td>{{ formatDateTime(item.create_time) }}</td>
            <td>
              <div class="operation-buttons">
                <button class="btn-text btn-edit" @click="handleEdit(item)">编辑</button>
                <button class="btn-text btn-view" @click="handleView(item)">查看</button>
                <button class="btn-text btn-delete" @click="handleDelete(item)">删除</button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div class="pagination-container">
        <div class="pagination-info">
          共 {{ total }} 条数据
        </div>
        <div class="pagination-size">
          <select v-model="pageSize" @change="handlePageSizeChange" class="form-select">
            <option :value="10">10条/页</option>
            <option :value="20">20条/页</option>
            <option :value="50">50条/页</option>
            <option :value="100">100条/页</option>
          </select>
        </div>
        <div class="pagination-controls">
          <button
            class="pagination-btn"
            :disabled="currentPage <= 1"
            @click="goToPage(currentPage - 1)"
          >上一页
          </button>
          <div class="page-numbers">
            <button
              v-for="page in displayPages"
              :key="page"
              class="page-number"
              :class="{ active: currentPage === page }"
              @click="goToPage(page)"
            >{{ page }}
            </button>
          </div>
          <button
            class="pagination-btn"
            :disabled="currentPage >= totalPages"
            @click="goToPage(currentPage + 1)"
          >下一页
          </button>
          <div class="pagination-jump">
            <span>前往</span>
            <input type="text" v-model.number="jumpPage" class="jump-input">
            <span>页</span>
            <button class="jump-btn" @click="handleJumpPage">确定</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import http from '@/utils/http'

export default {
  name: 'StoreManagementList',
  data () {
    return {
      // 搜索表单
      searchForm: {
        category: '',
        storeId: '',
        status: '',
        type: '',
        name: '',
        address: '',
        startDate: '',
        endDate: ''
      },

      // 列表数据
      tableData: [],
      loading: false,
      total: 0,

      // 分页
      currentPage: 1,
      pageSize: 10,
      jumpPage: '',

      // 选择
      selectAll: false,
      selectedItems: [],

      // 选项数据
      categoryOptions: [
        {
          value: '1',
          label: '旗舰店'
        },
        {
          value: '2',
          label: '直营店'
        },
        {
          value: '3',
          label: '加盟店'
        },
        {
          value: '4',
          label: '体验店'
        }
      ],
      typeOptions: [
        {
          value: 'retail',
          label: '零售门店'
        },
        {
          value: 'service',
          label: '服务门店'
        },
        {
          value: 'mixed',
          label: '综合门店'
        },
        {
          value: 'online',
          label: '线上店铺'
        }
      ]
    }
  },
  computed: {
    // 是否有选中的项目
    hasSelected () {
      return this.selectedItems.length > 0
    },

    // 总页数
    totalPages () {
      return Math.ceil(this.total / this.pageSize)
    },

    // 显示的页码
    displayPages () {
      const pages = []
      const maxDisplayPages = 5

      if (this.totalPages <= maxDisplayPages) {
        // 总页数少于最大显示页数，全部显示
        for (let i = 1; i <= this.totalPages; i++) {
          pages.push(i)
        }
      } else {
        // 总页数超过最大显示页数，显示当前页附近的页码
        let startPage = Math.max(1, this.currentPage - 2)
        let endPage = Math.min(this.totalPages, startPage + maxDisplayPages - 1)

        // 调整起始页
        if (endPage - startPage < maxDisplayPages - 1) {
          startPage = Math.max(1, endPage - maxDisplayPages + 1)
        }

        for (let i = startPage; i <= endPage; i++) {
          pages.push(i)
        }
      }

      return pages
    }
  },
  created () {
    // 页面加载时获取数据
    this.fetchData()

    // 实际项目中可能需要先加载一些基础数据，如门店分类选项等
    this.loadBaseData()
  },
  methods: {
    // 获取数据
    async fetchData () {
      this.tableLoading = true
      const params = {
        page: this.currentPage,
        size: this.pageSize,
        ...this.searchForm
      }
      try {
        // 使用shop-store-category API获取分类列表
        const response = await http.get('/api/v1/mini_core/shop-store',  params )

        if (response.data && response.data.code === 200) {
          this.tableData = response.data.data || []
          this.total = response.data.total
        } else {
          this.$message.error('获取分类数据失败')
        }
      } catch (error) {
        console.error('获取分类列表错误:', error)
        this.$message.error('获取分类数据出错: ' + (error.message || '未知错误'))
      } finally {
        this.tableLoading = false
      }
    },

    // 重置搜索
    resetSearch () {
      this.searchForm = {
        category: '',
        storeId: '',
        status: '',
        type: '',
        name: '',
        address: '',
        startDate: '',
        endDate: ''
      }
    },

    // 搜索
    handleSearch () {
      this.currentPage = 1
      this.fetchData()
    },

    // 刷新数据
    refreshData () {
      this.fetchData()
    },

    // 添加门店
    handleAdd () {
      this.$router.push('/shop/store/add')
    },

    // 编辑门店
    handleEdit (item) {
      this.$router.push(`/shop/store/add?id=${item.id}`)
    },

    // 查看门店
    handleView (item) {
      this.$router.push(`/shop/store/add?id=${item.id}&mode=view`)
    },

    async handleDelete (item) {
      if (confirm(`确定要删除门店"${item.name}"吗？`)) {
        this.loading = true
        try {
          const response = await http.delete(`/api/v1/mini_core/shop-store/${item.id}`)
          if (response.data && response.data.code === 200) {
            this.$message.success('删除成功!')
            this.fetchData() // 重新加载数据
          } else {
            this.$message.error('删除失败: ' + (response.data.message || '未知错误'))
          }
        } catch (error) {
          console.error('删除门店错误:', error)
          this.$message.error('删除出错: ' + (error.message || '未知错误'))
        } finally {
          this.loading = false
        }
      }
    },

    // 批量删除
    handleBatchDelete () {
      if (this.selectedItems.length === 0) {
        alert('请选择要删除的门店')
        return
      }

      if (confirm(`确定要删除选中的 ${this.selectedItems.length} 个门店吗？`)) {
        this.loading = true

        // 实际项目中应该调用批量删除API，或者使用Promise.all进行多个删除请求
        // const deletePromises = this.selectedItems.map(id =>
        //   axios.delete(`/api/v1/mini_core/shop-store/${id}`)
        // )

        // Promise.all(deletePromises)
        //   .then(() => {
        //     this.$message.success('批量删除成功')
        //     this.fetchData()
        //     this.selectedItems = []
        //     this.selectAll = false
        //   })
        //   .catch(error => {
        //     this.$message.error('批量删除失败: ' + error.message)
        //   })
        //   .finally(() => {
        //     this.loading = false
        //   })

        // 模拟API调用结果
        setTimeout(() => {
          console.log(`调用批量删除API，删除ID: ${this.selectedItems.join(', ')}`)
          this.loading = false
          alert('批量删除成功')
          this.fetchData()
          this.selectedItems = []
          this.selectAll = false
        }, 800)
      }
    },

    // 导出数据
    handleExport () {
      // 实际导出逻辑
      console.log('导出数据')
    },

    // 全选/取消全选
    handleSelectAll () {
      if (this.selectAll) {
        this.selectedItems = this.tableData.map(item => item.id)
      } else {
        this.selectedItems = []
      }
    },

    // 页码变化
    goToPage (page) {
      if (page < 1 || page > this.totalPages) return
      this.currentPage = page
      this.fetchData()
    },

    // 每页条数变化
    handlePageSizeChange () {
      this.currentPage = 1
      this.fetchData()
    },

    // 跳转页面
    handleJumpPage () {
      if (!this.jumpPage) return

      const page = parseInt(this.jumpPage)
      if (isNaN(page) || page < 1 || page > this.totalPages) {
        alert(`请输入有效的页码(1-${this.totalPages})`)
        return
      }

      this.goToPage(page)
      this.jumpPage = ''
    },

    // 获取分类名称
    getCategoryName (categoryId) {
      const category = this.categoryOptions.find(item => item.value === categoryId)
      return category ? category.label : '未知分类'
    },

    // 获取类型名称
    getTypeName (type) {
      const typeObj = this.typeOptions.find(item => item.value === type)
      return typeObj ? typeObj.label : '未知类型'
    },

    // 加载基础数据（分类、类型等选项）
    loadBaseData () {
      // 加载门店分类
      // axios.get('/api/v1/mini_core/shop-store-category')
      //   .then(response => {
      //     if (response.data && response.data.data) {
      //       this.categoryOptions = response.data.data.map(item => ({
      //         value: item.id.toString(),
      //         label: item.name
      //       }))
      //     }
      //   })
      //   .catch(error => {
      //     console.error('获取门店分类失败:', error)
      //   })

      // 注意：类型等其他基础数据也可以从后端加载
      // 本示例中使用了硬编码的选项数据
    },

    // 格式化日期时间
    formatDateTime (timestamp) {
      if (!timestamp) return '-'

      const date = new Date(timestamp)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },

  }
}
</script>

<style scoped>
.page-container {
  width: 100%;
  padding: 20px;
  background-color: #f5f7fa;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.page-content {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* 搜索表单 */
.search-container {
  padding: 20px;
  border-bottom: 1px solid #ebeef5;
}

.search-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.form-item {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 200px;
}

.form-item label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

.form-input,
.form-select {
  height: 36px;
  padding: 0 15px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  color: #606266;
  width: 100%;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #409eff;
}

.date-range {
  flex: 2;
  min-width: 350px;
}

.date-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
}

.date-separator {
  color: #909399;
  flex-shrink: 0;
}

.action-buttons {
  align-self: flex-end;
  display: flex;
  gap: 10px;
  margin-top: 24px;
  min-width: auto;
}

/* 操作按钮 */
.action-container {
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ebeef5;
}

.left-actions,
.right-actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 15px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid #dcdfe6;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.btn-primary {
  background-color: #409eff;
  color: white;
  border-color: #409eff;
}

.btn-primary:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

.btn-success {
  background-color: #67c23a;
  color: white;
  border-color: #67c23a;
}

.btn-success:hover {
  background-color: #85ce61;
  border-color: #85ce61;
}

.btn-danger {
  background-color: #f56c6c;
  color: white;
  border-color: #f56c6c;
}

.btn-danger:hover {
  background-color: #f78989;
  border-color: #f78989;
}

.btn-info {
  background-color: #909399;
  color: white;
  border-color: #909399;
}

.btn-info:hover {
  background-color: #a6a9ad;
  border-color: #a6a9ad;
}

.btn-default {
  background-color: #ffffff;
  color: #606266;
}

.btn-default:hover {
  background-color: #f2f6fc;
}

/* 图标 */
.icon-add::before {
  content: "+";
}

.icon-delete::before {
  content: "×";
}

.icon-export::before {
  content: "↓";
}

.icon-refresh::before {
  content: "↻";
}

/* 表格 */
.table-container {
  width: 100%;
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 500;
  padding: 12px 0;
  text-align: center;
  border-bottom: 1px solid #ebeef5;
}

.data-table td {
  padding: 12px 8px;
  text-align: center;
  color: #606266;
  border-bottom: 1px solid #ebeef5;
}

.store-name {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.store-logo {
  width: 24px;
  height: 24px;
  border-radius: 2px;
  object-fit: cover;
}

.address-cell {
  text-align: left;
  padding-left: 15px;
}

.status-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 2px;
  font-size: 12px;
}

.status-normal {
  background-color: #f0f9eb;
  color: #67c23a;
}

.status-disabled {
  background-color: #f4f4f5;
  color: #909399;
}

.loading-cell,
.empty-cell {
  text-align: center;
  padding: 50px 0;
  color: #909399;
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-radius: 50%;
  border-top: 2px solid #409eff;
  animation: spin 1s linear infinite;
  margin-right: 10px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 操作按钮 */
.operation-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.btn-text {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: color 0.2s;
  padding: 0;
}

.btn-edit {
  color: #409eff;
}

.btn-edit:hover {
  color: #66b1ff;
}

.btn-view {
  color: #67c23a;
}

.btn-view:hover {
  color: #85ce61;
}

.btn-delete {
  color: #f56c6c;
}

.btn-delete:hover {
  color: #f78989;
}

/* 分页 */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-top: 1px solid #ebeef5;
}

.pagination-info {
  color: #606266;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.pagination-btn {
  padding: 6px 12px;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  color: #409eff;
  border-color: #c6e2ff;
}

.pagination-btn:disabled {
  cursor: not-allowed;
  color: #c0c4cc;
}

.page-numbers {
  display: flex;
  gap: 5px;
}

.page-number {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.page-number:hover {
  color: #409eff;
}

.page-number.active {
  background-color: #409eff;
  color: white;
  border-color: #409eff;
}

.pagination-jump {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #606266;
}

.jump-input {
  width: 50px;
  height: 32px;
  padding: 0 5px;
  text-align: center;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.jump-btn {
  padding: 6px 12px;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  border-radius: 4px;
  cursor: pointer;
}

.jump-btn:hover {
  color: #409eff;
  border-color: #c6e2ff;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .form-item {
    min-width: 100%;
  }

  .action-buttons {
    margin-top: 0;
  }

  .pagination-container {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .pagination-controls {
    flex-wrap: wrap;
  }
}
</style>
