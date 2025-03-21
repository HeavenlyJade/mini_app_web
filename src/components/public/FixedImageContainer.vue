<template>
  <div class="fixed-image-container" :class="containerClass">
    <img :src="imageSrc" :alt="imageAlt" class="top-image" />
    <div
      class="image-overlay"
      :class="overlayClass"
      :style="{ ...defaultOverlayStyle, ...overlayStyle }"
    >
      <slot name="overlay">
        {{ overlayText }}
      </slot>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  imageSrc: string
  overlayText?: string
  imageAlt?: string
  overlayStyle?: Record<string, any>
  overlayClass?: string | object | Array<string>
  containerClass?: string | object | Array<string>
  containerHeight?: string
  fontSize?: string
  fontWeight?: string | number
  textShadow?: string
}

const props = withDefaults(defineProps<Props>(), {
  overlayText: '',
  imageAlt: 'Background Image',
  overlayStyle: () => ({}),
  overlayClass: '',
  containerClass: '',
  containerHeight: '40vh',
  fontSize: '20px',
  fontWeight: 'bold',
  textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)'
})

const defaultOverlayStyle = computed(() => ({
  fontSize: props.fontSize,
  fontWeight: props.fontWeight,
  textShadow: props.textShadow
}))
</script>

<style scoped>
.fixed-image-container {
  position: relative;
  width: 100%;
  height: 40vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 500;
}

.top-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 20px;
  font-weight: bold;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
  text-align: center;
  padding: 0 10px;
}
</style>
