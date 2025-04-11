<template>
    <div class="page-container" v-loading.fullscreen.lock="loading" element-loading-text="加载中...">
      <!-- 页面标题 -->
      <div class="page-header">
        <h2 class="page-title">Banner管理</h2>
        <div class="header-actions">
          <el-button type="primary" icon="Plus" @click="showAddDialog">添加</el-button>
          <el-button type="danger" icon="Delete" @click="handleBatchDelete" :disabled="!selectedBanners.length">批量删除</el-button>
        </div>
      </div>
  
      <!-- Banner列表 -->
      <div class="data-table">
        <el-table 
          :data="bannerList" 
          border 
          style="width: 100%"
          @selection-change="handleSelectionChange"
          v-loading="tableLoading">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="编号/类型" prop="code_type" width="120"></el-table-column>
          <el-table-column label="业务编号/链接地址" prop="business_code" width="180"></el-table-column>
          <el-table-column label="名称" prop="name" min-width="150"></el-table-column>
          <el-table-column label="上传图片" width="150">
            <template #default="scope">
              <el-image 
                v-if="scope.row.upload_image" 
                :src="scope.row.upload_image" 
                style="width: 100px; height: 50px; object-fit: cover;" 
                :preview-src-list="[scope.row.upload_image]">
              </el-image>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="扩展图片" width="150">
            <template #default="scope">
              <el-image 
                v-if="scope.row.expand_image" 
                :src="scope.row.expand_image" 
                style="width: 100px; height: 50px; object-fit: cover;" 
                :preview-src-list="[scope.row.expand_image]">
              </el-image>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">
                {{ scope.row.status === 1 ? '启用' : '隐藏' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="scope">
              <el-button link type="primary" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button link type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
  
        <!-- 分页控件 -->
        <div class="pagination-container">
          <div class="total-info">Total {{ total }}</div>
          <el-select v-model="pageSize" class="page-size-select">
            <el-option label="10/page" :value="10"></el-option>
            <el-option label="20/page" :value="20"></el-option>
            <el-option label="50/page" :value="50"></el-option>
          </el-select>
          <el-pagination
            layout="prev, pager, next"
            :total="total"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="handleCurrentChange">
          </el-pagination>
          <div class="goto-page">
            Go to 
            <el-input v-model="goToPage" class="goto-input" @keyup.enter="handleGoToPage"></el-input>
          </div>
        </div>
      </div>
  
      <!-- 添加/编辑Banner对话框 -->
      <el-dialog 
        :title="isEdit ? '编辑 Banner' : '添加 Banner'" 
        v-model="dialogVisible" 
        width="650px" 
        :close-on-click-modal="false">
        <el-form :model="bannerForm" :rules="rules" ref="bannerFormRef" label-width="100px">
          <el-form-item label="自定义类型" prop="code_type">
            <el-input v-model="bannerForm.code_type" placeholder="请输入Banner类型"></el-input>
            <div v-if="bannerForm.code_type === ''" class="error-tip">不能为空</div>
          </el-form-item>
  
          <el-form-item label="业务编号" prop="business_code">
            <el-input v-model="bannerForm.business_code" placeholder="请输入业务编号"></el-input>
            <div v-if="bannerForm.business_code === ''" class="error-tip">不能为空</div>
          </el-form-item>
  
          <el-form-item label="名称" prop="name">
            <el-input v-model="bannerForm.name" placeholder="请输入Banner名称"></el-input>
            <div v-if="bannerForm.name === ''" class="error-tip">不能为空</div>
          </el-form-item>
  
          <el-form-item label="上传图片">
            <file-uploader 
              :value="bannerForm.imageList" 
              :limit="1" 
              @change="handleImageChange" 
              tip-text="建议尺寸: 750px × 350px，支持jpg、png格式">
            </file-uploader>
          </el-form-item>
  
          <el-form-item label="扩展图片">
            <file-uploader 
              :value="bannerForm.extendedImageList" 
              :limit="1" 
              @change="handleExtendedImageChange" 
              tip-text="扩展图片(可选)，建议尺寸: 750px × 350px">
            </file-uploader>
          </el-form-item>
  
          <el-form-item label="链接类型" prop="link_type">
            <el-radio-group v-model="bannerForm.link_type">
              <el-radio :label="'direct'">直接链接</el-radio>
              <el-radio :label="'miniprogram'">小程序</el-radio>
            </el-radio-group>
          </el-form-item>
  
          <el-form-item label="链接地址" prop="link_url">
            <el-input v-model="bannerForm.link_url" placeholder="请输入链接地址"></el-input>
          </el-form-item>
  
          <el-form-item label="备注">
            <el-input v-model="bannerForm.remark" type="textarea" rows="3" placeholder="请输入备注信息"></el-input>
          </el-form-item>
  
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="bannerForm.status">
              <el-radio :label="1">显示</el-radio>
              <el-radio :label="0">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
  
          <el-form-item label="排序" prop="sort_order">
            <el-input-number v-model="bannerForm.sort_order" :min="0" controls-position="right"></el-input-number>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitForm" :loading="submitLoading">提交</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { ElMessage, ElMessageBox } from 'element-plus';
  import http from '@/utils/http';
  import FileUploader from '@/components/public/FileUploader.vue';
  
  export default {
    name: 'BannerManagement',
    components: {
      FileUploader
    },
    data() {
      return {
        // 加载状态
        loading: false,
        tableLoading: false,
        submitLoading: false,
        
        // 列表数据
        bannerList: [],
        selectedBanners: [],
        
        // 分页数据
        currentPage: 1,
        pageSize: 10,
        total: 0,
        goToPage: '',
        
        // 对话框控制
        dialogVisible: false,
        isEdit: false,
        
        // Banner表单
        bannerForm: {
          id: null,
          code_type: '',
          business_code: '0',
          name: '',
          imageList: [],
          extendedImageList: [],
          upload_image: '',
          expand_image: '',
          link_type: 'direct',
          link_url: '',
          remark: '',
          status: 1,
          sort_order: 0
        },
        
        // 表单验证规则
        rules: {
          code_type: [
            { required: true, message: '请输入Banner类型', trigger: 'blur' }
          ],
          business_code: [
            { required: true, message: '请输入业务编号', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入Banner名称', trigger: 'blur' }
          ],
          link_type: [
            { required: true, message: '请选择链接类型', trigger: 'change' }
          ],
          status: [
            { required: true, message: '请选择状态', trigger: 'change' }
          ]
        }
      };
    },
    
    mounted() {
      this.fetchBannerList();
    },
    
    methods: {
      // 获取Banner列表
      fetchBannerList() {
        this.tableLoading = true;
        
        const params = {
          page: this.currentPage,
          size: this.pageSize,
          need_total_count: true
        };
        
        http.get('/api/v1/mini_core/banners', params)
          .then(response => {
            if (response.data) {
              this.bannerList = response.data.items || [];
              this.total = response.data.total || 0;
            } else {
              this.bannerList = [];
              this.total = 0;
            }
          })
          .catch(error => {
            console.error('获取Banner列表失败:', error);
            ElMessage.error('获取Banner列表失败，请重试');
          })
          .finally(() => {
            this.tableLoading = false;
          });
      },
      
      // 显示添加对话框
      showAddDialog() {
        this.isEdit = false;
        this.bannerForm = {
          id: null,
          code_type: '',
          business_code: '0',
          name: '',
          imageList: [],
          extendedImageList: [],
          upload_image: '',
          expand_image: '',
          link_type: 'direct',
          link_url: '',
          remark: '',
          status: 1,
          sort_order: 0
        };
        this.dialogVisible = true;
      },
      
      // 处理编辑
      handleEdit(row) {
        this.isEdit = true;
        this.bannerForm = {
          id: row.id,
          code_type: row.code_type,
          business_code: row.business_code,
          name: row.name,
          imageList: row.upload_image ? [row.upload_image] : [],
          extendedImageList: row.expand_image ? [row.expand_image] : [],
          upload_image: row.upload_image,
          expand_image: row.expand_image,
          link_type: row.link_type || 'direct',
          link_url: row.link_url || '',
          remark: row.remark || '',
          status: row.status,
          sort_order: row.sort_order || 0
        };
        this.dialogVisible = true;
      },
      
      // 处理删除
      handleDelete(row) {
        ElMessageBox.confirm('确认删除该Banner?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          http.delete(`/api/v1/mini_core/banners/${row.id}`)
            .then(() => {
              ElMessage.success('删除成功');
              this.fetchBannerList();
            })
            .catch(error => {
              console.error('删除Banner失败:', error);
              ElMessage.error('删除Banner失败，请重试');
            })
            .finally(() => {
              this.loading = false;
            });
        }).catch(() => {
          ElMessage.info('已取消删除');
        });
      },
      
      // 处理批量删除
      handleBatchDelete() {
        if (this.selectedBanners.length === 0) {
          ElMessage.warning('请先选择要删除的Banner');
          return;
        }
        
        ElMessageBox.confirm(`确认删除选中的 ${this.selectedBanners.length} 个Banner?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const ids = this.selectedBanners.map(item => item.id);
          this.loading = true;
          
          http.post('/api/v1/mini_core/banners/batch-delete', { ids })
            .then(() => {
              ElMessage.success('批量删除成功');
              this.fetchBannerList();
              this.selectedBanners = [];
            })
            .catch(error => {
              console.error('批量删除失败:', error);
              ElMessage.error('批量删除失败，请重试');
            })
            .finally(() => {
              this.loading = false;
            });
        }).catch(() => {
          ElMessage.info('已取消删除');
        });
      },
      
      // 提交表单
      submitForm() {
        this.$refs.bannerFormRef.validate(valid => {
          if (valid) {
            if (this.bannerForm.imageList.length === 0) {
              ElMessage.warning('请上传Banner图片');
              return;
            }
            
            this.submitLoading = true;
            
            // 构建提交数据
            const formData = {
              code_type: this.bannerForm.code_type,
              business_code: this.bannerForm.business_code,
              name: this.bannerForm.name,
              upload_image: this.bannerForm.imageList[0],
              expand_image: this.bannerForm.extendedImageList.length > 0 ? this.bannerForm.extendedImageList[0] : '',
              link_type: this.bannerForm.link_type,
              link_url: this.bannerForm.link_url,
              remark: this.bannerForm.remark,
              status: this.bannerForm.status,
              sort_order: this.bannerForm.sort_order
            };
            
            const request = this.isEdit
              ? http.put(`/api/v1/mini_core/banners/${this.bannerForm.id}`, formData)
              : http.post('/api/v1/mini_core/banners', formData);
            
            request
              .then(() => {
                ElMessage.success(this.isEdit ? '更新成功' : '添加成功');
                this.dialogVisible = false;
                this.fetchBannerList();
              })
              .catch(error => {
                console.error(this.isEdit ? '更新Banner失败' : '添加Banner失败', error);
                ElMessage.error((this.isEdit ? '更新' : '添加') + 'Banner失败，请重试');
              })
              .finally(() => {
                this.submitLoading = false;
              });
          } else {
            return false;
          }
        });
      },
      
      // 图片上传变化处理
      handleImageChange(urls) {
        this.bannerForm.imageList = urls;
        this.bannerForm.upload_image = urls.length > 0 ? urls[0] : '';
      },
      
      // 扩展图片上传变化处理
      handleExtendedImageChange(urls) {
        this.bannerForm.extendedImageList = urls;
        this.bannerForm.expand_image = urls.length > 0 ? urls[0] : '';
      },
      
      // 表格选择行变化
      handleSelectionChange(selection) {
        this.selectedBanners = selection;
      },
      
      // 页码变化处理
      handleCurrentChange(page) {
        this.currentPage = page;
        this.fetchBannerList();
      },
      
      // 跳转到指定页码
      handleGoToPage() {
        if (this.goToPage && !isNaN(this.goToPage)) {
          const page = parseInt(this.goToPage);
          if (page > 0 && page <= Math.ceil(this.total / this.pageSize)) {
            this.currentPage = page;
            this.fetchBannerList();
          } else {
            ElMessage.warning('页码超出范围');
          }
        }
      }
    }
  };
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
  
  .data-table {
    background-color: #fff;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  
  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .total-info {
    color: #606266;
    font-size: 14px;
  }
  
  .page-size-select {
    width: 100px;
    margin: 0 15px;
  }
  
  .goto-page {
    display: flex;
    align-items: center;
    color: #606266;
    font-size: 14px;
  }
  
  .goto-input {
    width: 50px;
    margin: 0 8px;
  }
  
  .error-tip {
    color: #f56c6c;
    font-size: 12px;
    margin-top: 5px;
  }
  
  :deep(.el-form-item) {
    margin-bottom: 22px;
  }
  
  :deep(.el-dialog__body) {
    padding: 10px 20px;
  }
  </style>