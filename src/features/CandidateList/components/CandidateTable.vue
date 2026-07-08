<template>
  <div class="bg-white rounded-lg shadow overflow-x-auto">
    <div v-if="loading" class="flex justify-center items-center py-16 text-gray-400">
      Loading...
    </div>
    <div v-else-if="!candidates.length" class="flex justify-center items-center py-16 text-gray-400">
      No candidates found.
    </div>
    <table v-else class="w-full text-sm">
      <thead class="bg-gray-50 border-b border-gray-200">
        <tr>
          <th class="text-left py-4 px-6 font-semibold text-gray-700 uppercase text-xs">ID</th>
          <th class="text-left py-4 px-6 font-semibold text-gray-700 uppercase text-xs">Name</th>
          <th class="text-left py-4 px-6 font-semibold text-gray-700 uppercase text-xs">Province</th>
          <th class="text-left py-4 px-6 font-semibold text-gray-700 uppercase text-xs">NGO</th>
          <th class="text-left py-4 px-6 font-semibold text-gray-700 uppercase text-xs">Exam</th>
          <th class="text-left py-4 px-6 font-semibold text-gray-700 uppercase text-xs">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="candidate in candidates" :key="candidate.id" class="border-b border-gray-200 hover:bg-gray-50 transition">
          <td class="py-4 px-6 text-gray-600">{{ candidate.candidate_no }}</td>
          <td class="py-4 px-6 font-medium text-gray-900">{{ candidate.name }}</td>
          <td class="py-4 px-6 text-gray-600">{{ candidate.province }}</td>
          <td class="py-4 px-6 text-gray-600">{{ candidate.ngo }}</td>
          <td class="py-4 px-6">
            <span v-if="candidate.exam_result === 'Pass'" class="inline-block px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
              Pass {{ candidate.exam_score }}
            </span>
            <span v-else-if="candidate.exam_result === 'Fail'" class="inline-block px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
              Fail {{ candidate.exam_score }}
            </span>
            <span v-else class="text-gray-400">—</span>
          </td>
          <td class="py-4 px-6">
            <StatusBadge :status="candidate.status" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { Candidate } from '../types/candidate'
import StatusBadge from './StatusBadge.vue'

defineProps<{ candidates: Candidate[]; loading: boolean }>()
</script>
