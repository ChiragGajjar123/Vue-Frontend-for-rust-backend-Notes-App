<script setup>
import { onMounted } from 'vue'
import { useNotes } from '../composables/useNotes'
import { AlertCircle } from 'lucide-vue-next'
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
import NotesList from './NotesList.vue'
import NoteModal from './NoteModal.vue'
import ConfirmDialog from './ConfirmDialog.vue'
import Toast from './Toast.vue'

const {
  error,
  initNotes,
  confirmState,
  toasts,
  dismissToast
} = useNotes()

onMounted(() => {
  initNotes()
})
</script>

<template>
  <div class="dashboard">
    <Sidebar />

    <main class="main-content">
      <Header />

      <div v-if="error" class="alert alert-danger">
        <AlertCircle :size="18" />
        <span>{{ error }}</span>
      </div>

      <NotesList />
    </main>

    <NoteModal />

    <ConfirmDialog
      :visible="confirmState.visible"
      :title="confirmState.title"
      :message="confirmState.message"
      @confirm="confirmState.onConfirm?.()"
      @cancel="confirmState.onCancel?.()"
    />

    <Toast
      :toasts="toasts"
      @dismiss="dismissToast"
    />
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  margin-left: 280px;
  padding: 40px;
  min-height: 100vh;
  transition: margin-left 0.3s var(--spring-smooth);
}

.alert {
  padding: 12px 16px;
  border-radius: 14px;
  font-size: 0.9rem;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--glass-bg-subtle);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  position: relative;
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

@media (max-width: 992px) {
  .main-content {
    margin-left: 72px;
    padding: 32px 24px;
  }
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 20px 16px;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 16px 12px;
  }
}

@media (max-width: 360px) {
  .main-content {
    padding: 12px 8px;
  }
}
</style>
