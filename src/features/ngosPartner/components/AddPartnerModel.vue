<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import BaseModal from '../../../components/base/BaseModal.vue'
import BaseInput from '../../../components/base/BaseInput.vue'
import BaseButton from '../../../components/base/BaseButton.vue'
import { fileToBase64 } from '../composables/usePartnerLogos'
import type { NgoPartnerFormData } from '../types/partner'

const props = defineProps<{
  open: boolean
  apiError?: string | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  submit: [formData: NgoPartnerFormData, logoBase64: string | null]
}>()

const form = reactive({ name: '', type: '', address: '', phone: '', email: '' })
const validationError = ref('')
const logoPreview = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      form.name = ''
      form.type = ''
      form.address = ''
      form.phone = ''
      form.email = ''
      validationError.value = ''
      logoPreview.value = null
    }
  },
)

async function onLogoChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  logoPreview.value = await fileToBase64(file)
  ;(e.target as HTMLInputElement).value = ''
}

function removeLogo() {
  logoPreview.value = null
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?'
}

async function handleSubmit() {
  if (!form.name.trim()) {
    validationError.value = 'Organisation name is required'
    return
  }
  validationError.value = ''
  emit('submit', {
    name: form.name.trim(),
    type: form.type.trim() || undefined,
    address: form.address.trim() || undefined,
    phone: form.phone.trim() || undefined,
    email: form.email.trim() || undefined,
  }, logoPreview.value)
}
</script>

<template>
  <BaseModal :model-value="open" title="" @update:model-value="emit('update:open', $event)">
    <div class="px-6 space-y-5">

      <!-- Header -->
      <div class="mb-6 flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 ring-1 ring-blue-100">
          <svg class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
          </svg>
        </div>
        <div>
          <h3 class="text-[17px] text-slate-800">Add partner</h3>
          <p class="mt-0.5 text-[13px] text-slate-400">Register a new NGO or partner organisation</p>
        </div>
      </div>

      <!-- Server error -->
      <div v-if="apiError" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
        {{ apiError }}
      </div>

      <!-- Form card -->
      <div class="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-5">

        <!-- Logo upload -->
        <div class="flex items-center gap-4">
          <!-- Avatar / preview -->
          <button
            type="button"
            class="group relative h-14 w-14 shrink-0 overflow-hidden rounded-xl ring-1 ring-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 hover:ring-slate-300 hover:shadow-sm transition-shadow"
            title="Upload logo"
            @click="fileInput?.click()"
          >
            <img v-if="logoPreview" :src="logoPreview" class="h-full w-full object-cover" alt="Logo preview" />
            <span
              v-else
              class="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-[14px] font-semibold text-slate-400 select-none"
            >
              {{ form.name ? initials(form.name) : '' }}
              <svg v-if="!form.name" class="h-5 w-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18M3.75 3h16.5M3.75 3A.75.75 0 003 3.75v13.5c0 .414.336.75.75.75h16.5a.75.75 0 00.75-.75V3.75A.75.75 0 0020.25 3H3.75z" />
              </svg>
            </span>
            <!-- Hover overlay -->
            <span class="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
              <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>
            </span>
          </button>

          <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onLogoChange" />

          <div>
            <p class="text-[13px] font-medium text-slate-700">Organisation Logo</p>
            <p class="text-[12px] text-slate-400 mt-0.5">Click the avatar to upload · PNG or JPG</p>
            <button
              v-if="logoPreview"
              type="button"
              class="mt-1.5 text-[12px] text-red-500 hover:text-red-600 hover:underline"
              @click="removeLogo"
            >
              Remove
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <BaseInput v-model="form.name" label="Organisation name" placeholder="e.g. Future Light NGO" required :error="validationError" />
          <BaseInput v-model="form.type" label="Type" placeholder="e.g. Environmental, Education" />
        </div>

        <BaseInput v-model="form.address" label="Address" placeholder="123 Street, City" />

        <div class="grid grid-cols-2 gap-4">
          <BaseInput v-model="form.phone" label="Phone" placeholder="+855 12 345 678" />
          <BaseInput v-model="form.email" label="Email" type="email" placeholder="contact@organisation.org" @keyup.enter="handleSubmit" />
        </div>

        <div class="flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50/60 px-3.5 py-2.5">
          <svg class="mt-0.5 h-4 w-4 shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
          </svg>
          <p class="text-[13px] leading-relaxed text-blue-700">
            Enter the name of the NGO or partner organisation. You can add contact persons after creating the partner.
          </p>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-end gap-3">
        <BaseButton variant="secondary" class="!w-auto !px-5" @click="emit('update:open', false)">Cancel</BaseButton>
        <BaseButton class="!w-auto !px-5" @click="handleSubmit">Add Partner</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>
