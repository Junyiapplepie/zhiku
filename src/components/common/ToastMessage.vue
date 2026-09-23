<script setup>
import { useUiStore } from '../../stores/ui.js'
const { state } = useUiStore()
</script>

<template><Transition name="toast"><div v-if="state.toast" class="toast">{{ state.toast }}</div></Transition></template>
