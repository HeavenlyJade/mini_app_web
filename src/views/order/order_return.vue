<template>
    <div class="page-container" v-loading.fullscreen.lock="loading" element-loading-text="加载中...">
      <!-- 页面标题 -->
      <div class="page-header">
        <h2 class="page-title">退货申请管理</h2>
      </div>
  
      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="输入搜索:">
            <el-input v-model="searchForm.keyword" placeholder="订单号" clearable @keyup.enter="handleSearch"></el-input>
          </el-form-item>
          
          <el-form-item label="处理状态:">
            <el-select v-model="searchForm.status" placeholder="全部" clearable>
              <el-option label="全部" value=null></el-option>
              <el-option label="待处理申请" value="1"></el-option>
              <el-option label="退货中" value="2"></el-option>
              <el-option label="已完成" value="3"></el-option>
              <el-option label="已拒绝" value="4"></el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="申请时间:">
            <el-date-picker
              v-model="searchForm.applyTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              clearable>
            </el-date-picker>
          </el-form-item>
          
          <el-form-item label="操作人员:">
            <el-input v-model="searchForm.operator" placeholder="全部" clearable></el-input>
          </el-form-item>
          
          <el-form-item label="处理时间:">
            <el-date-picker
              v-model="searchForm.processTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              clearable>
            </el-date-picker>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
  
      <!-- 数据列表 -->
      <div class="data-list-container">
        <h3 class="section-title">数据列表</h3>
        
        <el-table
          :data="refundList"
          border
          style="width: 100%"
          v-loading="tableLoading"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="order_no" label="订单号" width="100"></el-table-column>
          <el-table-column prop="order_no" label="订单号" width="100"></el-table-column>

          <el-table-column prop="apply_time" label="申请时间" width="180"></el-table-column>
          <!-- <el-table-column prop="userId" label="用户账号" width="120"></el-table-column> -->
          <el-table-column prop="return_amount" label="退款金额" width="120">
            <template #default="scope">
              <span>¥ {{ scope.row.return_amount }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="申请状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusTagType(scope.row.status)">{{ getStatusType(scope.row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="audit_time" label="审核时间" width="180"></el-table-column>
          <el-table-column label="操作" fixed="right" width="120">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="viewDetail(scope.row)">查看详情</el-button>
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
            :total="totalItems"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange">
          </el-pagination>
        </div>
        
        <!-- 批量操作 -->
        <div class="batch-actions">
          <el-select v-model="batchAction" placeholder="批量删除" class="batch-select">
            <el-option label="批量删除" value="delete"></el-option>
            <el-option label="批量导出" value="export"></el-option>
          </el-select>
          <el-button type="primary" @click="handleBatchAction" :disabled="!selectedRows.length">确定</el-button>
        </div>
      </div>
      
    </div>
  </template>
  
  <script>
  import http from '@/utils/http';
  
  export default {
    name: 'RefundRequestPage',
    data() {
      return {
        // 加载状态
        loading: false,
        tableLoading: false,
        
        // 搜索表单
        searchForm: {
          keyword: '',
          status: '',
          applyTime: [],
          operator: '',
          processTime: []
        },
        
        // 列表数据
        refundList: [],
        selectedRows: [],
        
        // 分页数据
        currentPage: 1,
        pageSize: 10,
        totalItems: 0,
        
        // 批量操作
        batchAction: 'delete',
        
        // 详情对话框
        detailDialogVisible: false,
        currentDetail: null,
        
        // 处理表单
        handleForm: {
          result: 'approve',
          comment: ''
        }
      };
    },
    
    mounted() {
      this.fetchRefundRequests();
    },
    
    methods: {
      // 获取退款申请列表
      fetchRefundRequests() {
        this.tableLoading = true;
        
        // 构建查询参数
        const params = {
          page: this.currentPage,
          size: this.pageSize,
          need_total_count: true,
        //   refund_status: 1  // 添加退款状态过滤
        };
        
        // 添加搜索条件
        if (this.searchForm.keyword) {
          params.keyword = this.searchForm.keyword.trim();
        }
        
        
        if (this.searchForm.applyTime && this.searchForm.applyTime.length === 2) {
          params.refund_start_time = this.searchForm.applyTime[0];
          params.refund_end_time = this.searchForm.applyTime[1];
        }
        
        if (this.searchForm.operator) {
          params.operator = this.searchForm.operator.trim();
        }
        
        if (this.searchForm.processTime && this.searchForm.processTime.length === 2) {
          params.update_start_time = this.searchForm.processTime[0];
          params.update_end_time = this.searchForm.processTime[1];
        }
        
        // 发送请求
        http.get('/api/v1/mini_core/shop-order-return', params)
          .then(response => {
            if (response.data && response.data.data) {
              // 处理返回的数据，转换状态码为易读文本
              this.refundList = response.data.data;
              this.totalItems = response.data.total;
            } 
          })
          .catch(error => {
            console.error('获取退款申请列表失败:', error);
            this.$message.error('获取退款申请列表失败，请重试');
          })
          .finally(() => {
            this.tableLoading = false;
          });
      },
      
      // 根据状态获取文本描述
      getStatusType(status) {
        const statusMap = {
          0: '待审核',
          1: '已同意',
          2: '已拒绝',
          3: '退款中',
          4: '已完成'
        };
        return statusMap[status] || '未知状态';
      },
      
      // 根据状态获取标签类型
      getStatusTagType(status) {
        const typeMap = {
          0: 'info',    // 待审核
          1: 'success', // 已同意
          2: 'danger',  // 已拒绝
          3: 'warning', // 退款中
          4: 'success'  // 已完成
        };
        return typeMap[status] || 'info';
      },
      
      // 查看详情
      viewDetail(row) {
        this.$router.push({
        path: `/order/return/detail/`,
        query: {
          order_no: row.order_no,
        }
      });
      },
      
      // 提交处理结果
      submitHandle() {
        if (!this.currentDetail) return;
        
        const status = this.handleForm.result === 'approve' ? '已完成' : '已拒绝';
        const data = {
          id: this.currentDetail.id,
          status: status,
          remark: this.handleForm.comment,
          operator: localStorage.getItem('username') || 'admin'
        };
        
        this.loading = true;
        
        http.put(`/api/v1/mini_core/refund-requests/${this.currentDetail.id}`, data)
          .then(() => {
            this.$message.success('处理成功');
            this.detailDialogVisible = false;
            // 刷新列表
            this.fetchRefundRequests();
          })
          .catch(error => {
            console.error('处理失败:', error);
            this.$message.error('处理失败，请重试');
          })
          .finally(() => {
            this.loading = false;
          });
      },
      
      // 表格选择变化
      handleSelectionChange(rows) {
        this.selectedRows = rows;
      },
      
      // 搜索
      handleSearch() {
        this.currentPage = 1; // 重置到第一页
        this.fetchRefundRequests();
      },
      
      // 重置搜索条件
      resetSearch() {
        this.searchForm = {
          keyword: '',
          status: '',
          applyTime: [],
          operator: '',
          processTime: []
        };
        this.handleSearch();
      },
      
      // 批量操作
      handleBatchAction() {
        if (!this.selectedRows.length) {
          this.$message.warning('请先选择要操作的记录');
          return;
        }
        
        if (this.batchAction === 'delete') {
          this.handleBatchDelete();
        } else if (this.batchAction === 'export') {
          this.handleBatchExport();
        }
      },
      
      // 批量删除
      handleBatchDelete() {
        this.$confirm('确认删除选中的退款申请记录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const ids = this.selectedRows.map(row => row.id);
          
          this.loading = true;
          
          http.deleteWithData('/api/v1/mini_core/refund-requests/batch', { ids })
            .then(() => {
              this.$message.success('批量删除成功');
              this.fetchRefundRequests();
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
      
      // 批量导出
      handleBatchExport() {
        this.$message.info('导出功能暂未实现');
        // 可以在这里实现导出逻辑
      },
      
      // 分页大小变化
      handleSizeChange(size) {
        this.pageSize = size;
        this.fetchRefundRequests();
      },
      
      // 当前页变化
      handleCurrentChange(page) {
        this.currentPage = page;
        this.fetchRefundRequests();
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
    margin-bottom: 20px;
  }
  
  .page-title {
    font-size: 20px;
    color: #303133;
    margin: 0;
    padding-bottom: 10px;
    border-bottom: 1px solid #ebeef5;
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
  
  .section-title {
    font-size: 16px;
    color: #303133;
    margin-top: 0;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ebeef5;
  }
  
  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
  
  .batch-actions {
    margin-top: 20px;
    display: flex;
    align-items: center;
  }
  
  .batch-select {
    width: 140px;
    margin-right: 10px;
  }
  
  .detail-container {
    padding: 10px;
  }
  
  .evidence-images {
    margin-top: 20px;
  }
  
  .evidence-images h4 {
    font-size: 16px;
    margin-bottom: 10px;
  }
  
  .image-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .image-item {
    width: 100px;
    height: 100px;
    overflow: hidden;
    border: 1px solid #ebeef5;
    border-radius: 4px;
  }
  
  .handle-form {
    margin-top: 20px;
    border-top: 1px solid #ebeef5;
    padding-top: 20px;
  }
  
  .handle-form h4 {
    font-size: 16px;
    margin-bottom: 10px;
  }
  
  :deep(.el-form-item) {
    margin-bottom: 15px;
  }
  
  :deep(.el-button--link) {
    padding: 2px 0;
  }
  
  :deep(.el-date-editor.el-input__inner) {
    width: 240px;
  }
  
  .image-error {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  </style>