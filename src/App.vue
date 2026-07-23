<script setup>
import { computed } from 'vue'
import { useAuth } from './composables/useAuth'
import PageLoader from './components/PageLoader.vue'

const { user, loading } = useAuth()

const isDarkMode = computed(() => user.value?.theme === 'dark')
</script>

<template>
  <PageLoader v-if="loading" />

  <div v-else :class="['app-container', { dark: isDarkMode }]">
    <!-- Liquid Glass ambient background glows -->
    <div class="bg-glows">
      <div class="glow-1"></div>
      <div class="glow-2"></div>
      <div class="glow-3"></div>
    </div>

    <router-view />
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.4s ease, color 0.4s ease;
  width: 100%;
  position: relative;
}

.bg-glows {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}

.glow-1 {
  position: absolute;
  top: -15%;
  right: -10%;
  width: 55vw;
  height: 55vw;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, rgba(99, 102, 241, 0) 65%);
  filter: blur(100px);
  animation: glowFloat1 12s ease-in-out infinite alternate;
}

.glow-2 {
  position: absolute;
  bottom: -15%;
  left: -10%;
  width: 50vw;
  height: 50vw;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, rgba(236, 72, 153, 0) 65%);
  filter: blur(100px);
  animation: glowFloat2 14s ease-in-out infinite alternate;
}

.glow-3 {
  position: absolute;
  top: 40%;
  left: 30%;
  width: 35vw;
  height: 35vw;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0) 65%);
  filter: blur(120px);
  animation: glowFloat3 16s ease-in-out infinite alternate;
}

@keyframes glowFloat1 {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(-30px, 20px) scale(1.05); }
}

@keyframes glowFloat2 {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(20px, -30px) scale(1.08); }
}

@keyframes glowFloat3 {
  0% { transform: translate(0, 0) scale(1); opacity: 0.6; }
  100% { transform: translate(-20px, -15px) scale(1.1); opacity: 1; }
}
</style>
