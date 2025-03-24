<!-- RichTextEditor.vue - 完整单文件版 -->
<template>
  <div class="tinymce-container editor-container" :class="{fullscreen: fullscreen}">
    <textarea :id="tinymceId" class="tinymce-textarea" />
  </div>
</template>

<script>
// 注意：不要在这里使用 src 属性，而是在 index.html 或其他入口文件中引入 tinymce
export default {
  name: 'RichTextEditor',
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
      default: 300
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
      // 默认插件配置
      plugins: [
        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
        'preview', 'anchor', 'searchreplace', 'visualblocks', 'code',
        'fullscreen', 'insertdatetime', 'media', 'table', 'code',
        'help', 'wordcount', 'emoticons', 'autoresize', 'powerpaste',
        'print', 'template', 'codesample', 'hr', 'pagebreak',
        'nonbreaking', 'anchor', 'textpattern', 'autosave'
      ],
      // 默认工具栏配置
      toolbar: [
        'code undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor',
        'alignleft aligncenter alignright alignjustify outdent indent | styleselect formatselect fontselect fontsizeselect',
        'bullist numlist | blockquote subscript superscript removeformat | table image media charmap emoticons hr pagebreak insertdatetime',
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
        min_height: 150,
        language: 'zh_CN', // 使用中文语言包
        plugins: this.plugins,
        toolbar: this.customToolbar.length > 0 ? this.customToolbar : this.toolbar,
        menubar: this.menubar,
        fontsize_formats: '12px 14px 16px 18px 20px 24px 36px',
        placeholder: this.placeholder,
        object_resizing: true,
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        default_link_target: '_blank',
        link_title: false,
        // 禁用图片上传功能，可根据需要开启
        images_upload_handler: null,
        // 禁止拖放上传
        paste_data_images: false,
        // 禁用自动调整大小
        resize: false,
        // 初始化回调
        init_instance_callback: editor => {
          if (self.value) {
            editor.setContent(self.value)
          }
          self.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
            self.hasChange = true
            const content = editor.getContent()
            self.$emit('update:value', content)
            self.$emit('change', content)
            self.editorContent = content
          })
        },
        // 设置回调
        setup(editor) {
          editor.on('FullscreenStateChanged', e => {
            self.fullscreen = e.state
          })
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
</style>
