<script setup lang="ts">
withDefaults(
  defineProps<{
    breadcrumb?: string
    title: string
    subtitle?: string
  }>(),
  {
    breadcrumb: '',
    subtitle: '',
  },
)
</script>

<template>
  <div>
    <!-- Breadcrumb -->
    <p
      v-if="breadcrumb"
      class="text-[10px] font-semibold uppercase tracking-wider text-slate-400"
    >
      {{ breadcrumb }}
    </p>

    <!-- Title & Actions Row -->
    <div class="mt-1 flex flex-wrap items-center justify-between gap-4">
      <div class="min-w-0 flex-1">
        <h1 class="text-[24px] font-semibold tracking-tight text-slate-900">
          {{ title }}
        </h1>
        <p
          v-if="subtitle"
          class="mt-0.5 text-sm text-slate-500"
        >
          {{ subtitle }}
        </p>
      </div>
      <div v-if="$slots.default" class="flex shrink-0 items-center gap-2">
        <slot />
      </div>
    </div>
  </div>
</template>
