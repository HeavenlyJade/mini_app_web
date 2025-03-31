<template>
  <div class="page-container">
    <!-- 面包屑导航 -->
    <div class="breadcrumb">
      <i class="nav-icon menu-icon"></i>
    </div>

    <!-- 页面内容 -->
    <div class="content-wrapper">
      <!-- 操作栏 -->
      <div class="action-bar">
        <div class="left-actions">
          <router-link to="/shop/products/add" class="btn btn-primary">
            <i class="add-icon"></i> 商品新增
          </router-link>
          <div class="dropdown">
            <button class="btn btn-secondary" @click="toggleBatchMenu">批量操作 <i class="arrow-down"></i></button>
            <!-- 下拉菜单内容 -->
            <div class="dropdown-content" v-if="showBatchMenu">
              <div class="dropdown-item" @click="handleBatchAction('publish')">批量上架</div>
              <div class="dropdown-item" @click="handleBatchAction('unpublish')">批量下架</div>
              <div class="dropdown-item" @click="handleBatchAction('delete')">批量删除</div>
            </div>
          </div>
          <button class="btn btn-danger" @click="rebuildSort">
            <i class="refresh-icon"></i> 重建排序
          </button>
        </div>

        <div class="right-actions">
          <div class="search-wrapper">
            <input link class="search-input" placeholder="商品名称/编号/关键词" v-model="searchQuery"
              @focus="showSearchDropdown = true" @blur="onSearchBlur" @keyup.enter="searchProducts" />
            <button class="search-btn" @click="searchProducts">
              <i class="search-icon"></i>
            </button>

            <!-- 搜索下拉面板 -->
            <div class="search-dropdown" v-if="showSearchDropdown">
              <div class="search-stat-item">浏览量：{{ stats.views }}</div>
              <div class="search-stat-item">收藏量：{{ stats.favorites }}</div>
              <div class="search-stat-item">订单数：{{ stats.orders }}</div>
              <div class="search-stat-item">销售数：{{ stats.sales }}</div>
              <div class="search-stat-item">满意度：{{ stats.satisfaction }}</div>
              <div class="search-stat-item">赞：{{ stats.likes }}</div>
              <div class="search-stat-item">踩：{{ stats.dislikes }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 状态标签 -->
      <div class="status-tabs">
        <div v-for="(tab, index) in statusTabs" :key="index" class="status-tab"
          :class="{ active: activeTab === tab.value }" @click="changeTab(tab.value)">
          {{ tab.label }}
        </div>
      </div>

      <!-- 商品表格 -->
      <div class="product-table">
        <div v-if="loading" class="loading-indicator">
          <div class="spinner"></div>
          <div class="loading-text">加载中...</div>
        </div>
        <table v-else>
          <thead>
            <tr>
              <th class="checkbox-col">
                <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" />
              </th>
              <th class="image-col">图片</th>
              <th class="code-col">编号/条码</th>
              <th class="name-col">名称</th>
              <th class="category-col">商品分类</th>
              <th class="shop-col">所属门店</th>
              <th class="store-col">门店/分类</th>
              <th class="stock-col">库存/状态</th>
              <th class="price-col">价格</th>
              <th class="actions-col">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="productList.length === 0">
              <td colspan="10" class="empty-table">
                <div class="empty-message">
                  <i class="empty-icon"></i>
                  <p>暂无商品数据</p>
                </div>
              </td>
            </tr>
            <tr v-for="(product, index) in productList" :key="product.id || index">
              <td class="checkbox-col">
                <input type="checkbox" :value="product.id" v-model="selectedProducts" />
              </td>
              <td class="image-col">
                <img v-if="product.images" :src="getFirstImage(product.images)" :alt="product.name || '商品图片'"
                  class="product-image" />
                <div v-else class="no-image">无图片</div>
              </td>
              <td class="code-col">
                {{ product.code || '暂无编号' }}<br />
                <span class="secondary-text">{{ product.barcode || '-' }}</span>
              </td>
              <td class="name-col">
                <div class="product-name">
                  <span v-if="product.is_recommended" class="tag recommended">[推荐]</span>
                  {{ product.name || '未命名商品' }}
                </div>
              </td>
              <td class="category-col">{{ getCategoryName(product.category_id) }}</td>
              <td class="shop-col">{{ product.shop || '-' }}</td>
              <td class="store-col">{{ product.store_category || '-' }}</td>
              <td class="stock-col">
                {{ product.stock || 0 }}
                <div class="status-badge" :class="getStatusClass(product.status)">
                  {{ getStatusText(product.status) }}
                </div>
              </td>
              <td class="price-col">
                <span class="price">¥ {{ product.price || 0 }}</span>
                <span class="original-price" v-if="product.market_price && product.market_price > product.price">
                  ¥ {{ product.market_price }}
                </span>
              </td>
              <td class="actions-col">
                <button class="btn-icon edit" @click="handleEdit(product)">
                  <i class="edit-icon"></i>
                </button>
                <button class="btn-icon view" @click="handleView(product)">
                  <i class="view-icon"></i>
                </button>
                <button class="btn-icon delete" @click="handleDelete(product)">
                  <i class="delete-icon"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div class="pagination" v-if="totalProducts > 0">
        <div class="pagination-info">Total {{ totalProducts }}</div>
        <div class="page-size-selector">
          <select v-model="pageSize" @change="handlePageSizeChange">
            <option value="10">10/page</option>
            <option value="20">20/page</option>
            <option value="50">50/page</option>
            <option value="100">100/page</option>
          </select>
        </div>
        <div class="pagination-controls">
          <button class="pagination-btn prev" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
            &lt;
          </button>
          <div class="page-numbers">
            <div v-for="page in displayPages" :key="page" class="page-number" :class="{ active: currentPage === page }"
              @click="changePage(page)">
              {{ page }}
            </div>
          </div>
          <button class="pagination-btn next" :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)">
            &gt;
          </button>
          <div class="jump-page">
            Go to
            <input type="number" v-model="jumpToPage" @keyup.enter="jumpTo" class="jump-input" min="1"
              :max="totalPages" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/utils/http'

export default {
  name: 'ProductList',
  setup() {
    // 路由
    const router = useRouter()

    // 搜索和下拉
    const searchQuery = ref('')
    const showSearchDropdown = ref(false)
    const showBatchMenu = ref(false)

    // 状态变量
    const loading = ref(false)
    const productList = ref([])
    const categories = ref([])
    const error = ref(null)

    // 统计数据
    const stats = ref({
      views: 0,
      favorites: 0,
      orders: 0,
      sales: 0,
      satisfaction: 0,
      likes: 0,
      dislikes: 0
    })

    // 延迟关闭搜索下拉
    const onSearchBlur = () => {
      setTimeout(() => {
        showSearchDropdown.value = false
      }, 200)
    }

    // 状态标签
    const statusTabs = [
      {
        label: '全部',
        value: 'all'
      },
      {
        label: '销售中',
        value: 'selling'
      },
      {
        label: '已售罄',
        value: 'soldout'
      },
      {
        label: '仓库中',
        value: 'stored'
      }
    ]
    const activeTab = ref('all')

    // 选择商品
    const selectAll = ref(false)
    const selectedProducts = ref([])

    // 分页
    const totalProducts = ref(0)
    const currentPage = ref(1)
    const pageSize = ref(10)
    const jumpToPage = ref('')

    // 获取商品列表
    const fetchProducts = async () => {
      loading.value = true
      error.value = null

      try {
        const params = {
          page: currentPage.value,
          size: pageSize.value,
          keyword: searchQuery.value,
          status: activeTab.value === 'all' ? '' : activeTab.value
        }

        const response = await http.get('/api/v1/mini_core/shop-product', params)

        if (response.data && response.data.code === 200) {
          productList.value = response.data.data
          totalProducts.value = response.data.total

          // 清空选择
          selectedProducts.value = []
          selectAll.value = false
        } else {
          error.value = '获取商品列表失败'
          console.error('获取商品列表返回错误:', response.data)
        }
      } catch (err) {
        error.value = '获取商品列表出错'
        console.error('获取商品列表错误:', err)
      } finally {
        loading.value = false
      }
    }

    // 获取分类列表
    const fetchCategories = async () => {
      try {
        const response = await http.get('/api/v1/mini_core/product-category')
        if (response.data && response.data.data) {
          categories.value = response.data.data
        }
      } catch (err) {
        console.error('获取分类列表错误:', err)
      }
    }

    // 获取分类名称
    const getCategoryName = (categoryId) => {
      if (!categoryId) return '-'
      const category = categories.value.find(cat => cat.id === categoryId)
      return category ? category.name : '-'
    }

    // 获取商品第一张图片
    const getFirstImage = (images) => {
      if (!images) return ''
      try {
        // 尝试解析JSON字符串
        if (typeof images === 'string') {
          const parsedImages = JSON.parse(images)
          return Array.isArray(parsedImages) && parsedImages.length > 0 ? parsedImages[0] : ''
        }
        // 如果已经是数组
        if (Array.isArray(images) && images.length > 0) {
          return images[0]
        }
      } catch (err) {
        console.error('解析商品图片错误:', err)
      }
      return ''
    }

    // 获取状态类名
    const getStatusClass = (status) => {
      switch (status) {
        case 'selling':
        case '上架':
          return 'in-stock'
        case 'soldout':
        case '售罄':
          return 'out-stock'
        case 'stored':
        case '下架':
          return 'in-warehouse'
        default:
          return 'unknown'
      }
    }

    // 获取状态文本
    const getStatusText = (status) => {
      switch (status) {
        case 'selling':
          return '上架'
        case 'soldout':
          return '售罄'
        case 'stored':
          return '下架'
        default:
          return status || '未知'
      }
    }

    // 切换全选
    const toggleSelectAll = () => {
      if (selectAll.value) {
        selectedProducts.value = productList.value.map(item => item.id).filter(Boolean)
      } else {
        selectedProducts.value = []
      }
    }

    // 监听选中项变化同步全选状态
    watch(selectedProducts, (newVal) => {
      const validProducts = productList.value.filter(p => p.id !== undefined && p.id !== null)
      selectAll.value = newVal.length > 0 && newVal.length === validProducts.length
    })

    // 总页数
    const totalPages = computed(() => {
      return Math.ceil(totalProducts.value / pageSize.value) || 1
    })

    // 显示的页码
    const displayPages = computed(() => {
      let start = Math.max(1, currentPage.value - 2)
      let end = Math.min(totalPages.value, start + 4)

      // 调整起始页，确保显示5个页码或全部页码
      if (end - start + 1 < 5 && totalPages.value >= 5) {
        start = Math.max(1, end - 4)
      }

      return Array.from({ length: end - start + 1 }, (_, i) => start + i)
    })

    // 切换状态标签
    const changeTab = (tabValue) => {
      activeTab.value = tabValue
      currentPage.value = 1
      fetchProducts()
    }

    // 搜索商品
    const searchProducts = () => {
      currentPage.value = 1
      fetchProducts()
    }

    // 改变页码
    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        fetchProducts()
      }
    }

    // 改变每页显示数量
    const handlePageSizeChange = () => {
      currentPage.value = 1
      fetchProducts()
    }

    // 跳转页码
    const jumpTo = () => {
      if (jumpToPage.value) {
        const page = parseInt(jumpToPage.value)
        if (!isNaN(page) && page >= 1 && page <= totalPages.value) {
          changePage(page)
        }
        jumpToPage.value = ''
      }
    }

    // 切换批量操作菜单
    const toggleBatchMenu = () => {
      showBatchMenu.value = !showBatchMenu.value
    }

    // 批量操作
    const handleBatchAction = async (action) => {
      if (selectedProducts.value.length === 0) {
        alert('请选择要操作的商品')
        return
      }

      let actionText = ''
      switch (action) {
        case 'publish':
          actionText = '上架'
          break
        case 'unpublish':
          actionText = '下架'
          break
        case 'delete':
          actionText = '删除'
          break
      }

      if (confirm(`确认${actionText}选中的 ${selectedProducts.value.length} 个商品吗?`)) {
        try {
          loading.value = true

          // 构建请求参数
          const params = {
            ids: selectedProducts.value,
            action: action
          }

          // 调用批量操作API
          const response = await http.post('/api/v1/mini_core/shop-product/batch', params)

          if (response.data && response.data.code === 0) {
            alert(`批量${actionText}成功!`)
            // 刷新数据
            fetchProducts()
          } else {
            alert(`批量${actionText}失败: ${response.data.message || '未知错误'}`)
          }
        } catch (err) {
          console.error(`批量${actionText}错误:`, err)
          alert(`批量${actionText}出错: ${err.message || '网络错误'}`)
        } finally {
          loading.value = false
          showBatchMenu.value = false
        }
      }
    }

    // 重建排序
    const rebuildSort = async () => {
      if (confirm('确认要重建商品排序吗?')) {
        try {
          loading.value = true

          const response = await http.post('/api/v1/mini_core/shop-product/rebuild-sort')

          if (response.data && response.data.code === 0) {
            alert('重建排序成功!')
            // 刷新数据
            fetchProducts()
          } else {
            alert(`重建排序失败: ${response.data.message || '未知错误'}`)
          }
        } catch (err) {
          console.error('重建排序错误:', err)
          alert(`重建排序出错: ${err.message || '网络错误'}`)
        } finally {
          loading.value = false
        }
      }
    }

    // 编辑商品
    const handleEdit = (product) => {
      router.push(`/shop/products/add?id=${product.id}`)
    }

    // 查看商品
    const handleView = (product) => {
      router.push(`/shop/products/add?id=${product.id}&mode=view`)
    }

    // 删除商品
    const handleDelete = async (product) => {
      if (confirm(`确认删除商品 "${product.name || '未命名商品'}" 吗?`)) {
        try {
          loading.value = true

          const response = await http.delete(`/api/v1/mini_core/shop-product/${product.id}`)

          if (response.data && response.data.code === 0) {
            alert('删除成功!')
            // 刷新数据
            fetchProducts()
          } else {
            alert(`删除失败: ${response.data.message || '未知错误'}`)
          }
        } catch (err) {
          console.error('删除商品错误:', err)
          alert(`删除出错: ${err.message || '网络错误'}`)
        } finally {
          loading.value = false
        }
      }
    }

    // 初始化
    onMounted(() => {
      fetchProducts()
      fetchCategories()
    })

    return {
      // 状态变量
      loading,
      productList,
      error,
      searchQuery,
      showSearchDropdown,
      showBatchMenu,
      stats,
      statusTabs,
      activeTab,
      selectAll,
      selectedProducts,
      totalProducts,
      currentPage,
      pageSize,
      jumpToPage,
      totalPages,
      displayPages,

      // 方法
      onSearchBlur,
      toggleSelectAll,
      changeTab,
      searchProducts,
      changePage,
      handlePageSizeChange,
      jumpTo,
      toggleBatchMenu,
      handleBatchAction,
      rebuildSort,
      handleEdit,
      handleView,
      handleDelete,
      getCategoryName,
      getFirstImage,
      getStatusClass,
      getStatusText
    }
  }
}
</script>

<style lang="less" scoped>
.page-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 60px);
  color: #333;
}

.breadcrumb {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  font-size: 14px;
  color: #666;
}

.content-wrapper {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.left-actions,
.right-actions {
  display: flex;
  gap: 10px;
}

.btn {
  display: flex;
  align-items: center;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-primary {
  background-color: #67c23a;
  color: white;
}

.btn-secondary {
  background-color: #409eff;
  color: white;
}

.btn-danger {
  background-color: #f56c6c;
  color: white;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 10;
  background-color: white;
  border: 1px solid #eee;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  width: 120px;
}

.dropdown-item {
  padding: 8px 12px;
  cursor: pointer;

  &:hover {
    background-color: #f5f7fa;
  }
}

.search-wrapper {
  position: relative;
  display: flex;
}

.search-input {
  width: 200px;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px 0 0 4px;
  outline: none;

  &:focus {
    border-color: #409eff;
  }
}

.search-btn {
  border: 1px solid #dcdfe6;
  border-left: none;
  background-color: #f5f7fa;
  padding: 8px 15px;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.search-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 200px;
  background-color: white;
  border: 1px solid #eee;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  margin-top: 5px;
}

.search-stat-item {
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.status-tabs {
  display: flex;
  border-bottom: 1px solid #e4e7ed;
  margin-bottom: 16px;
}

.status-tab {
  padding: 10px 16px;
  cursor: pointer;
  position: relative;
  font-size: 14px;

  &.active {
    color: #409eff;

    &:after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: #409eff;
    }
  }
}

.product-table {
  overflow-x: auto;
  margin-bottom: 16px;

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    padding: 12px 8px;
    text-align: center;
    border-bottom: 1px solid #ebeef5;
  }

  th {
    background-color: #f5f7fa;
    font-weight: 500;
  }

  .image-col {
    width: 80px;
  }

  .product-image {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border: 1px solid #eee;
  }

  .code-col,
  .shop-col,
  .store-col {
    width: 100px;
  }

  .name-col {
    width: 300px;
    text-align: left;
  }

  .category-col {
    width: 120px;
  }

  .stock-col,
  .price-col {
    width: 100px;
  }

  .actions-col {
    width: 120px;
  }

  .product-name {
    display: flex;
    align-items: flex-start;
    text-align: left;
  }

  .tag {
    display: inline-block;
    padding: 2px 4px;
    margin-right: 5px;
    border-radius: 2px;
    font-size: 12px;
  }

  .tag.recommended {
    color: #ff9900;
  }

  .secondary-text {
    color: #909399;
    font-size: 12px;
  }

  .status-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    margin-top: 5px;

    &.in-stock {
      background-color: #f0f9eb;
      color: #67c23a;
    }

    &.out-stock {
      background-color: #f4f4f5;
      color: #909399;
    }
  }

  .price {
    font-weight: bold;
    color: #f56c6c;
  }

  .original-price {
    color: #909399;
    font-size: 12px;
    text-decoration: line-through;
    display: block;
  }

  .btn-icon {
    width: 24px;
    height: 24px;
    border: none;
    background: none;
    cursor: pointer;
    margin: 0 2px;
    padding: 0;

    &.edit {
      color: #409eff;
    }

    &.view {
      color: #67c23a;
    }

    &.delete {
      color: #f56c6c;
    }
  }
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;

  .pagination-info {
    font-size: 14px;
    color: #606266;
  }

  .page-size-selector {
    select {
      padding: 5px 10px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      background-color: white;
    }
  }

  .pagination-controls {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .pagination-btn {
    width: 32px;
    height: 32px;
    border: 1px solid #d9d9d9;
    background-color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;

    &:disabled {
      cursor: not-allowed;
      color: #c0c4cc;
    }
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
    border-radius: 4px;
    cursor: pointer;

    &.active {
      background-color: #409eff;
      color: white;
    }
  }

  .jump-page {
    display: flex;
    align-items: center;
    gap: 5px;

    .jump-input {
      width: 50px;
      padding: 5px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      text-align: center;
    }
  }
}

// Icons
.add-icon::before {
  content: "+";
}

.refresh-icon::before {
  content: "↻";
}

.search-icon::before {
  content: "🔍";
}

.arrow-down::before {
  content: "▼";
  font-size: 10px;
  margin-left: 5px;
}

.edit-icon::before {
  content: "✏️";
}

.view-icon::before {
  content: "👁️";
}

.delete-icon::before {
  content: "🗑️";
}
</style>
