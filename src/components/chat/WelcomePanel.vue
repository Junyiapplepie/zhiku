<script setup>
import ChatComposer from './ChatComposer.vue'
defineEmits(['send'])
const suggestions = [
  ['⚡', '技术搭载与追踪', '800V 高压平台有哪些优势？'],
  ['◫', '政策解读', '解读新能源购置税政策'],
  ['◩', '竞品对比分析', '对比 AION RT 与 MONA M03'],
  ['⌁', '智能问数', '近半年车型关注度趋势'],
]
</script>

<template>
  <section class="welcome"><div class="orb"></div><h1>你好，我是 <span class="gradient-text">智能汽车助手</span></h1>
    <p class="welcome-lead">连接企业知识库与市场数据，为您提供技术咨询、政策解读、竞品分析等全方位服务</p>
    <div class="suggestions"><button v-for="item in suggestions" :key="item[1]" class="suggestion" @click="$emit('send', item[2])"><span class="mini-icon">{{ item[0] }}</span><strong>{{ item[1] }}</strong><small>{{ item[2] }}</small></button></div>
    <ChatComposer @send="$emit('send', $event)" /><div class="disclaimer">内容由 AI 生成，请结合实际业务信息判断</div>
  </section>
</template>
