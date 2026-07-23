<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import type { SelectOption } from '@/components/base/BaseSelect.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseIcon from '@/components/base/BaseIcon.vue'
import type { SessionFilterOptions, SessionFilters } from '../types/filter'

const props = defineProps<{
  modelValue: SessionFilters
  options: SessionFilterOptions
}>()

const emit = defineEmits<{
  'update:modelValue': [value: SessionFilters]
  new: []
}>()

function update<K extends keyof SessionFilters>(key: K, value: SessionFilters[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

const provinceOptions = computed((): SelectOption[] => [
  { value: '', label: 'Province: All' },
  ...props.options.provinces.map(p => ({ value: p.name, label: p.name })),
])

// --- Date range dropdown (campaign years only) ---
const dateOpen = ref(false)
const datePanel = ref<HTMLDivElement | null>(null)

// Map campaign dates into formatted display items
const campaignItems = computed(() =>
  props.options.campaignDates.map(c => ({
    year: String(c.year),
    label: c.start_date && c.end_date
      ? `${formatDateStr(c.start_date)} - ${formatDateStr(c.end_date)}, ${c.year}`
      : String(c.year),
  }))
)

function selectYear(year: string) {
  if (props.modelValue.campaignYear === year) {
    // Deselect — clear everything
    update('campaignYear', '')
    update('startDate', '')
    update('endDate', '')
  } else {
    // Find campaign dates for this year and apply instantly
    const campaign = props.options.campaignDates.find(c => String(c.year) === year)
    update('campaignYear', year)
    update('startDate', campaign?.start_date ?? '')
    update('endDate', campaign?.end_date ?? '')
  }
  dateOpen.value = false
}

function clearDateRange() {
  update('campaignYear', '')
  update('startDate', '')
  update('endDate', '')
  dateOpen.value = false
}

// Click-away to close
function onDocumentClick(e: MouseEvent) {
  if (datePanel.value && !datePanel.value.contains(e.target as Node)) {
    dateOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', onDocumentClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocumentClick))

const hasDateFilter = computed(() =>
  props.modelValue.startDate || props.modelValue.endDate || props.modelValue.campaignYear
)

function formatDateStr(dateStr: string, showYear = false): string {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-').map(Number)
  // Use local-timezone date constructor (month is 0-indexed)
  const dt = new Date(y, m - 1, d)
  const day = String(dt.getDate()).padStart(2, '0')
  const month = dt.toLocaleDateString('en-GB', { month: 'short' })
  return showYear ? `${day} ${month}, ${y}` : `${day} ${month}`
}

function formatRange(startDate: string, endDate: string, campaignYear: string): string {
  if (startDate && endDate) {
    // Use campaign year when available (dates might differ from campaign year)
    if (campaignYear) {
      return `${formatDateStr(startDate)} - ${formatDateStr(endDate)}, ${campaignYear}`
    }
    const sameYear = startDate.split('-')[0] === endDate.split('-')[0]
    return sameYear
      ? `${formatDateStr(startDate)} - ${formatDateStr(endDate, true)}`
      : `${formatDateStr(startDate, true)} - ${formatDateStr(endDate, true)}`
  }
  if (campaignYear) return `Year: ${campaignYear}`
  if (startDate) return `From ${formatDateStr(startDate, true)}`
  if (endDate) return `To ${formatDateStr(endDate, true)}`
  return 'Date range'
}

const dateLabel = computed(() => formatRange(
  props.modelValue.startDate,
  props.modelValue.endDate,
  props.modelValue.campaignYear,
))
</script>

<template>
  <div class="flex items-center justify-between gap-3">
    <div class="flex flex-wrap items-center gap-2">
      <div class="w-44">
        <BaseSelect
          :model-value="modelValue.province"
          :options="provinceOptions"
          placeholder="Province"
          clearable
           @update:model-value="(v) => update('province', v as string)"
        />
      </div>

      <!-- Custom Date Range Dropdown -->
      <div ref="datePanel" class="relative">
        <!-- Trigger button styled like BaseSelect -->
        <button
          type="button"
          class="flex w-[200px] items-center gap-2 rounded border bg-white px-3 py-[7.5px] text-sm outline-none transition-all"
          :class="[
            hasDateFilter
              ? 'border-blue-400 text-blue-700'
              : 'border-slate-300 text-slate-500 hover:border-slate-400'
          ]"
          @click="dateOpen = !dateOpen"
        >
          <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span class="flex-1 text-left truncate">{{ dateLabel }}</span>
          <svg class="h-3 w-3 shrink-0 text-slate-400 transition-transform" :class="{ 'rotate-180': dateOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Dropdown Panel (campaign years only) -->
        <Transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="scale-95 opacity-0"
          leave-active-class="transition duration-100 ease-in"
          leave-to-class="scale-95 opacity-0"
        >
          <div
            v-if="dateOpen"
            class="absolute left-0 top-full z-50 mt-1 w-[270px] origin-top-left rounded-lg border border-slate-200 bg-white p-4 shadow-xl"
          >
            <div class="space-y-2">
              <div class="flex flex-col gap-1.5">
                <button
                  v-for="item in campaignItems"
                  :key="item.year"
                  type="button"
                  class="w-full rounded-md border px-3 py-2 text-left text-xs font-medium transition-all"
                  :class="
                    props.modelValue.campaignYear === item.year
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  "
                  @click="selectYear(item.year)"
                >
                  {{ item.label }}
                </button>
              </div>

              <!-- Clear button -->
              <button
                v-if="props.modelValue.campaignYear"
                type="button"
                class="mt-2 w-full rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                @click="clearDateRange"
              >
                Clear selection
              </button>
            </div>
          </div>
        </Transition>
      </div>

      <div class="w-44">
        <BaseSelect
          :model-value="modelValue.partnerType ?? ''"
          :options="[{ value: '', label: 'Partner: All' }, ...options.partnerTypes.map(p => ({ value: p, label: p }))]"
          placeholder="Partner Type"
          clearable
           @update:model-value="(v) => update('partnerType', v as string)"
        />
      </div>

    </div>

    <BaseButton
      variant="primary"
      class="!w-auto !rounded-[4px] !px-4 !py-2 text-sm font-semibold"
      @click="emit('new')"
    >
      <BaseIcon :size="14" :stroke-width="2.5">
        <path d="M12 5v14M5 12h14" />
      </BaseIcon>
      New session
    </BaseButton>
  </div>
</template>
