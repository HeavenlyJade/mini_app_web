<template>
  <div class="category-list-container" v-loading="loading" element-loading-text="加载中...">
    <!-- Action toolbar -->
    <div class="page-header">
      <h2 class="page-title">添加商品分类</h2>
    </div>

    <div class="toolbar">
      <!-- <el-select v-model="storeFilter" placeholder="门店" class="filter-item">
        <el-option label="全部门店" value="all"></el-option>
      </el-select> -->

      <el-input
        placeholder="搜索名称"
        v-model="searchKeyword"
        class="filter-item">
        <template #append>
          <el-button :icon="Search" @click="handleSearch"></el-button>
        </template>
      </el-input>

      <el-button type="primary" :icon="Plus" @click="handleAdd">添加</el-button>
      <el-button type="danger" :icon="Delete" @click="handleDeleteByGroup">删除所有选中</el-button>
      <el-button type="success" @click="handleExpandAll">一键展开/折叠</el-button>
      <el-button @click="handleBatchDelete">批量删除</el-button>
    </div>

    <!-- Category table -->
    <el-table
      ref="categoryTableRef"
      :data="filteredCategoryList"
      row-key="id"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column label="编号/名称" width="200">
        <template #default="scope">
          {{ scope.row.code || '-' }} / {{ scope.row.name || '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="type" label="编号/类型" width="150"></el-table-column>
      <el-table-column label="图标" width="120">
        <template #default="scope">
          <img :src="scope.row.icon" v-if="scope.row.icon" class="category-icon">
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="图片" width="120">
        <template #default="scope">
          <img :src="scope.row.image" v-if="scope.row.image" class="category-image">
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.status === '正常'">正常</el-tag>
          <el-tag type="info" v-else>停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220">
        <template #default="scope">
<!--          <el-button type="success" size="small" @click="handleAddSub(scope.row)">添加</el-button>-->
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加分页组件 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCategories"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background>
      </el-pagination>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, Search } from '@element-plus/icons-vue'
import http from '@/utils/http'

// 路由
const router = useRouter()

// 状态数据
const storeFilter = ref('all')
const searchKeyword = ref('')
const categoryList = ref([])
const selectedCategories = ref([])
const loading = ref(false)
const isExpanded = ref(false)
const categoryTableRef = ref(null)

// 分页相关状态
const currentPage = ref(1)
const pageSize = ref(10)
const totalCategories = ref(0)

// 计算属性
const filteredCategoryList = computed(() => {
  return categoryList.value
})

// 生命周期钩子
onMounted(() => {
  fetchCategoryData()
})

// 方法
const fetchCategoryData = () => {
  loading.value = true
  
  const params = {
    page: currentPage.value,
    size: pageSize.value,
    need_total_count: true
  }
  
  // 添加搜索条件
  if (searchKeyword.value && searchKeyword.value.trim() !== '') {
    params.keyword = searchKeyword.value.trim()
  }
  
  http.get('/api/v1/mini_core/product-category', params)
    .then(response => {
      if (response.data) {
        // 确保只处理data字段
        if (response.data.data && Array.isArray(response.data.data)) {
          categoryList.value = response.data.data
          totalCategories.value = response.data.total || 0
          console.log("数据列表:", categoryList.value.length, "总数:", totalCategories.value)
        } else if (Array.isArray(response.data)) {
          categoryList.value = response.data
          totalCategories.value = response.data.length
        } else {
          categoryList.value = []
          console.error('数据格式不符合预期:', response.data)
        }
      }
    })
    .catch(error => {
      console.error('获取分类数据错误:', error)
      ElMessage.error('获取分类数据失败: ' + (error.message || '未知错误'))
    })
    .finally(() => {
      loading.value = false
    })
}

const handleSearch = () => {
  currentPage.value = 1 // 重置到第一页
  fetchCategoryData()
}

const handleAdd = () => {
  // 导航到添加分类页面
  router.push('/shop/products/categories/add')
}

const handleAddSub = (row) => {
  // 导航到添加子分类页面（带父级ID）
  router.push(`/category/add?parentId=${row.id}`)
}

const handleEdit = (row) => {
  // 导航到编辑分类页面
  router.push(`/shop/products/categories/add?id=${row.id}`)
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该分类吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 这里添加调用删除分类API的代码
    // http.delete(`/api/v1/mini_core/product-category/${row.id}`)...

    // 目前只是模拟成功
    ElMessage.success('删除成功!')

    // 从本地列表中移除项目
    categoryList.value = categoryList.value.filter(item => item.id !== row.id)
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

const handleDeleteByGroup = () => {
  if (selectedCategories.value.length === 0) {
    ElMessage.warning('请先选择要删除的分类')
    return
  }

  ElMessageBox.confirm(`确认删除选中的 ${selectedCategories.value.length} 个分类吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 这里添加调用批量删除API的代码
    // const ids = selectedCategories.value.map(item => item.id)
    // http.deleteWithData('/api/v1/mini_core/product-category/batch', { ids })...

    // 目前只是模拟成功
    ElMessage.success('批量删除成功!')

    // 从本地列表中移除选中的项目
    const selectedIds = selectedCategories.value.map(item => item.id)
    categoryList.value = categoryList.value.filter(item => !selectedIds.includes(item.id))
    selectedCategories.value = []
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

const handleBatchDelete = () => {
  // 与handleDeleteByGroup类似但可能有不同的实现
  handleDeleteByGroup()
}

const handleExpandAll = () => {
  // 切换展开/折叠所有行
  isExpanded.value = !isExpanded.value

  // 如果有树表格，我们会使用这段代码：
  // if (categoryTableRef.value) {
  //   const rows = categoryTableRef.value.data
  //   rows.forEach(row => {
  //     categoryTableRef.value.toggleRowExpansion(row, isExpanded.value)
  //   })
  // }

  ElMessage.info(isExpanded.value ? '已展开所有分类' : '已折叠所有分类')
}

const handleSelectionChange = (val) => {
  selectedCategories.value = val
}

// 分页处理函数
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  fetchCategoryData()
}

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
  fetchCategoryData()
}
</script>

<style scoped>
.category-list-container {
  padding: 20px;
  position: relative;
}

.toolbar {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-item {
  width: 200px;
}

.category-icon,
.category-image {
  height: 40px;
  object-fit: contain;
}

/* 添加分页样式 */
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
