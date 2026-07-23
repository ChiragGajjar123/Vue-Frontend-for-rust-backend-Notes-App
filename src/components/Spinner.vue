<script setup>
const props = defineProps({
  size: { type: Number, default: 20 },
  color: { type: String, default: 'currentColor' },
  thickness: { type: Number, default: 2.5 }
})

const r = (props.size - props.thickness * 2) / 2
const circ = 2 * Math.PI * r
</script>

<template>
  <svg
    :width="size"
    :height="size"
    :viewBox="`0 0 ${size} ${size}`"
    fill="none"
    class="spinner-svg"
    aria-label="Loading"
    role="status"
  >
    <circle
      :cx="size / 2"
      :cy="size / 2"
      :r="r"
      :stroke="color"
      :stroke-width="thickness"
      :opacity="0.15"
    />
    <circle
      :cx="size / 2"
      :cy="size / 2"
      :r="r"
      :stroke="color"
      :stroke-width="thickness"
      :stroke-dasharray="`${circ * 0.75} ${circ * 0.25}`"
      stroke-linecap="round"
      class="spinner-arc"
    />
  </svg>
</template>

<style scoped>
.spinner-svg {
  display: inline-block;
  flex-shrink: 0;
  vertical-align: middle;
}

.spinner-arc {
  transform-origin: center;
  animation: spin 0.75s linear infinite;
}
</style>
