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
          <!-- <button class="btn btn-danger" @click="rebuildSort">
            <i class="refresh-icon"></i> 重建排序
          </button> -->
        </div>

        <div class="right-actions">
          <div class="search-form">
            <!-- 商品分类下拉框 -->
            <div class="search-item">
              <select v-model="searchCategoryId" class="search-select">
                <option :value="null">所有分类</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
            
            <!-- 商品名称搜索框 -->
            <div class="search-item">
              <input 
                class="search-input" 
                placeholder="商品名称" 
                v-model="searchName"
                @keyup.enter="searchProducts"
              />
            </div>
            
            <!-- 商品编号搜索框 -->
            <div class="search-item">
              <input 
                class="search-input" 
                placeholder="商品编号" 
                v-model="searchCode"
                @keyup.enter="searchProducts"
              />
            </div>
            
            <!-- 商品条码搜索框 -->
            <div class="search-item">
              <input 
                class="search-input" 
                placeholder="商品条码" 
                v-model="searchBarcode"
                @keyup.enter="searchProducts"
              />
            </div>
            
            <!-- 按钮组 -->
            <div class="search-buttons">
              <!-- 搜索按钮 -->
              <button class="search-btn" @click="searchProducts">
                <i class="search-icon"></i>
              </button>
              
              <!-- 清空按钮 -->
              <button class="clear-btn" @click="clearSearchFields">
                <i class="clear-icon"></i>
              </button>
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
              <!-- <th class="store-col">门店/分类</th> -->
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
              <td class="shop-col">{{ getStoreName(product.store_id) }}</td>
              <!-- <td class="store-col">{{ product.store_category || '-' }}</td> -->
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
                <button class="btn-action edit" @click="handleEdit(product)">
                  编辑
                </button>
                <button class="btn-action view" @click="handleView(product)">
                  查看
                </button>
                <button class="btn-action delete" @click="handleDelete(product)">
                  删除
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
import http from '@/utils/http'
import { loadStoreCategories } from '@/utils/store'
import { ElMessage, ElMessageBox } from 'element-plus'
import { WarningFilled } from '@element-plus/icons-vue'
import { markRaw } from 'vue'

export default {
  name: 'ProductList',
  data() {
    return {
      // 搜索和下拉
      searchName: null,        // 商品名称搜索
      searchCode: null,        // 商品编号搜索
      searchBarcode: null,     // 商品条码搜索
      searchCategoryId: null,  // 商品分类搜索
      showSearchDropdown: false,
      showBatchMenu: false,

      // 状态变量
      loading: false,
      productList: [],
      categories: [],
      error: null,

      // 统计数据
      stats: {
        views: 0,
        favorites: 0,
        orders: 0,
        sales: 0,
        satisfaction: 0,
        likes: 0,
        dislikes: 0
      },

      // 状态标签
      statusTabs: [
        { label: '全部', value: null },
        { label: '上架商品', value: '上架' },
        { label: '下架商品', value: '下架' },
      ],
      activeTab: null,

      // 选择商品
      selectAll: false,
      selectedProducts: [],
      categoryOptions: [],

      // 分页
      totalProducts: 0,
      currentPage: 1,
      pageSize: 10,
      jumpToPage: ''
    }
  },
  computed: {
    // 总页数
    totalPages() {
      return Math.ceil(this.totalProducts / this.pageSize) || 1
    },

    // 显示的页码
    displayPages() {
      let start = Math.max(1, this.currentPage - 2)
      let end = Math.min(this.totalPages, start + 4)

      // 调整起始页，确保显示5个页码或全部页码
      if (end - start + 1 < 5 && this.totalPages >= 5) {
        start = Math.max(1, end - 4)
      }

      return Array.from({ length: end - start + 1 }, (_, i) => start + i)
    }
  },
  watch: {
    // 监听选中项变化同步全选状态
    selectedProducts(newVal) {
      const validProducts = this.productList.filter(p => p.id !== undefined && p.id !== null)
      this.selectAll = newVal.length > 0 && newVal.length === validProducts.length
    }
  },
  mounted() {
    this.fetchProducts()
    this.fetchCategories()
    this.loadBaseData()
  },
  methods: {
    // 延迟关闭搜索下拉
    onSearchBlur() {
      setTimeout(() => {
        this.showSearchDropdown = false
      }, 200)
    },

    // 获取商品列表
    async fetchProducts() {
      this.loading = true
      this.error = null

      try {
        const params = {
          page: this.currentPage,
          size: this.pageSize,
          name: this.searchName,
          code: this.searchCode,
          barcode: this.searchBarcode,
          category_id: this.searchCategoryId,
          status:  this.activeTab,
          need_total_count: true,
        }

        const response = await http.get('/api/v1/mini_core/shop-product', params)

        if (response.data && response.data.code === 200) {
          this.productList = response.data.data
          this.totalProducts = response.data.total

          // 清空选择
          this.selectedProducts = []
          this.selectAll = false
        } else {
          this.error = '获取商品列表失败'
          console.error('获取商品列表返回错误:', response.data)
        }
      } catch (err) {
        this.error = '获取商品列表出错'
        console.error('获取商品列表错误:', err)
      } finally {
        this.loading = false
      }
    },

    // 获取分类列表
    async fetchCategories() {
      try {
        const params = {page:0,size:1000}
        const response = await http.get('/api/v1/mini_core/product-category',params)
        if (response.data && response.data.data) {
          this.categories = response.data.data
        }
      } catch (err) {
        console.error('获取分类列表错误:', err)
      }
    },

    // 加载基础数据
    async loadBaseData() {
      this.categoryOptions = await loadStoreCategories()
    },

    // 获取门店名称
    getStoreName(storeId) {
      if (!storeId) return '-'
      const store = this.categoryOptions.find(store => store.value === String(storeId))
      return store ? store.label : '-'
    },

    // 获取分类名称
    getCategoryName(categoryId) {
      if (!categoryId) return '-'
      const category = this.categories.find(cat => cat.id === categoryId)
      return category ? category.name : '-'
    },

    // 获取商品第一张图片
    getFirstImage(images) {
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
    },

    // 获取状态类名
    getStatusClass(status) {
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
    },

    // 获取状态文本
    getStatusText(status) {
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
    },

    // 切换全选
    toggleSelectAll() {
      if (this.selectAll) {
        this.selectedProducts = this.productList.map(item => item.id).filter(Boolean)
      } else {
        this.selectedProducts = []
      }
    },

    // 切换状态标签
    changeTab(tabValue) {
      this.activeTab = tabValue
      this.currentPage = 1
      this.fetchProducts()
    },

    // 搜索商品
    searchProducts() {
      this.currentPage = 1
      this.fetchProducts()
    },

    // 改变页码
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        this.fetchProducts()
      }
    },

    // 改变每页显示数量
    handlePageSizeChange() {
      this.currentPage = 1
      this.fetchProducts()
    },

    // 跳转页码
    jumpTo() {
      if (this.jumpToPage) {
        const page = parseInt(this.jumpToPage)
        if (!isNaN(page) && page >= 1 && page <= this.totalPages) {
          this.changePage(page)
        }
        this.jumpToPage = ''
      }
    },

    // 切换批量操作菜单
    toggleBatchMenu() {
      this.showBatchMenu = !this.showBatchMenu
    },

    // 批量操作
    async handleBatchAction(action) {
      if (this.selectedProducts.length === 0) {
        ElMessage.warning('请选择要操作的商品')
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

      ElMessageBox.confirm(
        `确认${actionText}选中的 ${this.selectedProducts.length} 个商品吗?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          icon: markRaw(WarningFilled),
        }
      ).then(async () => {
        try {
          this.loading = true

          // 构建请求参数
          const params = {
            ids: this.selectedProducts,
            action: action
          }

          // 调用批量操作API
          const response = await http.post('/api/v1/mini_core/shop-product/batch', params)

          if (response.data && response.data.code === 0) {
            ElMessage.success(`批量${actionText}成功!`)
            // 刷新数据
            this.fetchProducts()
          } else {
            ElMessage.error(`批量${actionText}失败: ${response.data.message || '未知错误'}`)
          }
        } catch (err) {
          console.error(`批量${actionText}错误:`, err)
          ElMessage.error(`批量${actionText}出错: ${err.message || '网络错误'}`)
        } finally {
          this.loading = false
          this.showBatchMenu = false
        }
      }).catch(() => {
        ElMessage.info(`已取消${actionText}操作`)
      })
    },

    // 重建排序
    rebuildSort() {
      // 使用 Element Plus 的 MessageBox 替代原生 confirm
      ElMessageBox.confirm(
        '重建排序后，列表记录将按照创建重新设置排序字段，确定要操作吗？',
        '提示',
        {
          confirmButtonText: '提交',
          cancelButtonText: '取消',
          type: 'warning',
          icon: markRaw(WarningFilled), // 使用警告图标
          draggable: true, // 允许拖动
        }
      )
      .then(async () => {
        try {
          this.loading = true
          const params = {
          page: this.currentPage,
          size: this.pageSize,
          need_total_count: true,
          ordering:["-create_time"]
        }
          const response = await http.post('/api/v1/mini_core/shop-product/shop-product')

          if (response.data && response.data.code === 0) {
            this.productList = response.data.data
            this.totalProducts = response.data.total
            // 刷新数据
            this.fetchProducts()
          } else {
            ElMessage.error(`重建排序失败: ${response.data.message || '未知错误'}`)
          }
        } catch (err) {
          console.error('重建排序错误:', err)
          ElMessage.error(`重建排序出错: ${err.message || '网络错误'}`)
        } finally {
          this.loading = false
        }
      })
      .catch(() => {
        // 用户点击取消按钮
        ElMessage.info('已取消重建排序')
      })
    },

    // 编辑商品
    handleEdit(product) {
      this.$router.push(`/shop/products/add?id=${product.id}`)
    }, 

    // 查看商品
    handleView(product) {
      this.$router.push(`/shop/products/add?id=${product.id}&mode=view`)
    },

    // 删除商品
    handleDelete(product) {
      ElMessageBox.confirm(
        `确认删除商品 "${product.name || '未命名商品'}" 吗?`,
        '删除确认',
        {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning',
          icon: markRaw(WarningFilled),
        }
      ).then(async () => {
        try {
          this.loading = true
          const response = await http.delete(`/api/v1/mini_core/shop-product/${product.id}`)

          if (response.data && response.data.code === 0) {
            ElMessage.success('删除成功!')
            // 刷新数据
            this.fetchProducts()
          } else {
            ElMessage.error(`删除失败: ${response.data.message || '未知错误'}`)
          }
        } catch (err) {
          console.error('删除商品错误:', err)
          ElMessage.error(`删除出错: ${err.message || '网络错误'}`)
        } finally {
          this.loading = false
        }
      }).catch(() => {
        ElMessage.info('已取消删除')
      })
    },

    // 清空所有搜索字段
    clearSearchFields() {
      this.searchName = null
      this.searchCode = null
      this.searchBarcode = null
      this.searchCategoryId = null
      
      // 重置状态标签为"全部"
      this.activeTab = null
    
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

.search-form {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-item {
  position: relative;
}

.search-input, 
.search-select {
  width: 150px;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  outline: none;
  font-size: 14px;
  
  &:focus {
    border-color: #409eff;
  }
}

.search-buttons {
  display: flex;
  gap: 8px;
}

.search-btn, 
.clear-btn {
  height: 38px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 15px;
}

.search-btn {
  background-color: #409eff;
  color: white;
  
  &:hover {
    background-color: #66b1ff;
  }
}

.clear-btn {
  background-color: #f56c6c;
  color: white;
  
  &:hover {
    background-color: #f78989;
  }
}

/* 自定义图标 */
.clear-icon::before {
  content: "×";
  font-size: 16px;
  font-weight: bold;
}

@media (max-width: 1200px) {
  .search-form {
    flex-wrap: wrap;
  }
  
  .search-item {
    flex: 1;
    min-width: 150px;
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

  .btn-action {
    padding: 4px 8px;
    margin: 0 2px;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    font-size: 12px;
    color: white;
    transition: all 0.2s;
  }

  .btn-action.edit {
    background-color: #409eff;
  }

  .btn-action.edit:hover {
    background-color: #66b1ff;
  }

  .btn-action.view {
    background-color: #67c23a;
  }

  .btn-action.view:hover {
    background-color: #85ce61;
  }

  .btn-action.delete {
    background-color: #f56c6c;
  }

  .btn-action.delete:hover {
    background-color: #f78989;
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
