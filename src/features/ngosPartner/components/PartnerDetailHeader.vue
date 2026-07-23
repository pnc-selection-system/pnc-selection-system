<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { NgoPartner } from '../types/partner'
import BaseBadge from '../../../components/base/BaseBadge.vue'
import { getLogo, saveLogo, fileToBase64 } from '../composables/usePartnerLogos'

const props = defineProps<{ partner: NgoPartner }>()

const fileInput = ref<HTMLInputElement | null>(null)
const localLogo = ref<string | null>(getLogo(props.partner.id))

// Refresh logo whenever the selected partner changes
watch(() => props.partner.id, (id) => {
  localLogo.value = getLogo(id)
})

const logoSrc = computed(() => localLogo.value ?? props.partner.logo ?? null)

async function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const base64 = await fileToBase64(file)
  // saveLogo already evicts this image from any other partner
  saveLogo(props.partner.id, base64)
  localLogo.value = base64
  ;(e.target as HTMLInputElement).value = ''
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}
</script>

<template>
  <div class="px-5 py-4 border-b border-slate-100">
    <div class="flex items-center justify-between gap-3">

      <!-- Left: logo + name -->
      <div class="flex items-center gap-3 min-w-0">

        <!-- Clickable logo -->
        <button
          type="button"
          class="group relative h-11 w-11 shrink-0 rounded-xl overflow-hidden ring-1 ring-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-shadow hover:ring-slate-300 hover:shadow-sm"
          title="Change logo"
          @click="fileInput?.click()"
        >
          <img v-if="logoSrc" :src="logoSrc" class="h-full w-full object-cover" alt="Partner logo" />
          <span
            v-else
            class="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-[13px] font-semibold text-slate-500 select-none"
          >
            {{ initials(partner.name) }}
          </span>

          <!-- Hover overlay -->
          <span class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
            <svg class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
            </svg>
          </span>
        </button>

        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />

        <!-- Name + type -->
        <div class="min-w-0">
          <h1 class="truncate text-[15px] font-semibold text-slate-800 leading-tight">
            {{ partner.name }}
          </h1>
          <p v-if="partner.type" class="truncate text-[12px] text-slate-400 leading-tight mt-0.5">
            {{ partner.type }}
          </p>
        </div>
      </div>

      <!-- Status badge -->
      <BaseBadge
        :type="partner.status === 'Active' ? 'success' : 'info'"
        class="shrink-0 !rounded-lg !px-2 !py-0.5 !h-auto !text-[11px]"
        :class="partner.status === 'Active' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : ''"
      >
        {{ partner.status }}
      </BaseBadge>
    </div>

    <!-- Meta row -->
    <div class="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-slate-500">
      <span v-if="partner.email" class="flex items-center gap-1">
        <svg class="h-3.5 w-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>
        {{ partner.email }}
      </span>
      <span v-if="partner.phone" class="flex items-center gap-1">
        <svg class="h-3.5 w-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
        </svg>
        {{ partner.phone }}
      </span>
      <span v-if="partner.address" class="flex items-center gap-1">
        <svg class="h-3.5 w-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
        {{ partner.address }}
      </span>
    </div>
  </div>
</template>
