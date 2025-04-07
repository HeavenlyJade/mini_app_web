<template>
    <div class="page-container">
      <div class="page-header">
        <h2 class="page-title">员工管理</h2>
        <div class="header-actions">
          <el-button type="primary" @click="handleAddUser">
            <el-icon><Plus /></el-icon> 新增员工
          </el-button>
          <el-button @click="refreshData">
            <el-icon><Refresh /></el-icon> 刷新
          </el-button>
        </div>
      </div>
  
      <div class="page-content">
        <!-- 搜索区域 -->
        <div class="search-box">
          <el-form :inline="true" :model="searchForm">
            <el-form-item label="用户名">
              <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable></el-input>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="searchForm.mobile" placeholder="请输入手机号" clearable></el-input>
            </el-form-item>
            <el-form-item label="部门">
              <el-select v-model="searchForm.department_id" placeholder="请选择部门" clearable>
                <el-option 
                  v-for="item in departmentOptions" 
                  :key="item.id" 
                  :label="item.name" 
                  :value="item.id">
                </el-option>
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
          <el-table-column prop="username" label="用户名" min-width="120" />
          <el-table-column prop="mobile" label="手机号" width="120">
            <template #default="scope">
              {{ scope.row.mobile || '未设置' }}
            </template>
          </el-table-column>
          <el-table-column prop="email" label="邮箱" width="180">
            <template #default="scope">
              {{ scope.row.email || '未设置' }}
            </template>
          </el-table-column>
          <el-table-column prop="department" label="部门" min-width="120">
            <template #default="scope">
              {{ scope.row.department || '未分配' }}
            </template>
          </el-table-column>
          <el-table-column prop="job_title" label="职位" min-width="120">
            <template #default="scope">
              {{ scope.row.job_title || '未设置' }}
            </template>
          </el-table-column>
          <el-table-column prop="role_numbers" label="角色" min-width="120" />
          <el-table-column prop="create_time" label="创建时间" width="170" />
          <el-table-column prop="last_login_time" label="最后登录" width="170">
            <template #default="scope">
              {{ scope.row.last_login_time || '从未登录' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button link type="primary"  @click="handleEdit(scope.row)">编辑</el-button>
              <el-button link type="info" @click="handleView(scope.row)">查看</el-button>
              <el-button link type="danger" class="delete-btn" @click="handleDelete(scope.row)">删除</el-button>
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
  
      <!-- 添加/编辑对话框 -->
      <el-dialog
        :title="dialogTitle"
        v-model="dialogVisible"
        width="600px"
        @close="resetForm"
      >
        <el-form
          ref="userForm"
          :model="userForm"
          :rules="rules"
          label-width="80px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="userForm.username" placeholder="请输入用户名" />
          </el-form-item>
          
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="userForm.mobile" placeholder="请输入手机号" />
          </el-form-item>
          
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userForm.email" placeholder="请输入邮箱地址" />
          </el-form-item>
          
          <el-form-item label="部门" prop="department_id">
            <el-select v-model="userForm.department_id" placeholder="请选择部门">
              <el-option 
                v-for="item in departmentOptions" 
                :key="item.id" 
                :label="item.name" 
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="职位" prop="job_title">
            <el-input v-model="userForm.job_title" placeholder="请输入职位" />
          </el-form-item>
          
          <el-form-item label="角色" prop="role_numbers">
            <el-select v-model="userForm.role_numbers" multiple placeholder="请选择角色">
              <el-option 
                v-for="item in roleOptions" 
                :key="item.value" 
                :label="item.label" 
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="密码" prop="password" v-if="!isEdit">
            <el-input v-model="userForm.password" type="password" placeholder="请输入密码" show-password />
          </el-form-item>
        </el-form>
        
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitForm" :loading="submitLoading">
              确定
            </el-button>
          </span>
        </template>
      </el-dialog>
  
      <!-- 查看详情对话框 -->
      <el-dialog
        title="员工详情"
        v-model="viewDialogVisible"
        width="600px"
      >
        <el-descriptions :column="2" border>
          <el-descriptions-item label="用户ID">{{ viewUserData.id }}</el-descriptions-item>
          <el-descriptions-item label="用户名">{{ viewUserData.username }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ viewUserData.mobile || '未设置' }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ viewUserData.email || '未设置' }}</el-descriptions-item>
          <el-descriptions-item label="部门">{{ viewUserData.department || '未分配' }}</el-descriptions-item>
          <el-descriptions-item label="职位">{{ viewUserData.job_title || '未设置' }}</el-descriptions-item>
          <el-descriptions-item label="角色" :span="2">{{ viewUserData.role_numbers }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ viewUserData.create_time }}</el-descriptions-item>
          <el-descriptions-item label="最后登录">{{ viewUserData.last_login_time || '从未登录' }}</el-descriptions-item>
          <el-descriptions-item label="创建者">{{ viewUserData.creator || '系统创建' }}</el-descriptions-item>
          <el-descriptions-item label="最后更新">{{ viewUserData.update_time }}</el-descriptions-item>
        </el-descriptions>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { Plus, Refresh } from '@element-plus/icons-vue'
  import http from '@/utils/http'
  import { ElMessage, ElMessageBox } from 'element-plus'
  
  export default {
    name: 'UserManagement',
    components: {
      Plus,
      Refresh
    },
    data() {
      return {
        // 搜索表单
        searchForm: {
          username: '',
          mobile: '',
          department_id: null
        },
        
        // 表格数据
        loading: false,
        tableData: [],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        
        // 对话框
        dialogVisible: false,
        isEdit: false,
        dialogTitle: '新增员工',
        submitLoading: false,
        userForm: {
          id: null,
          username: '',
          mobile: '',
          email: '',
          department_id: null,
          job_title: '',
          role_numbers: [],
          password: ''
        },
        
        // 查看详情
        viewDialogVisible: false,
        viewUserData: {},
        
        // 选项数据
        departmentOptions: [],
        roleOptions: [
          { value: 'admin', label: '管理员' },
          { value: 'user', label: '普通用户' },
          { value: 'operator', label: '操作员' }
        ],
        
        // 表单验证规则
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
          ],
          mobile: [
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
          ],
          email: [
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.fetchData()
      this.fetchDepartments()
    },
    methods: {
      // 获取员工列表
      async fetchData() {
        this.loading = true
        try {
          const params = {
            page: this.currentPage,
            size: this.pageSize,
            username: this.searchForm.username || undefined,
            mobile: this.searchForm.mobile || undefined,
            department_id: this.searchForm.department_id || undefined
          }
          
          const response = await http.get('/api/v1/users/',  params )
          
          if (response.data) {
            this.tableData = response.data.items || []
            this.total = response.data.total || 0
          } else {
            ElMessage.error('获取员工列表失败')
          }
        } catch (error) {
          console.error('获取员工列表失败:', error)
          ElMessage.error('获取员工列表失败')
        } finally {
          this.loading = false
        }
      },
      
      // 获取部门列表
      async fetchDepartments() {
        try {
          const response = await http.get('/api/v1/departments/')
          if (response.data && response.data.items) {
            this.departmentOptions = response.data.items
          }
        } catch (error) {
          console.error('获取部门列表失败:', error)
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
          username: '',
          mobile: '',
          department_id: null
        }
        this.handleSearch()
      },
      
      // 添加员工
      handleAddUser() {
        this.isEdit = false
        this.dialogTitle = '新增员工'
        this.resetForm()
        this.dialogVisible = true
      },
      
      // 编辑员工
      handleEdit(row) {
        this.isEdit = true
        this.dialogTitle = '编辑员工'
        // 深拷贝，避免直接修改表格数据
        const userData = JSON.parse(JSON.stringify(row))
        
        // 处理角色数据，确保是数组格式
        if (typeof userData.role_numbers === 'string' && userData.role_numbers) {
          userData.role_numbers = userData.role_numbers.split(',')
        } else if (!Array.isArray(userData.role_numbers)) {
          userData.role_numbers = []
        }
        
        this.userForm = userData
        this.dialogVisible = true
      },
      
      // 查看员工详情
      handleView(row) {
        this.viewUserData = row
        this.viewDialogVisible = true
      },
      
      // 删除员工
      handleDelete(row) {
        ElMessageBox.confirm(`确定要删除员工 "${row.username}" 吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          try {
            const response = await http.delete(`/api/v1/users/${row.id}`)
            if (response.status === 200) {
              ElMessage.success('删除成功')
              this.fetchData()
            } else {
              ElMessage.error('删除失败')
            }
          } catch (error) {
            console.error('删除员工失败:', error)
            ElMessage.error('删除失败')
          }
        }).catch(() => {})
      },
      
      // 重置表单
      resetForm() {
        if (this.$refs.userForm) {
          this.$refs.userForm.resetFields()
        }
        
        this.userForm = {
          id: null,
          username: '',
          mobile: '',
          email: '',
          department_id: null,
          job_title: '',
          role_numbers: [],
          password: ''
        }
      },
      
      // 提交表单
      async submitForm() {
        if (!this.$refs.userForm) return
        
        try {
          await this.$refs.userForm.validate()
        } catch (error) {
          return false
        }
        
        this.submitLoading = true
        try {
          const formData = { ...this.userForm }
          
          // 处理角色数据，确保是字符串格式
          if (Array.isArray(formData.role_numbers)) {
            formData.role_numbers = formData.role_numbers.join(',')
          }
          
          let response
          if (this.isEdit) {
            // 编辑模式
            const userId = formData.id
            delete formData.id // 有些API不需要在请求体中包含ID
            delete formData.password // 编辑时通常不修改密码
            
            response = await http.put(`/api/v1/users/${userId}`, formData)
          } else {
            // 创建模式
            response = await http.post('/api/v1/users/', formData)
          }
          
          if (response.status >= 200 && response.status < 300) {
            ElMessage.success(this.isEdit ? '编辑成功' : '新增成功')
            this.dialogVisible = false
            this.fetchData()
          } else {
            ElMessage.error(this.isEdit ? '编辑失败' : '新增失败')
          }
        } catch (error) {
          console.error(this.isEdit ? '编辑员工失败:' : '新增员工失败:', error)
          ElMessage.error(error.response?.data?.message || (this.isEdit ? '编辑失败' : '新增失败'))
        } finally {
          this.submitLoading = false
        }
      },
      
      // 分页大小变化
      handleSizeChange(val) {
        this.pageSize = val
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
    display: flex;
    justify-content: space-between;
    align-items: center;
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
  
  .search-box {
    padding: 16px;
    background-color: #f8f9fa;
    border-radius: 4px;
    margin-bottom: 16px;
  }
  
  .page-content {
    background-color: #fff;
    border-radius: 4px;
    padding: 0;
  }
  
  .pagination-box {
    padding: 16px;
    display: flex;
    justify-content: flex-end;
  }
  
  .delete-btn {
    color: #F56C6C;
  }
  
  @media (max-width: 768px) {
    .page-header {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .header-actions {
      margin-top: 10px;
    }
    
    .search-box {
      padding: 10px;
    }
    
    :deep(.el-form--inline .el-form-item) {
      margin-right: 0;
      width: 100%;
    }
  }
  </style>