<template>
    <div class="page-container">
      <div class="page-header">
        <h2 class="page-title">分销等级设置</h2>
      </div>
  
      <div class="page-content">
        <!-- 搜索区域 -->
        <div class="search-box">
          <el-form :inline="true" :model="searchForm">
            <el-form-item label="等级名称">
              <el-input 
                v-model="searchForm.name" 
                placeholder="请输入等级名称" 
                clearable
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button @click="resetSearch">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
  
        <!-- 操作按钮 -->
        <div class="operation-box">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon> 新增
          </el-button>
          <el-button @click="refreshData">刷新</el-button>
        </div>
  
        <!-- 表格区域 -->
        <el-table
          :data="tableData"
          border
          v-loading="loading"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="等级名称" min-width="150" />
          <el-table-column prop="level" label="等级权重" width="100" />
          <el-table-column prop="self_ratio" label="自购商品比例" width="120">
            <template #default="scope">
              {{ scope.row.self_ratio }}%
            </template>
          </el-table-column>
          <el-table-column prop="first_ratio" label="一级推荐比例" width="120">
            <template #default="scope">
              {{ scope.row.first_ratio }}%
            </template>
          </el-table-column>
          <el-table-column prop="second_ratio" label="二级推荐比例" width="120">
            <template #default="scope">
              {{ scope.row.second_ratio }}%
            </template>
          </el-table-column>
          <el-table-column prop="description" label="等级描述" min-width="180" />
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="scope">
              <el-button link type="primary" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button link type="danger" @click="handleDelete(scope.row)">删除</el-button>
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
  
        <!-- 添加/编辑对话框 -->
        <el-dialog
          :title="isEdit ? '编辑等级' : '新增等级'"
          v-model="dialogVisible"
          width="600px"
          @close="resetForm"
        >
          <el-form
            ref="levelForm"
            :model="levelForm"
            :rules="rules"
            label-width="120px"
          >
            <el-form-item label="等级名称" prop="name">
              <el-input v-model="levelForm.name" placeholder="请输入等级名称" />
            </el-form-item>
            
            <el-form-item label="等级权重" prop="level">
              <el-input-number 
                v-model="levelForm.level" 
                :min="1" 
                :precision="0"
                placeholder="数字越大等级越高"
              />
            </el-form-item>
            
            <el-form-item label="自购商品比例" prop="self_ratio">
              <el-input-number 
                v-model="levelForm.self_ratio" 
                :min="0" 
                :max="100" 
                :precision="2"
                :step="0.1"
              />
              <span class="unit">%</span>
            </el-form-item>
            
            <el-form-item label="一级推荐比例" prop="first_ratio">
              <el-input-number 
                v-model="levelForm.first_ratio" 
                :min="0" 
                :max="100" 
                :precision="2"
                :step="0.1"
              />
              <span class="unit">%</span>
            </el-form-item>
            
            <el-form-item label="二级推荐比例" prop="second_ratio">
              <el-input-number 
                v-model="levelForm.second_ratio" 
                :min="0" 
                :max="100" 
                :precision="2"
                :step="0.1"
              />
              <span class="unit">%</span>
            </el-form-item>
            
            <el-form-item label="等级描述" prop="description">
              <el-input 
                v-model="levelForm.description" 
                type="textarea"
                :rows="3" 
                placeholder="请输入等级描述"
              />
            </el-form-item>
          </el-form>
          
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="submitForm" :loading="submitLoading">
                确认
              </el-button>
            </span>
          </template>
        </el-dialog>
      </div>
    </div>
  </template>
  
  <script>
  import { Plus } from '@element-plus/icons-vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import http from '@/utils/http'
  
  export default {
    name: 'DistributionLevelSetting',
    components: {
      Plus
    },
    data() {
      return {
        // 搜索表单
        searchForm: {
          name: ''
        },
        
        // 表格数据
        loading: false,
        tableData: [],
        currentPage: 1,
        pageSize: 15,
        total: 0,
        selectedRows: [],
        
        // 对话框
        dialogVisible: false,
        isEdit: false,
        submitLoading: false,
        levelForm: {
          id: null,
          name: '',
          level: 1,
          self_ratio: 0,
          first_ratio: 0,
          second_ratio: 0,
          description: ''
        },
        
        // 表单验证规则
        rules: {
          name: [
            { required: true, message: '请输入等级名称', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ],
          level: [
            { required: true, message: '请输入等级权重', trigger: 'blur' },
            { type: 'number', min: 1, message: '权重必须大于0', trigger: 'blur' }
          ],
          self_ratio: [
            { required: true, message: '请输入自购商品比例', trigger: 'blur' },
            { type: 'number', min: 0, max: 100, message: '比例必须在0-100之间', trigger: 'blur' }
          ],
          first_ratio: [
            { required: true, message: '请输入一级推荐比例', trigger: 'blur' },
            { type: 'number', min: 0, max: 100, message: '比例必须在0-100之间', trigger: 'blur' }
          ],
          second_ratio: [
            { required: true, message: '请输入二级推荐比例', trigger: 'blur' },
            { type: 'number', min: 0, max: 100, message: '比例必须在0-100之间', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      // 获取等级列表
      async fetchData() {
        this.loading = true
        try {
          const response = await http.get('/api/v1/mini_core/distribution/levels', {
            params: {
              page: this.currentPage,
              size: this.pageSize,
              name: this.searchForm.name || undefined
            }
          })
          
          if (response.data && response.data.code === 200) {
            this.tableData = response.data.data
            this.total = response.data.total
          } else {
            ElMessage.error('获取数据失败')
          }
        } catch (error) {
          console.error('获取等级列表失败:', error)
          ElMessage.error('获取列表失败')
        } finally {
          this.loading = false
        }
      },
      
      // 刷新数据
      refreshData() {
        this.fetchData()
      },
      
      // 搜索
      handleSearch() {
        this.currentPage = 1
        this.fetchData()
      },
      
      // 重置搜索
      resetSearch() {
        this.searchForm = {
          name: ''
        }
        this.handleSearch()
      },
      
      // 选择变化
      handleSelectionChange(selection) {
        this.selectedRows = selection
      },
      
      // 添加等级
      handleAdd() {
        this.isEdit = false
        this.dialogVisible = true
        this.resetForm()
      },
      
      // 编辑等级
      handleEdit(row) {
        this.isEdit = true
        this.levelForm = JSON.parse(JSON.stringify(row))
        this.dialogVisible = true
      },
      
      // 删除等级
      handleDelete(row) {
        ElMessageBox.confirm(`确定要删除等级 "${row.name}" 吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          try {
            const response = await http.delete(`/api/v1/mini_core/distribution/levels/${row.id}`)
            if (response.data && response.data.code === 200) {
              ElMessage.success('删除成功')
              this.fetchData()
            } else {
              ElMessage.error('删除失败')
            }
          } catch (error) {
            console.error('删除失败:', error)
            ElMessage.error('删除失败')
          }
        }).catch(() => {})
      },
      
      // 重置表单
      resetForm() {
        if (this.$refs.levelForm) {
          this.$refs.levelForm.resetFields()
        }
        
        this.levelForm = {
          id: null,
          name: '',
          level: 1,
          self_ratio: 0,
          first_ratio: 0,
          second_ratio: 0,
          description: ''
        }
      },
      
      // 提交表单
      async submitForm() {
        try {
          await this.$refs.levelForm.validate()
        } catch (error) {
          return false
        }
        
        this.submitLoading = true
        try {
          let response
          const formData = { ...this.levelForm }
          
          if (this.isEdit) {
            // 编辑
            response = await http.put(`/api/v1/mini_core/distribution/levels/${formData.id}`, formData)
          } else {
            // 新增
            response = await http.post('/api/v1/mini_core/distribution/levels', formData)
          }
          
          if (response.data && response.data.code === 200) {
            ElMessage.success(this.isEdit ? '编辑成功' : '新增成功')
            this.dialogVisible = false
            this.fetchData()
          } else {
            ElMessage.error(response.data?.message || (this.isEdit ? '编辑失败' : '新增失败'))
          }
        } catch (error) {
          console.error(this.isEdit ? '编辑失败:' : '新增失败:', error)
          ElMessage.error(this.isEdit ? '编辑失败' : '新增失败')
        } finally {
          this.submitLoading = false
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
  
  .operation-box {
    margin-bottom: 16px;
    display: flex;
    gap: 10px;
  }
  
  .pagination-box {
    padding: 16px;
    display: flex;
    justify-content: flex-end;
  }
  
  .unit {
    margin-left: 8px;
    color: #606266;
  }
  
  :deep(.el-table) {
    width: 100% !important;
  }
  
  :deep(.el-table__body) {
    width: 100% !important;
  }
  
  @media (max-width: 768px) {
    .el-form-item {
      margin-bottom: 10px;
    }
    
    :deep(.el-form--inline .el-form-item) {
      display: block;
      margin-right: 0;
      width: 100%;
    }
    
    :deep(.el-dialog) {
      width: 90% !important;
    }
  }
  </style>