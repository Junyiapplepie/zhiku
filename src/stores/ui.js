import { reactive, readonly } from 'vue'

const state = reactive({ toast: '' })
let timer

export function useUiStore() {
  function notify(message) {
    state.toast = message
    clearTimeout(timer)
    timer = setTimeout(() => { state.toast = '' }, 1800)
  }
  return { state: readonly(state), notify }
}
