<script setup>
import { useNotes } from '../composables/useNotes'
import { FileText, Plus, Pin } from 'lucide-vue-next'
import OverlayLoader from './OverlayLoader.vue'
import NoteCard from './NoteCard.vue'

const {
  loading,
  filteredNotes,
  pinnedNotes,
  otherNotes,
  selectedTag,
  handleOpenCreateModal
} = useNotes()
</script>

<template>
  <OverlayLoader v-if="loading" label="Loading notes…" />

  <div v-else-if="filteredNotes.length === 0" class="empty-state">
    <div class="empty-glow"></div>
    <FileText class="empty-state-icon" :size="60" />
    <h3>No Notes Found</h3>
    <p>
      {{ selectedTag
        ? `You don't have any notes tagged with "${selectedTag}".`
        : 'Get started by capturing your first thought today!'
      }}
    </p>
    <button v-if="!selectedTag" class="btn-create" @click="handleOpenCreateModal">
      <Plus :size="20" />
      <span>Create a Note</span>
    </button>
  </div>

  <template v-else>
    <!-- Pinned Notes -->
    <section v-if="pinnedNotes.length > 0" class="notes-section">
      <h3 class="section-title">
        <Pin :size="18" class="pinned-icon" />
        <span>Pinned</span>
      </h3>
      <div class="notes-grid">
        <NoteCard v-for="note in pinnedNotes" :key="note.id" :note="note" />
      </div>
    </section>

    <!-- Other Notes -->
    <section v-if="otherNotes.length > 0">
      <h3 v-if="pinnedNotes.length > 0" class="section-title">
        <span>Others</span>
      </h3>
      <div class="notes-grid">
        <NoteCard v-for="note in otherNotes" :key="note.id" :note="note" />
      </div>
    </section>
  </template>
</template>

<style scoped>
.notes-section {
  margin-bottom: 32px;
}

.section-title {
  font-family: var(--font-title);
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-primary);
}

.pinned-icon {
  color: var(--accent);
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.empty-state {
  text-align: center;
  padding: 80px 40px;
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px dashed var(--glass-border);
  border-radius: 28px;
  max-width: 500px;
  margin: 40px auto;
  box-shadow: var(--glass-shadow);
  position: relative;
  overflow: hidden;
}

.empty-glow {
  position: absolute;
  inset: 0;
  background: var(--glass-highlight);
  pointer-events: none;
  border-radius: inherit;
}

.empty-state-icon {
  color: var(--text-secondary);
  margin-bottom: 20px;
  opacity: 0.5;
  position: relative;
  z-index: 1;
}

.empty-state h3 {
  font-family: var(--font-title);
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 10px;
  position: relative;
  z-index: 1;
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
}

.btn-create {
  width: auto;
  padding: 0 22px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--accent) 0%, #4f46e5 100%);
  color: white;
  border: none;
  font-weight: 600;
  font-family: var(--font-body);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.25);
  transition: all 0.2s var(--spring-smooth);
  position: relative;
  z-index: 1;
}

.btn-create:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
}

@media (max-width: 768px) {
  .notes-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .notes-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .section-title { font-size: 1.05rem; }
}
</style>
