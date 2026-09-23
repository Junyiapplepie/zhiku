const isPlainObject = value => value && typeof value === 'object' && !Array.isArray(value)

export function normalizeChartData(payload = {}) {
  const headers = payload.result_header || payload.headers || []
  const rows = payload.result_data || payload.data || []
  if (!rows.length) return { categories: [], series: [], table: [] }

  if (Array.isArray(rows[0])) return fromMatrix(headers, rows)
  if (isPlainObject(rows[0])) return fromObjects(headers, rows)
  if (isPlainObject(rows)) return fromSeriesObject(rows)
  return { categories: rows.map((_, index) => String(index + 1)), series: [{ name: headers[0] || '数值', data: rows.map(Number) }], table: rows }
}

function fromMatrix(headers, rows) {
  const safeHeaders = headers.length ? headers : rows[0].map((_, index) => `字段${index + 1}`)
  return {
    categories: rows.map(row => String(row[0])),
    series: safeHeaders.slice(1).map((name, index) => ({ name, data: rows.map(row => Number(row[index + 1]) || 0) })),
    table: rows.map(row => Object.fromEntries(safeHeaders.map((key, index) => [key, row[index]]))),
  }
}

function fromObjects(headers, rows) {
  const keys = headers.length ? headers : Object.keys(rows[0])
  const categoryKey = keys[0]
  return {
    categories: rows.map(row => String(row[categoryKey])),
    series: keys.slice(1).map(key => ({ name: key, data: rows.map(row => Number(row[key]) || 0) })),
    table: rows,
  }
}

function fromSeriesObject(rows) {
  const entries = Object.entries(rows)
  const length = Math.max(...entries.map(([, values]) => values.length))
  return {
    categories: Array.from({ length }, (_, index) => String(index + 1)),
    series: entries.map(([name, values]) => ({ name, data: values.map(Number) })),
    table: Array.from({ length }, (_, index) => Object.fromEntries(entries.map(([name, values]) => [name, values[index]]))),
  }
}

export function buildChartOption(model, view = 'line') {
  const colors = ['#4f86ef', '#48c5a1', '#9a72ee', '#f1a45c']
  const type = view === 'mix' ? null : view === 'stack' ? 'bar' : view
  return {
    animationDuration: 500,
    color: colors,
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0, icon: 'roundRect', itemWidth: 10, textStyle: { color: '#768295' } },
    grid: { left: 38, right: 20, top: 28, bottom: 52, containLabel: true },
    xAxis: { type: 'category', data: model.categories, axisLine: { lineStyle: { color: '#dfe5ec' } }, axisTick: { show: false } },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: '#edf0f4' } } },
    series: model.series.map((series, index) => ({
      ...series,
      type: type || (index === 0 ? 'bar' : 'line'),
      stack: view === 'stack' ? 'total' : undefined,
      smooth: view === 'line' || (view === 'mix' && index > 0),
      barMaxWidth: 30,
      areaStyle: view === 'line' ? { opacity: 0.08 } : undefined,
      symbolSize: 7,
    })),
  }
}
