<template>
    <div class="page-container">
      <div class="page-header">
        <h2 class="page-title">商城用户地址管理</h2>
        <div class="header-actions">
          <el-button type="primary" @click="handleAddAddress">
            <el-icon><Plus /></el-icon> 新增地址
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
            <el-form-item label="用户ID">
              <el-input v-model.number="searchForm.user_id" placeholder="请输入用户ID" clearable></el-input>
            </el-form-item>
            <el-form-item label="收件人">
              <el-input v-model="searchForm.receiver_name" placeholder="请输入收件人姓名" clearable></el-input>
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input v-model="searchForm.receiver_phone" placeholder="请输入联系电话" clearable></el-input>
            </el-form-item>
            <el-form-item label="默认地址">
              <el-select v-model="searchForm.is_default" placeholder="请选择" clearable>
                <el-option :value="1" label="是"></el-option>
                <el-option :value="0" label="否"></el-option>
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
          <el-table-column prop="user_id" label="用户ID" width="100" />
          <el-table-column prop="receiver_name" label="收件人" width="120" />
          <el-table-column prop="receiver_phone" label="联系电话" width="130" />
          <el-table-column label="地址" min-width="280">
            <template #default="scope">
              <div class="address-info">
                {{ formatAddress(scope.row) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="postal_code" label="邮政编码" width="100">
            <template #default="scope">
              {{ scope.row.postal_code || '未设置' }}
            </template>
          </el-table-column>
          <el-table-column prop="is_default" label="默认地址" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.is_default === 1 ? 'success' : 'info'">
                {{ scope.row.is_default === 1 ? '是' : '否' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="update_time" label="更新时间" width="170" />
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="scope">
              <el-button link type="primary" @click="handleEdit(scope.row)">编辑</el-button>
              <!-- <el-button 
                link 
                :type="scope.row.is_default === 0 ? 'success' : 'info'" 
                @click="handleSetDefault(scope.row)"
                :disabled="scope.row.is_default === 1"
              >
                设为默认
              </el-button> -->
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
          ref="addressForm"
          :model="addressForm"
          :rules="rules"
          label-width="100px"
        >
          <el-form-item label="用户ID" prop="user_id">
            <el-input v-model.number="addressForm.user_id" placeholder="请输入用户ID" />
          </el-form-item>
          
          <el-form-item label="收件人" prop="receiver_name">
            <el-input v-model="addressForm.receiver_name" placeholder="请输入收件人姓名" />
          </el-form-item>
          
          <el-form-item label="联系电话" prop="receiver_phone">
            <el-input v-model="addressForm.receiver_phone" placeholder="请输入联系电话" />
          </el-form-item>
          
          <el-form-item label="所在地区" prop="region_code">
            <address-selector 
              ref="addressSelector"
              :default-codes="defaultRegionCodes"
              mode="region"
              @change="handleAddressChange"
            />
          </el-form-item>
          
          <el-form-item label="详细地址" prop="detail_address">
            <el-input 
              v-model="addressForm.detail_address" 
              type="textarea" 
              :rows="3" 
              placeholder="请输入详细地址信息" 
            />
          </el-form-item>
          
          <el-form-item label="邮政编码" prop="postal_code">
            <el-input v-model="addressForm.postal_code" placeholder="请输入邮政编码" />
          </el-form-item>
          
          <el-form-item label="默认地址" prop="is_default">
            <el-switch
              v-model="addressForm.is_default"
              :active-value="1"
              :inactive-value="0"
            />
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
    </div>
  </template>
  
  <script>
  import { Plus, Refresh } from '@element-plus/icons-vue'
  import http from '@/utils/http'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import AddressSelector from '@/components/address/AddressSelector.vue'
  
  export default {
    name: 'ShopUserAddressManagement',
    components: {
      Plus,
      Refresh,
      AddressSelector
    },
    data() {
      return {
        // 搜索表单
        searchForm: {
          user_id: '',
          receiver_name: '',
          receiver_phone: '',
          is_default: ''
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
        dialogTitle: '新增地址',
        submitLoading: false,
        addressForm: {
          id: null,
          user_id: '',
          receiver_name: '',
          receiver_phone: '',
          province: '',
          city: '',
          district: '',
          detail_address: '',
          postal_code: '',
          is_default: 0
        },
        
        // 地址选择器默认值
        defaultRegionCodes: {
          province_code: ''
        },
        
        // 表单验证规则
        rules: {
          user_id: [
            { required: true, message: '请输入用户ID', trigger: 'blur' },
          ],
          receiver_name: [
            { required: true, message: '请输入收件人姓名', trigger: 'blur' }
          ],
          receiver_phone: [
            { required: true, message: '请输入联系电话', trigger: 'blur' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
          ],
          region_code: [
            { 
              required: true, 
              validator: (rule, value, callback) => {
                if (!this.addressForm.province || !this.addressForm.city || !this.addressForm.district) {
                  callback(new Error('请选择完整的省市区信息'))
                } else {
                  callback()
                }
              },
              trigger: 'change'
            }
          ],
          detail_address: [
            { required: true, message: '请输入详细地址', trigger: 'blur' }
          ],
          postal_code: [
            { pattern: /^\d{6}$/, message: '请输入正确的邮政编码', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      // 获取商城用户地址列表
      async fetchData() {
        this.loading = true
        try {
          const params = {
            page: this.currentPage,
            size: this.pageSize,
            need_total_count:true,
            user_id: this.searchForm.user_id || undefined,
            receiver_name: this.searchForm.receiver_name || undefined,
            receiver_phone: this.searchForm.receiver_phone || undefined,
            is_default: this.searchForm.is_default !== '' ? this.searchForm.is_default : undefined
          }
          
          const response = await http.get('/api/v1/mini_core/shop_user_addresses/all', params)
          
          if (response.data) {
            this.tableData = response.data.items || []
            this.total = response.data.total || 0
          } else {
            ElMessage.error('获取商城用户地址列表失败')
          }
        } catch (error) {
          console.error('获取商城用户地址列表失败:', error)
          ElMessage.error('获取商城用户地址列表失败')
        } finally {
          this.loading = false
        }
      },
      
      // 格式化地址
      formatAddress(row) {
        const parts = [row.province, row.city, row.district, row.detail_address]
        return parts.filter(part => part).join(' ')
      },
      
      // 处理地址选择器变化
      handleAddressChange(data) {
        this.addressForm.province = data.province.name
        this.addressForm.city = data.city.name
        this.addressForm.district = data.district.name
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
          user_id: '',
          receiver_name: '',
          receiver_phone: '',
          is_default: ''
        }
        this.handleSearch()
      },
      
      // 添加地址
      handleAddAddress() {
        this.isEdit = false
        this.dialogTitle = '新增收货地址'
        this.resetForm()
        this.dialogVisible = true
      },
      
      // 编辑地址
      handleEdit(row) {
        this.isEdit = true
        this.dialogTitle = '编辑收货地址'
        // 深拷贝，避免直接修改表格数据
        this.addressForm = JSON.parse(JSON.stringify(row))
        
        // 设置省市区选择器的默认值
        // 根据您的AddressSelector组件要求设置默认值
        // 假设我们可以获取省市区的编码，实际情况根据您的数据结构调整
        this.setAddressSelectorDefaults(row)
        
        this.dialogVisible = true
      },
      
      // 设置地址选择器默认值
      setAddressSelectorDefaults(row) {
        // 注意：这里只是示例，实际上您可能需要将省市区名称转换为对应的编码
        // 或者后端直接返回省市区的编码
        // 假设您的后端数据包含省市区的编码信息，例如 province_code, city_code, district_code
        
        if (row.province && row.city && row.district) {
          // 如果没有编码信息，只能清空选择器让用户重新选择
          if (this.$refs.addressSelector) {
            this.$refs.addressSelector.clear()
          }
          
          // 如果有编码信息，可以按照您的AddressSelector组件的要求设置
          // 例如：如果后端返回的格式是 "province_code/city_code/district_code"
          // this.defaultRegionCodes.province_code = `${row.province_code}/${row.city_code}/${row.district_code}`
          
          // 由于示例中没有编码信息，以下代码仅作示意
          // 实际使用时请替换为您的实际逻辑
          this.defaultRegionCodes = {
            province_code: ''  // 这里应该设置为实际的编码
          }
          
          // 通过nextTick确保组件已更新
          this.$nextTick(() => {
            if (this.$refs.addressSelector) {
              // 如果有更新组件的方法，可以调用
              // this.$refs.addressSelector.updateFromValues(row.province, row.city, row.district)
            }
          })
        }
      },
      
      // 设为默认地址
      async handleSetDefault(row) {
        try {
          const response = await http.put(`/api/v1/mini_core/shop_user_addresses/${row.id}`, {
            ...row,
            is_default: 1
          })
          
          if (response.status === 200) {
            ElMessage.success('设置默认地址成功')
            
            // 更新本地数据，重新设置所有地址的默认状态
            this.tableData.forEach(item => {
              if (item.user_id === row.user_id) {
                item.is_default = item.id === row.id ? 1 : 0
              }
            })
          } else {
            ElMessage.error('设置默认地址失败')
          }
        } catch (error) {
          console.error('设置默认地址失败:', error)
          ElMessage.error('设置默认地址失败')
        }
      },
      
      // 删除地址
      handleDelete(row) {
        ElMessageBox.confirm(`确定要删除 ${row.receiver_name} 的收货地址吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          try {
            const response = await http.delete(`/api/v1/mini_core/shop_user_addresses/${row.id}`)
            
            if (response.status === 200) {
              ElMessage.success('删除成功')
              this.fetchData()
            } else {
              ElMessage.error('删除失败')
            }
          } catch (error) {
            console.error('删除地址失败:', error)
            ElMessage.error('删除失败')
          }
        }).catch(() => {})
      },
      
      // 重置表单
      resetForm() {
        if (this.$refs.addressForm) {
          this.$refs.addressForm.resetFields()
        }
        
        this.addressForm = {
          id: null,
          user_id: '',
          receiver_name: '',
          receiver_phone: '',
          province: '',
          city: '',
          district: '',
          detail_address: '',
          postal_code: '',
          is_default: 0
        }
        
        // 清空地址选择器
        if (this.$refs.addressSelector) {
          this.$refs.addressSelector.clear()
        }
        
        this.defaultRegionCodes = {
          province_code: ''
        }
      },
      
      // 提交表单
      async submitForm() {
        if (!this.$refs.addressForm) return
        
        try {
          await this.$refs.addressForm.validate()
        } catch (error) {
          return false
        }
        
        this.submitLoading = true
        try {
          const formData = { ...this.addressForm }
          
          let response
          if (this.isEdit) {
            // 编辑模式
            response = await http.put(`/api/v1/mini_core/shop_user_addresses/${formData.id}`, formData)
          } else {
            // 创建模式
            response = await http.post('/api/v1/mini_core/shop_user_addresses/', formData)
          }
          
          if (response.status >= 200 && response.status < 300) {
            ElMessage.success(this.isEdit ? '编辑成功' : '新增成功')
            this.dialogVisible = false
            this.fetchData()
          } else {
            ElMessage.error(this.isEdit ? '编辑失败' : '新增失败')
          }
        } catch (error) {
          console.error(this.isEdit ? '编辑地址失败:' : '新增地址失败:', error)
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
  
  /* 地址信息样式 */
  .address-info {
    white-space: normal;
    word-break: break-all;
    line-height: 1.4;
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