<script setup>
import { ref, watch } from 'vue'
import { useChatStore } from '../../stores/chat.js'

const props = defineProps({ preset: { type: String, default: '' } })
const emit = defineEmits(['send'])
const chat = useChatStore()
const value = ref(props.preset)
watch(() => props.preset, next => { value.value = next })
function submit() { const question = value.value.trim(); if (!question) return; emit('send', question); value.value = '' }
</script>

<template>
  <div class="composer"><div class="composer-inner">
    <textarea v-model="value" rows="2" placeholder="请输入您的汽车相关问题…" @keydown.enter.exact.prevent="submit" />
    <div class="composer-actions"><div class="tool-group">
      <button class="tool" :class="{ active: chat.state.online }" @click="chat.toggleSource('online')">◎ 联网</button>
      <button class="tool" :class="{ active: chat.state.knowledge }" @click="chat.toggleSource('knowledge')">▣ 知识库</button>
    </div><button class="send" :disabled="!value.trim()" aria-label="发送问题" @click="submit">➤</button></div>
  </div></div>
</template>
