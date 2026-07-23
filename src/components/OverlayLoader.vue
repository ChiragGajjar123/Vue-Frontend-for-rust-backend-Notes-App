<script setup>
import Spinner from './Spinner.vue'

defineProps({
  label: { type: String, default: 'Loading…' }
})
</script>

<template>
  <div class="overlay-loader" role="status" aria-live="polite">
    <Spinner :size="40" color="var(--accent)" :thickness="3" />
    <span v-if="label" class="overlay-loader-label">{{ label }}</span>
  </div>
</template>

<style scoped>
.overlay-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 80px 20px;
  width: 100%;
  animation: fadeIn 0.2s ease;
}

.overlay-loader-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  animation: pulse-glow 1.4s ease-in-out infinite;
}
</style>
