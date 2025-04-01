<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">订单设置</h2>
    </div>

    <div class="page-content">
      <el-form 
        ref="settingForm"
        :model="settings"
        :rules="rules"
        label-width="140px"
        class="setting-form"
      >
        <!-- 订单自动关闭时间 -->
        <el-form-item label="订单自动关闭时间:" prop="auto_close_minutes">
          <el-input-number 
            v-model="settings.auto_close_minutes" 
            :min="1" 
            :max="1440"
            class="input-with-unit"
          />
          <span class="unit">分钟</span>
          <div class="setting-tip">已关闭(下单N分钟后未支付自动关闭订单)</div>
        </el-form-item>

        <!-- 订单自动收货时间 -->
        <el-form-item label="订单自动收货时间:" prop="auto_receive_days">
          <el-input-number 
            v-model="settings.auto_receive_days" 
            :min="1" 
            :max="30"
            class="input-with-unit"
          />
          <span class="unit">天</span>
          <div class="setting-tip">已收货(发货后超过N天用户未确认收货自动确认收货)</div>
        </el-form-item>

        <!-- 物流超时未更新时间 -->
        <el-form-item label="物流超时未更新时间:" prop="logistics_timeout_hours">
          <el-input-number 
            v-model="settings.logistics_timeout_hours" 
            :min="1" 
            :max="72"
            class="input-with-unit"
          />
          <span class="unit">小时</span>
          <div class="setting-tip">物流轨迹超过未更新提醒(0代表不提醒)</div>
        </el-form-item>

        <!-- 积分比例 -->
        <el-form-item label="积分比例:" prop="points_rate">
          <el-input-number 
            v-model="settings.points_rate" 
            :min="0"
            :max="1000"
            :precision="2"
            :step="0.1"
            class="input-with-unit"
          />
          <span class="unit">积分</span>
          <div class="setting-tip">积分抵扣(返回1元需要多少积分)</div>
        </el-form-item>

        <!-- 开票联系电话 -->
        <!-- <el-form-item label="开票联系电话:" prop="invoice_contact_phone">
          <el-input 
            v-model="settings.invoice_contact_phone" 
            maxlength="32"
            show-word-limit
            class="input-with-unit"
            placeholder="请输入开票联系电话"
          />
          <div class="setting-tip">开票联系电话</div>
        </el-form-item> -->

        <!-- 提交按钮 -->
        <el-form-item>
          <el-button type="primary" @click="submitSettings" :loading="loading">
            提交
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import http from '@/utils/http'

export default {
  name: 'OrderSetting',
  data() {
    return {
      loading: false,
      settings: {
        auto_close_minutes: null,      // 订单自动关闭时间（分钟）
        auto_receive_days: null,       // 订单自动收货时间（天）
        logistics_timeout_hours: null,  // 物流超时未更新时间（小时）
        points_rate: null,             // 积分比例
        invoice_contact_phone: null,    // 开票联系电话
        shop_id: null,                 // 店铺ID
      },
      rules: {
        auto_close_minutes: [
          { required: true, message: '请输入订单自动关闭时间', trigger: 'blur' },
          { type: 'number', min: 1, max: 1440, message: '时间必须在1-1440分钟之间', trigger: 'blur' }
        ],
        auto_receive_days: [
          { required: true, message: '请输入订单自动收货时间', trigger: 'blur' },
          { type: 'number', min: 1, max: 30, message: '时间必须在1-30天之间', trigger: 'blur' }
        ],
        logistics_timeout_hours: [
          { required: true, message: '请输入物流超时未更新时间', trigger: 'blur' },
          { type: 'number', min: 0, max: 72, message: '时间必须在0-72小时之间', trigger: 'blur' }
        ],
        points_rate: [
          { required: true, message: '请输入积分比例', trigger: 'blur' },
          { type: 'number', min: 0, message: '积分比例不能小于0', trigger: 'blur' }
        ],
        invoice_contact_phone: [
          { pattern: /^[0-9-]{0,32}$/, message: '请输入正确的联系电话', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchSettings()
  },
  methods: {
    // 获取订单设置
    async fetchSettings() {
      try {
        const response = await http.get('/api/v1/mini_core/shop-order-setting')
        if (response.data && response.data.code === 200) {
          const { data } = response.data
          this.settings = {
            auto_close_minutes: data.auto_close_minutes,
            auto_receive_days: data.auto_receive_days,
            logistics_timeout_hours: data.logistics_timeout_hours,
            points_rate: data.points_rate,
            invoice_contact_phone: data.invoice_contact_phone,
            shop_id: data.shop_id,
            id: data.id,
          }
        }
      } catch (error) {
        console.error('获取订单设置失败:', error)
        ElMessage.error('获取订单设置失败')
      }
    },

    // 提交设置
    async submitSettings() {
      try {
        await this.$refs.settingForm.validate()
      } catch (error) {
        return false
      }

      this.loading = true
      try {
        // 确保有 setting_id
        if (!this.settings.id) {
          ElMessage.error('缺少设置ID')
          return
        }

        // 构造请求数据
        const requestData = {
          shop_id: this.settings.shop_id,
          auto_close_minutes: this.settings.auto_close_minutes,
          auto_receive_days: this.settings.auto_receive_days,
          logistics_timeout_hours: this.settings.logistics_timeout_hours,
          points_rate: this.settings.points_rate,
          invoice_contact_phone: this.settings.invoice_contact_phone
        }

        // 发送PUT请求
        const response = await http.put(
          `/api/v1/mini_core/shop-order-setting/${this.settings.id}`, 
          requestData
        )

        if (response.data && response.data.code === 200) {
          ElMessage.success('设置保存成功')
          // 重新获取最新设置
          await this.fetchSettings()
        } else {
          ElMessage.error(response.data?.msg || '设置保存失败')
        }
      } catch (error) {
        console.error('保存设置失败:', error)
        ElMessage.error('设置保存失败')
      } finally {
        this.loading = false
      }
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
  margin-bottom: 30px;
}

.page-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.setting-form {
  max-width: 600px;
  margin: 0 auto;

  .input-with-unit {
    width: 200px;
    margin-right: 10px;
  }

  .unit {
    color: #606266;
    margin-right: 10px;
  }

  .setting-tip {
    color: #909399;
    font-size: 12px;
    margin-top: 4px;
  }

  :deep(.el-form-item) {
    margin-bottom: 30px;
  }

  :deep(.el-input-number) {
    width: 200px;
  }
}
</style> 