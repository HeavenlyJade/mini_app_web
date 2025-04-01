<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">退货原因管理</h2>
    </div>

    <div class="page-content">
      <!-- 操作按钮区域 -->
      <div class="operation-bar">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>添加退货原因
        </el-button>
        <el-button type="danger" :disabled="!selectedReasons.length" @click="handleBatchDelete">
          <el-icon><Delete /></el-icon>批量删除
        </el-button>
      </div>

      <!-- 表格区域 -->
      <el-table
        v-loading="loading"
        :data="reasonList"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="编号" width="80" />
        <el-table-column prop="reason_type" label="原因类型" min-width="180" />
        <el-table-column prop="sort_order" label="排序" width="100" />
        <el-table-column label="是否启用" width="120">
          <template #default="scope">
            <el-switch
              v-model="scope.row.is_enabled"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="添加时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
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
      width="500px"
      @close="resetForm"
    >
      <el-form
        ref="reasonForm"
        :model="reasonForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="原因类型:" prop="reason_type">
          <el-input v-model="reasonForm.reason_type" placeholder="请输入退货原因" />
        </el-form-item>
        <el-form-item label="排序:" prop="sort_order">
          <el-input-number v-model="reasonForm.sort_order" :min="0" />
        </el-form-item>
        <el-form-item label="是否启用:">
          <el-switch v-model="reasonForm.is_enabled" />
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import http from '@/utils/http'

export default {
  name: 'ReturnReason',
  components: {
    Plus,
    Delete
  },
  data() {
    return {
      loading: false,
      submitLoading: false,
      dialogVisible: false,
      dialogTitle: '添加退货原因',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      reasonList: [],
      selectedReasons: [],
      reasonForm: {
        id: null,
        reason_type: '',
        sort_order: 0,
        is_enabled: true
      },
      rules: {
        reason_type: [
          { required: true, message: '请输入退货原因', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        sort_order: [
          { required: true, message: '请输入排序号', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchReasonList()
  },
  methods: {
    // 获取退货原因列表
    async fetchReasonList() {
      this.loading = true
      try {
        const response = await http.get('/api/v1/mini_core/shop-return-reason', {
          params: {
            page: this.currentPage,
            size: this.pageSize
          }
        })
        if (response.data && response.data.code === 200) {
          this.reasonList = response.data.data
          this.total = response.data.total
        }
      } catch (error) {
        console.error('获取退货原因列表失败:', error)
        ElMessage.error('获取列表失败')
      } finally {
        this.loading = false
      }
    },

    // 处理选择变化
    handleSelectionChange(selection) {
      this.selectedReasons = selection
    },

    // 添加退货原因
    handleAdd() {
      this.dialogTitle = '添加退货原因'
      this.reasonForm = {
        id: null,
        reason_type: '',
        sort_order: 0,
        is_enabled: true
      }
      this.dialogVisible = true
    },

    // 编辑退货原因
    handleEdit(row) {
      this.dialogTitle = '编辑退货原因'
      this.reasonForm = {
        id: row.id,
        reason_type: row.reason_type,
        sort_order: row.sort_order,
        is_enabled: row.is_enabled
      }
      this.dialogVisible = true
    },

    // 删除退货原因
    handleDelete(row) {
      ElMessageBox.confirm('确定要删除该退货原因吗？', '提示', {
        type: 'warning'
      }).then(async () => {
        try {
          const response = await http.delete(`/api/v1/mini_core/shop-return-reason/${row.id}`)
          if (response.data && response.data.code === 200) {
            ElMessage.success('删除成功')
            this.fetchReasonList()
          }
        } catch (error) {
          console.error('删除失败:', error)
          ElMessage.error('删除失败')
        }
      })
    },

    // 批量删除
    handleBatchDelete() {
      if (!this.selectedReasons.length) {
        ElMessage.warning('请选择要删除的项目')
        return
      }
      
      ElMessageBox.confirm(`确定要删除选中的 ${this.selectedReasons.length} 项吗？`, '提示', {
        type: 'warning'
      }).then(async () => {
        try {
          const ids = this.selectedReasons.map(item => item.id)
          const response = await http.delete('/api/v1/mini_core/shop-return-reason/batch', {
            data: { ids }
          })
          if (response.data && response.data.code === 200) {
            ElMessage.success('批量删除成功')
            this.fetchReasonList()
          }
        } catch (error) {
          console.error('批量删除失败:', error)
          ElMessage.error('批量删除失败')
        }
      })
    },

    // 更改状态
    async handleStatusChange(row) {
      try {
        const response = await http.put(`/api/v1/mini_core/shop-return-reason/${row.id}`, {
          ...row,
          is_enabled: row.is_enabled
        })
        if (response.data && response.data.code === 200) {
          ElMessage.success('状态更新成功')
        } else {
          row.is_enabled = !row.is_enabled // 恢复原状态
          ElMessage.error('状态更新失败')
        }
      } catch (error) {
        row.is_enabled = !row.is_enabled // 恢复原状态
        console.error('更新状态失败:', error)
        ElMessage.error('更新状态失败')
      }
    },

    // 提交表单
    async submitForm() {
      try {
        await this.$refs.reasonForm.validate()
      } catch (error) {
        return false
      }

      this.submitLoading = true
      try {
        const isEdit = !!this.reasonForm.id
        const response = await http[isEdit ? 'put' : 'post'](
          `/api/v1/mini_core/shop-return-reason${isEdit ? `/${this.reasonForm.id}` : ''}`,
          this.reasonForm
        )
        
        if (response.data && response.data.code === 200) {
          ElMessage.success(`${isEdit ? '编辑' : '添加'}成功`)
          this.dialogVisible = false
          this.fetchReasonList()
        }
      } catch (error) {
        console.error(`${this.reasonForm.id ? '编辑' : '添加'}失败:`, error)
        ElMessage.error(`${this.reasonForm.id ? '编辑' : '添加'}失败`)
      } finally {
        this.submitLoading = false
      }
    },

    // 重置表单
    resetForm() {
      if (this.$refs.reasonForm) {
        this.$refs.reasonForm.resetFields()
      }
      this.reasonForm = {
        id: null,
        reason_type: '',
        sort_order: 0,
        is_enabled: true
      }
    },

    // 处理分页大小变化
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.fetchReasonList()
    },

    // 处理页码变化
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchReasonList()
    }
  }
}
</script>

<style scoped lang="less">
.page-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.operation-bar {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-dialog__body) {
  padding-top: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style> 