import { defineStore } from 'pinia'
import { fetchActiveForm, saveForm as saveFormRequest } from '../service/service'
import type { AssessmentForm } from '../types/question'

interface State {
  activeForm: AssessmentForm | null
  loaded: boolean
}

export const useAssessmentFormStore = defineStore('assessmentForm', {
  state: (): State => ({
    activeForm: null,
    loaded: false,
  }),

  actions: {
    async load() {
      if (this.loaded) return
      this.activeForm = await fetchActiveForm()
      this.loaded = true
    },

    async save(form: AssessmentForm) {
      this.activeForm = await saveFormRequest(form)
      this.loaded = false  // force re-fetch on next load
    },
  },
})