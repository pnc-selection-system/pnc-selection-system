<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-2">Permission matrix</h3>
    <p class="text-sm text-gray-500 mb-4">Capabilities by role tier</p>

    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-300">
            <th class="text-left py-3 px-2 font-semibold text-gray-600 text-xs uppercase">Capability</th>
            <th class="text-center py-3 px-2 font-semibold text-gray-600 text-xs uppercase">ADM</th>
            <th class="text-center py-3 px-2 font-semibold text-gray-600 text-xs uppercase">MGR</th>
            <th class="text-center py-3 px-2 font-semibold text-gray-600 text-xs uppercase">OFF</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="permission in permissions" :key="permission.capability" class="border-b border-gray-200">
            <td class="py-3 px-2 text-gray-900">{{ permission.capability }}</td>
            <td class="text-center py-3 px-2">
              <span v-if="permission.admin" class="text-blue-600 font-bold text-lg">✓</span>
              <span v-else class="text-gray-300">—</span>
            </td>
            <td class="text-center py-3 px-2">
              <span v-if="permission.manager" class="text-green-600 font-bold text-lg">✓</span>
              <span v-else class="text-gray-300">—</span>
            </td>
            <td class="text-center py-3 px-2">
              <span v-if="permission.officer" class="text-purple-600 font-bold text-lg">✓</span>
              <span v-else class="text-gray-300">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Legend -->
    <div class="mt-6 flex gap-4 flex-wrap">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-blue-600"></div>
        <span class="text-xs text-gray-600">Manager</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-green-600"></div>
        <span class="text-xs text-gray-600">Officer tier</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-orange-600"></div>
        <span class="text-xs text-gray-600">Investigator</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-purple-600"></div>
        <span class="text-xs text-gray-600">Committee</span>
      </div>
    </div>

    <div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3">
      <span class="flex-shrink-0 text-2xl">⚠️</span>
      <p class="text-sm text-yellow-800">
        RBAC is enforced server-side on every endpoint, not just hidden in the UI.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Permission } from '../../features/users-roles/types'
defineProps<{
  permissions: Permission[]
}>()
</script>
