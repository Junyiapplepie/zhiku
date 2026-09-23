<script setup>
import { useRouter } from 'vue-router'
import { useChatStore } from '../../stores/chat.js'

const router = useRouter()
const chat = useChatStore()
function createChat() { chat.newChat(); router.push('/chat') }
function selectSession(id) { chat.openSession(id); router.push(`/chat/${id}`) }
</script>

<template>
  <aside class="sidebar">
    <div class="brand"><img class="brand-mark" src="/logo.png" alt="智库 AI"><div><strong>智库 AI</strong><small>智能汽车知识助手</small></div></div>
    <button class="new-chat" @click="createChat">＋ <span>开启新对话</span></button>
    <div class="side-label"><span>最近会话</span><span>{{ chat.state.sessions.length }}</span></div>
    <div class="session-list">
      <button v-for="session in chat.state.sessions" :key="session.id" class="session" :class="{ active: chat.state.activeId === session.id }" @click="selectSession(session.id)">
        <span class="session-title">{{ session.title }}</span><span class="session-time">{{ session.time }}</span>
      </button>
    </div>
    <div class="side-footer">
      <button class="admin-entry" @click="router.push('/admin')">⌘ <span>系统管理</span></button>
      <button class="profile"><span class="avatar">林</span><span>林晓宇 · 产品中心</span></button>
    </div>
  </aside>
</template>
