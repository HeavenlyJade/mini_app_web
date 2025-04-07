<template>
    <div class="page-container">
      <div class="page-header">
        <h2 class="page-title">商城用户管理</h2>
        <div class="header-actions">
          <el-button type="primary" @click="handleAddUser">
            <el-icon><Plus /></el-icon> 新增用户
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
            <el-form-item label="用户信息">
              <el-input v-model="searchForm.keyword" placeholder="用户名/昵称/手机号" clearable></el-input>
            </el-form-item>
            <el-form-item label="会员等级">
              <el-select v-model="searchForm.member_level" placeholder="请选择会员等级" clearable>
                <el-option label="普通会员" value="普通会员"></el-option>
                <el-option label="银卡会员" value="银卡会员"></el-option>
                <el-option label="金卡会员" value="金卡会员"></el-option>
                <el-option label="钻石会员" value="钻石会员"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="注册时间">
              <el-date-picker
                v-model="searchForm.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="分销状态">
              <el-select v-model="searchForm.is_distributor" placeholder="请选择分销状态" clearable>
                <el-option label="非分销商" :value="0"></el-option>
                <el-option label="分销商" :value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用户状态">
              <el-select v-model="searchForm.status" placeholder="请选择用户状态" clearable>
                <el-option label="禁用" :value="0"></el-option>
                <el-option label="正常" :value="1"></el-option>
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
          <el-table-column label="用户信息" min-width="180">
            <template #default="scope">
              <div class="user-info">
                <el-avatar :size="40" :src="scope.row.avatar" @error="handleAvatarError">
                  {{ scope.row.nickname?.charAt(0) || scope.row.username?.charAt(0) || 'U' }}
                </el-avatar>
                <div class="user-details">
                  <div class="user-name">{{ scope.row.nickname || scope.row.username || '未设置' }}</div>
                  <div class="user-phone">{{ scope.row.phone || '未设置手机号' }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="real_name" label="真实姓名" width="120">
            <template #default="scope">
              {{ scope.row.real_name || '未设置' }}
            </template>
          </el-table-column>
          <el-table-column prop="gender" label="性别" width="80">
            <template #default="scope">
              {{ scope.row.gender === 1 ? '男' : scope.row.gender === 2 ? '女' : '未知' }}
            </template>
          </el-table-column>
          <el-table-column prop="member_level" label="会员等级" width="120">
            <template #default="scope">
              {{ scope.row.member_level || '普通会员' }}
            </template>
          </el-table-column>
          <el-table-column prop="points" label="积分" width="100">
            <template #default="scope">
              {{ scope.row.points || 0 }}
            </template>
          </el-table-column>
          <el-table-column prop="balance" label="余额" width="100">
            <template #default="scope">
              {{ scope.row.balance || 0 }}
            </template>
          </el-table-column>
          <el-table-column prop="is_distributor" label="分销商" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.is_distributor === 1 ? 'success' : 'info'">
                {{ scope.row.is_distributor === 1 ? '是' : '否' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="register_time" label="注册时间" width="160" />
          <el-table-column prop="status" label="状态" width="80">
            <template #default="scope">
              <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
                {{ scope.row.status === 1 ? '正常' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250" fixed="right">
            <template #default="scope">
              <el-button link type="primary" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button link @click="handleView(scope.row)">查看</el-button>
              <el-button 
                link 
                :type="scope.row.status === 1 ? 'warning' : 'success'" 
                @click="handleToggleStatus(scope.row)"
              >
                {{ scope.row.status === 1 ? '禁用' : '启用' }}
              </el-button>
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
          label-width="100px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="userForm.username" placeholder="请输入用户名" />
          </el-form-item>
          
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="userForm.nickname" placeholder="请输入昵称" />
          </el-form-item>
          
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="userForm.phone" placeholder="请输入手机号" />
          </el-form-item>
          
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userForm.email" placeholder="请输入邮箱地址" />
          </el-form-item>
          
          <el-form-item label="真实姓名" prop="real_name">
            <el-input v-model="userForm.real_name" placeholder="请输入真实姓名" />
          </el-form-item>
          
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="userForm.gender">
              <el-radio :label="0">未知</el-radio>
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item label="会员等级" prop="member_level">
            <el-select v-model="userForm.member_level" placeholder="请选择会员等级">
              <el-option label="普通会员" value="普通会员"></el-option>
              <el-option label="银卡会员" value="银卡会员"></el-option>
              <el-option label="金卡会员" value="金卡会员"></el-option>
              <el-option label="钻石会员" value="钻石会员"></el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="会员卡号" prop="member_card_no">
            <el-input v-model="userForm.member_card_no" placeholder="请输入会员卡号" />
          </el-form-item>
          
          <el-form-item label="积分" prop="points">
            <el-input-number v-model="userForm.points" :min="0" />
          </el-form-item>
          
          <el-form-item label="余额" prop="balance">
            <el-input-number v-model="userForm.balance" :min="0" :precision="2" :step="0.01" />
          </el-form-item>
          
          <el-form-item label="是否分销商" prop="is_distributor">
            <el-switch
              v-model="userForm.is_distributor"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
          
          <el-form-item label="用户标签" prop="tags">
            <el-input v-model="userForm.tags" placeholder="多个标签用逗号分隔" />
          </el-form-item>
          
          <el-form-item label="备注" prop="remark">
            <el-input 
              v-model="userForm.remark" 
              type="textarea" 
              :rows="3" 
              placeholder="请输入备注信息" 
            />
          </el-form-item>
          
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="userForm.status">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
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
        title="用户详情"
        v-model="viewDialogVisible"
        width="700px"
      >
        <div class="user-detail-header">
          <el-avatar :size="80" :src="viewUserData.avatar" @error="handleAvatarError">
            {{ viewUserData.nickname?.charAt(0) || viewUserData.username?.charAt(0) || 'U' }}
          </el-avatar>
          <div class="user-detail-info">
            <h3>{{ viewUserData.nickname || viewUserData.username || '未设置昵称' }}</h3>
            <p>{{ viewUserData.phone || '未设置手机号' }}</p>
          </div>
        </div>
  
        <el-tabs>
          <el-tab-pane label="基本信息">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="用户ID">{{ viewUserData.id }}</el-descriptions-item>
              <el-descriptions-item label="用户名">{{ viewUserData.username || '未设置' }}</el-descriptions-item>
              <el-descriptions-item label="昵称">{{ viewUserData.nickname || '未设置' }}</el-descriptions-item>
              <el-descriptions-item label="手机号">{{ viewUserData.phone || '未设置' }}</el-descriptions-item>
              <el-descriptions-item label="邮箱">{{ viewUserData.email || '未设置' }}</el-descriptions-item>
              <el-descriptions-item label="真实姓名">{{ viewUserData.real_name || '未设置' }}</el-descriptions-item>
              <el-descriptions-item label="性别">
                {{ viewUserData.gender === 1 ? '男' : viewUserData.gender === 2 ? '女' : '未知' }}
              </el-descriptions-item>
              <el-descriptions-item label="生日">{{ viewUserData.birthday || '未设置' }}</el-descriptions-item>
              <el-descriptions-item label="会员等级">{{ viewUserData.member_level || '普通会员' }}</el-descriptions-item>
              <el-descriptions-item label="会员卡号">{{ viewUserData.member_card_no || '未设置' }}</el-descriptions-item>
              <el-descriptions-item label="积分">{{ viewUserData.points || 0 }}</el-descriptions-item>
              <el-descriptions-item label="账户余额">{{ viewUserData.balance || 0 }}</el-descriptions-item>
              <el-descriptions-item label="是否分销商">
                {{ viewUserData.is_distributor === 1 ? '是' : '否' }}
              </el-descriptions-item>
              <el-descriptions-item label="用户标签">{{ viewUserData.tags || '无' }}</el-descriptions-item>
              <el-descriptions-item label="状态">
                {{ viewUserData.status === 1 ? '正常' : '禁用' }}
              </el-descriptions-item>
              <el-descriptions-item label="注册时间">{{ viewUserData.register_time || '未知' }}</el-descriptions-item>
              <el-descriptions-item label="注册IP">{{ viewUserData.register_ip || '未知' }}</el-descriptions-item>
              <el-descriptions-item label="注册渠道">{{ viewUserData.register_channel || '未知' }}</el-descriptions-item>
              <el-descriptions-item label="注册门店">{{ viewUserData.register_shop_name || '未知' }}</el-descriptions-item>
              <el-descriptions-item label="最后登录">{{ viewUserData.last_login_time || '从未登录' }}</el-descriptions-item>
              <el-descriptions-item label="最后登录IP">{{ viewUserData.last_login_ip || '未知' }}</el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>
          <el-tab-pane label="详细地址">
            <div class="address-content">
              {{ viewUserData.address || '用户未设置详细地址' }}
            </div>
          </el-tab-pane>
          <el-tab-pane label="备注信息">
            <div class="remark-content">
              {{ viewUserData.remark || '暂无备注信息' }}
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { Plus, Refresh } from '@element-plus/icons-vue'
  import http from '@/utils/http'
  import { ElMessage, ElMessageBox } from 'element-plus'
  
  export default {
    name: 'ShopUserManagement',
    components: {
      Plus,
      Refresh
    },
    data() {
      return {
        // 搜索表单
        searchForm: {
          keyword: '',
          member_level: '',
          dateRange: [],
          is_distributor: '',
          status: ''
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
        dialogTitle: '新增用户',
        submitLoading: false,
        userForm: {
          id: null,
          username: '',
          nickname: '',
          phone: '',
          email: '',
          real_name: '',
          gender: 0,
          member_level: '普通会员',
          member_card_no: '',
          points: 0,
          balance: 0,
          is_distributor: 0,
          tags: '',
          remark: '',
          status: 1
        },
        
        // 查看详情
        viewDialogVisible: false,
        viewUserData: {},
        
        // 表单验证规则
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
          ],
          phone: [
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
          ],
          email: [
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      // 获取商城用户列表
      async fetchData() {
        this.loading = true
        try {
          const params = {
            page: this.currentPage,
            size: this.pageSize,
            keyword: this.searchForm.keyword || undefined,
            member_level: this.searchForm.member_level || undefined,
            start_date: this.searchForm.dateRange?.[0] || undefined,
            end_date: this.searchForm.dateRange?.[1] || undefined,
            is_distributor: this.searchForm.is_distributor !== '' ? this.searchForm.is_distributor : undefined,
            status: this.searchForm.status !== '' ? this.searchForm.status : undefined
          }
          
          const response = await http.get('/api/v1/mini_core/shop_users/', params)
          
          if (response.data) {
            this.tableData = response.data.items || []
            this.total = response.data.total || 0
          } else {
            ElMessage.error('获取商城用户列表失败')
          }
        } catch (error) {
          console.error('获取商城用户列表失败:', error)
          ElMessage.error('获取商城用户列表失败')
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
          keyword: '',
          member_level: '',
          dateRange: [],
          is_distributor: '',
          status: ''
        }
        this.handleSearch()
      },
      
      // 添加用户
      handleAddUser() {
        this.isEdit = false
        this.dialogTitle = '新增商城用户'
        this.resetForm()
        this.dialogVisible = true
      },
      
      // 编辑用户
      handleEdit(row) {
        this.isEdit = true
        this.dialogTitle = '编辑商城用户'
        // 深拷贝，避免直接修改表格数据
        this.userForm = JSON.parse(JSON.stringify(row))
        this.dialogVisible = true
      },
      
      // 查看用户详情
      handleView(row) {
        this.viewUserData = row
        this.viewDialogVisible = true
      },
      
      // 切换用户状态
      async handleToggleStatus(row) {
        const newStatus = row.status === 1 ? 0 : 1
        const statusText = newStatus === 1 ? '启用' : '禁用'
        
        try {
          const response = await http.patch(`/api/v1/mini_core/shop_users/${row.id}/status`, {
            status: newStatus
          })
          
          if (response.status === 200) {
            ElMessage.success(`${statusText}成功`)
            // 更新本地数据
            row.status = newStatus
          } else {
            ElMessage.error(`${statusText}失败`)
          }
        } catch (error) {
          console.error(`${statusText}用户失败:`, error)
          ElMessage.error(`${statusText}失败`)
        }
      },
      
      // 删除用户
      handleDelete(row) {
        ElMessageBox.confirm(`确定要删除用户 "${row.nickname || row.username || row.phone || row.id}" 吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          try {
            const response = await http.delete(`/api/v1/mini_core/shop_users/${row.id}`)
            
            if (response.status === 200) {
              ElMessage.success('删除成功')
              this.fetchData()
            } else {
              ElMessage.error('删除失败')
            }
          } catch (error) {
            console.error('删除用户失败:', error)
            ElMessage.error('删除失败')
          }
        }).catch(() => {})
      },
      
      // 头像加载错误处理
      handleAvatarError() {
        return true
      },
      
      // 重置表单
      resetForm() {
        if (this.$refs.userForm) {
          this.$refs.userForm.resetFields()
        }
        
        this.userForm = {
          id: null,
          username: '',
          nickname: '',
          phone: '',
          email: '',
          real_name: '',
          gender: 0,
          member_level: '普通会员',
          member_card_no: '',
          points: 0,
          balance: 0,
          is_distributor: 0,
          tags: '',
          remark: '',
          status: 1
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
          
          let response
          if (this.isEdit) {
            // 编辑模式
            response = await http.put(`/api/v1/mini_core/shop_users/${formData.id}`, formData)
          } else {
            // 创建模式
            response = await http.post('/api/v1/mini_core/shop_users/', formData)
          }
          
          if (response.status >= 200 && response.status < 300) {
            ElMessage.success(this.isEdit ? '编辑成功' : '新增成功')
            this.dialogVisible = false
            this.fetchData()
          } else {
            ElMessage.error(this.isEdit ? '编辑失败' : '新增失败')
          }
        } catch (error) {
          console.error(this.isEdit ? '编辑用户失败:' : '新增用户失败:', error)
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
  
  /* 用户信息样式 */
  .user-info {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .user-details {
    display: flex;
    flex-direction: column;
  }
  
  .user-name {
    font-weight: bold;
    margin-bottom: 4px;
  }
  
  .user-phone {
    color: #909399;
    font-size: 12px;
  }
  
  /* 用户详情样式 */
  .user-detail-header {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #ebeef5;
  }
  
  .user-detail-info h3 {
    margin: 0 0 8px 0;
    font-size: 18px;
  }
  
  .user-detail-info p {
    margin: 0;
    color: #909399;
  }
  
  .address-content, .remark-content {
    padding: 16px;
    background-color: #f8f9fa;
    border-radius: 4px;
    min-height: 100px;
    white-space: pre-wrap;
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