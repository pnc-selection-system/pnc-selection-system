<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      <!-- Header -->
      <div class="border-b border-gray-200 px-6 py-4">
        <h2 class="text-xl font-bold text-gray-900">{{ editUser ? 'Edit User' : 'Add New User' }}</h2>
      </div>

      <!-- Content -->
      <form @submit.prevent="submitForm" class="px-6 py-4 space-y-4">
        <!-- Name Field -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input v-model="formData.name" type="text" placeholder="Enter full name"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required />
          <span v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</span>
        </div>

        <!-- Email Field -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input v-model="formData.email" type="email" placeholder="user@pnc.org"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required />
          <span v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</span>
        </div>

        <!-- Role Field -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select v-model="formData.role"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required>
            <option value="">Select a role</option>
            <option value="Selection Manager">Selection Manager</option>
            <option value="Selection Officer">Selection Officer</option>
            <option value="Investigator">Investigator</option>
            <option value="Committee">Committee</option>
            <option value="Officer">Officer</option>
          </select>
          <span v-if="errors.role" class="text-red-500 text-xs mt-1">{{ errors.role }}</span>
        </div>

        <!-- Status Field -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select v-model="formData.status"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required>
            <option value="Active">Active</option>
            <option value="Invited">Invited</option>
            <option value="Deactivated">Deactivated</option>
          </select>
          <span v-if="errors.status" class="text-red-500 text-xs mt-1">{{ errors.status }}</span>
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="p-3 bg-green-100 text-green-800 rounded-lg text-sm">
          {{ successMessage }}
        </div>
      </form>

      <!-- Footer -->
      <div class="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
        <button @click="closeDialog"
          class="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition font-medium">
          Cancel
        </button>
        <button @click="submitForm" :disabled="isSubmitting"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition font-medium">
          {{ isSubmitting ? (editUser ? 'Saving...' : 'Adding...') : (editUser ? 'Save Changes' : 'Add User') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface FormData {
  name: string
  email: string
  role: string
  status: string
}

interface Errors {
  name?: string
  email?: string
  role?: string
  status?: string
}

const props = defineProps<{
  isOpen: boolean
  editUser?: FormData & { id?: string } | null
}>()

const emit = defineEmits<{
  close: []
  submit: [user: FormData & { id?: string }]
}>()

const formData = ref<FormData>({
  name: '',
  email: '',
  role: '',
  status: 'Active',
})

watch(
  () => props.editUser,
  (user) => {
    if (user) {
      formData.value = { name: user.name, email: user.email, role: user.role, status: user.status }
    } else {
      resetForm()
    }
  },
)

const errors = ref<Errors>({})
const isSubmitting = ref(false)
const successMessage = ref('')

const validateForm = (): boolean => {
  errors.value = {}

  if (!formData.value.name.trim()) {
    errors.value.name = 'Full name is required'
  }

  if (!formData.value.email.trim()) {
    errors.value.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = 'Please enter a valid email'
  }

  if (!formData.value.role) {
    errors.value.role = 'Role is required'
  }

  if (!formData.value.status) {
    errors.value.status = 'Status is required'
  }

  return Object.keys(errors.value).length === 0
}

const submitForm = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true
  successMessage.value = ''

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    successMessage.value = `User ${formData.value.name} ${props.editUser ? 'updated' : 'added'} successfully!`

    // Emit the submit event
    emit('submit', { ...formData.value, id: props.editUser?.id })

    // Reset form after a short delay
    setTimeout(() => {
      resetForm()
      closeDialog()
    }, 1000)
  } catch (error) {
    console.error('Error adding user:', error)
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  formData.value = {
    name: '',
    email: '',
    role: '',
    status: 'Active',
  }
  errors.value = {}
  successMessage.value = ''
}

const closeDialog = () => {
  resetForm()
  emit('close')
}
</script>
