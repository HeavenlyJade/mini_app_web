<template>
  <div class="page-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <h2 class="page-title">商品分类管理</h2>
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
          <input type="text" v-model="categoryForm.store" class="form-input" placeholder="所属门店">
        </div>

        <div class="form-item">
          <label>上级分类</label>
          <select v-model="categoryForm.parentCategory" class="form-select">
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
            <button class="upload-btn">
              <i class="upload-icon"></i>
              插入图标图片
            </button>
            <button class="upload-btn">
              <i class="upload-icon"></i>
              上传本地图片
            </button>
          </div>
        </div>

        <div class="form-item">
          <label>图片</label>
          <div class="upload-container">
            <button class="upload-btn">
              <i class="upload-icon"></i>
              插入图标图片
            </button>
            <button class="upload-btn">
              <i class="upload-icon"></i>
              上传本地图片
            </button>
          </div>
        </div>

        <div class="form-item">
          <label>排序</label>
          <input type="number" v-model="categoryForm.sort" class="form-input" placeholder="0">
        </div>

        <div class="form-item">
          <label class="required">状态</label>
          <div class="radio-group">
            <label class="radio-item">
              <input type="radio" v-model="categoryForm.status" value="active" checked>
              <span>正常</span>
            </label>
            <label class="radio-item">
              <input type="radio" v-model="categoryForm.status" value="disabled">
              <span>停用</span>
            </label>
          </div>
        </div>

        <div class="form-item">
          <label>扩展属性</label>
          <div class="extension-properties">
            <div class="input-group">
              <input type="text" class="form-input" placeholder="属性名称">
              <span class="separator">:</span>
              <input type="text" class="form-input" placeholder="属性值">
              <button class="add-btn green">添加</button>
            </div>
          </div>
        </div>

        <div class="form-item">
          <label>详细介绍</label>
          <div class="editor-container">
            <rich-text-editor
              v-model:value="categoryForm.content"
              placeholder="请输入详细介绍..."
              :height="300"
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

<script>
import RichTextEditor from '@/components/richtext/RichTextEditor.vue'

export default {
  name: 'CategoryAddPage',
  components: {
    RichTextEditor
  },
  data () {
    return {
      categoryForm: {
        name: '',
        remark: '',
        type: '',
        store: '',
        parentCategory: '',
        code: '',
        sort: 0,
        status: 'active',
        content: '' // 富文本编辑器内容
      },
      parentCategories: [
        {
          id: 1,
          name: '食品'
        },
        {
          id: 2,
          name: '电器'
        },
        {
          id: 3,
          name: '服装'
        },
      ]
    }
  },
  methods: {
    handleContentChange (html) {
      console.log('编辑器内容已更新:', html)
      // 可以在这里进行其他操作，比如内容验证等
    },
    submitForm () {
      // 表单验证
      if (!this.categoryForm.name) {
        this.$message.error('请输入分类名称');
        return;
      }

      // 提交表单数据
      console.log('提交的表单数据:', this.categoryForm);

      // 这里调用API保存数据
      // this.$api.category.save(this.categoryForm).then(res => {
      //   if (res.code === 0) {
      //     this.$message.success('保存成功');
      //     this.$router.push('/category/list');
      //   } else {
      //     this.$message.error(res.message || '保存失败');
      //   }
      // }).catch(error => {
      //   this.$message.error('网络错误，请稍后重试');
      //   console.error(error);
      // });
    },
    cancel () {
      this.$router.go(-1);
    }
  }
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
  gap: 10px;
}

.upload-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 15px;
  background-color: #f0ad4e;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
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
}

.separator {
  margin: 0 10px;
  color: #606266;
}

.add-btn {
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
