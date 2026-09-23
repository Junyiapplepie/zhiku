import { computed, reactive, readonly } from 'vue'
import { initialSessions } from '../mock/demoData.js'
import { requestWorkflow } from '../services/sse.js'

const state = reactive({
  sessions: structuredClone(initialSessions), activeId: null,
  streaming: false, streamDone: false, currentNode: 0,
  question: '', answer: '', thinking: '', chart: null, error: '',
  online: true, knowledge: true,
})
let controller = null

const activeSession = computed(() => state.sessions.find(item => item.id === state.activeId))

export function useChatStore() {
  function newChat() {
    abort(false)
    Object.assign(state, { activeId: null, question: '', answer: '', thinking: '', chart: null, streamDone: false, currentNode: 0, error: '' })
  }

  function openSession(id) {
    abort(false)
    const session = state.sessions.find(item => item.id === id)
    if (!session) return
    Object.assign(state, { activeId: id, question: session.question, answer: session.answer, chart: session.chart, thinking: '', streamDone: true, currentNode: 3, error: '' })
  }

  async function send(question) {
    abort(false)
    const id = `session-${Date.now()}`
    state.sessions.unshift({ id, title: question.slice(0, 28), time: '刚刚', question, answer: '', chart: null })
    Object.assign(state, { activeId: id, question, answer: '', thinking: '正在理解问题并选择合适的知识工作流…', chart: null, streaming: true, streamDone: false, currentNode: 0, error: '' })
    controller = new AbortController()
    try {
      await requestWorkflow(question, { signal: controller.signal, onEvent: dispatch })
    } catch (error) {
      if (error.name !== 'AbortError') {
        state.error = '请求失败，请检查接口或稍后重试。'
        state.streaming = false
      }
    }
  }

  function dispatch({ event, data }) {
    if (event === 'node_change') state.currentNode = data.index
    if (event === 'thinking') state.thinking = data
    if (event === 'text_delta') state.answer += data
    if (event === 'chart') state.chart = data
    if (event === 'workflow_end') {
      state.streaming = false
      state.streamDone = true
      controller = null
      const session = activeSession.value
      if (session) Object.assign(session, { answer: state.answer, chart: state.chart })
    }
  }

  function abort(markDone = true) {
    controller?.abort()
    controller = null
    if (state.streaming) {
      state.streaming = false
      state.streamDone = markDone
    }
  }

  function toggleSource(source) { state[source] = !state[source] }

  return { state: readonly(state), activeSession, newChat, openSession, send, abort, toggleSource }
}
