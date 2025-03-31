<template>
  <div class="page-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <h2 class="page-title">添加商品</h2>
    </div>

    <!-- 页面内容区域 -->
    <div class="page-content">
      <form @submit.prevent="submitForm" class="product-form">
        <div class="form-section">
          <div class="form-row">
            <div class="form-item">
              <label>所属门店</label>
              <div class="select-wrapper">
                <select v-model="formData.store_id">
                  <option value="">请选择门店</option>
                  <option v-for="store in storeOptions" :key="store.id" :value="store.id">
                    {{ store.name }}
                  </option>
                </select>
                <i class="arrow-down"></i>
              </div>
              <div class="input-tip">没有多店铺的不需要选择</div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label><span class="required">*</span> 商品分类</label>
              <div class="select-wrapper">
                <select v-model="formData.category_id" required>
                  <option value="">请选择商品分类</option>
                  <option v-for="category in categoryOptions" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
                <i class="arrow-down"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- 商品基础信息 -->
        <div class="form-section">
          <div class="form-row">
            <div class="form-item">
              <label>商品条码</label>
              <div class="input-with-tip">
                <input type="text" v-model="formData.barcode" placeholder="商品条码">
                <div class="input-tip">建议配合扫码枪使用</div>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label><span class="required">*</span> 商品名称</label>
              <input type="text" v-model="formData.name" required placeholder="商品名称">
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label>别名</label>
              <input type="text" v-model="formData.alias" placeholder="商品别名">
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label>类型</label>
              <div class="radio-group">
                <label class="radio-item">
                  <input type="radio" v-model="formData.type" value="physical" checked>
                  <span class="radio-circle"></span>
                  <span class="radio-text">实物商品</span>
                </label>
                <label class="radio-item">
                  <input type="radio" v-model="formData.type" value="virtual">
                  <span class="radio-circle"></span>
                  <span class="radio-text">虚拟商品</span>
                </label>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label><span class="required">*</span> 海外直邮</label>
              <div class="radio-group">
                <label class="radio-item">
                  <input type="radio" v-model="formData.overseas" value="yes">
                  <span class="radio-circle"></span>
                  <span class="radio-text">支持</span>
                </label>
                <label class="radio-item">
                  <input type="radio" v-model="formData.overseas" value="no" checked>
                  <span class="radio-circle"></span>
                  <span class="radio-text">不支持</span>
                </label>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label>标签(关键词)</label>
              <div class="input-with-tip">
                <input type="text" v-model="formData.tags" placeholder="标签/关键词">
                <div class="input-tip">多个标签用逗号隔开</div>
              </div>
            </div>
          </div>

          <!--          <div class="form-row">-->
          <!--            <div class="form-item">-->
          <!--              <label>扩展属性</label>-->
          <!--              <div class="attributes-container">-->
          <!--                <input type="text" class="attribute-input" placeholder="扩展属性名">-->
          <!--                <span class="attribute-separator">:</span>-->
          <!--                <input type="text" class="attribute-input" placeholder="扩展属性值">-->
          <!--                <button type="button" class="add-btn">添加</button>-->
          <!--              </div>-->
          <!--            </div>-->
          <!--          </div>-->

          <div class="form-row">
            <div class="form-item">
              <label>购买须知</label>
              <textarea v-model="formData.purchaseNotes" class="text-area"
                        placeholder="购买须知，最多500个字"></textarea>
              <div class="char-count">最多500个</div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label>商品特色</label>
              <textarea v-model="formData.features" class="text-area" placeholder="商品特色，最多500个字"></textarea>
              <div class="char-count">最多500个</div>
            </div>
          </div>
        </div>

        <!-- 物流和模板 -->
        <div class="form-section">
          <div class="form-row">
            <div class="form-item">
              <label>选择物流模板</label>
              <div class="select-wrapper">
                <select v-model="formData.logisticsTemplate">
                  <option value="">包邮</option>
                  <option value="template1">按件收费</option>
                  <option value="template2">按重量收费</option>
                </select>
                <i class="arrow-down"></i>
              </div>
              <div class="input-tip warning-tip">
                虚拟商品等不需要快递（不需要用户填写地址）的商品请选择不需要物流
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label>扩展物流模板</label>
              <div class="select-wrapper">
                <select v-model="formData.extendedLogisticsTemplate">
                  <option value="">请选择</option>
                  <!-- 更多选项 -->
                </select>
                <i class="arrow-down"></i>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label><span class="required">*</span> 优先券</label>
              <div class="input-with-tip">
                <input type="text" v-model="formData.priorityCoupon" required>
                <div class="input-tip orange-tip">最多可使用1张优惠券</div>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label>排序</label>
              <input type="text" v-model="formData.sort" placeholder="0">
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label>推荐</label>
              <div class="radio-group">
                <label class="radio-item">
                  <input type="radio" v-model="formData.recommended" value="no" checked>
                  <span class="radio-circle"></span>
                  <span class="radio-text">不推荐</span>
                </label>
                <label class="radio-item">
                  <input type="radio" v-model="formData.recommended" value="yes">
                  <span class="radio-circle"></span>
                  <span class="radio-text">推荐</span>
                </label>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label>是否展示</label>
              <div class="radio-group">
                <label class="radio-item">
                  <input type="radio" v-model="formData.display" value="yes" checked>
                  <span class="radio-circle"></span>
                  <span class="radio-text">正常展示</span>
                </label>
                <label class="radio-item">
                  <input type="radio" v-model="formData.display" value="no">
                  <span class="radio-circle"></span>
                  <span class="radio-text">默认隐藏，不在前端展示</span>
                </label>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label>是否售后</label>
              <div class="checkbox-group">
                <label class="checkbox-item">
                  <input type="checkbox" v-model="formData.afterSaleOptions" value="exchange">
                  <span class="checkbox-square"></span>
                  <span class="checkbox-text">仅换货</span>
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" v-model="formData.afterSaleOptions" value="return">
                  <span class="checkbox-square"></span>
                  <span class="checkbox-text">退款/退货</span>
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" v-model="formData.afterSaleOptions" value="repair">
                  <span class="checkbox-square"></span>
                  <span class="checkbox-text">换修</span>
                </label>
                <div class="checkbox-tip">都不勾选代表本商品不支持售后</div>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label><span class="required">*</span> 状态</label>
              <div class="radio-group">
                <label class="radio-item">
                  <input type="radio" v-model="formData.status" value="上架" checked>
                  <span class="radio-circle"></span>
                  <span class="radio-text">上架</span>
                </label>
                <label class="radio-item">
                  <input type="radio" v-model="formData.status" value="下架">
                  <span class="radio-circle"></span>
                  <span class="radio-text">下架</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- 视频和图片信息 -->
        <div class="form-section">
          <div class="form-row">
            <div class="form-item">
              <label>视频地址</label>
              <div class="input-with-tip">
                <input type="text" v-model="formData.videoUrl" placeholder="https://...">
                <div class="input-tip orange-tip">必须是mp4的地址</div>
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-item">
              <label>商品图片</label>
              <file-uploader
                v-model:value="formData.images"
                @change="handleImagesChange"
                :limit="5"
                tip-text="第一张图片默认为封面图片，可拖动排序">
              </file-uploader>
            </div>
          </div>
        </div>

        <!-- 商品详情 -->
        <div class="form-section">
          <div class="form-row">
            <div class="form-item full-width">
              <label>详细介绍</label>
              <div class="editor-container">
                <rich-text-editor
                  v-model:value="formData.description"
                  placeholder="请输入商品详细介绍..."
                  :height="300"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 价格和库存信息 -->
        <div class="form-section">
          <div class="form-row">
            <div class="form-item">
              <label>单位</label>
              <div class="unit-input">
                <input type="text" v-model="formData.unit" placeholder="份">
                <div class="unit-tip">比如: 份/瓶/箱/斤</div>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label><span class="required">*</span> 市场价</label>
              <input
                type="text"
                v-model.number="formData.marketPrice"
                @input="validateNumericInput"
                required
                placeholder="0"
              >
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label><span class="required">*</span> 价格</label>
              <input type="text" v-model="formData.price" required placeholder="0">
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label>税率</label>
              <div class="input-with-tip">
                <input type="text" v-model="formData.taxRate" placeholder="0">
                <div class="input-tip">例如增值税6%</div>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label><span class="required">*</span> 需要积分</label>
              <div class="input-with-tip">
                <input type="text" v-model="formData.requiredPoints" required placeholder="0">
                <div class="input-tip">购买需要扣除用户的积分数量</div>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label><span class="required">*</span> 赠送积分</label>
              <div class="points-input-group">
                <input type="text" v-model="formData.giftPoints" required placeholder="0">
                <div class="select-wrapper small">
                  <select v-model="formData.giftPointsType">
                    <option value="fixed">固定数量积分</option>
                    <option value="percent">百分比积分</option>
                  </select>
                  <i class="arrow-down"></i>
                </div>
                <div class="input-tip">购买后用户可获得的积分数量</div>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label><span class="required">*</span> 最少购买</label>
              <div class="min-buy-input">
                <input type="text" v-model="formData.minPurchase" required placeholder="1">
                <span class="unit-text">份</span>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label><span class="required">*</span> 库存</label>
              <input type="text" v-model="formData.stock" required placeholder="0">
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label>库存预警</label>
              <div class="input-with-tip">
                <input type="text" v-model="formData.stockWarning" placeholder="0">
                <div class="input-tip">库存低于该数量系统会告警</div>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label>库存设置</label>
              <div class="checkbox-group">
                <label class="checkbox-item">
                  <input type="checkbox" v-model="formData.stockSettings" value="autoOrder">
                  <span class="checkbox-text">无库存自动下架</span>
                  <span class="checkbox-square"></span>

                </label>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label>商品重量</label>
              <div class="weight-input">
                <input type="text" v-model="formData.weight" placeholder="0">
                <span class="unit-text">kg</span>
              </div>
            </div>
          </div>

        </div>

        <!-- 规格信息 -->
        <div class="form-section">
          <div class="form-row">
            <div class="form-item full-width">
              <div class="spec-header">
                <label>规格尺寸</label>
                <div class="spec-tip warning-text">如有颜色、尺码等多规格，请在此添加商品规格</div>
              </div>
              <div class="spec-actions">
                <button type="button" class="add-spec-btn">
                  <span class="plus-icon">+</span> 添加商品规格
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="form-footer">
          <button type="button" class="btn btn-cancel">取消</button>
          <button type="submit" class="btn btn-submit">提交</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import RichTextEditor from '@/components/richtext/RichTextEditor.vue'
import FileUploader from '@/components/public/FileUploader.vue'
import { numericInputHandler } from '@/utils/validators'

import http from '@/utils/http'
import { ElMessage } from 'element-plus'

export default {
  name: 'ProductAdd',
  components: {
    RichTextEditor,
    FileUploader
  },
  data () {
    return {
      // 状态
      productId: null,
      isEdit: false,
      loading: false,

      // 表单数据
      formData: {
        // 商店信息
        store_id: '',
        category_id: '',

        // 商品基础信息
        code: '',
        name: '',
        alias: '',
        type: 'physical',
        support_overseas_shipping: false,
        keywords: '',
        purchase_notice: '',
        features: '',

        // 物流和模板
        freight_template_id: '',
        extend_freight_template_id: '',
        discount: '1',
        sort_order: 0,
        is_recommended: false,
        display_mode: 'normal',
        services: [],
        status: 'online',

        // 视频和图片
        video_code: '',
        video_url: '',
        images: [],

        // 商品详情
        detail: '',

        // 价格和库存
        unit: '份',
        market_price: '',
        price: '',
        tax_rate: '',
        points_required: 0,
        points_reward: 0,
        min_purchase_qty: 1,
        stock: '',
        stock_alert: '',
        no_stock_mode: false,
        auto_offline: false,
        weight: '',
        member_card_id: '',

        // 规格信息
        specifications: [],
        attributes: [],
        spec_combinations: []
      },

      // 选项数据
      storeOptions: [],
      categoryOptions: [],
      imageFileList: []
    }
  },
  created () {
    this.productId = this.$route.params.id || this.$route.query.id
    this.isEdit = !!this.productId
  },
  mounted () {
    // 加载基础数据
    Promise.all([
      this.fetchDowns(),
    ]).then(() => {
      // 基础数据加载完成后，如果是编辑模式再加载详情
      if (this.isEdit) {
        this.fetchProductDetail().then(() => {
          // 数据加载完成后再初始化图片
          this.initImageData()
        })
      }
    })
  },
  methods: {
    // 获取门店列表
    validateNumericInput (event) {
      const result = numericInputHandler(event, (errorMsg) => {
        this.$message.error(errorMsg)
      }, {
        allowNegative: false,
        allowDecimal: true,
        decimalDigits: 2
      })
      this.formData.marketPrice = result !== null ? result : ''
    },

    async fetchDowns () {
      this.storeOptions = await http.get_downs('shop_store')
      this.categoryOptions = await http.get_downs('shop_product_category')
    },
    handleImagesChange (urls) {
      // console.log('商品图片已更新:', urls)
    },
    // 获取商品详情
    async fetchProductDetail () {
      this.loading = true
      try {
        const response = await http.get(`/api/v1/mini_core/shop-product/${this.productId}`)

        if (response.data && response.data.data) {
          // 更新表单数据
          const productData = response.data.data

          // 使用解构赋值更新表单数据
          Object.keys(productData).forEach(key => {
            if (productData[key] !== undefined && key in this.formData) {
              this.formData[key] = productData[key]
            }
          })

          // 处理图片数据
          if (productData.images) {
            let images = []
            try {
              if (typeof productData.images === 'string') {
                images = JSON.parse(productData.images)
              } else if (Array.isArray(productData.images)) {
                images = productData.images
              }

              this.imageFileList = images.map((url, index) => ({
                name: `image_${index}`,
                url
              }))
            } catch (e) {
              console.error('解析图片数据失败:', e)
            }
          }

          // 处理其他可能需要解析的JSON字符串字段
          ['specifications', 'attributes', 'services', 'spec_combinations'].forEach(field => {
            if (productData[field] && typeof productData[field] === 'string') {
              try {
                this.formData[field] = JSON.parse(productData[field])
              } catch (e) {
                console.error(`解析${field}数据失败:`, e)
              }
            }
          })
        }
      } catch (error) {
        console.error('获取商品详情失败:', error)
        ElMessage.error('获取商品详情失败')
      } finally {
        this.loading = false
      }
    },
    // 在编辑模式下初始化图片

    initImageData () {
      if (this.isEdit && this.formData.images) {
        let images = this.formData.images
        // 如果是字符串，尝试解析JSON
        if (typeof images === 'string') {
          try {
            images = JSON.parse(images)
          } catch (e) {
            console.error('解析图片数据失败:', e)
            images = []
          }
        }
        // 确保images是数组
        if (!Array.isArray(images)) {
          images = []
        }
        // 设置到表单数据
        this.formData.images = images
      }
    },
    // 提交表单

    async submitForm () {
      // 表单验证
      if (!this.formData.name) {
        ElMessage.error('请输入商品名称')
        return
      }

      // 处理图片数据
      if (this.imageFileList.length > 0) {
        const images = this.imageFileList.map(file => {
          // 如果是新上传的文件（有 response 字段），使用 response.url
          if (file.response && file.response.url) {
            return file.response.url
          }
          // 否则使用现有的 url
          return file.url
        })
        this.formData.images = JSON.stringify(images)
      } else {
        this.formData.images = JSON.stringify([])
      }

      // 处理其他需要字符串化的字段
      ['services', 'attributes', 'specifications', 'spec_combinations'].forEach(field => {
        if (Array.isArray(this.formData[field])) {
          this.formData[field] = JSON.stringify(this.formData[field])
        }
      })

      this.loading = true
      try {
        let response

        if (this.isEdit) {
          // 编辑模式
          response = await http.put(`/api/v1/mini_core/shop-product/${this.productId}`, this.formData)
        } else {
          // 新增模式
          response = await http.post('/api/v1/mini_core/shop-product', this.formData)
        }

        if (response.data && response.data.code === 200) {
          ElMessage.success(this.isEdit ? '商品更新成功' : '商品添加成功')
          this.$router.push('/shop/products/list')
        } else {
          ElMessage.error(response.data?.message || '操作失败')
        }
      } catch (error) {
        console.error('提交失败:', error)
        ElMessage.error('提交失败: ' + (error.message || '未知错误'))
      } finally {
        this.loading = false
      }
    },

    // 取消操作
    cancel () {
      this.$router.push('/shop/products/list')
    }
  }
}
</script>

<style scoped>

.editor-container {
  width: 100%;
  max-width: 800px;
}

.page-container {
  width: 100%;
  padding: 20px;
  background-color: #f5f5f5;
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
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.product-form {
  padding: 20px;
}

.form-section {
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
}

.form-section:last-child {
  border-bottom: none;
}

.form-row {
  margin-bottom: 15px;
  display: flex;
}

.form-item {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.form-item.full-width {
  width: 100%;
}

.form-item label {
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
}

.required {
  color: #f56c6c;
  margin-right: 4px;
}

input[type="text"],
input[type="number"],
select,
textarea {
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
}

input[type="text"]:focus,
input[type="number"]:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #409eff;
}

input[type="text"]::placeholder,
input[type="number"]::placeholder,
select::placeholder,
textarea::placeholder {
  color: #c0c4cc;
}

.select-wrapper {
  position: relative;
}

.select-wrapper select {
  width: 100%;
  appearance: none;
  padding-right: 30px;
  background-color: #fff;
}

.select-wrapper.small {
  width: 180px;
}

.select-wrapper .arrow-down {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #606266;
  pointer-events: none;
}

.store-options {
  display: flex;
  gap: 10px;
}

.store-option {
  padding: 8px 15px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  cursor: pointer;
  font-size: 14px;
}

.store-option.active {
  background-color: #67c23a;
  color: white;
  border-color: #67c23a;
}

.store-option .option-text {
  font-size: 14px;
}

.input-with-tip {
  position: relative;
}

.input-with-tip .input-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.input-with-tip .warning-tip {
  color: #e6a23c;
}

.input-with-tip .orange-tip {
  color: #ff9900;
}

.radio-group,
.checkbox-group {
  display: flex;
  gap: 15px;
}

.radio-item,
.checkbox-item {
  display: flex;
  align-items: center;
  cursor: pointer;
}

input[type="radio"],
input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.radio-circle {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 1px solid #dcdfe6;
  border-radius: 50%;
  margin-right: 6px;
  position: relative;
}

.radio-circle:after {
  content: "";
  display: none;
  width: 8px;
  height: 8px;
  background-color: #409eff;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

input[type="radio"]:checked ~ .radio-circle:after {
  display: block;
}

.checkbox-square {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  margin-right: 6px;
  position: relative;
}

.checkbox-square:after {
  content: "✓";
  display: none;
  font-size: 12px;
  color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

input[type="checkbox"]:checked ~ .checkbox-square {
  background-color: #409eff;
  border-color: #409eff;
}

input[type="checkbox"]:checked ~ .checkbox-square:after {
  display: block;
}

.radio-text,
.checkbox-text {
  font-size: 14px;
  color: #606266;
}

.checkbox-tip {
  margin-left: 10px;
  font-size: 12px;
  color: #909399;
}

.text-area {
  min-height: 100px;
  resize: vertical;
}

.char-count {
  font-size: 12px;
  color: #909399;
  text-align: right;
  margin-top: 5px;
}

.attributes-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.attribute-input {
  flex: 1;
}

.attribute-separator {
  font-weight: bold;
  color: #606266;
}

.add-btn {
  padding: 8px 15px;
  background-color: #67c23a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.add-btn:hover {
  background-color: #85ce61;
}

.image-upload-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.upload-tip {
  font-size: 12px;
  color: #606266;
}

.upload-btns {
  display: flex;
  gap: 10px;
}

.upload-btn {
  padding: 8px 15px;
  background-color: #f0ad4e;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.upload-btn:hover {
  background-color: #ec971f;
}

.upload-btn.secondary {
  background-color: #5bc0de;
}

.upload-btn.secondary:hover {
  background-color: #31b0d5;
}

.editor-tabs {
  display: flex;
  border-bottom: 1px solid #dcdfe6;
  margin-bottom: 10px;
}

.tab {
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
}

.tab.active {
  color: #409eff;
  border-bottom: 2px solid #409eff;
}

.editor-toolbar {
  display: flex;
  padding: 5px;
  border: 1px solid #dcdfe6;
  border-bottom: none;
  gap: 5px;
  flex-wrap: wrap;
  background-color: #f5f7fa;
}

.editor-toolbar.second-row {
  border-top: none;
  border-bottom: 1px solid #dcdfe6;
}

.toolbar-group {
  display: flex;
  gap: 2px;
}

.toolbar-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 2px;
}

.toolbar-btn:hover {
  background-color: #ecf5ff;
}

.editor-content {
  border: 1px solid #dcdfe6;
  min-height: 300px;
}

.content-area {
  width: 100%;
  min-height: 300px;
  padding: 10px;
  border: none;
  resize: vertical;
}

.content-area:focus {
  outline: none;
}

.editor-footer {
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
  background-color: #f5f7fa;
  border: 1px solid #dcdfe6;
  border-top: none;
  font-size: 12px;
  color: #909399;
}

.tiny-icon {
  font-weight: bold;
  color: #606266;
}

.unit-input,
.weight-input,
.min-buy-input {
  display: flex;
  align-items: center;
}

.unit-input input,
.weight-input input,
.min-buy-input input {
  flex: 1;
}

.unit-text {
  margin-left: 10px;
  color: #606266;
}

.unit-tip {
  margin-left: 10px;
  font-size: 12px;
  color: #909399;
}

.points-input-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.points-input-group input {
  width: 100px;
}

.points-input-group .input-tip {
  font-size: 12px;
  color: #909399;
}

.card-input-group {
  display: flex;
  flex-direction: column;
}

.card-input-group .card-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 5px;
}

.card-input-group .input-tip {
  font-size: 12px;
  margin-top: 5px;
}

.spec-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.spec-header label {
  margin-right: 10px;
  margin-bottom: 0;
}

.spec-header .spec-tip {
  font-size: 12px;
}

.warning-text {
  color: #e6a23c;
}

.spec-actions {
  margin-top: 10px;
}

.add-spec-btn {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background-color: #ecf5ff;
  color: #409eff;
  border: 1px solid #d9ecff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.add-spec-btn .plus-icon {
  margin-right: 5px;
  font-weight: bold;
}

.add-spec-btn:hover {
  background-color: #d9ecff;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.btn {
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.btn.btn-cancel {
  background-color: #f5f7fa;
  border: 1px solid #dcdfe6;
  color: #606266;
}

.btn.btn-cancel:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}

.btn.btn-submit {
  background-color: #409eff;
  border: 1px solid #409eff;
  color: white;
}

.btn.btn-submit:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
  }

  .upload-btns {
    flex-direction: column;
  }
}
</style>
