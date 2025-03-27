<template>
  <div class="page-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <h2 class="page-title">添加商品</h2>
    </div>

    <!-- 页面内容区域 -->
    <div class="page-content">
      <form @submit.prevent="submitForm" class="product-form">
        <!-- 商店信息 -->
        <div class="form-section">
          <div class="form-row">
            <div class="form-item">
              <label>所属门店</label>
              <div class="store-options">
                <div class="store-option active">
                  <span class="option-text">添加到门店</span>
                </div>
                <div class="store-option">
                  <span class="option-text">没有多选的不需要选择</span>
                </div>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label>省份</label>
              <div class="select-wrapper">
                <select v-model="formData.province">
                  <option value="">请选择</option>
                  <option value="beijing">北京市</option>
                  <option value="shanghai">上海市</option>
                  <option value="guangdong">广东省</option>
                  <!-- 更多选项 -->
                </select>
                <i class="arrow-down"></i>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label><span class="required">*</span> 商品分类</label>
              <div class="select-wrapper">
                <select v-model="formData.category" required>
                  <option value="">商品分类</option>
                  <option value="category1">酒类</option>
                  <option value="category2">饮料</option>
                  <option value="category3">食品</option>
                  <!-- 更多选项 -->
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
                <div class="input-tip">多个标签用空格或逗号隔开</div>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label>扩展属性</label>
              <div class="attributes-container">
                <input type="text" class="attribute-input" placeholder="扩展属性名">
                <span class="attribute-separator">:</span>
                <input type="text" class="attribute-input" placeholder="扩展属性值">
                <button type="button" class="add-btn">添加</button>
              </div>
            </div>
          </div>

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
                  <input type="radio" v-model="formData.status" value="online" checked>
                  <span class="radio-circle"></span>
                  <span class="radio-text">上架</span>
                </label>
                <label class="radio-item">
                  <input type="radio" v-model="formData.status" value="offline">
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
              <label>视频编号</label>
              <div class="input-with-tip">
                <input type="text" v-model="formData.videoId" placeholder="视频编号">
                <div class="input-tip">使用已有视频点播视频</div>
              </div>
            </div>
          </div>

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
              <label>图片</label>
              <div class="image-upload-section">
                <div class="upload-tip">
                  <span>第一张图片默认为封面图片，可拖动排序</span>
                </div>
                <div class="upload-btns">
                  <button type="button" class="upload-btn">从图片库选择</button>
                  <button type="button" class="upload-btn secondary">上传本地图片</button>
                </div>
              </div>
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
                  @change="handleContentChange"
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
              <input type="text" v-model="formData.marketPrice" required placeholder="0">
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
                  <input type="checkbox" v-model="formData.stockSettings" value="noStock">
                  <span class="checkbox-square"></span>
                  <span class="checkbox-text">无库存</span>
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" v-model="formData.stockSettings" value="autoOrder">
                  <span class="checkbox-square"></span>
                  <span class="checkbox-text">自动下架</span>
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

          <div class="form-row">
            <div class="form-item">
              <label>自动发卡</label>
              <div class="card-input-group">
                <span class="card-label">会员卡规则ID</span>
                <input type="text" v-model="formData.cardRuleId" placeholder="会员卡规则ID">
                <div class="input-tip orange-tip">用户购买后的该商品以后，系统会自动给用户发放该会员卡</div>
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
<script setup>
import { reactive } from 'vue'
import RichTextEditor from '@/components/richtext/RichTextEditor.vue'

// 表单数据
const formData = reactive({
  // 商店信息
  province: '',
  category: '',

  // 商品基础信息
  barcode: '',
  name: '',
  alias: '',
  type: 'physical',
  overseas: 'no',
  tags: '',
  purchaseNotes: '',
  features: '',

  // 物流和模板
  logisticsTemplate: '',
  extendedLogisticsTemplate: '',
  priorityCoupon: '1',
  sort: '0',
  recommended: 'no',
  display: 'yes',
  afterSaleOptions: [],
  status: 'online',

  // 视频和图片
  videoId: '',
  videoUrl: '',
  images: [],

  // 商品详情
  description: '',

  // 价格和库存
  unit: '份',
  marketPrice: '',
  price: '',
  taxRate: '',
  requiredPoints: '0',
  giftPoints: '0',
  giftPointsType: 'fixed',
  minPurchase: '1',
  stock: '',
  stockWarning: '',
  stockSettings: [],
  weight: '',
  cardRuleId: '',

  // 规格信息
  specs: []
})

// 提交表单
const submitForm = () => {
  console.log('提交的表单数据:', formData)
  // 这里添加表单验证和提交到后端的逻辑
  alert('表单提交成功！')
}

const handleContentChange = (html) => {
  console.log('商品详情已更新:', html)
  // 可以在这里做额外的验证或处理
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
