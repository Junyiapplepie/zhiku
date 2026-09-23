<script setup>
import { workflowSteps } from '../../mock/demoData.js'
defineProps({ current: { type: Number, default: 0 }, done: Boolean })
</script>

<template>
  <div class="workflow"><div class="workflow-title"><span>工作流执行过程</span><span class="workflow-state">{{ done ? '已完成' : `正在处理 · ${workflowSteps[current]}` }}</span></div>
    <div class="steps"><div v-for="(step, index) in workflowSteps" :key="step" class="step" :class="{ done: done || index < current, running: !done && index === current }">{{ step }}</div></div>
  </div>
</template>
