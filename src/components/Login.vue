<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { LogIn, Mail, Lock, AlertCircle, Sparkles } from 'lucide-vue-next'
import Spinner from './Spinner.vue'

const { login } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleSubmit = async () => {
  error.value = ''
  if (!email.value.trim() || !password.value.trim()) {
    error.value = 'Please fill in all fields.'
    return
  }
  loading.value = true
  try {
    await login(email.value.trim(), password.value)
    router.push({ name: 'Dashboard' })
  } catch (err) {
    error.value = err.message || 'Invalid email or password.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-glow"></div>

      <div class="auth-header">
        <div class="auth-logo">
          <Sparkles class="auth-logo-icon" :size="32" />
          <span>NovaNotes</span>
        </div>
        <p class="auth-subtitle">Capture thoughts, secure your ideas</p>
      </div>

      <div v-if="error" class="alert alert-danger">
        <AlertCircle :size="18" />
        <span>{{ error }}</span>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="login-email">Email</label>
          <div class="input-container">
            <Mail class="input-icon" :size="18" />
            <input
              id="login-email"
              type="email"
              class="form-input"
              placeholder="Enter your email address"
              v-model="email"
              :disabled="loading"
              autocomplete="email"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="login-password">Password</label>
          <div class="input-container">
            <Lock class="input-icon" :size="18" />
            <input
              id="login-password"
              type="password"
              class="form-input"
              placeholder="••••••••"
              v-model="password"
              :disabled="loading"
              autocomplete="current-password"
            />
          </div>
        </div>

        <button
          type="submit"
          :class="['btn', 'btn-primary', { 'btn-loading': loading }]"
          :disabled="loading"
        >
          <template v-if="loading">
            <Spinner :size="18" color="white" /> Logging in…
          </template>
          <template v-else>
            <LogIn :size="18" /> Log In
          </template>
        </button>
      </form>

      <div class="auth-footer">
        Don't have an account?
        <router-link to="/signup" class="auth-link">Sign up</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  position: relative;
}

.auth-card {
  position: relative;
  width: 100%;
  max-width: 440px;
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur-heavy));
  -webkit-backdrop-filter: blur(var(--glass-blur-heavy));
  border: 1px solid var(--glass-border-glow);
  border-radius: 28px;
  padding: 40px;
  box-shadow: var(--glass-shadow-elevated);
  animation: glassReveal 0.5s var(--spring-smooth);
  overflow: hidden;
}

.auth-glow {
  position: absolute;
  inset: 0;
  background: var(--glass-highlight);
  pointer-events: none;
  border-radius: inherit;
}

.auth-header {
  text-align: center;
  margin-bottom: 30px;
  position: relative;
  z-index: 1;
}

.auth-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-title);
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--accent) 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
}

.auth-logo-icon {
  color: var(--accent);
  -webkit-text-fill-color: initial;
}

.auth-subtitle {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.alert {
  padding: 12px 16px;
  border-radius: 14px;
  font-size: 0.9rem;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  z-index: 1;
  background: var(--glass-bg-subtle);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  overflow: hidden;
}

.alert::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  border-radius: 4px 0 0 4px;
}

.alert-danger {
  color: var(--danger);
}

.alert-danger::after {
  background: var(--danger);
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.form-group label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  color: var(--text-secondary);
  pointer-events: none;
}

.form-input {
  width: 100%;
  padding: 14px 14px 14px 44px;
  background: var(--glass-input-bg);
  border: 1px solid var(--glass-input-border);
  border-radius: 14px;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 0.95rem;
  transition: all 0.25s ease;
  backdrop-filter: blur(10px);
}

.form-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 4px var(--accent-glow), var(--glass-shadow);
}

.form-input::placeholder {
  color: var(--text-secondary);
  opacity: 0.6;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  border: none;
  border-radius: 14px;
  font-family: var(--font-body);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s var(--spring-smooth);
  width: 100%;
  position: relative;
  z-index: 1;
}

.btn-primary {
  background: linear-gradient(135deg, var(--accent) 0%, #4f46e5 100%);
  color: #ffffff;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-loading {
  pointer-events: none;
  opacity: 0.8;
}

.auth-footer {
  text-align: center;
  margin-top: 24px;
  color: var(--text-secondary);
  font-size: 0.9rem;
  position: relative;
  z-index: 1;
}

.auth-link {
  color: var(--accent);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.auth-link:hover {
  color: var(--accent-hover);
  text-decoration: underline;
}

@media (max-width: 480px) {
  .auth-card {
    padding: 24px 20px;
    border-radius: 22px;
  }

  .auth-logo {
    font-size: 1.6rem;
  }
}

@media (max-width: 360px) {
  .auth-card {
    padding: 20px 16px;
    border-radius: 18px;
  }

  .auth-logo {
    font-size: 1.4rem;
  }

  .btn {
    height: 44px;
    font-size: 0.9rem;
  }
}
</style>
