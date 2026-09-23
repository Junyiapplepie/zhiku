<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Vditor from 'vditor'

const props = defineProps({ content: { type: String, default: '' } })
const container = ref(null)
let renderVersion = 0

async function renderMarkdown() {
  const version = ++renderVersion
  await nextTick()
  if (!container.value || version !== renderVersion) return
  if (!props.content) { container.value.innerHTML = ''; return }
  await Vditor.preview(container.value, props.content, {
    cdn: 'https://cdn.jsdelivr.net/npm/vditor@3.11.2', mode: 'light', anchor: 0,
    markdown: { toc: false, mark: true, footnotes: true },
    hljs: { style: 'github', lineNumber: true },
    math: { engine: 'KaTeX' },
  })
}

onMounted(renderMarkdown)
watch(() => props.content, renderMarkdown)
onBeforeUnmount(() => { renderVersion++ })
</script>

<template><div ref="container" class="markdown-body vditor-reset" /></template>
