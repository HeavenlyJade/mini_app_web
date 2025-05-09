<!-- RichTextEditor.vue - 完整单文件版 -->
<template>
  <div class="tinymce-container editor-container" :class="{fullscreen: fullscreen}">
    <textarea :id="tinymceId" class="tinymce-textarea" />
    
    <!-- 添加文件上传对话框 -->
    <el-dialog v-model="showImageUploader" title="上传图片" width="500px">
      <FileUploader 
        v-model:value="uploadedImages" 
        :limit="9"
        @change="handleImagesChange" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showImageUploader = false">取消</el-button>
          <el-button type="primary" @click="insertUploadedImages">插入图片</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
// 注意：不要在这里使用 src 属性，而是在 index.html 或其他入口文件中引入 tinymce
import FileUploader from '@/components/public/FileUploader.vue'

export default {
  name: 'RichTextEditor',
  components: {
    FileUploader
  },
  props: {
    // 初始内容
    value: {
      type: String,
      default: ''
    },
    // 占位文本
    placeholder: {
      type: String,
      default: '请输入内容...'
    },
    // 高度
    height: {
      type: Number,
      default: 500
    },
    // 宽度
    width: {
      type: [String, Number],
      default: '100%'
    },
    // 是否显示菜单栏
    menubar: {
      type: Boolean,
      default: false
    },
    // 自定义工具栏
    customToolbar: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tinymceId: 'vue-tinymce-' + +new Date(),
      fullscreen: false,
      hasInit: false,
      hasChange: false,
      editorContent: '',
      // 添加图片上传相关数据
      showImageUploader: false,
      uploadedImages: [],
      // 默认插件配置
      plugins: [
        'advlist', 'autolink', 'lists', 'link',  'charmap',
        'preview', 'anchor', 'searchreplace', 'visualblocks', 'code',
        'fullscreen', 'insertdatetime', 'media', 'table', 'code',
        'help', 'wordcount', 'emoticons', 'autoresize', 'powerpaste',
        'print', 'template', 'codesample', 'hr', 'pagebreak',
        'nonbreaking', 'anchor', 'textpattern', 'autosave',
        'paste', 'imagetools' // 添加处理粘贴和图片处理的插件
      ],
      // 默认工具栏配置
      toolbar: [
        'code undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor',
        'alignleft aligncenter alignright alignjustify outdent indent | styleselect formatselect fontselect fontsizeselect',
        'bullist numlist | blockquote subscript superscript removeformat | table image media charmap emoticons hr pagebreak insertdatetime customimageupload',
        'print preview | fullscreen'
      ]
    }
  },
  watch: {
    value(val) {
      // 当父组件更新value时，更新编辑器内容
      if (this.hasInit) {
        this.$nextTick(() => {
          window.tinymce.get(this.tinymceId)?.setContent(val || '')
        })
      }
    }
  },
  mounted() {
    this.initTinymce()
  },
  beforeUnmount() {
    this.destroyTinymce()
  },
  methods: {
    initTinymce() {
      const self = this

      // 确保TinyMCE已加载
      if (typeof window.tinymce === 'undefined') {
        console.error('TinyMCE not loaded')
        return
      }

      window.tinymce.init({
        selector: `#${this.tinymceId}`,
        height: this.height,
        width: this.width,
        min_height: 150,
        language: 'zh_CN', // 使用中文语言包
        plugins: this.plugins,
        toolbar: this.customToolbar.length > 0 ? this.customToolbar : this.toolbar,
        menubar: this.menubar,
        fontsize_formats: '12px 14px 16px 18px 20px 24px 36px',
        placeholder: this.placeholder,

        // 图片和拖拽相关设置
        paste_data_images: true, // 允许粘贴图片
        automatic_uploads: true, // 自动上传
        images_reuse_filename: true,
        images_file_types: 'jpeg,jpg,png,gif,bmp,webp,svg,ico', // 支持的文件类型

        // 允许拖放
        dragdrop_allow_only_images: false, // 不仅允许图片，允许所有支持的文件类型

        // 文件选择器设置
        file_picker_types: 'file image media',

        // 修复上传进度指示器问题的图片上传处理
        images_upload_handler: function(blobInfo, success, failure, progress) {
          // 创建FormData对象
          const formData = new FormData();
          formData.append('file', blobInfo.blob(), blobInfo.filename());
          
          // 隐藏上传指示器
          window.tinymce.activeEditor.notificationManager.close();
          
          // 使用imageUploadHttp实例上传图片
          import('@/utils/http').then(httpModule => {
            httpModule.default.uploadImage(formData)
              .then(response => {
                // 根据实际接口返回结构调整
                const imageUrl = response.data.url || response.data.data;
                success(imageUrl);
                
                // 上传完成后，再次确保指示器被清除
                setTimeout(() => {
                  window.tinymce.activeEditor.notificationManager.close();
                  
                  // 清除所有可能的进度指示器
                  const editorBody = window.tinymce.activeEditor.getBody();
                  const indicators = editorBody.querySelectorAll(
                    '.mce-progress, .tox-progress-indicator, [data-mce-bogus="all"], .tox-progress, .mce-loader'
                  );
                  indicators.forEach(indicator => {
                    if (indicator && indicator.parentNode) {
                      indicator.parentNode.removeChild(indicator);
                    }
                  });
                }, 100);
              })
              .catch(error => {
                console.error('上传失败:', error);
                failure('图片上传失败: ' + (error.message || '未知错误'));
              });
          });
        },

        // 文件选择器回调
        file_picker_callback: function(callback, value, meta) {
          // 如果是图片类型，则打开自定义上传对话框
          if (meta.filetype === 'image') {
            self.showImageUploader = true;
            // 保存回调函数，用于后续调用
            self._imageCallback = callback;
            return;
          }
          
          // 其他类型文件使用原有方法
          const input = document.createElement('input');
          input.setAttribute('type', 'file');

          // 设置接受的文件类型
          if (meta.filetype === 'image') {
            input.setAttribute('accept', 'image/*');
          }

          // 文件选择后的处理
          input.onchange = function() {
            const file = this.files[0];

            // 创建FileReader读取文件
            const reader = new FileReader();
            reader.onload = function() {
              // 创建blob URL
              const id = 'blobid' + (new Date()).getTime();
              const blobCache = window.tinymce.activeEditor.editorUpload.blobCache;
              const base64 = reader.result.split(',')[1];
              const blobInfo = blobCache.create(id, file, base64);
              blobCache.add(blobInfo);

              // 回调，插入图片
              callback(blobInfo.blobUri(), { title: file.name });
            };
            reader.readAsDataURL(file);
          };

          // 触发文件选择
          input.click();
        },

        // 基本设置
        object_resizing: true,
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        default_link_target: '_blank',
        link_title: false,

        // 禁用自动调整大小
        resize: false,

        // 初始化回调
        init_instance_callback: editor => {
          if (self.value) {
            editor.setContent(self.value)
          }
          self.hasInit = true

          // 添加变量保存用户光标位置
          let lastBookmark = null;

          // 修改内容变化监听，保存和恢复光标位置
          editor.on('NodeChange Change KeyUp', () => {
            // 保存当前光标位置
            lastBookmark = editor.selection.getBookmark(2, true, true);

            // 处理内容更新
            self.hasChange = true
            const content = editor.getContent()
            self.editorContent = content

            // 触发事件，但避免直接使用setValue或setContent
            // 因为这会重置光标位置
            self.$emit('update:value', content)
            self.$emit('change', content)

            // 在内容变化时也尝试清理进度指示器
            const editorBody = editor.getBody();
            const indicators = editorBody.querySelectorAll(
              '.mce-progress, .tox-progress-indicator, [data-mce-bogus="all"]'
            );
            indicators.forEach(indicator => {
              if (indicator && indicator.parentNode) {
                indicator.parentNode.removeChild(indicator);
              }
            });
          });

          // 单独监听SetContent事件，它会在外部设置内容时触发
          editor.on('SetContent', () => {
            // 如果有保存的光标位置且不是程序主动设置内容，则恢复位置
            if (lastBookmark && !self._preventCursorRestore) {
              editor.selection.moveToBookmark(lastBookmark);
            }
          });
        },

        // 设置回调
        setup(editor) {
          // 添加自定义图片上传按钮
          editor.ui.registry.addButton('customimageupload', {
            icon: 'image',
            tooltip: '上传图片',
            onAction: function() {
              self.showImageUploader = true;
            }
          });
          
          editor.on('FullscreenStateChanged', e => {
            self.fullscreen = e.state
          })

          // 添加拖放事件处理
          editor.on('dragover', function(e) {
            e.preventDefault();
          });

          // 监听上传完成事件
          editor.on('UploadComplete', function() {
            console.log('上传完成事件触发，清理指示器');

            setTimeout(() => {
              // 查找并移除所有上传指示器
              const editorBody = editor.getBody();
              const indicators = editorBody.querySelectorAll(
                '.mce-progress, .tox-progress-indicator, [data-mce-bogus="all"], .tox-progress, .mce-loader'
              );

              indicators.forEach(indicator => {
                if (indicator && indicator.parentNode) {
                  indicator.parentNode.removeChild(indicator);
                }
              });

              // 强制刷新编辑器视图
              editor.focus();
              editor.nodeChanged();
            }, 200);
          });
        }
      })
    },

    destroyTinymce() {
      if (window.tinymce?.get(this.tinymceId)) {
        window.tinymce.get(this.tinymceId).destroy()
      }
    },

    // 获取编辑器内容
    getContent() {
      if (!window.tinymce?.get(this.tinymceId)) return ''
      return window.tinymce.get(this.tinymceId).getContent()
    },

    // 设置编辑器内容
    setContent(html) {
      if (!window.tinymce?.get(this.tinymceId)) return
      window.tinymce.get(this.tinymceId).setContent(html || '')
    },

    // 清空编辑器内容
    clear() {
      this.setContent('')
    },
    
    // 处理图片上传变更
    handleImagesChange(urls) {
      console.log('图片上传变更:', urls);
    },
    
    // 插入已上传的图片到编辑器
    insertUploadedImages() {
      if (this.uploadedImages.length === 0) {
        // 可以在这里添加提示，比如"请上传图片"
        return;
      }
      
      this.imageSuccess(this.uploadedImages);
      this.showImageUploader = false;
      this.uploadedImages = []; // 清空已上传的图片列表
    },

    // 图片上传成功后填充到富文本编辑器
    imageSuccess(urlList) {
      try {
        if (!window.tinymce?.get(this.tinymceId)) return

        let imageTemplateList = ''
        urlList.forEach(item => {
          const image = `<img style="max-width:100%;" src="${item}">`
          imageTemplateList = imageTemplateList + image
        })

        window.tinymce.get(this.tinymceId).insertContent(imageTemplateList)
        this.$message?.({
          message: '上传成功！',
          type: 'success'
        })
      } catch (error) {
        console.log(error)
        this.$message?.({
          message: error,
          type: 'error'
        })
      }
    }
  }
}
</script>

<style scoped>
.tinymce-container {
  position: relative;
  width: 100%;
  max-width: 1200px; /* 设置最大宽度，可以根据需要调整 */
  margin: 0 auto; /* 如果需要居中显示 */
}

.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}

/* 全屏状态 */
.tinymce-container :deep(.mce-fullscreen) {
  z-index: 10000;
}

/* 隐藏底部logo栏 */
.tinymce-container :deep(.mce-edit-area + .mce-statusbar) {
  opacity: 0;
  height: 0;
}

/* 编辑器内部样式调整 */
.tinymce-container :deep(p) {
  margin: 0;
}

/* 确保编辑器内容区域填满容器 */
.tinymce-container :deep(.mce-edit-area) {
  width: 100%;
}

/* 对话框底部样式 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
