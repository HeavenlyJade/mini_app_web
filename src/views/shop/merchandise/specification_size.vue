<!-- 添加更好的错误状态和空状态处理 -->
<template>
  <div class="page-container">
    <!-- 全局加载 -->
    <el-loading v-if="loading" fullscreen element-loading-text="加载中..."></el-loading>

    <!-- Page Header with Action Buttons -->
    <div class="action-bar">
      <el-button type="success" icon="el-icon-plus" @click="showAddCategoryDialog">添加</el-button>
      <el-button type="danger" icon="el-icon-edit" :disabled="!hasSelected" @click="handleBatchEdit">编辑</el-button>
    </div>

    <!-- 标签页导航 - 只在有数据时显示 -->
    <div class="filter-tabs" v-if="specData.length > 0">
      <el-tabs v-model="activeTab" @tab-click="handleTabClick" type="border-card" class="responsive-tabs">
        <el-tab-pane v-for="(item, index) in specData" :key="index" :label="item.name" :name="index.toString()">
          <!-- 空的标签页内容，实际内容在外部渲染 -->
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 无数据时显示提示和占位 -->
    <div v-else class="empty-data-container">
      <div class="empty-placeholder">
        <i class="el-icon-document"></i>
        <p>暂无规格尺寸数据</p>
        <el-button type="primary" size="small" @click="showAddCategoryDialog">添加规格尺寸</el-button>
      </div>
    </div>

    <!-- 数据表格 - 只在有标签页数据时显示 -->
    <template v-if="specData.length > 0">
      <el-table :data="currentTabData" style="width: 100%" v-loading="tableLoading" element-loading-text="加载中..."
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="属性名称" width="180"></el-table-column>
        <el-table-column prop="notes" label="备注"></el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scope">
            <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" class="delete-btn" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <!-- 添加空数据显示 -->
        <template #empty>
          <p class="empty-text">当前分类暂无数据</p>
        </template>
      </el-table>

      <!-- 添加子项按钮 -->
      <div class="add-child-property">
        <el-button type="success" icon="el-icon-plus" @click="showAddItemDialog">添加子项</el-button>
      </div>
    </template>

    <!-- 添加规格尺寸类别对话框 -->
    <el-dialog title="增加规格尺寸" v-model="categoryDialogVisible" width="50%" :close-on-click-modal="false"
      @close="resetCategoryForm">
      <el-form :model="categoryForm" :rules="categoryRules" ref="categoryForm" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="categoryForm.name" placeholder="请输入规格尺寸名称"></el-input>
          <div class="error-tip" v-show="categoryForm.name === ''">不能为空</div>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="categoryForm.notes" type="textarea" placeholder="请输入备注信息"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="categoryForm.order" :min="0" controls-position="right"></el-input-number>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="categoryDialogVisible = false" :disabled="categoryLoading">取消</el-button>
          <el-button type="primary" @click="submitCategoryForm" :loading="categoryLoading">提交</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加/编辑规格尺寸子项对话框 -->
    <el-dialog :title="dialogType === 'add' ? '增加子项' : '修改子项'" v-model="dialogVisible" width="50%"
      :close-on-click-modal="false" @close="resetForm">
      <el-form :model="form" :rules="rules" ref="specForm" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" :placeholder="dialogType === 'add' ? '请输入名称' : form.name"></el-input>
          <div v-if="dialogType === 'add'" class="error-tip" v-show="form.name === ''">不能为空</div>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.notes" type="textarea" placeholder="请输入备注信息"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.order" :min="0" controls-position="right"></el-input-number>
        </el-form-item>
        <!-- 扩展属性区域 - 根据标签页类型显示 -->
        <div v-if="shouldShowExtendedProps()" class="extended-props">
          <h4>扩展属性</h4>
          <div v-for="(prop, idx) in form.extendedProps" :key="idx" class="extended-props-row">
            <el-input v-model="prop.key" placeholder="属性键" class="extended-prop-input"></el-input>
            <span class="prop-separator">:</span>
            <el-input v-model="prop.value" placeholder="属性值" class="extended-prop-input"></el-input>
            <el-button type="danger" icon="el-icon-delete" circle size="mini" class="remove-prop-btn"
              @click="removeExtendedProp(idx)"></el-button>
          </div>
          <el-button type="primary" size="small" icon="el-icon-plus" class="add-prop-btn" @click="addExtendedProp">
            添加属性
          </el-button>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false" :disabled="formLoading">取消</el-button>
          <el-button type="primary" @click="submitForm" :loading="formLoading">提交</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加网络错误提示组件 -->
    <el-backtop>
      <div class="backtop-inner">
        <i class="el-icon-caret-top"></i>
      </div>
    </el-backtop>

    <!-- 离线状态提示 -->
    <div class="offline-alert" v-if="isOffline">
      <el-alert title="网络连接已断开" type="error" :closable="false" description="当前处于离线状态，无法保存数据。请检查网络连接后刷新页面。" show-icon>
      </el-alert>
    </div>
  </div>
</template>
<!-- Script Section -->
<script>
// 引入axios
import axios from 'axios';

export default {
  name: 'DimensionSpecsManagement',
  data() {
    return {
      activeTab: '0',
      selectedRows: [],
      hasSelected: false,

      // 加载状态标志
      loading: false,
      tableLoading: false,
      formLoading: false,
      categoryLoading: false,

      // 对话框控制
      dialogVisible: false,
      dialogType: 'add',
      categoryDialogVisible: false,

      // 表单数据
      form: {
        name: '',
        notes: '',
        order: 0,
        extendedProps: []
      },
      categoryForm: {
        name: '',
        notes: '',
        order: 0
      },

      // 其他数据
      extendedPropKey: '',
      extendedPropValue: '',
      showExtendedProps: false,

      // 表单验证规则
      rules: {
        name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 50,
            message: '长度在 1 到 50 个字符',
            trigger: 'blur'
          }
        ]
      },
      categoryRules: {
        name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 50,
            message: '长度在 1 到 50 个字符',
            trigger: 'blur'
          }
        ]
      },

      // 规格数据，初始为空，将从服务器获取
      specData: []
    }
  },
  computed: {
    // 获取当前标签页的数据
    currentTabData () {
      if (this.activeTab !== undefined && this.specData[this.activeTab]) {
        return this.specData[this.activeTab].value || [];
      }
      return [];
    }
  },
  // 组件创建时加载数据
  created() {
    this.fetchSpecData();
  },
  methods: {
    // === 数据加载方法 ===

    // 从服务器获取规格尺寸列表
    fetchSpecData() {
      // 显示加载状态
      this.loading = true;

      // 发送请求获取数据
      return axios.get('/api/spec-dimensions')
        .then(response => {
          // 检查响应数据格式
          if (response.data && Array.isArray(response.data)) {
            this.specData = response.data;

            // 如果有数据，默认选中第一个标签页
            if (this.specData.length > 0) {
              this.activeTab = '0';
            }
          } else {
            // 后端返回的数据格式不正确，使用默认空数据
            console.error('获取规格尺寸列表返回的数据格式不正确');
            this.specData = [];
            this.$message.error('获取规格尺寸数据格式不正确');
          }
        })
        .catch(error => {
          console.error('获取规格尺寸列表失败:', error);
          // 重要：设置默认空数组，而不是保持之前的状态
          this.specData = [];
          this.$message.error('获取规格尺寸列表失败，请刷新页面重试');
        })
        .finally(() => {
          this.loading = false;
        });
    },

    // 添加新的规格尺寸类别
    addSpecCategory(category) {
      return axios.post('/api/spec-dimensions', category)
        .then(response => {
          return response.data;
        });
    },

    // 添加/编辑规格尺寸的子项
    saveSpecItem(item, isEdit = false) {
      const currentCategoryId = this.specData[this.activeTab].id; // 假设后端返回的数据中包含id字段

      // 构建请求数据
      const requestData = {
        ...item,
        categoryId: currentCategoryId
      };

      let request;
      if (isEdit) {
        // 编辑现有项
        request = axios.put(`/api/spec-items/${item.id}`, requestData);
      } else {
        // 添加新项
        request = axios.post('/api/spec-items', requestData);
      }

      return request.then(response => {
        return response.data;
      });
    },

    // 删除规格尺寸子项
    deleteSpecItem(itemId) {
      return axios.delete(`/api/spec-items/${itemId}`)
        .then(response => {
          return response.data;
        });
    },

    // === UI交互方法 ===

    // 表格选择行变化
    handleSelectionChange(rows) {
      this.selectedRows = rows;
      this.hasSelected = rows.length > 0;
    },

    // 标签页点击事件
    handleTabClick() {
      // 重置选中行
      this.selectedRows = [];
      this.hasSelected = false;
    },

    // === 规格尺寸类别相关方法 ===

    // 显示添加规格尺寸类别对话框
    showAddCategoryDialog() {
      this.categoryForm = {
        name: '',
        notes: '',
        order: 0
      };
      this.categoryDialogVisible = true;
    },

    // 重置规格尺寸类别表单
    resetCategoryForm() {
      if (this.$refs.categoryForm) {
        this.$refs.categoryForm.resetFields();
      }
      this.categoryForm = {
        name: '',
        notes: '',
        order: 0
      };
    },

    // 提交规格尺寸类别表单
    submitCategoryForm() {
      this.$refs.categoryForm.validate((valid) => {
        if (valid) {
          // 检查名称是否已存在
          const nameExists = this.specData.some(item => item.name === this.categoryForm.name);
          if (nameExists) {
            this.$message({
              type: 'warning',
              message: '规格尺寸名称已存在'
            });
            return;
          }

          // 构建新的规格尺寸类别数据
          const newCategory = {
            name: this.categoryForm.name,
            notes: this.categoryForm.notes || '',
            order: this.categoryForm.order
          };

          // 显示加载状态
          this.categoryLoading = true;

          // 发送到服务器
          // 发送到服务器
          this.addSpecCategory(newCategory)
            .then(() => {
              // 添加成功后重新获取数据列表
              return this.fetchSpecData();
            })
            .then(() => {
              this.categoryDialogVisible = false;
              this.$message({
                type: 'success',
                message: '添加规格尺寸成功!'
              });
            })
            .catch(error => {
              console.error('添加规格尺寸失败:', error);
              this.$message.error('添加规格尺寸失败，请重试');
            })
            .finally(() => {
              this.categoryLoading = false;
            });
        } else {
          return false;
        }
      });
    },

    // === 子项相关方法 ===

    // 显示添加子项对话框
    showAddItemDialog() {
      this.dialogType = 'add';
      this.form = {
        name: '',
        notes: '',
        order: 0,
        extendedProps: []
      };
      this.dialogVisible = true;
    },

    // 处理编辑行
    handleEdit(row) {
      this.dialogType = 'edit';

      // 填充表单数据
      this.form = {
        id: row.id,
        name: row.name,
        notes: row.notes || '',
        order: row.order || 0,
        extendedProps: [...(row.extendedProps || [])]
      };

      this.dialogVisible = true;
    },

    // 批量编辑
    handleBatchEdit() {
      if (this.selectedRows.length > 0) {
        // 简化起见，只编辑第一个选中的行
        this.handleEdit(this.selectedRows[0]);
      }
    },

    // 判断是否显示扩展属性
    shouldShowExtendedProps() {
      if (!this.specData[this.activeTab]) {
        return false;
      }
      // 根据当前标签页决定是否显示扩展属性
      return ['颜色', '新订单提示'].includes(this.specData[this.activeTab].name);
    },

    // 添加扩展属性
    addExtendedProp() {
      if (this.extendedPropKey && this.extendedPropValue) {
        this.form.extendedProps.push({
          key: this.extendedPropKey,
          value: this.extendedPropValue
        });
        this.extendedPropKey = '';
        this.extendedPropValue = '';
      } else {
        // 如果没有填写键或值，也添加一个空属性
        this.form.extendedProps.push({
          key: '',
          value: ''
        });
      }
    },

    // 删除扩展属性
    removeExtendedProp(index) {
      if (index !== undefined) {
        this.form.extendedProps.splice(index, 1);
      } else {
        // 如果没有提供索引，则删除最后一个
        this.form.extendedProps.pop();
      }
    },

    // 重置子项表单
    resetForm() {
      if (this.$refs.specForm) {
        this.$refs.specForm.resetFields();
      }
      this.form = {
        name: '',
        notes: '',
        order: 0,
        extendedProps: []
      };
      this.extendedPropKey = '';
      this.extendedPropValue = '';
    },

    // 提交子项表单
    submitForm() {
      this.$refs.specForm.validate((valid) => {
        if (valid) {
          // 构建提交的数据
          const itemData = {
            name: this.form.name,
            notes: this.form.notes || '',
            order: this.form.order,
            extendedProps: [...this.form.extendedProps]
          };

          // 如果是编辑模式，添加ID
          if (this.dialogType === 'edit') {
            itemData.id = this.form.id;
          }

          // 显示加载状态
          this.formLoading = true;

          // 发送到服务器
          this.saveSpecItem(itemData, this.dialogType === 'edit')
            .then(() => {
              // 保存成功后重新获取数据
              return this.fetchSpecData();
            })
            .then(() => {
              this.dialogVisible = false;
              this.$message({
                type: 'success',
                message: this.dialogType === 'add' ? '添加成功!' : '修改成功!'
              });
            })
            .catch(error => {
              console.error('保存数据失败:', error);
              this.$message.error('保存失败，请重试');
            })
            .finally(() => {
              this.formLoading = false;
            });
        } else {
          return false;
        }
      });
    },

    // 删除记录
    handleDelete(row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 显示加载状态
        this.tableLoading = true;

        // 发送删除请求到服务器
        this.deleteSpecItem(row.id)
          .then(() => {
            // 删除成功后重新获取数据
            return this.fetchSpecData();
          })
          .then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          })
          .catch(error => {
            console.error('删除失败:', error);
            this.$message.error('删除失败，请重试');
          })
          .finally(() => {
            this.tableLoading = false;
          });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
};
</script>

<!-- Style Section -->
<style lang="less" scoped>
.page-container {
  width: 100%;
  padding: 15px;
}

.action-bar {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 15px;

  .el-button+.el-button {
    margin-left: 10px;
  }
}

.filter-tabs {
  margin-bottom: 20px;

  .filter-tag {
    margin-right: 10px;
    margin-bottom: 10px;
  }

  .el-tabs {
    margin-top: 10px;
  }
}

// 响应式标签页样式
.responsive-tabs {
  width: 100%;
  overflow-x: auto;

  :deep(.el-tabs__nav) {
    white-space: nowrap;
    float: none;
  }

  :deep(.el-tabs__header) {
    overflow-x: auto;
    margin-bottom: 0;
  }

  :deep(.el-tabs__nav-wrap) {
    padding-bottom: 5px;
  }

  :deep(.el-tabs__nav-scroll) {
    overflow-x: visible;
  }

  :deep(.el-tabs__item) {
    float: none;
    display: inline-block;
  }
}

// Table styles
.el-table {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  table-layout: fixed;
  width: 100% !important;
  max-width: 100%;
}

.delete-btn {
  color: #f56c6c;
}

// 空数据样式
.empty-text {
  color: #909399;
  text-align: center;
  padding: 20px 0;
}

// Dialog styles
.el-dialog {
  .intl-btn {
    margin-left: 10px;
  }
}

// Extended properties section
.extended-props {
  border-top: 1px dashed #e6e6e6;
  padding-top: 15px;
  margin-top: 15px;

  .extended-props-row {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  .extended-prop-input {
    flex: 1;
  }

  .prop-separator {
    margin: 0 10px;
    font-weight: bold;
  }

  .remove-prop-btn {
    margin-left: 10px;
  }

  .add-prop-btn {
    margin-top: 10px;
  }
}

// Add child property button styles
.add-child-property {
  margin-top: 20px;

  .el-button {
    padding: 8px 20px;
    width: auto;
  }
}

// Custom styles to match the screenshots
:deep(.el-button--success) {
  background-color: #67c23a;
  border-color: #67c23a;
}

:deep(.el-button--danger) {
  background-color: #f56c6c;
  border-color: #f56c6c;
}

:deep(.el-tabs__item) {
  height: 32px;
  line-height: 32px;
  font-size: 14px;
}

:deep(.el-button--primary) {
  background-color: #409eff;
  border-color: #409eff;
}

// Match the styles for input placeholders from the screenshots
:deep(.el-input__inner::placeholder) {
  color: #c0c4cc;
}

// Dialog footer styles
.dialog-footer {
  display: flex;
  justify-content: flex-end;

  .el-button+.el-button {
    margin-left: 10px;
  }
}

.error-tip {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
}

/* 对话框样式优化 */
:deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 500;
}

:deep(.el-dialog__body) {
  padding: 20px;
}
</style>
