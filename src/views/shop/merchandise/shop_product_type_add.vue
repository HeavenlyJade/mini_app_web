<template>
  <div class="page-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <h2 class="page-title">{{ isEdit ? '编辑商品分类' : '添加商品分类' }}</h2>
    </div>

    <!-- 分类添加表单 -->
    <div class="page-content">
      <div class="form-container">
        <div class="form-item">
          <label class="required">名称</label>
          <input link v-model="categoryForm.name" class="form-input" placeholder="请输入分类名称">
        </div>

        <div class="form-item">
          <label>备注</label>
          <input link v-model="categoryForm.remark" class="form-input" placeholder="请输入备注信息">
        </div>

        <div class="form-item">
          <label>类型</label>
          <div class="input-with-hint">
            <input link v-model="categoryForm.type" class="form-input" placeholder="请输入类型">
            <span class="input-hint">自定义类型，32个字以内</span>
          </div>
        </div>

        <!-- <div class="form-item">
          <label>所属门店</label>
          <input link v-model="categoryForm.store_id" class="form-input" placeholder="所属门店">
        </div> -->

        <div class="form-item">
          <label>上级分类</label>
          <div class="select-wrapper">
            <select v-model="categoryForm.parent_id" class="form-select">
              <option value="">请选择</option>
              <option 
                v-for="category in parentCategories" 
                :key="category.id" 
                :value="category.id"
                :class="{ 'level-0': category.level === 0, 'level-1': category.level === 1, 'level-2': category.level === 2 }">
                <template v-if="category.level === 0">{{ category.name }}</template>
                <template v-if="category.level === 1">{{ category.name }}</template>
                <template v-if="category.level === 2">{{ category.name }}</template>
              </option>
            </select>
          </div>
        </div>

        <div class="form-item">
          <label>编号</label>
          <div class="input-with-hint">
            <input link v-model="categoryForm.code" class="form-input" placeholder="请输入编号">
            <span class="input-hint">自定义编号，32个字符以内</span>
          </div>
        </div>

        <div class="form-item">
          <label>图标</label>
          <div class="upload-wrapper">
            <file-uploader
              v-model:value="categoryForm.iconList"
              @change="handleIconChange"
              :limit="1"
              tip-text="请上传分类图标"
              :disabled="false">
            </file-uploader>
          </div>
        </div>

        <div class="form-item">
          <label>图片</label>
          <div class="upload-wrapper">
            <file-uploader
              v-model:value="categoryForm.imageList"
              @change="handleImageChange"
              :limit="1"
              tip-text="请上传分类图片"
              :disabled="false">
            </file-uploader>
          </div>
        </div>

        <div class="form-item">
          <label>排序</label>
          <input type="number" v-model="categoryForm.sort_order" class="form-input" placeholder="0">
        </div>

        <div class="form-item">
          <label class="required">状态</label>
          <div class="radio-group">
            <label class="radio-item">
              <input type="radio" v-model="categoryForm.status" value="正常">
              <span>正常</span>
            </label>
            <label class="radio-item">
              <input type="radio" v-model="categoryForm.status" value="停用">
              <span>停用</span>
            </label>
          </div>
        </div>

        <div class="form-item">
          <label>扩展属性</label>
          <div class="extension-properties">
            <div class="input-group" v-for="(prop, index) in customProperties" :key="index">
              <input link class="form-input" placeholder="属性名称" v-model="prop.key">
              <span class="separator">:</span>
              <input link class="form-input" placeholder="属性值" v-model="prop.value">
              <button class="remove-btn red" @click="removeProperty(index)">删除</button>
            </div>
            <div class="input-group">
              <input link class="form-input" placeholder="属性名称" v-model="newProperty.key">
              <span class="separator">:</span>
              <input link class="form-input" placeholder="属性值" v-model="newProperty.value">
              <button class="add-btn green" @click="addProperty">添加</button>
            </div>
          </div>
        </div>

        <div class="form-item">
          <label>详细介绍</label>
          <div class="editor-container">
            <rich-text-editor
              v-model:value="categoryForm.content"
              placeholder="请输入详细介绍..."
              :height="500"
              @change="handleContentChange"
            />
          </div>
        </div>

        <div class="form-actions">
          <button class="submit-btn" @click="submitForm">提交</button>
          <button class="cancel-btn" @click="cancel">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
import { Upload, Delete } from '@element-plus/icons-vue'
import RichTextEditor from '@/components/richtext/RichTextEditor.vue'
import FileUploader from '@/components/public/FileUploader.vue'
import http from '@/utils/http'

// 路由和导航
const route = useRoute()
const router = useRouter()

// 状态变量
const categoryId = computed(() => route.params.id || route.query.id)
const isEdit = computed(() => !!categoryId.value)
const loading = ref(false)
const parentCategories = ref([])
const customProperties = ref([])
const newProperty = reactive({ key: '', value: '' })

// 表单数据
const categoryForm = reactive({
  id: null,
  name: null,
  remark: null,
  type: null,
  store_id: null,
  parent_id: null,
  code: null,
  icon: null,
  image: null,
  iconList: [],
  imageList: [],
  sort_order: 0,
  status: '正常',
  content: null
})

// 图标上传处理
const handleIconChange = (urls) => {
  if (urls && urls.length > 0) {
    categoryForm.icon = urls[0]
  } else {
    categoryForm.icon = ''
  }
}

// 图片上传处理
const handleImageChange = (urls) => {
  if (urls && urls.length > 0) {
    categoryForm.image = urls[0]
  } else {
    categoryForm.image = ''
  }
}

// 获取父级分类列表并转换为树状结构显示
const fetchParentCategories = async () => {
  try {
    loading.value = true
    const response = await http.post('/api/v1/mini_core/product-category-field',{fields:['id','name','parent_id']})
    if (response.data) {
      let categories = []
      if (Array.isArray(response.data)) {
        categories = response.data
      } else if (response.data.data && Array.isArray(response.data.data)) {
        categories = response.data.data
      }
      
      // 先获取顶级分类
      const topLevelCategories = categories.filter(cat => cat.parent_id === 0)
      
      // 转换为树状结构的扁平数组
      const result = []
      
      // 添加顶级分类
      topLevelCategories.forEach(cat => {
        result.push({
          ...cat,
          level: 0
        })
        
        // 添加子分类（第一级）
        const children = categories.filter(child => child.parent_id === cat.id)
        children.forEach(child => {
          result.push({
            ...child,
            level: 1
          })
          
          // 添加孙子分类（第二级）
          const grandchildren = categories.filter(gc => gc.parent_id === child.id)
          grandchildren.forEach(gc => {
            result.push({
              ...gc,
              level: 2
            })
          })
        })
      })
      
      parentCategories.value = result
    }
  } catch (error) {
    console.error('获取父级分类失败:', error)
    ElMessage.error('获取父级分类失败')
  } finally {
    loading.value = false
  }
}

// 获取分类详情（编辑模式）
const fetchCategoryDetail = async () => {
  if (!categoryId.value) return

  try {
    loading.value = true
    const response = await http.get(`/api/v1/mini_core/product-category/${categoryId.value}`)
    if (response.data) {
      const categoryData = Array.isArray(response.data) ? response.data[0] : response.data.data || response.data

      // 更新表单数据
      Object.keys(categoryForm).forEach(key => {
        if (categoryData[key] !== undefined && key !== 'iconList' && key !== 'imageList') {
          categoryForm[key] = categoryData[key]
        }
      })

      // 初始化图标和图片数据
      if (categoryData.icon) {
        categoryForm.iconList = [categoryData.icon]
      }
      
      if (categoryData.image) {
        categoryForm.imageList = [categoryData.image]
      }

      // 处理自定义属性
      if (categoryData.attribute) {
        try {
          const props = categoryData.attribute
          customProperties.value = Object.entries(props).map(([key, value]) => ({ key, value }))
        } catch (e) {
          console.error('解析自定义属性失败:', e)
        }
      }
    }
  } catch (error) {
    console.error('获取分类详情失败:', error)
    ElMessage.error('获取分类详情失败')
  } finally {
    loading.value = false
  }
}

// 添加自定义属性
const addProperty = () => {
  if (!newProperty.key.trim()) {
    ElMessage.warning('请输入属性名称')
    return
  }

  customProperties.value.push({
    key: newProperty.key,
    value: newProperty.value
  })

  // 清空输入
  newProperty.key = ''
  newProperty.value = ''
}

// 删除自定义属性
const removeProperty = (index) => {
  customProperties.value.splice(index, 1)
}

// 富文本内容变更
const handleContentChange = (html) => {
  categoryForm.content = html
}

// 提交表单
const submitForm = async () => {
  // 表单验证
  if (!categoryForm.name) {
    ElMessage.error('请输入分类名称')
    return
  }

  // 处理自定义属性
  const customPropertiesObj = {}
  customProperties.value.forEach(prop => {
    if (prop.key.trim()) {
      customPropertiesObj[prop.key] = prop.value
    }
  })

  // 构建提交数据 - 不需要包含iconList和imageList
  const { iconList, imageList, ...submitData } = categoryForm
  submitData.attribute = customPropertiesObj

  try {
    loading.value = true

    let response
    if (isEdit.value) {
      // 编辑模式
      response = await http.put(`/api/v1/mini_core/product-category/${categoryId.value}`, submitData)
    } else {
      // 新增模式
      response = await http.post('/api/v1/mini_core/product-category', submitData)
    }

    if (response.data) {
      ElMessage.success(isEdit.value ? '更新成功' : '添加成功')
      // 返回列表页
      // router.push('/shop/products/categories')
    } else {
      ElMessage.error(isEdit.value ? '更新失败' : '添加失败')
    }
  } catch (error) {
    console.error('提交表单失败:', error)
    ElMessage.error(`提交失败: ${error.message || '网络错误'}`)
  } finally {
    loading.value = false
  }
}

// 取消操作
const cancel = () => {
  router.go(-1)
}

// 生命周期钩子
onMounted(async () => {
  // 加载父级分类数据
  await fetchParentCategories()

  // 如果是编辑模式，加载分类详情
  if (isEdit.value) {
    await fetchCategoryDetail()
  }
})

// 获取选中分类名称
const getSelectedCategoryName = () => {
  const selected = parentCategories.value.find(cat => cat.id === categoryForm.parent_id)
  return selected ? selected.name : ''
}
</script>

<style scoped>
.page-container {
  width: 100%;
  padding: 20px;
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

.form-container {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
}

.form-item {
  margin-bottom: 20px;
  display: flex;
  align-items: flex-start;
}

.form-item label {
  width: 100px;
  text-align: right;
  padding-right: 12px;
  color: #606266;
  line-height: 32px;
}

.required:before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}

.form-input {
  width: 100%;
  max-width: 400px;
  height: 32px;
  line-height: 32px;
  padding: 0 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  color: #606266;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #409eff;
}

.form-select {
  width: 100%;
  max-width: 400px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  color: #606266;
  background-color: #fff;
  padding: 0;
  font-size: 14px;
}

.form-select option {
  padding: 8px 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.form-select option.level-0 {
  font-weight: bold;
  color: #303133;
  padding-left: 12px;
}

.form-select option.level-1 {
  color: #606266;
  padding-left: 28px;
}

.form-select option.level-2 {
  color: #909399;
  font-size: 13px;
  padding-left: 44px;
}

.input-with-hint {
  display: flex;
  flex-direction: column;
}

.input-hint {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.upload-wrapper {
  width: 100%;
  max-width: 400px;
}

.preview-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.preview-image {
  width: 80px;
  height: 80px;
  object-fit: contain;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.remove-btn {
  background-color: #f56c6c;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 4px 8px;
}

.radio-group {
  display: flex;
  align-items: center;
}

.radio-item {
  display: flex;
  align-items: center;
  margin-right: 20px;
  cursor: pointer;
}

.extension-properties {
  width: 100%;
  max-width: 600px;
}

.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.separator {
  margin: 0 10px;
  color: #606266;
}

.add-btn, .remove-btn {
  padding: 8px 15px;
  margin-left: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #fff;
}

.green {
  background-color: #67c23a;
}

.red {
  background-color: #f56c6c;
}

.editor-container {
  width: 100%;
  max-width: 800px;
}

.form-actions {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.submit-btn {
  padding: 8px 20px;
  background-color: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn {
  padding: 8px 20px;
  background-color: #909399;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.select-wrapper {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.selected-display {
  margin-top: 5px;
  font-size: 13px;
  color: #409eff;
}
</style>
