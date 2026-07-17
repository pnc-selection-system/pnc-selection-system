<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    description?: string
    imageSize?: number
  }>(),
  {
    description: 'There are no items to display.',
    imageSize: 200,
  },
)
</script>

<template>
  <div class="flex flex-col items-center justify-center px-6 py-12">
    <h3 v-if="title" class="mb-4 text-base font-semibold text-slate-700">{{ title }}</h3>
    <el-empty :description="description" :image-size="imageSize">
      <slot />
    </el-empty>
  </div>
</template>
