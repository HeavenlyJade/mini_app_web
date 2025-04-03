<template>
    <div class="page-container">
      <div class="page-header">
        <h2 class="page-title">员工名片管理</h2>
        <div class="header-actions">
          <el-button type="primary" @click="handleAdd">
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
            <el-form-item label="员工信息">
              <el-input 
                v-model="searchForm.keyword" 
                placeholder="姓名/电话/微信" 
                clearable
              />
            </el-form-item>
            <el-form-item label="职位">
              <el-input 
                v-model="searchForm.position" 
                placeholder="请输入职位" 
                clearable
              />
            </el-form-item>
            <el-form-item label="公司">
              <el-input 
                v-model="searchForm.company" 
                placeholder="请输入公司" 
                clearable
              />
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
          <el-table-column label="头像" width="80">
            <template #default="scope">
              <el-avatar 
                :size="50" 
                :src="scope.row.image_url || defaultAvatar" 
                @error="handleAvatarError"
              />
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名" min-width="100" />
          <el-table-column prop="phone" label="电话" width="130" />
          <el-table-column prop="weixing" label="微信" min-width="120" />
          <el-table-column prop="position" label="职位" min-width="120" />
          <el-table-column prop="company" label="公司" min-width="150" />
          <el-table-column prop="create_time" label="创建时间" width="170" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button link type="primary" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button link type="success" @click="handlePreview(scope.row)">预览</el-button>
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
          ref="employeeForm"
          :model="employeeForm"
          :rules="rules"
          label-width="80px"
        >
          <el-form-item label="头像" prop="image_url">
            <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :headers="uploadHeaders"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="employeeForm.image_url" :src="employeeForm.image_url" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
          
          <el-form-item label="姓名" prop="name">
            <el-input v-model="employeeForm.name" placeholder="请输入员工姓名" />
          </el-form-item>
          
          <el-form-item label="电话" prop="phone">
            <el-input v-model="employeeForm.phone" placeholder="请输入电话号码" />
          </el-form-item>
          
          <el-form-item label="微信" prop="weixing">
            <el-input v-model="employeeForm.weixing" placeholder="请输入微信号" />
          </el-form-item>
          
          <el-form-item label="职位" prop="position">
            <el-input v-model="employeeForm.position" placeholder="请输入职位" />
          </el-form-item>
          
          <el-form-item label="公司" prop="company">
            <el-input v-model="employeeForm.company" placeholder="请输入公司名称" />
          </el-form-item>
          
          <el-form-item label="OpenID" prop="openid" v-if="isEdit">
            <el-input v-model="employeeForm.openid" disabled />
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
  
      <!-- 名片预览抽屉 -->
      <el-drawer
        v-model="previewDrawer"
        title="名片预览"
        direction="rtl"
        size="300px"
      >
        <div class="namecard-preview">
          <div class="namecard-avatar">
            <el-avatar 
              :size="100" 
              :src="previewData.image_url || defaultAvatar"
              @error="handleAvatarError"
            />
          </div>
          <h3 class="namecard-name">{{ previewData.name }}</h3>
          
          <div class="namecard-info">
            <div class="info-item">
              <label>手机：</label>
              <div class="info-value">
                {{ previewData.phone }}
                <el-button link type="primary" @click="copyText(previewData.phone)" size="small">复制</el-button>
              </div>
            </div>
            
            <div class="info-item">
              <label>职业：</label>
              <div class="info-value">
                {{ previewData.position }}
                <el-button link type="primary" @click="copyText(previewData.position)" size="small">复制</el-button>
              </div>
            </div>
            
            <div class="info-item">
              <label>微信：</label>
              <div class="info-value">
                {{ previewData.weixing }}
                <el-button link type="primary" @click="copyText(previewData.weixing)" size="small">复制</el-button>
              </div>
            </div>
            
            <div class="info-item">
              <label>公司：</label>
              <div class="info-value">{{ previewData.company }}</div>
            </div>
          </div>
  
          <div class="namecard-qrcode">
            <img :src="qrCodeUrl" alt="二维码" class="qrcode-image" />
            <div class="qrcode-text">扫码查看详情</div>
          </div>
        </div>
      </el-drawer>
    </div>
  </template>
  
  <script>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { Plus, Refresh } from '@element-plus/icons-vue'
  import http from '@/utils/http'
  
  export default {
    name: 'EmployeeNamecardManage',
    components: {
      Plus,
      Refresh
    },
    data() {
      return {
        // 搜索表单
        searchForm: {
          keyword: '',
          position: '',
          company: ''
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
        employeeForm: {
          id: null,
          name: '',
          phone: '',
          weixing: '',
          position: '',
          company: '',
          image_url: '',
          openid: ''
        },
        
        // 表单验证规则
        rules: {
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入电话号码', trigger: 'blur' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
          ],
          position: [
            { required: true, message: '请输入职位', trigger: 'blur' }
          ],
          company: [
            { required: true, message: '请输入公司名称', trigger: 'blur' }
          ]
        },
        
        // 上传配置
        uploadUrl: '/api/v1/mini_core/upload',
        uploadHeaders: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        defaultAvatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
        
        // 预览抽屉
        previewDrawer: false,
        previewData: {},
        qrCodeUrl: ''
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      // 获取员工列表
      async fetchData() {
        this.loading = true
        try {
          const params = {
            page: this.currentPage,
            size: this.pageSize,
            keyword: this.searchForm.keyword || undefined,
            position: this.searchForm.position || undefined,
            company: this.searchForm.company || undefined
          }
          
          const response = await http.get('/api/v1/mini_core/employees', { params })
          
          if (response.data && response.data.code === 200) {
            this.tableData = response.data.data
            this.total = response.data.total
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
          position: '',
          company: ''
        }
        this.handleSearch()
      },
      
      // 添加员工
      handleAdd() {
        this.isEdit = false
        this.dialogTitle = '新增员工'
        this.resetForm()
        this.dialogVisible = true
      },
      
      // 编辑员工
      handleEdit(row) {
        this.isEdit = true
        this.dialogTitle = '编辑员工'
        this.employeeForm = JSON.parse(JSON.stringify(row))
        this.dialogVisible = true
      },
      
      // 预览名片
      handlePreview(row) {
        this.previewData = row
        // 生成二维码URL（这里只是示例，实际应根据需求生成）
        this.qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`https://your-domain.com/employee/${row.id}`)}`
        this.previewDrawer = true
      },
      
      // 删除员工
      handleDelete(row) {
        ElMessageBox.confirm(`确定要删除员工 "${row.name}" 的名片吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          try {
            const response = await http.delete(`/api/v1/mini_core/employees/${row.id}`)
            if (response.data && response.data.code === 200) {
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
      
      // 复制文本
      copyText(text) {
        navigator.clipboard.writeText(text).then(() => {
          ElMessage.success('复制成功')
        }).catch(() => {
          ElMessage.error('复制失败')
        })
      },
      
      // 重置表单
      resetForm() {
        if (this.$refs.employeeForm) {
          this.$refs.employeeForm.resetFields()
        }
        
        this.employeeForm = {
          id: null,
          name: '',
          phone: '',
          weixing: '',
          position: '',
          company: '',
          image_url: '',
          openid: ''
        }
      },
      
      // 提交表单
      async submitForm() {
        try {
          await this.$refs.employeeForm.validate()
        } catch (error) {
          return false
        }
        
        this.submitLoading = true
        try {
          let response
          const formData = { ...this.employeeForm }
          
          if (this.isEdit) {
            // 编辑
            response = await http.put(`/api/v1/mini_core/employees/${formData.id}`, formData)
          } else {
            // 新增
            response = await http.post('/api/v1/mini_core/employees', formData)
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
      
      // 头像上传成功
      handleAvatarSuccess(response, file) {
        if (response.code === 200 && response.data) {
          this.employeeForm.image_url = response.data
        } else {
          ElMessage.error('上传失败')
        }
      },
      
      // 头像上传前验证
      beforeAvatarUpload(file) {
        const isImage = file.type.startsWith('image/')
        const isLt2M = file.size / 1024 / 1024 < 2
        
        if (!isImage) {
          ElMessage.error('上传头像图片只能是图片格式!')
        }
        
        if (!isLt2M) {
          ElMessage.error('上传头像图片大小不能超过 2MB!')
        }
        
        return isImage && isLt2M
      },
      
      // 头像加载失败
      handleAvatarError() {
        // 头像加载失败时的处理
        return true
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
  
  .page-content {
    background-color: #fff;
    border-radius: 4px;
  }
  
  .search-box {
    padding: 16px;
    background-color: #f8f9fa;
    border-radius: 4px;
    margin-bottom: 16px;
  }
  
  .pagination-box {
    padding: 16px;
    display: flex;
    justify-content: flex-end;
  }
  
  /* 头像上传样式 */
  .avatar-uploader {
    width: 100px;
    height: 100px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .avatar-uploader:hover {
    border-color: #409EFF;
  }
  
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
    object-fit: cover;
  }
  
  /* 名片预览样式 */
  .namecard-preview {
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .namecard-avatar {
    margin-bottom: 15px;
  }
  
  .namecard-name {
    font-size: 22px;
    margin: 0 0 20px 0;
    text-align: center;
  }
  
  .namecard-info {
    width: 100%;
    margin-bottom: 30px;
  }
  
  .info-item {
    display: flex;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .info-item label {
    width: 60px;
    color: #606266;
  }
  
  .info-value {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .namecard-qrcode {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .qrcode-image {
    width: 150px;
    height: 150px;
    margin-bottom: 10px;
  }
  
  .qrcode-text {
    font-size: 12px;
    color: #909399;
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
      display: block;
      margin-right: 0;
      width: 100%;
    }
  }
  </style>