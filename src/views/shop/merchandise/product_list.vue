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
            <button class="btn btn-secondary">批量操作 <i class="arrow-down"></i></button>
            <!-- 下拉菜单内容 -->
            <div class="dropdown-content" v-if="showBatchMenu">
              <div class="dropdown-item">批量上架</div>
              <div class="dropdown-item">批量下架</div>
              <div class="dropdown-item">批量删除</div>
            </div>
          </div>
          <button class="btn btn-danger">
            <i class="refresh-icon"></i> 重建排序
          </button>
        </div>

        <div class="right-actions">
          <div class="search-wrapper">
            <input
              type="text"
              class="search-input"
              placeholder="商品分类"
              v-model="searchQuery"
              @focus="showSearchDropdown = true"
              @blur="onSearchBlur"
            />
            <button class="search-btn">
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
        <div
          v-for="(tab, index) in statusTabs"
          :key="index"
          class="status-tab"
          :class="{ active: activeTab === tab.value }"
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
        </div>
      </div>

      <!-- 商品表格 -->
      <div class="product-table">
        <table>
          <thead>
          <tr>
            <th class="checkbox-col">
              <input type="checkbox" v-model="selectAll" @change="toggleSelectAll"/>
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
          <tr v-for="(product, index) in productList" :key="product.id">
            <td class="checkbox-col">
              <input
                type="checkbox"
                :value="product.id"
                v-model="selectedProducts"
              />
            </td>
            <td class="image-col">
              <img :src="product.image" :alt="product.name" class="product-image"/>
            </td>
            <td class="code-col">
              {{ product.code }}<br/>
              <span class="secondary-text">{{ product.barcode }}</span>
            </td>
            <td class="name-col">
              <div class="product-name">
                <span v-if="product.isRecommended" class="tag recommended">[推荐]</span>
                {{ product.name }}
              </div>
            </td>
            <td class="category-col">{{ product.category }}</td>
            <td class="shop-col">{{ product.shop }}</td>
            <td class="store-col">{{ product.storeCategory }}</td>
            <td class="stock-col">
              {{ product.stock }}
              <div class="status-badge" :class="product.status">{{ product.statusText }}</div>
            </td>
            <td class="price-col">
              <span class="price">¥ {{ product.price }}</span>
              <span class="original-price" v-if="product.originalPrice">¥ {{ product.originalPrice }}</span>
            </td>
            <td class="actions-col">
              <button class="btn-icon edit">
                <i class="edit-icon"></i>
              </button>
              <button class="btn-icon view">
                <i class="view-icon"></i>
              </button>
              <button class="btn-icon delete">
                <i class="delete-icon"></i>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div class="pagination">
        <div class="pagination-info">Total {{ totalProducts }}</div>
        <div class="page-size-selector">
          <select v-model="pageSize">
            <option value="50">50/page</option>
            <option value="100">100/page</option>
            <option value="200">200/page</option>
          </select>
        </div>
        <div class="pagination-controls">
          <button
            class="pagination-btn prev"
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
          >
            &lt;
          </button>
          <div class="page-numbers">
            <div
              v-for="page in displayPages"
              :key="page"
              class="page-number"
              :class="{ active: currentPage === page }"
              @click="changePage(page)"
            >
              {{ page }}
            </div>
          </div>
          <button
            class="pagination-btn next"
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
          >
            &gt;
          </button>
          <div class="jump-page">
            Go to
            <input
              type="text"
              v-model="jumpToPage"
              @keyup.enter="jumpTo"
              class="jump-input"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'

// 搜索和下拉
const searchQuery = ref('')
const showSearchDropdown = ref(false)
const showBatchMenu = ref(false)

// 统计数据
const stats = ref({
  views: 2,
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

// 模拟商品数据
const productList = ref([
  {
    id: 1,
    image: '/product-1.jpg',
    code: '1962891',
    barcode: '-',
    name: '金酱酒53度500ml贵州金酱酒香型白酒十大名酒档次粮食送礼高度',
    category: '研发产品',
    shop: '-',
    storeCategory: '研发产品',
    stock: 200,
    status: 'in-stock',
    statusText: '上架',
    price: 586,
    originalPrice: null,
    isRecommended: false
  },
  {
    id: 2,
    image: '/product-2.jpg',
    code: '1962887',
    barcode: '-',
    name: '金酱53度250ml金酱白酒香型酒庄白酒节国产送礼盒档次纯粮高度',
    category: '系列酒酒',
    shop: '-',
    storeCategory: '系列酒酒',
    stock: 999996,
    status: 'in-stock',
    statusText: '上架',
    price: 198,
    originalPrice: 388,
    isRecommended: true
  },
  {
    id: 3,
    image: '/product-3.jpg',
    code: '1961512',
    barcode: '-',
    name: '金酱酱香型53度500ml粮标贵州手工酿造高端商务礼盒装单瓶装',
    category: '自主产品',
    shop: '-',
    storeCategory: '自主产品',
    stock: 36,
    status: 'in-stock',
    statusText: '上架',
    price: 899,
    originalPrice: 899,
    isRecommended: false
  },
  {
    id: 4,
    image: '/product-4.jpg',
    code: '1961515',
    barcode: 'a0000000001',
    name: '53度500ml金酱酒金标贵州酱香型手工酿造高端商务礼盒装单瓶装',
    category: '自主产品',
    shop: '-',
    storeCategory: '自主产品',
    stock: 99999,
    status: 'in-stock',
    statusText: '上架',
    price: 1099,
    originalPrice: 1099,
    isRecommended: true
  },
  {
    id: 5,
    image: '/product-5.jpg',
    code: '1961511',
    barcode: '-',
    name: '53度500ml高度白酒金酱v15贵州送礼盒酱香型高端商务礼盒装单瓶',
    category: '自主产品',
    shop: '-',
    storeCategory: '自主产品',
    stock: 56,
    status: 'in-stock',
    statusText: '上架',
    price: 1299,
    originalPrice: 1299,
    isRecommended: false
  },
  {
    id: 6,
    image: '/product-6.jpg',
    code: '1961484',
    barcode: '-',
    name: '53度500ml金酱馆品贵州高度白酒酱香型粮食高端商务礼盒装单瓶装',
    category: '定制产品',
    shop: '-',
    storeCategory: '定制产品',
    stock: 999996,
    status: 'in-stock',
    statusText: '上架',
    price: 899,
    originalPrice: null,
    isRecommended: true
  }
])

// 切换全选
const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedProducts.value = productList.value.map(product => product.id)
  } else {
    selectedProducts.value = []
  }
}

// 监听选中项变化
const selectedCount = computed(() => selectedProducts.value.length)
const allSelected = computed(() => {
  return selectedProducts.value.length === productList.value.length
})

// 分页
const totalProducts = ref(6)
const currentPage = ref(1)
const pageSize = ref(50)
const jumpToPage = ref('')

const totalPages = computed(() => {
  return Math.ceil(totalProducts.value / pageSize.value)
})

const displayPages = computed(() => {
  // 简单分页显示，实际项目中可能需要更复杂的逻辑
  return Array.from({ length: totalPages.value }, (_, i) => i + 1)
})

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    // 这里可以添加加载数据的逻辑
  }
}

const jumpTo = () => {
  const page = parseInt(jumpToPage.value)
  if (!isNaN(page) && page >= 1 && page <= totalPages.value) {
    changePage(page)
  }
  jumpToPage.value = ''
}

// 初始化
onMounted(() => {
  // 这里可以添加初始化加载数据的逻辑
})
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

.left-actions, .right-actions {
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

  th, td {
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

  .code-col, .shop-col, .store-col {
    width: 100px;
  }

  .name-col {
    width: 300px;
    text-align: left;
  }

  .category-col {
    width: 120px;
  }

  .stock-col, .price-col {
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
