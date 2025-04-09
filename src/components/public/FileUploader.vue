<template>
  <div class="file-uploader">
    <div class="upload-tip" v-if="showTips">
      <span>{{ tipText }}</span>
    </div>

    <div class="upload-container">
      <!-- 可拖拽图片预览区域 -->
      <draggable
        v-model="fileList"
        item-key="uid"
        ghost-class="ghost-item"
        chosen-class="chosen-item"
        :disabled="disabled"
        @end="onDragEnd">
        <template #item="{element}">
          <div class="image-item">
            <div class="image-preview">
              <img :src="element.url" :alt="element.name">
              <div class="image-actions">
                <span class="preview-action" @click="handlePictureCardPreview(element)">
                  <el-icon><zoom-in /></el-icon>
                </span>
                <span class="remove-action" @click="handleRemove(element)" v-if="!disabled">
                  <el-icon><delete /></el-icon>
                </span>
              </div>
            </div>
            <div class="sort-handle" v-if="!disabled">
              <el-icon><rank /></el-icon>
            </div>
          </div>
        </template>
      </draggable>

      <!-- 上传按钮 -->
      <div class="upload-button" v-if="!disabled && (fileList.length < limit)">
        <el-upload
          action="#"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="handleFileChange"
          :http-request="customUpload"
          :disabled="disabled">
          <div class="upload-trigger">
            <el-icon><plus /></el-icon>
          </div>
        </el-upload>
      </div>
    </div>

    <!-- 预览对话框 -->
    <el-dialog v-model="dialogVisible" title="图片预览">
      <img width="100%" :src="dialogImageUrl" alt="预览图片">
    </el-dialog>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { ElMessage, ElLoading } from 'element-plus';
import draggable from 'vuedraggable';
// 导入 Element Plus 图标
import { Plus, Delete, ZoomIn, Rank } from '@element-plus/icons-vue';
import http from '@/utils/http';

export default {
  name: 'FileUploader',
  components: {
    draggable,
    Plus,
    Delete,
    ZoomIn,
    Rank
  },
  props: {
    // 已有的图片列表
    value: {
      type: Array,
      default: () => []
    },
    // 最大文件数
    limit: {
      type: Number,
      default: 5
    },
    // 是否显示提示文本
    showTips: {
      type: Boolean,
      default: true
    },
    // 提示文本
    tipText: {
      type: String,
      default: '第一张图片默认为封面图片，可拖动排序'
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 自定义上传API路径
    uploadUrl: {
      type: String,
      default: '/api/v1/mini_core/upload'
    }
  },
  emits: ['update:value', 'change'],
  setup(props, { emit }) {
    const fileList = ref([]);
    const dialogImageUrl = ref('');
    const dialogVisible = ref(false);
    const uploadLoading = ref(false);

    // 生成唯一ID
    const generateUid = () => {
      return 'upload_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
    };

    // 初始化文件列表
    const initFileList = (files) => {
      if (!files || !Array.isArray(files)) return;

      fileList.value = files.map((url, index) => ({
        name: `file_${index}`,
        url: url,
        uid: generateUid()
      }));
    };

    // 监听props变化
    watch(() => props.value, (newVal) => {
      initFileList(newVal);
    }, { immediate: true });

    // 拖拽结束后触发更新
    const onDragEnd = () => {
      updateValues();
    };

    // 更新值并触发事件
    const updateValues = () => {
      const urls = fileList.value.map(file => file.url).filter(Boolean);
      emit('update:value', urls);
      emit('change', urls);
    };

    // 图片预览
    const handlePictureCardPreview = (file) => {
      dialogImageUrl.value = file.url;
      dialogVisible.value = true;
    };

    // 移除图片
    const handleRemove = (file) => {
      const index = fileList.value.findIndex(item => item.uid === file.uid);
      if (index !== -1) {
        fileList.value.splice(index, 1);
        updateValues();
      }
    };

    // 文件变化处理
    const handleFileChange = (file) => {
      if (file.raw) {
        // 检查文件类型
        const isImage = file.raw.type.indexOf('image/') !== -1;
        if (!isImage) {
          ElMessage.error('只能上传图片文件!');
          return;
        }

        // 检查文件大小
        const isLt2M = file.raw.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          ElMessage.error('图片大小不能超过 2MB!');
          return;
        }

        // 检查是否超过限制
        if (fileList.value.length >= props.limit) {
          ElMessage.warning(`最多只能上传 ${props.limit} 张图片!`);
          return;
        }

        // 上传文件
        uploadLoading.value = true;
        uploadFile(file.raw).then(url => {
          if (url) {
            fileList.value.push({
              name: file.name,
              url: url,
              uid: generateUid()
            });
            updateValues();
          }
          uploadLoading.value = false;
        });
      }
    };

    // 自定义上传处理
    const customUpload = (options) => {
      // 阻止默认上传行为，由我们自己的handleFileChange处理
      return false;
    };

    // 上传文件方法
    const uploadFile = async (file) => {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await http.uploadImage(formData);
        if (response.data && response.data.url) {
          ElMessage.success('上传成功');
          return response.data.url;
        } else {
          ElMessage.error('上传图片失败');
          return '';
        }
      } catch (error) {
        console.error('上传图片错误:', error);
        ElMessage.error('上传图片失败: ' + (error.message || '网络错误'));
        return '';
      }
    };

    // 初始化
    initFileList(props.value);

    return {
      fileList,
      dialogImageUrl,
      dialogVisible,
      uploadLoading,
      handlePictureCardPreview,
      handleRemove,
      handleFileChange,
      customUpload,
      onDragEnd
    };
  }
};
</script>

<style scoped>
.file-uploader {
  width: 100%;
}

.upload-tip {
  margin-bottom: 10px;
  color: #909399;
  font-size: 12px;
}

.upload-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.image-item {
  position: relative;
  width: 146px;
  height: 146px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  overflow: hidden;
  cursor: move;
  background-color: #fff;
  box-sizing: border-box;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.image-item:hover {
  border-color: #409eff;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
}

.image-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
}

.image-preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.image-actions {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  opacity: 0;
  transition: opacity 0.3s;
}

.image-preview:hover .image-actions {
  opacity: 1;
}

.preview-action, .remove-action {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.2s;
}

.preview-action:hover, .remove-action:hover {
  transform: scale(1.2);
}

.sort-handle {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 24px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  cursor: move;
}

.upload-button {
  width: 146px;
  height: 146px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  background-color: #fafafa;
  transition: border-color 0.3s;
}

.upload-button:hover {
  border-color: #409eff;
}

  .upload-trigger {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.upload-trigger .el-icon {
  font-size: 40px;
  color: #8c939d;
  border: 2px dashed #c0c4cc;
  border-radius: 50%;
  padding: 10px;
  background-color: #f5f7fa;
}

.preview-action .el-icon,
.remove-action .el-icon,
.sort-handle .el-icon {
  font-size: 18px;
}

.ghost-item {
  opacity: 0.5;
  background: #c8ebfb;
  border: 1px dashed #409eff;
}

.chosen-item {
  border: 1px solid #409eff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
</style>
