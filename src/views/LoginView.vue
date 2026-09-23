<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter(), route = useRoute()
const account = ref('lin.xy'), code = ref('8888')
const canSubmit = computed(() => account.value.trim() && code.value.trim().length === 4)
function login() { localStorage.setItem('zhiku_token', 'demo-token'); router.replace(route.query.redirect || '/admin') }
</script>

<template>
  <main class="login-page"><section class="login-visual"><div class="login-brand"><img src="/logo.png" alt=""><strong>智库 AI 问答助手</strong></div><div><span class="eyebrow">AUTOMOTIVE INTELLIGENCE</span><h1>让每一次提问<br>都连接业务答案</h1><p>企业汽车知识库、竞品数据与智能工作流的一站式入口。</p></div></section>
    <section class="login-panel"><div class="login-card"><h2>欢迎回来</h2><p>使用企业账号验证码登录</p><label>企业账号<input v-model="account" placeholder="请输入企业账号"></label><label>验证码<div class="code-row"><input v-model="code" maxlength="4" placeholder="4 位验证码"><button>获取验证码</button></div></label><button class="login-submit" :disabled="!canSubmit" @click="login">进入系统</button><small>演示账号已预填，点击即可进入管理后台</small></div></section>
  </main>
</template>
