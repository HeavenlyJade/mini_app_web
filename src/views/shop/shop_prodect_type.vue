<template>
  <div class="category-list-container">
    <!-- Action toolbar -->
    <div class="toolbar">
      <el-select v-model="storeFilter" placeholder="门店" class="filter-item">
        <el-option label="全部门店" value="all"></el-option>
      </el-select>

      <el-input
        placeholder="搜索"
        v-model="searchKeyword"
        class="filter-item">
        <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
      </el-input>

      <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
      <el-button type="danger" icon="el-icon-delete" @click="handleDeleteByGroup">删除所有选中</el-button>
      <el-button type="success" @click="handleExpandAll">一键展开/折叠</el-button>
      <el-button @click="handleBatchDelete">批量删除</el-button>
    </div>

    <!-- Category table -->
    <el-table
      ref="categoryTable"
      :data="categoryList"
      row-key="id"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="name" label="编号/名称" width="200"></el-table-column>
      <el-table-column prop="type" label="编号/类型" width="150"></el-table-column>
      <el-table-column label="图标" width="120">
        <template slot-scope="scope">
          <img :src="scope.row.icon" v-if="scope.row.icon" class="category-icon">
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="图片" width="120">
        <template slot-scope="scope">
          <img :src="scope.row.image" v-if="scope.row.image" class="category-image">
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status === '正常'">正常</el-tag>
          <el-tag type="info" v-else>停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="handleAddSub(scope.row)">添加</el-button>
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'CategoryList',
  data() {
    return {
      storeFilter: '',
      searchKeyword: '',
      categoryList: [
        {
          id: '484674',
          name: '自主产品',
          type: '1\nindex',
          icon: require('@/assets/img/classoc_case/img_2.png'),
          image: '',
          status: '正常'
        },
        {
          id: '484675',
          name: '研发产品',
          type: '2',
          icon: require('@/assets/img/classoc_case/img_2.png'),
          image: '',
          status: '正常'
        },
        {
          id: '484676',
          name: '定制产品',
          type: '3',
          icon: require('@/assets/img/classoc_case/img_2.png'),
          image: '',
          status: '正常'
        },
        {
          id: '485083',
          name: '系列酒酒',
          type: '4',
          icon: require('@/assets/img/classoc_case/img_2.png'),
          image: '',
          status: '正常'
        }
      ],
      selectedCategories: []
    }
  },
  methods: {
    handleSearch() {
      // Implement search functionality
      console.log('Searching for:', this.searchKeyword)
    },
    handleAdd() {
      // Navigate to add category page
      this.$router.push('/category/add')
    },
    handleAddSub(row) {
      // Navigate to add subcategory page with parent id
      this.$router.push(`/category/add?parentId=${row.id}`)
    },
    handleEdit(row) {
      // Navigate to edit category page
      this.$router.push(`/category/edit/${row.id}`)
    },
    handleDelete(row) {
      this.$confirm('确认删除该分类吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // Delete category logic
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleDeleteByGroup() {
      if (this.selectedCategories.length === 0) {
        this.$message.warning('请先选择要删除的分类')
        return
      }

      this.$confirm(`确认删除选中的 ${this.selectedCategories.length} 个分类吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // Delete selected categories logic
        this.$message({
          type: 'success',
          message: '批量删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleBatchDelete() {
      // Similar to handleDeleteByGroup but may have different implementation
    },
    handleExpandAll() {
      // Toggle expand/collapse all rows
      console.log('Toggle expand/collapse all')
    },
    handleSelectionChange(val) {
      this.selectedCategories = val
    }
  }
}
</script>

<style scoped>
.category-list-container {
  padding: 20px;
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
</style>
