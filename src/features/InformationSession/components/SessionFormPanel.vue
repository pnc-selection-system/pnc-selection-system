<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'

const today = computed(() => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
})
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { fetchPartners } from '@/features/ngosPartner/service/service'
import { useSessionFormValidation } from '../composables/useSessionFormValidation'
import SessionLocationFields from './SessionLocationFields.vue'
import SessionAttendanceFields from './SessionAttendanceFields.vue'
import SessionPartnerTypeSelector from './SessionPartnerTypeSelector.vue'
import SessionHostList from './SessionHostList.vue'
import SessionCreatedByList from './SessionCreatedByList.vue'
import SessionAlumniFields from './SessionAlumniFields.vue'
import SessionOfficerFields from './SessionOfficerFields.vue'
import type { SessionFormData } from '../types/session'
import type { SessionFilterOptions } from '../types/filter'
import type { NgoPartner } from '@/features/ngosPartner/types/partner'

const props = defineProps<{
  modelValue: SessionFormData
  options: SessionFilterOptions
  campaigns?: { id: number; name: string; year: number }[]
  isSaving?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: SessionFormData]
  save: []
  cancel: []
}>()

const {
  markTouched,
  markAllTouched,
  isFormValid,
  errorCount,
  wasSubmitted,
  fieldError,
  hasError,
  inputClasses,
} = useSessionFormValidation(() => props.modelValue)

const partners = ref<NgoPartner[]>([])
const partnersLoading = ref(false)

const currentCampaign = computed(() =>
  (props.campaigns || []).find(c => c.id === props.modelValue.campaign_id)
)

onMounted(async () => {
  partnersLoading.value = true
  try {
    partners.value = await fetchPartners()
  } catch (e) {
    console.error('Failed to load NGO partners:', e)
  } finally {
    partnersLoading.value = false
  }
})

function update<K extends keyof SessionFormData>(key: K, value: SessionFormData[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

function onPartnerTypeChange(type: SessionFormData['partnerType']) {
  const reset: Partial<SessionFormData> = {
    partnerType: type,
    partnerName: '',
    location: '',
    hosts: type === 'Officer' ? [] : [{ name: '' }],
    createdBy: [],
    createByInput: '',
  }
  if (type === 'School' || type === 'NGO' || type === 'Officer') reset.school = ''
  emit('update:modelValue', { ...props.modelValue, ...reset })
}

function removeCreateBy(index: number) {
  const createdBy = props.modelValue.createdBy.filter((_, i) => i !== index)
  emit('update:modelValue', { ...props.modelValue, createdBy })
}

function addHost() {
  const hosts = [...props.modelValue.hosts, { name: '' }]
  emit('update:modelValue', { ...props.modelValue, hosts })
}

function removeHost(index: number) {
  const hosts = props.modelValue.hosts.filter((_, i) => i !== index)
  emit('update:modelValue', { ...props.modelValue, hosts })
}

function updateHost(index: number, name: string) {
  const hosts = props.modelValue.hosts.map((h, i) => i === index ? { ...h, name } : h)
  emit('update:modelValue', { ...props.modelValue, hosts })
}

function addOfficerName() {
  const name = props.modelValue.partnerName?.trim()
  if (!name) return
  const hosts = [...props.modelValue.hosts, { name }]
  emit('update:modelValue', { ...props.modelValue, hosts, partnerName: '' })
}

function onSave() {
  wasSubmitted.value = true
  markAllTouched()
  if (isFormValid.value) emit('save')
}
</script>

<template>
  <div class="space-y-4">
    <!-- Campaign (read-only) -->
    <div class="space-y-1.5">
      <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">CAMPAIGN</label>
      <div class="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
        {{ currentCampaign ? `${currentCampaign.name} (${currentCampaign.year})` : 'No active campaign' }}
      </div>
    </div>

    <div class="space-y-1.5">
      <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">DATE *</label>
      <input type="date" :value="modelValue.date" :class="inputClasses('date')"
        :min="today" @change="update('date', ($event.target as HTMLInputElement).value)"
        @blur="markTouched('date')" />
      <p v-if="hasError('date')" class="mt-1 text-xs text-red-500">{{ fieldError('date') }}</p>
    </div>

    <SessionLocationFields
      :province-id="modelValue.province_id" :district-id="modelValue.district_id" :provinces="options.provinces"
      @update:province-id="(v) => { markTouched('province_id'); update('province_id', v) }"
      @update:district-id="(v) => { markTouched('district_id'); update('district_id', v) }"
    />

    <div class="space-y-1.5">
      <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">VENUE</label>
      <input type="text" :value="modelValue.venue" :class="inputClasses('venue')"
        @input="update('venue', ($event.target as HTMLInputElement).value)" @blur="markTouched('venue')"
        placeholder="Enter venue name" />
      <p v-if="hasError('venue')" class="mt-1 text-xs text-red-500">{{ fieldError('venue') }}</p>
    </div>

    <SessionAttendanceFields
      :attendance-count="modelValue.attendanceCount" :expected-attendance="modelValue.expectedAttendance"
      :input-classes="inputClasses" :field-error="fieldError" :has-error="hasError" :mark-touched="markTouched"
      @update:attendance-count="(v) => update('attendanceCount', v)"
      @update:expected-attendance="(v) => update('expectedAttendance', v)"
    />

    <SessionPartnerTypeSelector :model-value="modelValue.partnerType" :has-error="hasError"
      :field-error="fieldError" @change="onPartnerTypeChange" />

    <template v-if="modelValue.partnerType === 'School'">
      <div class="space-y-1.5">
        <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">SCHOOL NAME *</label>
        <input type="text" :value="modelValue.partnerName" :class="inputClasses('partnerName')"
          placeholder="Enter school partner name" @input="update('partnerName', ($event.target as HTMLInputElement).value)"
          @blur="markTouched('partnerName')" />
        <p v-if="hasError('partnerName')" class="mt-1 text-xs text-red-500">{{ fieldError('partnerName') }}</p>
      </div>
      <SessionCreatedByList :items="modelValue.createdBy" :input-value="modelValue.createByInput"
        @remove="removeCreateBy" @update:input-value="(v) => update('createByInput', v)" />
      <SessionHostList :hosts="modelValue.hosts" label="HOST BY" placeholder="Host by" add-button-text="Host by"
        @add="addHost" @remove="removeHost" @update="updateHost" />
    </template>

    <SessionAlumniFields v-if="modelValue.partnerType === 'Alumni'"
      :partner-name="modelValue.partnerName" :school="modelValue.school" :generation="modelValue.generation"
      :location="modelValue.location" :input-classes="inputClasses" :field-error="fieldError"
      :has-error="hasError" :mark-touched="markTouched"
      @update:partner-name="(v) => update('partnerName', v)" @update:school="(v) => update('school', v)"
      @update:generation="(v) => update('generation', v)" @update:location="(v) => update('location', v)" />

    <template v-if="modelValue.partnerType === 'NGO'">
      <div class="space-y-1.5">
        <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">SELECT NGO *</label>
        <div :class="hasError('partnerName') ? 'base-select-error' : ''">
          <BaseSelect :model-value="modelValue.partnerName"
            :options="partners.map(p => ({ value: p.name, label: p.name }))" placeholder="Select an NGO partner"
            :disabled="partnersLoading"
            @update:model-value="(v: string | number) => { markTouched('partnerName'); update('partnerName', String(v)) }" />
        </div>
        <p v-if="hasError('partnerName')" class="mt-1 text-xs text-red-500">{{ fieldError('partnerName') }}</p>
      </div>
      <SessionCreatedByList :items="modelValue.createdBy" :input-value="modelValue.createByInput"
        @remove="removeCreateBy" @update:input-value="(v) => update('createByInput', v)" />
      <SessionHostList :hosts="modelValue.hosts" label="HOST BY" placeholder="Host by" add-button-text="Add host"
        @add="addHost" @remove="removeHost" @update="updateHost" />
    </template>

    <SessionOfficerFields v-if="modelValue.partnerType === 'Officer'"
      :partner-name="modelValue.partnerName" :department="modelValue.department" :hosts="modelValue.hosts"
      :input-classes="inputClasses" :field-error="fieldError" :has-error="hasError" :mark-touched="markTouched"
      @update:partner-name="(v) => update('partnerName', v)" @update:department="(v) => update('department', v)"
      @add-officer-name="addOfficerName" @remove-host="removeHost" />

    <transition name="fade">
      <div v-if="wasSubmitted && !isFormValid" class="rounded border border-red-200 bg-red-50 px-3 py-2">
        <p class="text-xs font-medium text-red-700">
          Please fix {{ errorCount }} error{{ errorCount !== 1 ? 's' : '' }} before saving.
        </p>
      </div>
    </transition>

    <div class="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 mt-4">
      <BaseButton variant="secondary" :disabled="isSaving" @click="emit('cancel')">Cancel</BaseButton>
      <BaseButton :disabled="isSaving" :loading="isSaving" @click="onSave">
        {{ isSaving ? 'Saving...' : 'Save session' }}
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

.base-select-error :deep(.el-select .el-select__wrapper) {
  --el-select-border-color-hover: #f87171;
  border-color: #f87171 !important;
  box-shadow: 0 0 0 1px #f87171 !important;
}
.base-select-error :deep(.el-select .el-select__wrapper.is-focused) {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 1px #ef4444 !important;
}
</style>
