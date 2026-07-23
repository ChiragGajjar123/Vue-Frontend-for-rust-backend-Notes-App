<script setup>
import { useNotes } from '../composables/useNotes'
import { X, Check } from 'lucide-vue-next'
import Spinner from './Spinner.vue'

const {
  isModalOpen,
  editingNote,
  noteForm,
  tagInput,
  modalSaving,
  handleFormSubmit,
  handleAddTag,
  handleRemoveTag
} = useNotes()

const colors = ['slate', 'blue', 'green', 'yellow', 'purple', 'rose']
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isModalOpen" class="modal-overlay" @click.self="isModalOpen = false">
        <div class="modal-content" @click.stop>
          <div class="modal-glow"></div>

          <div class="modal-header">
            <h3 class="modal-title">
              {{ editingNote ? 'Edit Note' : 'Create Note' }}
            </h3>
            <button
              class="modal-close-btn"
              @click="isModalOpen = false"
              :disabled="modalSaving"
            >
              <X :size="20" />
            </button>
          </div>

          <form @submit.prevent="handleFormSubmit">
            <div class="modal-body">
              <div class="form-group">
                <label for="modal-title-input">Title</label>
                <input
                  id="modal-title-input"
                  type="text"
                  class="form-input"
                  placeholder="Note title..."
                  v-model="noteForm.title"
                  :disabled="modalSaving"
                />
              </div>

              <div class="form-group">
                <label for="modal-content-input">Content</label>
                <textarea
                  id="modal-content-input"
                  class="form-input form-textarea"
                  placeholder="Write your note contents here..."
                  v-model="noteForm.content"
                  :disabled="modalSaving"
                ></textarea>
              </div>

              <div class="form-group">
                <label>Tags</label>
                <div class="tag-input-container">
                  <span v-for="tag in noteForm.tags" :key="tag" class="tag-badge">
                    #{{ tag }}
                    <button
                      type="button"
                      class="tag-remove-btn"
                      @click="handleRemoveTag(tag)"
                      :disabled="modalSaving"
                    >
                      <X :size="12" />
                    </button>
                  </span>
                  <input
                    type="text"
                    class="tag-text-input"
                    placeholder="Add tag and press Enter"
                    v-model="tagInput"
                    @keydown.enter.prevent="handleAddTag"
                    @blur="handleAddTag"
                    :disabled="modalSaving"
                  />
                </div>
              </div>

              <div class="form-group">
                <label>Note Color</label>
                <div class="color-selector">
                  <div
                    v-for="colorOpt in colors"
                    :key="colorOpt"
                    :class="['color-option', colorOpt, { selected: noteForm.color === colorOpt }]"
                    @click="!modalSaving && (noteForm.color = colorOpt)"
                  >
                    <Check
                      v-if="noteForm.color === colorOpt"
                      :size="14"
                      class="color-check"
                    />
                  </div>
                </div>
              </div>

              <div class="form-group form-group-row">
                <input
                  id="modal-pin-input"
                  type="checkbox"
                  class="pin-checkbox"
                  v-model="noteForm.pinned"
                  :disabled="modalSaving"
                />
                <label for="modal-pin-input" class="pin-label">
                  Pin this note to the top
                </label>
              </div>
            </div>

            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                @click="isModalOpen = false"
                :disabled="modalSaving"
              >
                Cancel
              </button>
              <button
                type="submit"
                :class="['btn', 'btn-primary', 'btn-submit', { 'btn-loading': modalSaving }]"
                :disabled="modalSaving"
              >
                <template v-if="modalSaving">
                  <Spinner :size="18" color="white" /> Saving…
                </template>
                <template v-else>
                  <Check :size="18" /><span>Save Note</span>
                </template>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
}

.modal-content {
  position: relative;
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur-heavy));
  -webkit-backdrop-filter: blur(var(--glass-blur-heavy));
  border: 1px solid var(--glass-border-glow);
  border-radius: 24px;
  width: 100%;
  max-width: 560px;
  max-height: calc(100vh - 60px);
  box-shadow: var(--glass-shadow-elevated);
  animation: scaleUp 0.3s var(--spring-bounce);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-glow {
  position: absolute;
  inset: 0;
  background: var(--glass-highlight);
  pointer-events: none;
  border-radius: inherit;
}

.modal-content form {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid var(--glass-border);
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.modal-title {
  font-family: var(--font-title);
  font-size: 1.35rem;
  font-weight: 800;
}

.modal-close-btn {
  background: var(--glass-bg-subtle);
  border: 1px solid var(--glass-border);
  cursor: pointer;
  color: var(--text-secondary);
  border-radius: 10px;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  backdrop-filter: blur(10px);
}

.modal-close-btn:hover {
  background: var(--glass-bg-solid);
  color: var(--text-primary);
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 18px;
  flex: 1;
  overflow-y: auto;
  padding: 18px 24px;
  position: relative;
  z-index: 1;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.form-input {
  width: 100%;
  padding: 13px 16px;
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
  box-shadow: 0 0 0 4px var(--accent-glow);
}

.form-input::placeholder {
  color: var(--text-secondary);
  opacity: 0.6;
}

.form-textarea {
  min-height: 120px;
  resize: vertical;
  line-height: 1.6;
}

/* Color selector */
.color-selector {
  display: flex;
  gap: 12px;
  margin-top: 4px;
  flex-wrap: wrap;
}

.color-option {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 2px solid var(--glass-border);
  cursor: pointer;
  position: relative;
  transition: all 0.2s var(--spring-bounce);
  backdrop-filter: blur(8px);
}

.color-option.selected {
  border-color: var(--accent);
  transform: scale(1.15);
  box-shadow: 0 0 12px var(--accent-glow);
}

.color-option.slate { background-color: var(--note-slate); }
.color-option.blue { background-color: var(--note-blue); }
.color-option.green { background-color: var(--note-green); }
.color-option.yellow { background-color: var(--note-yellow); }
.color-option.purple { background-color: var(--note-purple); }
.color-option.rose { background-color: var(--note-rose); }

.color-check {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--text-primary);
}

/* Tag input */
.tag-input-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 10px 12px;
  background: var(--glass-input-bg);
  border: 1px solid var(--glass-input-border);
  border-radius: 14px;
  align-items: center;
  backdrop-filter: blur(10px);
  transition: border-color 0.25s;
}

.tag-input-container:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 4px var(--accent-glow);
}

.tag-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.8rem;
  padding: 4px 10px;
  border-radius: 20px;
  background: var(--accent-glow);
  color: var(--accent);
  font-weight: 600;
}

.tag-remove-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  border-radius: 50%;
  transition: background 0.2s;
}

.tag-remove-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.tag-text-input {
  border: none;
  background: transparent;
  outline: none;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 0.9rem;
  flex-grow: 1;
  min-width: 120px;
}

.tag-text-input::placeholder {
  color: var(--text-secondary);
  opacity: 0.5;
}

/* Pin row */
.form-group-row {
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-top: 6px;
}

.pin-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--accent);
}

.pin-label {
  cursor: pointer;
  text-transform: none !important;
  font-size: 0.93rem !important;
  letter-spacing: 0 !important;
  color: var(--text-primary) !important;
}

/* Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid var(--glass-border);
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 22px;
  border: none;
  border-radius: 14px;
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s var(--spring-smooth);
}

.btn-secondary {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
}

.btn-secondary:hover {
  background: var(--glass-bg-solid);
  transform: translateY(-1px);
}

.btn-primary {
  background: linear-gradient(135deg, var(--accent) 0%, #4f46e5 100%);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

.btn-loading { pointer-events: none; opacity: 0.8; }

/* Transition */
.modal-enter-active { animation: fadeIn 0.2s ease; }
.modal-leave-active { animation: fadeIn 0.15s ease reverse; }

@media (max-width: 360px) {
  .modal-overlay { padding: 8px; }

  .modal-content {
    border-radius: 16px;
    max-height: 92vh;
  }

  .modal-header,
  .modal-footer {
    padding: 12px 14px;
  }

  .modal-body {
    padding: 14px;
    gap: 14px;
  }

  .color-selector { gap: 6px; }
  .color-option { width: 28px; height: 28px; }
}
</style>
