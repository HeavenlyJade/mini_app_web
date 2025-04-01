<template>
  <div class="page-container">
    <div v-if="orderDetail && Object.keys(orderDetail).length > 0" class="page-content">
      <!-- 基本信息区域 -->
      <div class="detail-section">
        <div class="section-header">
          <i class="el-icon-document"></i> 基本信息
        </div>
        <div class="info-table">
          <table>
            <tr>
              <td class="label">订单编号</td>
              <td class="value">{{ orderDetail.order_no }}</td>
              <td class="label">发货单流水号</td>
              <td class="value">{{ orderDetail.express_no || '暂无' }}</td>
              <td class="label">用户账号</td>
              <td class="value">{{ orderDetail.nickname }}</td>
            </tr>
            <tr>
              <td class="label">支付方式</td>
              <td class="value">{{ orderDetail.pay_method }}</td>
              <td class="label">订单来源</td>
              <td class="value">{{ orderDetail.order_source }}</td>
              <td class="label">订单类型</td>
              <td class="value">{{ orderDetail.order_type }}</td>
            </tr>
            <tr>
              <td class="label">配送方式</td>
              <td class="value">{{ orderDetail.delivery_platform }}</td>
              <td class="label">物流单号</td>
              <td class="value">{{ orderDetail.express_no }}</td>
              <td class="label">自动确认收货时间</td>
              <td class="value">{{ orderDetail.confirm_time ? formatDateTime(orderDetail.confirm_time) : '15天' }}</td>
            </tr>
            <tr>
              <td class="label">订单可得分布</td>
              <td class="value">{{ orderDetail.point_amount }}</td>
              <td class="label">订单可得成长值</td>
              <td class="value">{{ orderDetail.point_amount }}</td>
              <td class="label">备注</td>
              <td class="value">{{ orderDetail.remark }}</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- 收货人信息区域 -->
      <div class="detail-section">
        <div class="section-header">
          <i class="el-icon-location"></i> 收货人信息
        </div>
        <div class="info-table">
          <table>
            <tr>
              <td class="label">收货人</td>
              <td class="value">{{ orderDetail.receiver_name }}</td>
              <td class="label">手机号码</td>
              <td class="value">{{ orderDetail.receiver_phone }}</td>
              <td class="label">邮政编码</td>
              <td class="value">{{ orderDetail.postal_code }}</td>
              <td class="label">收货地址</td>
              <td class="value">{{ getFullAddress() }}</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- 商品信息区域 -->
      <div class="detail-section">
        <div class="section-header">
          <i class="el-icon-goods"></i> 商品信息
        </div>
        <div class="product-table">
          <el-table :data="productList" border style="width: 100%">
            <el-table-column label="商品图片" width="100">
              <template #default="scope">
                <div class="product-image">
                  <img :src="scope.row.product_img" alt="商品图片">
                </div>
              </template>
            </el-table-column>
            <el-table-column label="商品名称" min-width="200">
              <template #default="scope">
                <div>{{ scope.row.product_name }}</div>
                <div class="brand-info">货号：{{ scope.row.sku_code }}</div>
              </template>
            </el-table-column>
            <el-table-column label="价格/货号" width="150">
              <template #default="scope">
                <div class="price-info">价格：￥{{ scope.row.unit_price }}</div>
                <div class="sku-info">实付：￥{{ scope.row.actual_price }}</div>
              </template>
            </el-table-column>
            <el-table-column label="属性" width="150">
              <template #default="scope">
                <div>{{ scope.row.product_spec }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" width="80" />
            <el-table-column label="小计" width="120">
              <template #default="scope">
                <div class="total-price">￥{{ scope.row.total_price }}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 费用信息区域 -->
        <div class="fee-info">
          <div class="section-header">
            <i class="el-icon-money"></i> 费用信息
          </div>
          <div class="fee-table">
            <table>
              <tr>
                <td class="label">商品合计</td>
                <td class="value price">￥{{ orderDetail.product_amount }}</td>
                <td class="label">运费</td>
                <td class="value price">￥{{ orderDetail.freight_amount }}</td>
                <td class="label">优惠券</td>
                <td class="value price">-￥{{ orderDetail.discount_amount || 0 }}</td>
                <td class="label">积分抵扣</td>
                <td class="value price">-￥{{ 0 }}</td>
              </tr>
              <tr>
                <td class="label">活动优惠</td>
                <td class="value price">-￥{{ calculateDiscount() }}</td>
                <td class="label">折扣金额</td>
                <td class="value price">-￥{{ orderDetail.discount_amount || 0 }}</td>
                <td class="label">订单总金额</td>
                <td class="value price highlight">￥{{ orderDetail.product_amount }}</td>
                <td class="label">应付款金额</td>
                <td class="value price highlight">￥{{ orderDetail.actual_amount }}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>

      <!-- 操作信息区域 -->
      <div class="detail-section">
        <div class="section-header">
          <i class="el-icon-setting"></i> 操作信息
        </div>
        <div class="operation-table">
          <el-table :data="operationLogs" border style="width: 100%">
            <el-table-column prop="operator" label="操作者" width="150" />
            <el-table-column prop="operateTime" label="操作时间" width="180" />
            <el-table-column prop="orderStatus" label="订单状态" width="120" />
            <el-table-column prop="msg" label="订单信息" width="120" />
            <el-table-column prop="remark" label="备注" min-width="200" />
          </el-table>
        </div>
      </div>

      <!-- 底部操作按钮 -->
      <div class="action-buttons" v-if="Object.keys(orderDetail).length > 0 || !loading">
        <el-button @click="goBack">返回列表</el-button>
        <el-button type="primary" @click="printOrder">打印订单</el-button>
        <el-button v-if="canShip()" type="warning" @click="shipOrder">订单发货</el-button>
        <el-button v-if="canClose()" type="danger" @click="closeOrder">关闭订单</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import http from '@/utils/http'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'OrderDetail',
  data() {
    return {
      loading: false,
      orderId: null,
      orderDetail: {},
      productList: [],
      operationLogs: []
    }
  },
  created() {
    // 从路由参数获取订单ID
    this.orderId = this.$route.params.order_id || this.$route.query.order_id
    if (this.orderId) {
      this.fetchOrderDetail()
    } else {
      ElMessage.error('订单ID不能为空')
      this.goBack()
    }
  },
  methods: {
    // 获取订单详情
    async fetchOrderDetail() {
      this.loading = true
      try {
        const response = await http.get(`/api/v1/mini_core/orders/${this.orderId}/details`)
        if (response.data && response.data.code === 200) {
          this.orderDetail = response.data.order_info

          // 设置商品列表
          this.productList = response.data.order_details || []

          // 设置操作日志
          this.operationLogs = this.formatOperationLogs(response.data.order_logs)

        } else {
          ElMessage.error('获取订单详情失败')
        }
      } catch (error) {
        console.error('获取订单详情出错:', error)
        ElMessage.error('获取订单详情失败，请重试')
      } finally {
        this.loading = false
      }
    },

    // 获取操作日志
    async fetchOperationLogs() {
      try {
        const response = await http.get(`/api/v1/mini_core/shop-order/${this.orderId}/logs`)
        if (response.data && response.data.code === 200) {
          this.operationLogs = response.data.data || []
        }
      } catch (error) {
        console.error('获取操作日志出错:', error)
        // 生成默认日志
      }
    },
    formatOperationLogs(logs) {
      if (!logs || !logs.length) return []
      return logs.map(log => {
        let msgParts = [];
        if (log.new_value && typeof log.new_value === 'object') {
          // 遍历new_value对象的所有键值对
          for (const [key, value] of Object.entries(log.new_value)) {
            msgParts.push(`${value}`);
          }
        }
        return {
          operator: log.operator,
          operateTime: log.operation_time,
          orderStatus: log.operation_type,
          msg: msgParts.length > 0 ? msgParts.join(', ') : null,
          remark: log.remark || log.operation_desc
        }
      })
    },


    // 格式化日期时间
    formatDateTime(dateStr) {
      if (!dateStr) return '-'
      const date = new Date(dateStr)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    },

    // 获取完整地址
    getFullAddress() {
      let address = ''
      if (this.orderDetail.province) address += this.orderDetail.province
      if (this.orderDetail.city) address += ' ' + this.orderDetail.city
      if (this.orderDetail.district) address += ' ' + this.orderDetail.district
      if (this.orderDetail.address) address += ' ' + this.orderDetail.address
      return address || '暂无地址信息'
    },

    // 计算折扣金额
    calculateDiscount() {
      return ((this.orderDetail.product_amount || 0) - (this.orderDetail.actual_amount || 0) - (this.orderDetail.discount_amount || 0)).toFixed(2)
    },

    // 返回列表
    goBack() {
      this.$router.push('/orer/list')
    },

    // 打印订单
    printOrder() {
      window.print()
    },

    // 订单发货
    shipOrder() {
      ElMessageBox.prompt('请输入物流单号', '订单发货', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S+/,
        inputErrorMessage: '物流单号不能为空'
      }).then(({ value }) => {
        this.loading = true
        http.put(`/api/v1/mini_core/shop-order/${this.orderId}/ship`, {
          express_no: value,
          express_company: '顺丰速运' // 可以添加物流公司选择
        }).then(response => {
          if (response.data && response.data.code === 200) {
            ElMessage.success('发货成功')
            this.fetchOrderDetail() // 重新加载订单详情
          } else {
            ElMessage.error('发货失败')
          }
        }).catch(error => {
          console.error('发货出错:', error)
          ElMessage.error('发货失败，请重试')
        }).finally(() => {
          this.loading = false
        })
      }).catch(() => {
        // 取消发货
      })
    },

    // 关闭订单
    closeOrder() {
      ElMessageBox.confirm('确认关闭此订单吗？', '关闭订单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        http.put(`/api/v1/mini_core/shop-order/${this.orderId}/close`).then(response => {
          if (response.data && response.data.code === 200) {
            ElMessage.success('订单已关闭')
            this.fetchOrderDetail() // 重新加载订单详情
          } else {
            ElMessage.error('关闭订单失败')
          }
        }).catch(error => {
          console.error('关闭订单出错:', error)
          ElMessage.error('关闭订单失败，请重试')
        }).finally(() => {
          this.loading = false
        })
      }).catch(() => {
        // 取消关闭
      })
    },

    // 判断是否可以发货
    canShip() {
      return this.orderDetail.status === '已付款' &&
        this.orderDetail.delivery_status !== '已发货' &&
        this.orderDetail.delivery_status !== '已签收'
    },

    // 判断是否可以关闭订单
    canClose() {
      return this.orderDetail.status !== '已关闭' &&
        this.orderDetail.status !== '已完成'
    }
  }
}
</script>

<style scoped>
.page-container {
  padding: 20px;
  background-color: #f5f7fa;
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

.page-content {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

/* 详情区域样式 */
.detail-section {
  margin-bottom: 24px;
}

.section-header {
  padding: 10px 0;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  display: flex;
  align-items: center;
}

.section-header i {
  margin-right: 8px;
  color: #409EFF;
}

/* 表格样式 */
.info-table,
.fee-table,
.operation-table {
  width: 100%;
  border-collapse: collapse;
}

.info-table table,
.fee-table table {
  width: 100%;
  border-collapse: collapse;
}

.info-table td,
.fee-table td {
  padding: 12px 8px;
  border-bottom: 1px solid #ebeef5;
}

.label {
  width: 120px;
  color: #606266;
  font-weight: normal;
  text-align: right;
  padding-right: 10px;
  background-color: #f8f8f9;
}

.value {
  color: #303133;
}

.price {
  color: #f56c6c;
  font-weight: bold;
}

.highlight {
  font-size: 16px;
  color: #f56c6c;
}

/* 商品图片样式 */
.product-image {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

/* 商品信息样式 */
.brand-info,
.sku-info {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.price-info {
  color: #f56c6c;
}

.total-price {
  color: #f56c6c;
  font-weight: bold;
}

/* 操作按钮样式 */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px dashed #ebeef5;
}

/* 打印样式 - 隐藏不必要的元素 */
@media print {
  .action-buttons {
    display: none;
  }

  .page-container {
    padding: 0;
    background-color: #fff;
  }

  .page-content {
    box-shadow: none;
    padding: 0;
  }
}

.loading-container {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}
</style>