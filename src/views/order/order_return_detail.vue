<template>
  <div class="page-container" v-loading.fullscreen.lock="loading" element-loading-text="加载中...">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">退货申请详情</h2>
      <div class="page-actions">
        <el-button type="primary" @click="goBack">返回列表</el-button>
      </div>
    </div>

    <!-- 退货申请基本信息 -->
    <div class="info-card">
      <div class="card-header">
        <h3 class="card-title">服务单信息</h3>
      </div>
      <div class="card-content" v-if="returnInfo">
        <el-descriptions :column="3" border>
          <el-descriptions-item label="服务单号">{{ returnInfo.return_no || '-' }}</el-descriptions-item>
          <el-descriptions-item label="订单号">{{ returnInfo.order_no || '-' }}</el-descriptions-item>
          <el-descriptions-item label="申请时间">{{ returnInfo.apply_time || '-' }}</el-descriptions-item>
          <el-descriptions-item label="用户ID">{{ returnInfo.user_id || '-' }}</el-descriptions-item>
          <el-descriptions-item label="退款金额">
            <span class="price-text">¥ {{ returnInfo.return_amount || '0.00' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="退货数量">{{ returnInfo.return_quantity || '0' }}</el-descriptions-item>
          <el-descriptions-item label="申请状态">
            <el-tag :type="getStatusTagType(returnInfo.status)">{{ getStatusText(returnInfo.status) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="审核时间">{{ returnInfo.audit_time || '-' }}</el-descriptions-item>
          <el-descriptions-item label="完成时间">{{ returnInfo.complete_time || '-' }}</el-descriptions-item>
          <el-descriptions-item label="退款原因" :span="3">{{ returnInfo.return_reason || '-' }}</el-descriptions-item>
          <el-descriptions-item label="退款方式" :span="1">{{ getRefundWayText(returnInfo.refund_way) }}</el-descriptions-item>
          <el-descriptions-item label="退款账户" :span="2">{{ returnInfo.refund_account || '-' }}</el-descriptions-item>
          <el-descriptions-item label="拒绝原因" :span="3" v-if="returnInfo.status === 2">
            <span class="refuse-reason">{{ returnInfo.refuse_reason || '-' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="退货物流公司" :span="1" v-if="returnInfo.return_express_company">{{ returnInfo.return_express_company }}</el-descriptions-item>
          <el-descriptions-item label="退货物流单号" :span="2" v-if="returnInfo.return_express_no">{{ returnInfo.return_express_no }}</el-descriptions-item>
          <el-descriptions-item label="备注说明" :span="3">{{ returnInfo.description || '-' }}</el-descriptions-item>
        </el-descriptions>

        <!-- 凭证图片 -->
        <div class="evidence-section" v-if="returnInfo.images && returnInfo.images.length">
          <h4 class="section-title">凭证图片</h4>
          <div class="evidence-images">
            <div v-for="(img, index) in returnInfo.images" :key="index" class="image-item">
              <el-image 
                :src="img" 
                :preview-src-list="returnInfo.images"
                fit="cover">
              </el-image>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 退货商品列表 -->
    <div class="info-card">
      <div class="card-header">
        <h3 class="card-title">退货商品</h3>
      </div>
      <div class="card-content">
        <el-table :data="returnDetails" border style="width: 100%">
          <el-table-column label="商品图片" width="120">
            <template #default="scope">
              <el-image 
                v-if="scope.row.product_img"
                style="width: 80px; height: 80px" 
                :src="scope.row.product_img" 
                :preview-src-list="[scope.row.product_img]"
                fit="cover">
                <template #error>
                  <div class="image-placeholder">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </template>
              </el-image>
              <div v-else class="image-placeholder">
                <i class="el-icon-picture-outline"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="product_name" label="商品名称" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="product_spec" label="规格" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column prop="price" label="单价" width="100">
            <template #default="scope">
              <span>¥ {{ scope.row.price || '0.00' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" width="80"></el-table-column>
          <el-table-column prop="subtotal" label="小计" width="120">
            <template #default="scope">
              <span class="price-text">¥ {{ scope.row.subtotal || '0.00' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="reason" label="退货原因" min-width="180" show-overflow-tooltip></el-table-column>
        </el-table>

        <!-- 合计金额 -->
        <div class="total-section" v-if="returnInfo">
          <div class="total-item">
            <span class="total-label">合计：</span>
            <span class="total-value">¥ {{ returnInfo.return_amount || '0.00' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作日志 -->
    <div class="info-card">
      <div class="card-header">
        <h3 class="card-title">服务单日志</h3>
      </div>
      <div class="card-content">
        <el-timeline>
          <el-timeline-item
            v-for="(log, index) in returnLogs"
            :key="index"
            :timestamp="log.operation_time"
            :type="getTimelineItemType(log.operation_type)">
            <div class="timeline-content">
              <div class="timeline-title">
                <span class="operation-type">{{ log.operation_type }}</span>
                <span class="operator">操作人：{{ log.operator || '系统' }}</span>
              </div>
              <div class="timeline-desc">
                {{ log.operation_desc }}
                <div v-if="log.old_status !== null && log.new_status !== null">
                  状态从 <el-tag size="small">{{ log.old_status }}</el-tag> 
                  变更为 <el-tag size="small" :type="log.new_status">{{ log.new_status }}</el-tag>
                </div>
                <div v-if="log.remark" class="log-remark">备注：{{ log.remark }}</div>
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>

    <!-- 操作区域 -->
    <div class="action-section" v-if="returnInfo && returnInfo.status === 0">
      <div class="action-form">
        <el-form :model="handleForm" label-width="100px">
          <el-form-item label="处理结果">
            <el-radio-group v-model="handleForm.result">
              <el-radio :label="1">同意申请</el-radio>
              <el-radio :label="2">拒绝申请</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="处理备注">
            <el-input 
              type="textarea" 
              v-model="handleForm.remark" 
              rows="3" 
              placeholder="请输入处理备注说明"></el-input>
          </el-form-item>
          <el-form-item v-if="handleForm.result === 2" label="拒绝原因">
            <el-input 
              type="textarea" 
              v-model="handleForm.refuseReason" 
              rows="3" 
              placeholder="请输入拒绝原因，将会展示给用户"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitHandle" :loading="submitting">提交处理</el-button>
            <el-button @click="goBack">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import http from '@/utils/http';

export default {
  name: 'OrderReturnDetail',
  data() {
    return {
      loading: false,
      submitting: false,
      returnId: null,
      returnInfo: null,
      returnDetails: [],
      returnLogs: [],
      handleForm: {
        result: 1,
        remark: '',
        refuseReason: ''
      }
    };
  },
  created() {
    // 从路由参数获取退货ID
    this.returnId = this.$route.params.order_no || this.$route.query.order_no;
    if (this.returnId) {
      this.fetchReturnDetail();
    } else {
      this.$message.error('缺少退货申请ID');
      this.goBack();
    }
  },
  methods: {
    // 获取退货详情数据
    fetchReturnDetail() {
      this.loading = true;
      http.get(`/api/v1/mini_core/shop-order-return_detail/`,{order_no: this.returnId})
        .then(response => {
          if (response.data && response.data.data) {
            const { return_info, return_details, return_logs } = response.data.data;
            this.returnInfo = return_info || {};
            this.returnDetails = return_details || [];
            this.returnLogs = return_logs || [];
            
            // 处理images字段，确保是数组
            if (this.returnInfo.images && typeof this.returnInfo.images === 'string') {
              try {
                this.returnInfo.images = JSON.parse(this.returnInfo.images);
              } catch (e) {
                this.returnInfo.images = this.returnInfo.images.split(',');
              }
            } else if (!this.returnInfo.images) {
              this.returnInfo.images = [];
            }
          } else {
            this.$message.error('获取退货详情失败：数据格式不正确');
          }
        })
        .catch(error => {
          console.error('获取退货详情失败:', error);
          this.$message.error('获取退货详情失败');
        })
        .finally(() => {
          this.loading = false;
        });
    },

    // 提交处理结果
    submitHandle() {
      if (!this.returnId) return;

      if (this.handleForm.result === 2 && !this.handleForm.refuseReason) {
        this.$message.warning('请填写拒绝原因');
        return;
      }

      this.submitting = true;
      
      const data = {
 
        status: this.handleForm.result,
        admin_remark: this.handleForm.remark,
        refuse_reason: this.handleForm.result === 2 ? this.handleForm.refuseReason : null
      };
      
      http.put(`/api/v1/mini_core/shop-order-return/${this.returnId}/audit`, data)
        .then(() => {
          this.$message.success('处理成功');
          // 重新获取数据，显示最新状态
          this.fetchReturnDetail();
        })
        .catch(error => {
          console.error('处理失败:', error);
          this.$message.error('处理失败，请重试');
        })
        .finally(() => {
          this.submitting = false;
        });
    },

    // 返回列表
    goBack() {
      this.$router.push('/order/return');
    },

    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        0: '待审核',
        1: '已同意',
        2: '已拒绝',
        3: '退款中',
        4: '已完成'
      };
      return statusMap[status] || '未知状态';
    },

    // 获取状态标签类型
    getStatusTagType(status) {
      const typeMap = {
        0: 'info',
        1: 'success',
        2: 'danger',
        3: 'warning',
        4: 'success'
      };
      return typeMap[status] || 'info';
    },

    // 获取退款方式文本
    getRefundWayText(way) {
      const wayMap = {
        1: '原路退回',
        2: '退到余额',
        3: '人工处理'
      };
      return wayMap[way] || '未知方式';
    },

    // 获取操作类型文本
    getOperationTypeText(type) {
      const typeMap = {
        1: '创建申请',
        2: '审核通过',
        3: '审核拒绝',
        4: '退款处理',
        5: '完成退款',
        6: '取消申请'
      };
      return typeMap[type] || '系统操作';
    },

    // 获取时间线图标类型
    getTimelineItemType(type) {
      const typeMap = {
        1: 'primary',  // 创建申请
        2: 'success',  // 审核通过
        3: 'danger',   // 审核拒绝
        4: 'warning',  // 退款处理
        5: 'success',  // 完成退款
        6: 'info'      // 取消申请
      };
      return typeMap[type] || 'info';
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

.info-card {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  overflow: hidden;
}

.card-header {
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
}

.card-title {
  font-size: 16px;
  color: #303133;
  margin: 0;
}

.card-content {
  padding: 20px;
}

.price-text {
  color: #f56c6c;
  font-weight: bold;
}

.refuse-reason {
  color: #f56c6c;
}

.evidence-section {
  margin-top: 20px;
}

.section-title {
  font-size: 14px;
  margin-bottom: 15px;
  color: #606266;
}

.evidence-images {
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
  background-color: #f5f7fa;
}

.total-section {
  display: flex;
  justify-content: flex-end;
  padding: 15px 0 0;
}

.total-item {
  display: flex;
  align-items: center;
}

.total-label {
  font-size: 14px;
  color: #606266;
}

.total-value {
  font-size: 16px;
  color: #f56c6c;
  font-weight: bold;
  margin-left: 8px;
}

.timeline-content {
  padding: 0 8px;
}

.timeline-title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.operation-type {
  font-weight: bold;
  color: #303133;
}

.operator {
  color: #909399;
  font-size: 12px;
}

.timeline-desc {
  color: #606266;
  line-height: 1.5;
}

.log-remark {
  margin-top: 5px;
  color: #909399;
  font-size: 12px;
}

.action-section {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.action-form {
  max-width: 600px;
  margin: 0 auto;
}

.image-placeholder {
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  color: #909399;
  font-size: 24px;
}

:deep(.el-descriptions) {
  margin-bottom: 20px;
}

:deep(.el-descriptions__label) {
  font-weight: bold;
}

:deep(.el-timeline-item__content) {
  color: #303133;
}

:deep(.el-timeline-item__timestamp) {
  color: #909399;
}

:deep(.el-form-item__label) {
  font-weight: bold;
}
</style>