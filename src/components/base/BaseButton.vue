<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary' | 'danger' | 'outline'
    size?: 'small' | 'default' | 'large'
    disabled?: boolean
    loading?: boolean
    equalWidth?: boolean
    draggable?: boolean
  }>(),
  {
    type: 'button',
    variant: 'primary',
    size: 'default',
    disabled: false,
    loading: false,
    equalWidth: false,
    draggable: false,
  },
)

const elType = computed(() => {
  if (props.variant === 'secondary' || props.variant === 'outline') return 'default'
  if (props.variant === 'danger') return 'danger'
  return 'primary'
})

const isPlain = computed(() => props.variant === 'outline')

defineEmits<{
  click: [event: MouseEvent]
}>()

defineOptions({ inheritAttrs: false })
</script>

<template>
  <el-button
    v-if="!equalWidth"
    :class="$attrs.class"
    :style="$attrs.style"
    :type="elType"
    :plain="isPlain"
    :size="size"
    :disabled="disabled"
    :loading="loading"
    :native-type="type"
    :draggable="draggable"
    @click="(e: MouseEvent) => $emit('click', e)"
  >
    <slot />
  </el-button>
  <button
    v-else
    :class="[$attrs.class, 'equal-width-btn']"
    :style="{ width: '100%', minWidth: '0', maxWidth: '100%', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', padding: '8px 12px', boxSizing: 'border-box' }"
    :type="type"
    :disabled="disabled"
    :draggable="draggable"
    @click="(e: MouseEvent) => $emit('click', e)"
  >
    <slot />
  </button>
</template>

<style scoped>
.equal-width-btn {
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
}
</style>
