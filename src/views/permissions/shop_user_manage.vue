<template>
    <div class="page-container" v-loading.fullscreen.lock="loading" element-loading-text="加载中...">
      <!-- 页面标题 -->
      <div class="page-header">
        <h2 class="page-title">员工管理</h2>
        <div class="header-actions">
          <el-button type="primary" @click="showAddDialog">添加员工</el-button>
        </div>
      </div>
  
      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="员工姓名">
            <el-input v-model="searchForm.username" placeholder="输入员工姓名" clearable @keyup.enter="handleSearch"></el-input>
          </el-form-item>
          
          <el-form-item label="所属部门">
            <el-select v-model="searchForm.department_id" placeholder="选择部门" clearable>
              <el-option label="全部" :value="null"></el-option>
              <el-option v-for="dept in departments" :key="dept.id" :label="dept.name" :value="dept.id"></el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="职位">
            <el-input v-model="searchForm.job_title" placeholder="输入职位" clearable @keyup.enter="handleSearch"></el-input>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
  
      <!-- 员工列表 -->
      <div class="data-list-container">
        <el-table
          :data="employeeList"
          border
          style="width: 100%"
          v-loading="tableLoading"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="username" label="员工姓名" min-width="120"></el-table-column>
          <el-table-column prop="department" label="所属部门" min-width="120"></el-table-column>
          <el-table-column prop="job_title" label="职位" min-width="120"></el-table-column>
          <el-table-column prop="mobile" label="手机号码" min-width="120"></el-table-column>
          <el-table-column prop="email" label="邮箱" min-width="150"></el-table-column>
          <el-table-column prop="role_numbers" label="角色" min-width="120"></el-table-column>
          <el-table-column prop="create_time" label="创建时间" min-width="160"></el-table-column>
          <el-table-column prop="last_login_time" label="最后登录时间" min-width="160"></el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button link type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange">
          </el-pagination>
        </div>
        
        <!-- 批量操作 -->
        <div class="batch-actions" v-if="selectedRows.length > 0">
          <el-button type="danger" @click="handleBatchDelete">批量删除</el-button>
        </div>
      </div>
  
      <!-- 添加/编辑员工对话框 -->
      <el-dialog 
        :title="dialogType === 'add' ? '添加员工' : '编辑员工'" 
        v-model="dialogVisible" 
        width="600px"
        :close-on-click-modal="false">
        <el-form :model="form" :rules="rules" ref="employeeForm" label-width="100px">
          <el-form-item label="员工姓名" prop="username">
            <el-input v-model="form.username" placeholder="请输入员工姓名"></el-input>
          </el-form-item>
          
          <el-form-item label="所属部门" prop="department_id">
            <el-select v-model="form.department_id" placeholder="请选择部门" style="width: 100%">
              <el-option v-for="dept in departments" :key="dept.id" :label="dept.name" :value="dept.id"></el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="职位" prop="job_title">
            <el-input v-model="form.job_title" placeholder="请输入职位"></el-input>
          </el-form-item>
          
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="form.mobile" placeholder="请输入手机号码"></el-input>
          </el-form-item>
          
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          
          <el-form-item label="角色" prop="role_numbers">
            <el-select v-model="form.role_numbers" multiple placeholder="请选择角色" style="width: 100%">
              <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id"></el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="密码" prop="password" v-if="dialogType === 'add'">
            <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
          </el-form-item>
          
          <el-form-item label="确认密码" prop="confirmPassword" v-if="dialogType === 'add'">
            <el-input v-model="form.confirmPassword" type="password" placeholder="请再次输入密码"></el-input>
          </el-form-item>
          
          <el-form-item label="允许部门" prop="allowed_department_ids">
            <el-select v-model="form.allowed_department_ids" multiple placeholder="请选择允许管理的部门" style="width: 100%">
              <el-option v-for="dept in departments" :key="dept.id" :label="dept.name" :value="dept.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitForm" :loading="submitLoading">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import http from '@/utils/http';
  
  export default {
    name: 'EmployeeManage',
    data() {
      // 自定义验证函数：确认密码
      const validateConfirmPassword = (rule, value, callback) => {
        if (value !== this.form.password) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      };
      
      return {
        // 加载状态
        loading: false,
        tableLoading: false,
        submitLoading: false,
        
        // 搜索表单
        searchForm: {
          username: '',
          department_id: null,
          job_title: ''
        },
        
        // 列表数据
        employeeList: [],
        selectedRows: [],
        
        // 分页数据
        currentPage: 1,
        pageSize: 10,
        total: 0,
        
        // 对话框控制
        dialogVisible: false,
        dialogType: 'add', // 'add' 或 'edit'
        
        // 表单数据
        form: {
          id: null,
          username: '',
          department_id: null,
          job_title: '',
          mobile: '',
          email: '',
          role_numbers: [],
          password: '',
          confirmPassword: '',
          allowed_department_ids: []
        },
        
        // 表单验证规则
        rules: {
          username: [
            { required: true, message: '请输入员工姓名', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ],
          mobile: [
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
          ],
          email: [
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, message: '密码长度至少为6个字符', trigger: 'blur' }
          ],
          confirmPassword: [
            { required: true, message: '请再次输入密码', trigger: 'blur' },
            { validator: validateConfirmPassword, trigger: 'blur' }
          ]
        },
        
        // 部门和角色列表
        departments: [],
        roles: []
      };
    },
    
    created() {
      this.fetchEmployees();
      this.fetchDepartments();
      this.fetchRoles();
    },
    
    methods: {
      // 获取员工列表
      fetchEmployees() {
        this.tableLoading = true;
        
        // 构建查询参数
        const params = {
          page: this.currentPage,
          size: this.pageSize,
          need_total_count: true
        };
        
        // 添加搜索条件
        if (this.searchForm.username) {
          params.username = this.searchForm.username.trim();
        }
        
        if (this.searchForm.department_id) {
          params.department_id = this.searchForm.department_id;
        }
        
        if (this.searchForm.job_title) {
          params.job_title = this.searchForm.job_title.trim();
        }
        
        http.get('/api/v1/users/', params)
          .then(response => {
            if (response.data) {
              this.employeeList = response.data.items || [];
              this.total = response.data.total || 0;
            } else {
              this.employeeList = [];
              this.total = 0;
            }
          })
          .catch(error => {
            console.error('获取员工列表失败:', error);
            this.$message.error('获取员工列表失败，请重试');
          })
          .finally(() => {
            this.tableLoading = false;
          });
      },
      
      // 获取部门列表
      fetchDepartments() {
        http.get('/api/v1/departments/')
          .then(response => {
            if (response.data && Array.isArray(response.data)) {
              this.departments = response.data;
            } else {
              this.departments = [];
            }
          })
          .catch(error => {
            console.error('获取部门列表失败:', error);
            this.departments = [];
          });
      },
      
      // 获取角色列表
      fetchRoles() {
        http.get('/api/v1/roles/')
          .then(response => {
            if (response.data && Array.isArray(response.data)) {
              this.roles = response.data;
            } else {
              this.roles = [];
            }
          })
          .catch(error => {
            console.error('获取角色列表失败:', error);
            this.roles = [];
          });
      },
      
      // 显示添加对话框
      showAddDialog() {
        this.dialogType = 'add';
        this.form = {
          id: null,
          username: '',
          department_id: null,
          job_title: '',
          mobile: '',
          email: '',
          role_numbers: [],
          password: '',
          confirmPassword: '',
          allowed_department_ids: []
        };
        this.dialogVisible = true;
      },
      
      // 处理编辑
      handleEdit(row) {
        this.dialogType = 'edit';
        this.form = {
          id: row.id,
          username: row.username,
          department_id: row.department_id,
          job_title: row.job_title,
          mobile: row.mobile,
          email: row.email,
          role_numbers: row.role_numbers ? row.role_numbers.split(',') : [],
          password: '',
          confirmPassword: '',
          allowed_department_ids: row.allowed_department_ids || []
        };
        this.dialogVisible = true;
      },
      
      // 处理删除
      handleDelete(row) {
        this.$confirm('确认删除该员工?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          http.delete(`/api/v1/users/${row.id}`)
            .then(() => {
              this.$message.success('删除成功');
              this.fetchEmployees();
            })
            .catch(error => {
              console.error('删除失败:', error);
              this.$message.error('删除失败，请重试');
            })
            .finally(() => {
              this.loading = false;
            });
        }).catch(() => {
          this.$message.info('已取消删除');
        });
      },
      
      // 批量删除
      handleBatchDelete() {
        if (this.selectedRows.length === 0) {
          this.$message.warning('请先选择要删除的员工');
          return;
        }
        
        this.$confirm(`确认删除选中的 ${this.selectedRows.length} 名员工?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const ids = this.selectedRows.map(row => row.id);
          this.loading = true;
          
          http.post('/api/v1/users/batch-delete', { ids })
            .then(() => {
              this.$message.success('批量删除成功');
              this.fetchEmployees();
              this.selectedRows = [];
            })
            .catch(error => {
              console.error('批量删除失败:', error);
              this.$message.error('批量删除失败，请重试');
            })
            .finally(() => {
              this.loading = false;
            });
        }).catch(() => {
          this.$message.info('已取消删除');
        });
      },
      
      // 提交表单
      submitForm() {
        this.$refs.employeeForm.validate(valid => {
          if (valid) {
            this.submitLoading = true;
            
            // 构建提交数据
            const formData = {
              username: this.form.username,
              department_id: this.form.department_id,
              job_title: this.form.job_title,
              mobile: this.form.mobile,
              email: this.form.email,
              role_numbers: this.form.role_numbers.join(','),
              allowed_department_ids: this.form.allowed_department_ids
            };
            
            // 如果是添加模式，添加密码字段
            if (this.dialogType === 'add') {
              formData.password = this.form.password;
            }
            
            // 调用API
            const request = this.dialogType === 'add'
              ? http.post('/api/v1/users/', formData)
              : http.put(`/api/v1/users/${this.form.id}`, formData);
            
            request
              .then(() => {
                this.$message.success(this.dialogType === 'add' ? '添加成功' : '更新成功');
                this.dialogVisible = false;
                this.fetchEmployees();
              })
              .catch(error => {
                console.error(this.dialogType === 'add' ? '添加失败' : '更新失败', error);
                this.$message.error((this.dialogType === 'add' ? '添加' : '更新') + '失败，请重试');
              })
              .finally(() => {
                this.submitLoading = false;
              });
          } else {
            return false;
          }
        });
      },
      
      // 表格选择行变化
      handleSelectionChange(rows) {
        this.selectedRows = rows;
      },
      
      // 搜索
      handleSearch() {
        this.currentPage = 1;
        this.fetchEmployees();
      },
      
      // 重置搜索条件
      resetSearch() {
        this.searchForm = {
          username: '',
          department_id: null,
          job_title: ''
        };
        this.handleSearch();
      },
      
      // 分页大小变化
      handleSizeChange(size) {
        this.pageSize = size;
        this.fetchEmployees();
      },
      
      // 当前页变化
      handleCurrentChange(page) {
        this.currentPage = page;
        this.fetchEmployees();
      }
    }
  };
  </script>
  
  <style scoped>
  .page-container {
    padding: 20px;
    background-color: #f5f7fa;
    min-height: 100vh;
  }
  
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .page-title {
    font-size: 20px;
    color: #303133;
    margin: 0;
  }
  
  .search-bar {
    background-color: #fff;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  }
  
  .search-form {
    display: flex;
    flex-wrap: wrap;
  }
  
  .data-list-container {
    background-color: #fff;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  
  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
  
  .batch-actions {
    margin-top: 20px;
  }
  
  :deep(.el-form-item) {
    margin-bottom: 15px;
  }
  
  :deep(.el-button--link) {
    padding: 2px 0;
  }
  
  :deep(.el-table .cell) {
    white-space: nowrap;
  }
  
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
  }
  </style>