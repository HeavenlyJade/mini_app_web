<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">分销配置</h2>
    </div>

    <div class="page-content">
      <el-form 
        ref="configForm"
        :model="configData"
        :rules="rules"
        label-width="140px"
        class="config-form"
        v-loading="loading"
      >
        <!-- 基础设置区域 -->
        <div class="section-card">
          <div class="section-title">基础设置</div>
          
          <el-form-item label="分销功能" prop="distribution_enabled">
            <el-radio-group v-model="configData.distribution_enabled">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="0">关闭</el-radio>
            </el-radio-group>
            <div class="form-tip">关闭分销功能后，不会展示分销相关内容，商品无法进行分销</div>
          </el-form-item>
          
          <el-form-item label="分销层级" prop="distribution_level">
            <el-radio-group v-model="configData.distribution_level">
              <el-radio :label="1">一级分销</el-radio>
              <el-radio :label="2">二级分销</el-radio>
            </el-radio-group>
            <div class="form-tip">为商家提供的分销层级设置，等级越多分享收益范围越广</div>
          </el-form-item>
          
          <el-form-item label="分销自购返佣" prop="self_purchase_enabled">
            <el-radio-group v-model="configData.self_purchase_enabled">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="0">关闭</el-radio>
            </el-radio-group>
            <div class="form-tip">开启后，分销商可通过自己购买商品获得佣金</div>
          </el-form-item>
          
          <el-form-item label="商品详情显示分销" prop="product_detail_display">
            <el-radio-group v-model="configData.product_detail_display">
              <el-radio :label="1">显示</el-radio>
              <el-radio :label="0">隐藏</el-radio>
            </el-radio-group>
            <div class="form-tip">商品在商品详情页展示分销收益或佣金信息</div>
          </el-form-item>
        </div>
        
        <!-- 分销商设置区域 -->
        <div class="section-card">
          <div class="section-title">分销商设置</div>
          
          <el-form-item label="详情页面访问用户" prop="detail_page_access">
            <el-radio-group v-model="configData.detail_page_access">
              <el-radio :label="1">全部用户</el-radio>
              <el-radio :label="2">分销商</el-radio>
            </el-radio-group>
            <div class="form-tip">选择全部用户，则所有人在商品详情页可以看到收益提示</div>
          </el-form-item>
          
          <el-form-item label="结算时机" prop="settlement_time">
            <el-input-number 
              v-model="configData.settlement_time" 
              :min="1"
              :max="30"
              :precision="0"
              :step="1"
              class="input-with-unit"
            />
            <span class="unit">天</span>
            <div class="form-tip">预估收益变成待结算的天数，通常在确定收货后变更</div>
          </el-form-item>
        </div>
        
        <!-- 申请设置区域 -->
        <div class="section-card">
          <div class="section-title">申请设置</div>
          
          <el-form-item label="成为分销商条件" prop="become_distributor_condition">
            <el-checkbox-group v-model="configData.become_distributor_condition">
              <el-checkbox label="register">注册会员</el-checkbox>
              <el-checkbox label="purchase">购买商品</el-checkbox>
              <el-checkbox label="invite">邀请好友</el-checkbox>
              <el-checkbox label="apply">申请审核</el-checkbox>
            </el-checkbox-group>
            <div class="form-tip">设置成为分销商的条件，可多选</div>
          </el-form-item>
          
          <el-form-item label="购买商品成为分销商" prop="purchase_requirement" v-if="configData.become_distributor_condition.includes('purchase')">
            <el-input-number 
              v-model="configData.purchase_requirement.order_count" 
              :min="1"
              :precision="0"
              :step="1"
              placeholder="订单数量"
              class="input-with-unit"
              style="width: 150px; margin-right: 20px;"
            />
            <span>订单</span>
            
            <el-input-number 
              v-model="configData.purchase_requirement.amount" 
              :min="0"
              :precision="2"
              :step="10"
              placeholder="消费金额"
              class="input-with-unit"
              style="width: 150px; margin-left: 20px;"
            />
            <span class="unit">元</span>
            <div class="form-tip">设置用户购买商品后可成为分销商的条件</div>
          </el-form-item>
          
          <el-form-item label="邀请好友成为分销商" prop="invite_requirement" v-if="configData.become_distributor_condition.includes('invite')">
            <el-input-number 
              v-model="configData.invite_requirement.invite_count" 
              :min="1"
              :precision="0"
              :step="1"
              placeholder="邀请人数"
              class="input-with-unit"
            />
            <span class="unit">人</span>
            <div class="form-tip">邀请指定数量的好友注册成为会员后，可成为分销商</div>
          </el-form-item>
        </div>
        
        <!-- 协议设置区域 -->
        <div class="section-card">
          <div class="section-title">协议设置</div>
          
          <el-form-item label="分销协议" prop="agreement_enabled">
            <el-radio-group v-model="configData.agreement_enabled">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="0">关闭</el-radio>
            </el-radio-group>
            <div class="form-tip">开启后，申请分销时需要同意分销协议</div>
          </el-form-item>
          
          <el-form-item label="协议内容" prop="agreement_content" v-if="configData.agreement_enabled === 1">
            <el-input 
              v-model="configData.agreement_content" 
              type="textarea"
              :rows="5"
              placeholder="请输入分销协议内容"
            />
          </el-form-item>
        </div>
        
        <!-- 提交按钮 -->
        <div class="form-actions">
          <el-button type="primary" @click="submitForm" :loading="submitLoading">保存配置</el-button>
          <el-button @click="resetForm">重置</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import http from '@/utils/http'

export default {
  name: 'DistributionConfig',
  data() {
    return {
      loading: false,
      submitLoading: false,
      configData: {
        distribution_enabled: 1,
        distribution_level: 2,
        self_purchase_enabled: 1,
        product_detail_display: 1,
        detail_page_access: 1,
        settlement_time: 7,
        become_distributor_condition: ['register'],
        purchase_requirement: {
          order_count: 1,
          amount: 0
        },
        invite_requirement: {
          invite_count: 1
        },
        agreement_enabled: 1,
        agreement_content: ''
      },
      rules: {
        distribution_enabled: [
          { required: true, message: '请选择是否开启分销功能', trigger: 'change' }
        ],
        distribution_level: [
          { required: true, message: '请选择分销层级', trigger: 'change' }
        ],
        self_purchase_enabled: [
          { required: true, message: '请选择是否开启自购返佣', trigger: 'change' }
        ],
        product_detail_display: [
          { required: true, message: '请选择是否在商品详情显示分销', trigger: 'change' }
        ],
        detail_page_access: [
          { required: true, message: '请选择详情页面访问用户', trigger: 'change' }
        ],
        settlement_time: [
          { required: true, message: '请设置结算时机', trigger: 'blur' },
          { type: 'number', min: 1, message: '结算时机必须大于0', trigger: 'blur' }
        ],
        become_distributor_condition: [
          { required: true, message: '请选择成为分销商条件', trigger: 'change' },
          { type: 'array', min: 1, message: '至少选择一个条件', trigger: 'change' }
        ],
        agreement_content: [
          { required: true, message: '请输入协议内容', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchConfig()
  },
  methods: {
    // 获取分销配置
    async fetchConfig() {
      this.loading = true
      try {
        const response = await http.get('/api/v1/mini_core/distribution/config')
        if (response.data && response.data.code === 200) {
          // 合并配置数据，保留默认值
          this.configData = { ...this.configData, ...response.data.data }
          
          // 处理可能的数据类型不一致问题
          if (typeof this.configData.become_distributor_condition === 'string') {
            this.configData.become_distributor_condition = JSON.parse(this.configData.become_distributor_condition)
          }
        }
      } catch (error) {
        console.error('获取分销配置失败:', error)
        ElMessage.error('获取配置失败')
      } finally {
        this.loading = false
      }
    },
    
    // 提交表单
    async submitForm() {
      try {
        await this.$refs.configForm.validate()
      } catch (error) {
        return false
      }
      
      this.submitLoading = true
      try {
        // 准备提交的数据
        const formData = JSON.parse(JSON.stringify(this.configData))
        
        // 如果不需要购买条件，则清空购买条件数据
        if (!formData.become_distributor_condition.includes('purchase')) {
          formData.purchase_requirement = {
            order_count: 0,
            amount: 0
          }
        }
        
        // 如果不需要邀请条件，则清空邀请条件数据
        if (!formData.become_distributor_condition.includes('invite')) {
          formData.invite_requirement = {
            invite_count: 0
          }
        }
        
        // 如果协议关闭，清空协议内容
        if (formData.agreement_enabled === 0) {
          formData.agreement_content = ''
        }
        
        const response = await http.post('/api/v1/mini_core/distribution/config', formData)
        
        if (response.data && response.data.code === 200) {
          ElMessage.success('保存配置成功')
        } else {
          ElMessage.error(response.data?.message || '保存配置失败')
        }
      } catch (error) {
        console.error('保存配置失败:', error)
        ElMessage.error('保存配置失败')
      } finally {
        this.submitLoading = false
      }
    },
    
    // 重置表单
    resetForm() {
      this.$refs.configForm.resetFields()
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
}

.page-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.page-content {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
}

.config-form {
  max-width: 900px;
}

.section-card {
  margin-bottom: 30px;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.form-actions {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.input-with-unit {
  width: 150px;
}

.unit {
  margin-left: 8px;
  color: #606266;
}

@media (max-width: 768px) {
  .page-content {
    padding: 10px;
  }
  
  .section-card {
    padding: 15px;
  }
  
  :deep(.el-form-item__label) {
    float: none;
    display: block;
    text-align: left;
    padding: 0 0 10px;
  }
  
  :deep(.el-form-item__content) {
    margin-left: 0 !important;
  }
  
  .input-with-unit {
    width: 120px;
  }
}
</style>