<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'success' | 'warning' | 'info' | 'danger' | 'primary'
    size?: 'large' | 'default' | 'small'
    closable?: boolean
    hit?: boolean
    disableTransitions?: boolean
  }>(),
  {
    type: 'info',
    size: 'small',
    closable: false,
    hit: false,
    disableTransitions: false,
  },
)

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <el-tag
    :type="type || undefined"
    :size="size"
    :closable="closable"
    :hit="hit"
    :disable-transitions="disableTransitions"
    effect="light"
    class="inline-flex items-center gap-1.5"
    style="border-radius: 4px"
    @close="emit('close')"
  >
    <slot />
  </el-tag>
</template>
