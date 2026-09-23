<script setup>
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ChatConversation from '../components/chat/ChatConversation.vue'
import WelcomePanel from '../components/chat/WelcomePanel.vue'
import AppSidebar from '../components/layout/AppSidebar.vue'
import TopBar from '../components/layout/TopBar.vue'
import { useChatStore } from '../stores/chat.js'

const route = useRoute(), router = useRouter(), chat = useChatStore()
function send(question) { chat.send(question); router.replace(`/chat/${chat.state.activeId}`) }
function loadRouteSession() { if (route.params.sessionId && route.params.sessionId !== chat.state.activeId) chat.openSession(route.params.sessionId) }
onMounted(loadRouteSession)
watch(() => route.params.sessionId, loadRouteSession)
</script>

<template>
  <div class="shell"><AppSidebar /><section class="workspace"><TopBar />
    <ChatConversation v-if="chat.state.activeId" :chat="chat.state" @send="send" @stop="chat.abort(true)" />
    <div v-else class="chat-scroll"><WelcomePanel @send="send" /></div>
  </section></div>
</template>
