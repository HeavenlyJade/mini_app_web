<template>
  <div class="page-container">
    <!-- Page Header -->
    <div class="page-header">
      <h2 class="page-title">门店分类管理</h2>
      <div class="header-actions">
        <el-button type="primary" icon="el-icon-plus" @click="showAddCategoryDialog">添加</el-button>
        <el-button type="danger" icon="el-icon-delete" :disabled="!hasSelection" @click="handleBatchDelete">批量删除
        </el-button>
        <el-button type="success" icon="el-icon-download" @click="exportCategories">导出</el-button>
      </div>
    </div>

    <!-- Search Filter -->
    <div class="search-container">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="分类名称">
          <el-input v-model="searchForm.name" placeholder="请输入分类名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="正常" value="正常"></el-option>
            <el-option label="停用" value="停用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- Categories Tree Table -->
    <div class="page-content">
      <el-table
        :data="treeTableData"
        border
        row-key="id"
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        @selection-change="handleSelectionChange"
        v-loading="tableLoading">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="编号" min-width="80">
          <template #default="scope">
            <div class="category-name-cell">
              <span>{{ scope.row.id }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" min-width="80">
          <template #default="scope">
            <div class="category-name-cell">
              <span> {{ scope.row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" min-width="80">
          <template #default="scope">
            <div class="category-name-cell">
              <span>{{ scope.row.type }}</span>
            </div>
          </template>
        </el-table-column>
        <!--        <el-table-column prop="icon" label="图标" width="120">-->
        <!--          <template #default="scope">-->
        <!--            <img v-if="scope.row.icon" :src="scope.row.icon" class="category-icon" alt="图标">-->
        <!--            <span v-else>-</span>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <!--        <el-table-column prop="image" label="图片" width="120">-->
        <!--          <template #default="scope">-->
        <!--            <img v-if="scope.row.image" :src="scope.row.image" class="category-image" alt="图片">-->
        <!--            <span v-else>-</span>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === '正常' ? 'success' : 'info'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
            <el-button type="text" size="small" @click="addSubCategory(scope.row)">添加子分类</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Add/Edit Category Dialog -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="600px">
      <el-form :model="categoryForm" ref="categoryForm" :rules="rules" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="categoryForm.name" placeholder="自定义类型，32个字以内"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="categoryForm.remark" type="textarea" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-input v-model="categoryForm.type" placeholder="自定义类型，32个字以内"></el-input>
        </el-form-item>
        <el-form-item label="上级分类">
          <el-cascader
            v-model="categoryForm.parent_id"
            :options="cascaderOptions"
            :props="{
              checkStrictly: true,
              value: 'id',
              label: 'name',
              emitPath: false
            }"
            placeholder="请选择上级分类"
            clearable
            style="width: 100%">
          </el-cascader>
        </el-form-item>
        <el-form-item label="编号" v-if="isEdit">
          <el-input v-model="categoryForm.code" placeholder="自定义编号，32个字符以内"></el-input>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input v-model.number="categoryForm.sort_order" placeholder="0"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="categoryForm.status">
            <el-radio label="正常">正常</el-radio>
            <el-radio label="停用">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <!--        <el-form-item label="免审核">-->
        <!--          <el-radio-group v-model="categoryForm.requireApproval">-->
        <!--            <el-radio :label="false">该分类下的商家人注是免审核</el-radio>-->
        <!--            <el-radio :label="true">需要审核</el-radio>-->
        <!--          </el-radio-group>-->
        <!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import http from '@/utils/http'

export default {
  name: 'CategoryManagement',
  data () {
    return {
      // 存储分类数据
      categories: [],
      selection: [],
      hasSelection: false,
      dialogVisible: false,
      isEdit: false,
      dialogTitle: '添加分类',
      // 修改你的categoryForm初始化，使其与API期望的字段名称匹配：
      categoryForm: {
        name: '',
        remark: '', // 不是remarks
        type: '',
        parent_id: null, // 不是parentId
        code: '',
        sort_order: 0, // 这应该与API期望的匹配
        status: '正常',
        is_recommend: false
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          },
          {
            max: 32,
            message: '长度不能超过32个字符',
            trigger: 'blur'
          }
        ],
        sort_order: [
          {
            type: 'number',
            message: '请输入数字',
            trigger: 'blur'
          }
        ]
      },
      searchForm: {
        name: null,
        status: null
      },
      tableLoading: false,
    }
  },
  computed: {
    // 转换为树形结构数据
    treeTableData () {
      const filteredData = this.getFilteredData()
      return this.convertToTreeData(filteredData)
    },

    // 转换为级联选择器所需的树形结构
    cascaderOptions () {
      const options = [{
        id: null,
        name: '顶级分类'
      }]

      // 添加所有可选的分类
      const filteredCategories = this.categories.filter(cat => {
        if (this.isEdit && cat.id === this.categoryForm.id) {
          return false // 编辑时排除自身，防止自己选择自己作为父级
        }
        return true
      })

      const treeData = this.convertToTreeData(filteredCategories)
      return [...options, ...treeData]
    }
  },

  created () {
    // 在组件创建时加载数据
    this.fetchCategories()
  },

  methods: {
    // 从API获取分类数据
    async fetchCategories () {
      this.tableLoading = true
      try {
        // 使用shop-store-category API获取分类列表
        const response = await http.get('/api/v1/mini_core/shop-store-category', this.searchForm)

        if (response.data && response.data.code === 200) {
          this.categories = response.data.data || []
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

    // 筛选数据（基于搜索条件）
    getFilteredData () {
      let filtered = [...this.categories]

      if (this.searchForm.name) {
        filtered = filtered.filter(item =>
          item.name && item.name.includes(this.searchForm.name))
      }

      if (this.searchForm.status) {
        filtered = filtered.filter(item =>
          item.status === this.searchForm.status)
      }

      return filtered
    },

    // 将扁平数据转换为树形结构
    convertToTreeData (data) {
      const result = []
      const map = {}

      // 首先创建所有节点的映射
      data.forEach(item => {
        map[item.id] = {
          ...item,
          children: []
        }
      })

      // 然后构建树
      data.forEach(item => {
        const node = map[item.id]

        if (!item.parent_id) {
          // 根节点直接放入结果数组
          result.push(node)
        } else {
          // 子节点放入父节点的 children 数组
          if (map[item.parent_id]) {
            map[item.parent_id].children.push(node)
          } else {
            // 如果找不到父节点，作为根节点处理
            result.push(node)
          }
        }
      })

      return result
    },

    // 显示添加分类对话框
    showAddCategoryDialog () {
      this.isEdit = false
      this.dialogTitle = '增加分类'
      this.categoryForm = {
        name: '',
        remark: '',
        type: '',
        parent_id: null,
        sort_order: 0,
        status: '正常',
        is_recommend: false
      }
      this.dialogVisible = true
    },

    // 处理搜索
    handleSearch () {
      this.fetchCategories()
    },

    // 重置搜索表单
    resetSearch () {
      this.searchForm = {
        name: '',
        status: ''
      }
      this.fetchCategories()
    },

    // 导出分类
    exportCategories () {
      // 实现导出功能，可能需要调用后端API
      this.$message.info('导出功能开发中')
    },

    // 添加子分类
    addSubCategory (row) {
      this.showAddCategoryDialog()
      this.categoryForm.parent_id = row.id
    },

    // 编辑分类
    handleEdit (row) {
      this.isEdit = true
      this.dialogTitle = '编辑分类'

      // 获取分类详情
      this.getCategoryDetail(row.id)
    },

    // 获取分类详情
    async getCategoryDetail (categoryId) {
      this.tableLoading = true
      try {
        const response = await http.get(`/api/v1/mini_core/shop-store-category/${categoryId}`)

        if (response.data && response.data.code === 200) {
          // 设置表单数据
          this.categoryForm = response.data.data || {}
          this.dialogVisible = true
        } else {
          this.$message.error('获取分类详情失败')
        }
      } catch (error) {
        console.error('获取分类详情错误:', error)
        this.$message.error('获取分类详情出错: ' + (error.message || '未知错误'))
      } finally {
        this.tableLoading = false
      }
    },
    // 删除分类
    handleDelete (row) {
      this.$confirm('确认删除该分类?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteCategory(row.id)
      }).catch(() => {
        // 用户取消
      })
    },

    // 调用API删除分类
    async deleteCategory (categoryId) {
      this.tableLoading = true
      try {
        const response = await http.delete(`/api/v1/mini_core/shop-store-category/${categoryId}`)

        if (response.data && response.data.code === 200) {
          this.$message.success('删除成功!')
          this.fetchCategories() // 重新加载数据
        } else {
          this.$message.error('删除失败: ' + (response.data.message || '未知错误'))
        }
      } catch (error) {
        console.error('删除分类错误:', error)
        this.$message.error('删除出错: ' + (error.message || '未知错误'))
      } finally {
        this.tableLoading = false
      }
    },

    // 批量删除
    handleBatchDelete () {
      if (this.selection.length === 0) return

      this.$confirm(`确认删除选中的${this.selection.length}个分类?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 收集所有要删除的ID
        const ids = this.selection.map(item => item.id)
        this.batchDeleteCategories(ids)
      }).catch(() => {
        // 用户取消
      })
    },

    // 调用API批量删除分类
    async batchDeleteCategories (ids) {
      if (ids.length === 0) {
        this.$message.warning('请选择要删除的分类')
        return
      }

      this.tableLoading = true
      try {
        const response = await http.post('/api/v1/mini_core/batch-delete',{ids: ids} )

        // 根据后端返回的结构处理响应
        if (response.data.code === 200) {
          this.$message.success(response.data.message || '批量删除成功!')
          this.fetchCategories() // 重新加载数据
          this.selection = []
          this.hasSelection = false
        } else {
          // 处理后端返回的错误信息
          this.$message.error(response.data.message || '批量删除出错')
        }
      } catch (error) {
        console.error('批量删除错误:', error)
        this.$message.error('批量删除出错: ' + (error.message || '未知错误'))
      } finally {
        this.tableLoading = false
      }
    },
    // 表格选择变化
    handleSelectionChange (selection) {
      this.selection = selection
      this.hasSelection = selection.length > 0
    },

    // 提交表单
    submitForm () {
      this.$refs.categoryForm.validate(async (valid) => {
        if (valid) {
          this.tableLoading = true
          try {
            let response

            if (this.isEdit) {
              // 编辑现有分类
              response = await http.put(`/api/v1/mini_core/shop-store-category/${this.categoryForm.id}`, this.categoryForm)
            } else {
              // 添加新分类
              response = await http.post('/api/v1/mini_core/shop-store-category', this.categoryForm)
            }

            if (response.data && response.data.code === 200) {
              this.$message.success(this.isEdit ? '更新成功!' : '添加成功!')
              this.dialogVisible = false
              this.fetchCategories() // 重新加载数据
            } else {
              this.$message.error((this.isEdit ? '更新' : '添加') + '失败: ' + (response.data.message || '未知错误'))
            }
          } catch (error) {
            console.error((this.isEdit ? '编辑' : '添加') + '分类错误:', error)
            this.$message.error((this.isEdit ? '编辑' : '添加') + '分类出错: ' + (error.message || '未知错误'))
          } finally {
            this.tableLoading = false
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.page-container {
  padding: 20px;
  width: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.page-content {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.category-name-cell {
  display: flex;
  align-items: center;
}

.category-tree-line {
  color: #999;
  margin-right: 5px;
}

.category-icon, .category-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
}

.upload-buttons {
  display: flex;
  gap: 10px;
}

.extension-property {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.extension-list {
  margin-top: 15px;
  border-top: 1px dashed #eee;
  padding-top: 10px;
}

.extension-item {
  background-color: #f5f7fa;
  padding: 5px 10px;
  border-radius: 4px;
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
