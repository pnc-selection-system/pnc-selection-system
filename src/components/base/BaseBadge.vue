<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'success' | 'warning' | 'info' | 'danger' | 'primary'
    size?: 'large' | 'default' | 'small'
    dot?: boolean
    closable?: boolean
    hit?: boolean
    disableTransitions?: boolean
  }>(),
  {
    type: 'info',
    size: 'small',
    dot: false,
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
    effect="plain"
    class="inline-flex items-center gap-1.5 rounded"
    @close="emit('close')"
  >
    <span
      v-if="dot"
      class="inline-block h-2 w-2 rounded-full flex-shrink-0"
      :class="{
        'bg-emerald-500': type === 'success',
        'bg-amber-500': type === 'warning',
        'bg-slate-400': type === 'info',
        'bg-red-500': type === 'danger',
        'bg-blue-500': !type || type === 'primary',
      }"
    />
    <slot />
  </el-tag>
</template>
