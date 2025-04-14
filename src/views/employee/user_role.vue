<template>
    <div class="page-container">
      <div class="page-header">
        <h2 class="page-title">角色管理</h2>
        <el-button type="primary" @click="handleAdd">新增角色</el-button>
      </div>
  
      <div class="page-content">
        <!-- 搜索区域 -->
        <div class="search-box">
          <el-form :inline="true" :model="searchForm">
            <el-form-item label="角色编号">
              <el-input v-model="searchForm.roleNumber" placeholder="请输入角色编号" clearable />
            </el-form-item>
            <el-form-item label="创建人">
              <el-input v-model="searchForm.creator" placeholder="请输入创建人" clearable />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button @click="resetSearch">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
  
        <!-- 表格区域 -->
        <el-table :data="tableData" border v-loading="loading" style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="role_number" label="角色编号" width="120" />
          <el-table-column prop="creator" label="创建人" width="120" />
          <el-table-column prop="create_time" label="创建时间" width="180">
            <template #default="scope">
              {{ formatTime(scope.row.create_time) }}
            </template>
          </el-table-column>
          <el-table-column prop="modifier" label="修改人" width="120" />
          <el-table-column prop="update_time" label="更新时间" width="180">
            <template #default="scope">
              {{ formatTime(scope.row.update_time) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250" fixed="right">
            <template #default="scope">
              <el-button link type="primary" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button link type="primary" @click="handlePermissions(scope.row)">权限设置</el-button>
              <el-button link type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
  
        <!-- 分页 -->
        <div class="pagination-box">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
  
      <!-- 角色表单对话框 -->
      <el-dialog
        :title="dialogTitle"
        v-model="dialogVisible"
        width="500px"
        :close-on-click-modal="false"
      >
        <el-form :model="roleForm" :rules="rules" ref="roleFormRef" label-width="100px">
          <el-form-item label="角色编号" prop="role_number">
            <el-input v-model="roleForm.role_number" placeholder="请输入角色编号" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitForm">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { ElMessage, ElMessageBox } from 'element-plus'
  import http from '@/utils/http'
  
  export default {
    name: 'RoleManagement',
    data() {
      return {
        loading: false,
        tableData: [],
        total: 0,
        currentPage: 1,
        pageSize: 10,
        dialogVisible: false,
        dialogTitle: '',
        searchForm: {
          roleNumber: '',
          creator: ''
        },
        roleForm: {
          role_number: ''
        },
        rules: {
          role_number: [
            { required: true, message: '请输入角色编号', trigger: 'blur' }
          ]
        }
      }
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      // 获取角色列表
      async fetchData() {
        this.loading = true
        try {
          const response = await http.get('/api/v1/roles/', {
            page: this.currentPage,
            size: this.pageSize,
            role_number: this.searchForm.roleNumber || undefined,
            creator: this.searchForm.creator || undefined
          })
          
          if (response.data) {
            this.tableData = response.data.items || []
            this.total = response.data.total || 0
          }
        } catch (error) {
          console.error('获取角色列表失败:', error)
        } finally {
          this.loading = false
        }
      },
  
      // 格式化时间
      formatTime(timeStr) {
        if (!timeStr) return '-'
        return new Date(timeStr).toLocaleString()
      },
  
      // 搜索
      handleSearch() {
        this.currentPage = 1
        this.fetchData()
      },
  
      // 重置搜索
      resetSearch() {
        this.searchForm.roleNumber = ''
        this.searchForm.creator = ''
        this.handleSearch()
      },
  
      // 新增角色
      handleAdd() {
        this.dialogTitle = '新增角色'
        this.roleForm = {
          role_number: ''
        }
        this.dialogVisible = true
      },
  
      // 编辑角色
      handleEdit(row) {
        this.dialogTitle = '编辑角色'
        this.roleForm = { ...row }
        this.dialogVisible = true
      },
  
      // 提交表单
      async submitForm() {
        if (!this.$refs.roleFormRef) return
        
        try {
          await this.$refs.roleFormRef.validate()
          if (this.dialogTitle === '新增角色') {
            await http.post('/api/v1/roles/', this.roleForm)
            ElMessage.success('新增成功')
          } else {
            await http.put(`/api/v1/roles/${this.roleForm.id}`, this.roleForm)
            ElMessage.success('更新成功')
          }
          this.dialogVisible = false
          this.fetchData()
        } catch (error) {
          console.error('保存失败:', error)
        }
      },
  
      // 删除角色
      handleDelete(row) {
        ElMessageBox.confirm('确认删除该角色吗？', '提示', {
          type: 'warning'
        }).then(async () => {
          try {
            await http.delete(`/api/v1/roles/${row.id}`)
            ElMessage.success('删除成功')
            this.fetchData()
          } catch (error) {
            console.error('删除失败:', error)
          }
        })
      },
  
      // 权限设置
      handlePermissions(row) {
        // 跳转到权限设置页面或打开权限设置弹窗
      },
  
      // 分页相关方法
      handleSizeChange(val) {
        this.pageSize = val
        this.fetchData()
      },
  
      handleCurrentChange(val) {
        this.currentPage = val
        this.fetchData()
      }
    }
  }
  </script>
  
  <style scoped>
  .page-container {
    padding: 20px;
  }
  
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .search-box {
    margin-bottom: 20px;
    padding: 20px;
    background-color: #fff;
    border-radius: 4px;
  }
  
  .pagination-box {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
  
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  </style>