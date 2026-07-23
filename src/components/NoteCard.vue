<script setup>
import { useNotes } from '../composables/useNotes'
import { Pin, Trash2 } from 'lucide-vue-next'
import Spinner from './Spinner.vue'

const props = defineProps({
  note: { type: Object, required: true }
})

const {
  deletingIds,
  pinningIds,
  handleTogglePin,
  handleDeleteNote,
  handleOpenEditModal,
  formatDate
} = useNotes()
</script>

<template>
  <div
    :class="[
      'note-card',
      `color-${note.color || 'slate'}`,
      { 'note-busy': deletingIds.has(note.id) }
    ]"
    @click="handleOpenEditModal(note)"
  >
    <div class="note-glow"></div>

    <div class="note-header">
      <h4 class="note-title">{{ note.title || 'Untitled' }}</h4>
      <button
        :class="['note-pin-btn', { pinned: note.pinned, 'note-busy': pinningIds.has(note.id) }]"
        @click.stop="handleTogglePin($event, note)"
        :disabled="pinningIds.has(note.id)"
        :title="note.pinned ? 'Unpin note' : 'Pin note'"
      >
        <Spinner v-if="pinningIds.has(note.id)" :size="16" color="currentColor" />
        <Pin v-else :size="16" :fill="note.pinned ? 'currentColor' : 'none'" />
      </button>
    </div>

    <p class="note-content">{{ note.content }}</p>

    <div v-if="note.tags && note.tags.length > 0" class="note-tags-container">
      <span v-for="tag in note.tags" :key="tag" class="note-tag">#{{ tag }}</span>
    </div>

    <div class="note-footer">
      <span class="note-date">{{ formatDate(note.updatedAt) }}</span>
      <div class="note-actions">
        <button
          class="note-action-btn delete"
          @click.stop="handleDeleteNote($event, note.id)"
          title="Delete note"
          :disabled="deletingIds.has(note.id)"
        >
          <Spinner v-if="deletingIds.has(note.id)" :size="15" color="currentColor" />
          <Trash2 v-else :size="15" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.note-card {
  border-radius: 22px;
  border: 1px solid var(--glass-border);
  padding: 24px;
  box-shadow: var(--glass-shadow);
  transition: all 0.3s var(--spring-smooth);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  height: fit-content;
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  min-height: 180px;
  animation: slideUp 0.35s var(--spring-smooth);
  cursor: pointer;
}

.note-glow {
  position: absolute;
  inset: 0;
  background: var(--glass-refraction);
  pointer-events: none;
  border-radius: inherit;
  opacity: 0.6;
}

.note-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--glass-shadow-hover);
  border-color: var(--glass-border-glow);
}

.note-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--accent);
  opacity: 0.6;
  border-radius: 4px 0 0 4px;
}

.note-card.color-slate { background-color: var(--note-slate); }
.note-card.color-blue { background-color: var(--note-blue); }
.note-card.color-green { background-color: var(--note-green); }
.note-card.color-yellow { background-color: var(--note-yellow); }
.note-card.color-purple { background-color: var(--note-purple); }
.note-card.color-rose { background-color: var(--note-rose); }

.note-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
}

.note-title {
  font-size: 1.1rem;
  font-weight: 700;
  font-family: var(--font-title);
  color: var(--text-primary);
  word-break: break-word;
}

.note-pin-btn {
  background: var(--glass-bg-subtle);
  border: 1px solid var(--glass-border);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s var(--spring-smooth);
  padding: 5px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.note-pin-btn:hover {
  color: var(--accent);
  background: var(--glass-bg-solid);
  transform: scale(1.1);
}

.note-pin-btn.pinned {
  color: var(--accent);
  background: var(--accent-glow);
  border-color: var(--accent);
}

.note-content {
  font-size: 0.92rem;
  color: var(--text-primary);
  white-space: pre-wrap;
  word-break: break-word;
  margin-bottom: 20px;
  flex-grow: 1;
  opacity: 0.85;
  position: relative;
  z-index: 1;
}

.note-tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.note-tag {
  font-size: 0.72rem;
  padding: 3px 10px;
  border-radius: 20px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
  font-weight: 600;
  backdrop-filter: blur(8px);
}

.note-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--glass-border);
  padding-top: 12px;
  margin-top: auto;
  position: relative;
  z-index: 1;
}

.note-date {
  font-size: 0.72rem;
  color: var(--text-secondary);
}

.note-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.note-action-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 6px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s var(--spring-smooth);
}

.note-action-btn:hover {
  background: var(--glass-bg-solid);
  color: var(--text-primary);
}

.note-action-btn.delete:hover {
  color: var(--danger);
  background: rgba(239, 68, 68, 0.1);
}

.note-busy {
  opacity: 0.5;
  pointer-events: none;
}

@media (max-width: 480px) {
  .note-card {
    padding: 18px;
    border-radius: 18px;
    min-height: 140px;
  }
}

@media (max-width: 360px) {
  .note-card {
    padding: 14px;
    border-radius: 14px;
    min-height: 120px;
  }

  .note-title { font-size: 1rem; }
  .note-content { font-size: 0.85rem; }
}
</style>
