<script setup>
import { useUiStore } from '../../stores/ui.js'
import ChatComposer from './ChatComposer.vue'
import DataVisualization from './DataVisualization.vue'
import MarkdownRenderer from './MarkdownRenderer.vue'
import WorkflowPanel from './WorkflowPanel.vue'

const props = defineProps({ chat: { type: Object, required: true } })
const emit = defineEmits(['send', 'stop'])
const { notify } = useUiStore()
async function copyAnswer() { await navigator.clipboard?.writeText(props.chat.answer); notify('回答已复制') }
</script>

<template>
  <div class="chat-scroll"><main class="conversation">
    <div class="message user-message"><div class="user-bubble">{{ chat.question }}</div></div>
    <div class="message assistant-message"><div class="assistant-head"><img class="assistant-logo" src="/logo.png" alt=""><span>智库 AI</span></div>
      <WorkflowPanel :current="chat.currentNode" :done="chat.streamDone" />
      <div v-if="chat.streaming && chat.thinking" class="thinking">{{ chat.thinking }}</div>
      <div v-if="chat.error" class="thinking error-state">{{ chat.error }}</div>
      <div class="answer"><MarkdownRenderer :content="chat.answer" /><span v-if="chat.streaming" class="cursor" /></div>
      <DataVisualization v-if="chat.chart && chat.streamDone" :payload="chat.chart" />
      <div v-if="chat.streamDone" class="message-actions"><button class="icon-btn" @click="copyAnswer">复制</button><button class="icon-btn" @click="notify('感谢反馈')">赞</button><button class="icon-btn" @click="$emit('send', chat.question)">重新生成</button></div>
    </div>
  </main></div>
  <div class="conversation-composer"><button v-if="chat.streaming" class="stop-btn" @click="$emit('stop')">■ 停止生成</button><ChatComposer v-else @send="$emit('send', $event)" /></div>
</template>
