<template>
  <aside class="sidebar">
    <div class="sidebar-header">{{ header }}</div>
    <ul>
      <li v-for="(item, index) in items" :key="index">{{ item }}</li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  header: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped>
.sidebar {
  width: 200px;
  padding: 15px;
  border-right: 1px solid #ddd;
  height: 100%;
}

.sidebar-header {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  margin: 10px 0;
}
</style>
