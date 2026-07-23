<script setup>
import { AlertCircle, CheckCircle, AlertTriangle, X } from 'lucide-vue-next'

defineProps({
  toasts: { type: Array, default: () => [] }
})

const emit = defineEmits(['dismiss'])

const iconMap = {
  error: AlertCircle,
  success: CheckCircle,
  warning: AlertTriangle
}
</script>

<template>
  <Teleport to="body">
    <div class="toast-container" v-if="toasts.length">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['toast', `toast-${toast.type}`]"
        >
          <component :is="iconMap[toast.type] || AlertCircle" :size="18" class="toast-icon" />
          <span class="toast-message">{{ toast.message }}</span>
          <button class="toast-close" @click="emit('dismiss', toast.id)">
            <X :size="14" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-radius: 16px;
  background: var(--glass-bg-solid);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow-elevated);
  font-size: 0.9rem;
  color: var(--text-primary);
  animation: toastSlideIn 0.35s var(--spring-bounce);
  position: relative;
  overflow: hidden;
}

.toast::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--glass-highlight);
  pointer-events: none;
  border-radius: inherit;
}

.toast::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  border-radius: 4px 0 0 4px;
}

.toast-error::after { background: var(--danger); }
.toast-success::after { background: var(--success); }
.toast-warning::after { background: var(--warning); }

.toast-icon {
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.toast-error .toast-icon { color: var(--danger); }
.toast-success .toast-icon { color: var(--success); }
.toast-warning .toast-icon { color: var(--warning); }

.toast-message {
  flex: 1;
  position: relative;
  z-index: 1;
  font-weight: 500;
}

.toast-close {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 4px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  position: relative;
  z-index: 1;
}

.toast-close:hover {
  background: var(--glass-bg);
  color: var(--text-primary);
}

.toast-enter-active {
  animation: toastSlideIn 0.35s var(--spring-bounce);
}
.toast-leave-active {
  animation: toastSlideOut 0.25s ease forwards;
}
.toast-move {
  transition: transform 0.3s var(--spring-smooth);
}

@media (max-width: 480px) {
  .toast-container {
    left: 12px;
    right: 12px;
    top: 12px;
    max-width: none;
  }
}
</style>
