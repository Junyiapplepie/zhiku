import { answerMarkdown, chartPayload } from '../mock/demoData.js'

const API_BASE = import.meta.env.VITE_API_BASE || '/api'
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export async function requestWorkflow(question, { signal, onEvent }) {
  const response = USE_MOCK
    ? new Response(createMockWorkflowStream(question, signal), { headers: { 'content-type': 'text/event-stream' } })
    : await fetch(`${API_BASE}/gac/user/workflow/ask`, {
        method: 'POST', signal,
        headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
        body: JSON.stringify({ question }),
      })

  if (!response.ok || !response.body) throw new Error(`SSE request failed: ${response.status}`)
  await parseSSEStream(response.body, onEvent, signal)
}

export async function parseSSEStream(stream, onEvent, signal) {
  const reader = stream.getReader()
  const decoder = new TextDecoder('utf-8')
  let buffer = ''

  try {
    while (true) {
      if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')
      const { value, done } = await reader.read()
      buffer += decoder.decode(value || new Uint8Array(), { stream: !done })
      const packets = buffer.split(/\r?\n\r?\n/)
      buffer = packets.pop() || ''
      packets.filter(Boolean).forEach(packet => onEvent(parseEvent(packet)))
      if (done) {
        if (buffer.trim()) onEvent(parseEvent(buffer))
        break
      }
    }
  } finally {
    reader.releaseLock()
  }
}

function parseEvent(packet) {
  let event = 'message'
  const data = []
  for (const line of packet.split(/\r?\n/)) {
    if (line.startsWith('event:')) event = line.slice(6).trim()
    if (line.startsWith('data:')) data.push(line.slice(5).trimStart())
  }
  const raw = data.join('\n')
  try { return { event, data: JSON.parse(raw) } }
  catch { return { event, data: raw } }
}

function createMockWorkflowStream(question, signal) {
  const encoder = new TextEncoder()
  const chunks = answerMarkdown.match(/[\s\S]{1,18}/g) || []
  const events = [
    ['workflow_start', { taskId: crypto.randomUUID(), question }],
    ['node_change', { index: 1, label: '检索知识库' }],
    ['thinking', '已识别车型、指标与时间范围，正在检索企业知识库。'],
    ['node_change', { index: 2, label: '分析竞品数据' }],
    ['thinking', '正在统一价格、续航、智能驾驶与关注度数据口径。'],
    ['node_change', { index: 3, label: '生成回答' }],
    ...chunks.map(text => ['text_delta', text]),
    ['chart', chartPayload], ['workflow_end', { status: 'success' }],
  ]

  return new ReadableStream({
    async start(controller) {
      for (const [event, data] of events) {
        if (signal.aborted) return controller.error(new DOMException('Aborted', 'AbortError'))
        const packet = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
        const cut = Math.max(1, Math.floor(packet.length * 0.58))
        controller.enqueue(encoder.encode(packet.slice(0, cut)))
        await wait(event === 'text_delta' ? 24 : 260, signal)
        controller.enqueue(encoder.encode(packet.slice(cut)))
        await wait(event === 'text_delta' ? 24 : 160, signal)
      }
      controller.close()
    },
  })
}

function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms)
    signal.addEventListener('abort', () => {
      clearTimeout(timer)
      reject(new DOMException('Aborted', 'AbortError'))
    }, { once: true })
  })
}
