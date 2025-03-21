<!-- src/components/public/ImageViewer.vue -->
<template>
  <div v-if="show" class="image-viewer-overlay" @click.self="closeViewer">
    <div class="image-viewer-content">
      <button class="nav-button prev" @click="prevImage" v-show="images.length > 1">&lt;</button>
      <img
        :src="images[currentIndex]"
        :alt="'Image ' + (currentIndex + 1)"
        class="viewer-image"
      />
      <button class="nav-button next" @click="nextImage" v-show="images.length > 1">&gt;</button>
      <button class="close-button" @click="closeViewer">×</button>
      <div class="image-counter" v-if="images.length > 1">
        {{ currentIndex + 1 }} / {{ images.length }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, onMounted, onUnmounted } from 'vue'

interface Props {
  show: boolean
  images: string[]
  currentIndex: number
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  images: () => [],
  currentIndex: 0
})

const emit = defineEmits(['update:show', 'update:currentIndex'])

const closeViewer = () => {
  emit('update:show', false)
  document.body.style.overflow = '' // 恢复背景滚动
}

const nextImage = () => {
  emit('update:currentIndex', (props.currentIndex + 1) % props.images.length)
}

const prevImage = () => {
  emit('update:currentIndex',
    (props.currentIndex - 1 + props.images.length) % props.images.length
  )
}

// 键盘事件处理
const handleKeydown = (e: KeyboardEvent) => {
  if (!props.show) return

  switch (e.key) {
    case 'Escape':
      closeViewer()
      break
    case 'ArrowLeft':
      prevImage()
      break
    case 'ArrowRight':
      nextImage()
      break
  }
}

// 监听show属性变化来添加/移除滚动锁定
watch(() => props.show, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden' // 禁止背景滚动
  } else {
    document.body.style.overflow = '' // 恢复背景滚动
  }
})

// 组件挂载时添加键盘事件监听
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

// 组件卸载时移除键盘事件监听
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = '' // 确保组件卸载时恢复滚动
})
</script>

<style scoped>
.image-viewer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.image-viewer-content {
  position: relative;
  max-width: 90%;
  max-height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.viewer-image {
  max-width: 90%;
  max-height: 90vh;
  object-fit: contain;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.3);
  border: none;
  color: white;
  padding: 15px;
  cursor: pointer;
  font-size: 24px;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.nav-button:hover {
  background: rgba(255, 255, 255, 0.5);
}

.nav-button.prev {
  left: -60px;
}

.nav-button.next {
  right: -60px;
}

.close-button {
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 30px;
  cursor: pointer;
  padding: 5px;
}

.close-button:hover {
  color: #ddd;
}

.image-counter {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 16px;
}

</style>
