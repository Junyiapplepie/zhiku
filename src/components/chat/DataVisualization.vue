<script setup>
import * as echarts from 'echarts/core'
import { BarChart, LineChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { buildChartOption, normalizeChartData } from '../../utils/chartAdapter.js'

echarts.use([BarChart, LineChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer])
const props = defineProps({ payload: { type: Object, required: true } })
const views = [['table', '表格'], ['line', '折线'], ['bar', '柱状'], ['mix', '组合'], ['stack', '堆叠']]
const view = ref('line'), chartEl = ref(null)
const model = computed(() => normalizeChartData(props.payload))
let instance, observer

async function draw() {
  if (view.value === 'table') { instance?.dispose(); instance = null; return }
  await nextTick()
  if (!chartEl.value) return
  instance ||= echarts.init(chartEl.value)
  instance.setOption(buildChartOption(model.value, view.value), true)
}

onMounted(() => { draw(); observer = new ResizeObserver(() => instance?.resize()); if (chartEl.value) observer.observe(chartEl.value) })
watch([view, model], draw, { deep: true })
onBeforeUnmount(() => { observer?.disconnect(); instance?.dispose() })
</script>

<template>
  <section class="viz-card"><div class="viz-head"><div><h3>车型市场关注度趋势</h3><p>数据口径：公开平台指数 · 近六个月</p></div><div class="view-switch"><button v-for="item in views" :key="item[0]" :class="{ active: view === item[0] }" @click="view = item[0]">{{ item[1] }}</button></div></div>
    <table v-if="view === 'table'" class="data-table"><thead><tr><th v-for="key in Object.keys(model.table[0] || {})" :key="key">{{ key }}</th></tr></thead><tbody><tr v-for="(row, index) in model.table" :key="index"><td v-for="(value, key) in row" :key="key">{{ value }}</td></tr></tbody></table>
    <div v-else ref="chartEl" class="echarts-container" />
  </section>
</template>
