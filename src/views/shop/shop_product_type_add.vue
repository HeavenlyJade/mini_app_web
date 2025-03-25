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
          <input type="text" v-model="categoryForm.name" class="form-input" placeholder="请输入分类名称">
        </div>

        <div class="form-item">
          <label>备注</label>
          <input type="text" v-model="categoryForm.remark" class="form-input" placeholder="请输入备注信息">
        </div>

        <div class="form-item">
          <label>类型</label>
          <div class="input-with-hint">
            <input type="text" v-model="categoryForm.type" class="form-input" placeholder="请输入类型">
            <span class="input-hint">自定义类型，32个字以内</span>
          </div>
        </div>

        <div class="form-item">
          <label>所属门店</label>
          <input type="text" v-model="categoryForm.store_id" class="form-input" placeholder="所属门店">
        </div>

        <div class="form-item">
          <label>上级分类</label>
          <select v-model="categoryForm.parent_id" class="form-select">
            <option value="">请选择</option>
            <option v-for="category in parentCategories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <div class="form-item">
          <label>编号</label>
          <div class="input-with-hint">
            <input type="text" v-model="categoryForm.code" class="form-input" placeholder="请输入编号">
            <span class="input-hint">自定义编号，32个字符以内</span>
          </div>
        </div>

        <div class="form-item">
          <label>图标</label>
          <div class="upload-container">
            <el-upload
              action="#"
              :http-request="uploadIcon"
              :show-file-list="false"
              :before-upload="beforeIconUpload">
              <el-button type="warning" :icon="Upload">上传图标</el-button>
            </el-upload>
            <div v-if="categoryForm.icon" class="preview-container">
              <img :src="categoryForm.icon" class="preview-image" alt="图标预览">
              <el-button type="danger" :icon="Delete" size="small" @click="removeIcon" class="remove-btn">删除</el-button>
            </div>
          </div>
        </div>

        <div class="form-item">
          <label>图片</label>
          <div class="upload-container">
            <el-upload
              action="#"
              :http-request="uploadImage"
              :show-file-list="false"
              :before-upload="beforeImageUpload">
              <el-button type="warning" :icon="Upload">上传图片</el-button>
            </el-upload>
            <div v-if="categoryForm.image" class="preview-container">
              <img :src="categoryForm.image" class="preview-image" alt="图片预览">
              <el-button type="danger" :icon="Delete" size="small" @click="removeImage" class="remove-btn">删除</el-button>
            </div>
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
              <input type="text" class="form-input" placeholder="属性名称" v-model="prop.key">
              <span class="separator">:</span>
              <input type="text" class="form-input" placeholder="属性值" v-model="prop.value">
              <button class="remove-btn red" @click="removeProperty(index)">删除</button>
            </div>
            <div class="input-group">
              <input type="text" class="form-input" placeholder="属性名称" v-model="newProperty.key">
              <span class="separator">:</span>
              <input type="text" class="form-input" placeholder="属性值" v-model="newProperty.value">
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
  id: '',
  name: '',
  remark: '',
  type: '',
  store_id: null,
  parent_id: '',
  code: '',
  icon: '',
  image: '',
  sort_order: 0,
  status: '正常',
  content: ''
})

// 获取父级分类列表
const fetchParentCategories = async () => {
  try {
    loading.value = true
    const response = await http.get('/api/v1/mini_core/product-category')
    if (response.data) {
      // 处理数据格式
      if (Array.isArray(response.data)) {
        parentCategories.value = response.data.filter(item => item.parent_id === 0)
      } else if (response.data.data && Array.isArray(response.data.data)) {
        parentCategories.value = response.data.data.filter(item => item.parent_id === 0)
      }
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
        if (categoryData[key] !== undefined) {
          categoryForm[key] = categoryData[key]
        }
      })

      // 处理自定义属性
      if (categoryData.custom_properties) {
        try {
          const props = JSON.parse(categoryData.custom_properties)
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

// 上传图标前检查
const beforeIconUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 上传图标
const uploadIcon = async (options) => {
  try {
    const formData = new FormData()
    formData.append('file', options.file)

    const loading = ElLoading.service({
      lock: true,
      text: '上传中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    const response = await http.post('/api/v1/upload/image', formData)
    loading.close()

    if (response.data && response.data.url) {
      categoryForm.icon = response.data.url
      ElMessage.success('图标上传成功')
    } else {
      ElMessage.error('图标上传失败')
    }
  } catch (error) {
    ElMessage.error('图标上传失败: ' + error.message)
  }
}

// 删除图标
const removeIcon = () => {
  categoryForm.icon = ''
}

// 上传图片前检查
const beforeImageUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB!')
    return false
  }
  return true
}

// 上传图片
const uploadImage = async (options) => {
  try {
    const formData = new FormData()
    formData.append('file', options.file)

    const loading = ElLoading.service({
      lock: true,
      text: '上传中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    const response = await http.post('/api/v1/upload/image', formData)
    loading.close()

    if (response.data && response.data.url) {
      categoryForm.image = response.data.url
      ElMessage.success('图片上传成功')
    } else {
      ElMessage.error('图片上传失败')
    }
  } catch (error) {
    ElMessage.error('图片上传失败: ' + error.message)
  }
}

// 删除图片
const removeImage = () => {
  categoryForm.image = ''
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

  // 构建提交数据
  const submitData = {
    ...categoryForm,
    custom_properties: JSON.stringify(customPropertiesObj)
  }

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
      router.push('/shop/products/categories')
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
  height: 32px;
  line-height: 32px;
  padding: 0 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  color: #606266;
  background-color: #fff;
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

.upload-container {
  display: flex;
  gap: 15px;
  align-items: center;
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
</style>
