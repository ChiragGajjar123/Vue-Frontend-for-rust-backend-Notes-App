import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from './useAuth'
import { api } from '../services/api'

// Singleton reactive state
const notes = ref([])
const loading = ref(true)
const error = ref('')

const pinningIds = reactive(new Set())
const deletingIds = reactive(new Set())
const modalSaving = ref(false)
const themeSaving = ref(false)

// Mobile sidebar
const isSidebarOpen = ref(false)

// Filter & Search
const searchQuery = ref('')
const selectedTag = ref(null)

// Modal state
const isModalOpen = ref(false)
const editingNote = ref(null)
const noteForm = reactive({
  title: '',
  content: '',
  tags: [],
  color: 'slate',
  pinned: false
})
const tagInput = ref('')

// Confirm dialog state
const confirmState = reactive({
  visible: false,
  title: '',
  message: '',
  onConfirm: null,
  onCancel: null
})

// Toast state
const toasts = ref([])
let toastIdCounter = 0

// Track initialization
let initialized = false

export function useNotes() {
  const { user, logout, updateTheme } = useAuth()
  const router = useRouter()

  const isDarkMode = computed(() => user.value?.theme === 'dark')

  // Toast helper
  const showToast = (message, type = 'error') => {
    const id = ++toastIdCounter
    toasts.value.push({ id, message, type })
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, 3500)
  }

  const dismissToast = (id) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  // Confirm dialog helper
  const showConfirm = (title, message) => {
    return new Promise((resolve) => {
      confirmState.visible = true
      confirmState.title = title
      confirmState.message = message
      confirmState.onConfirm = () => {
        confirmState.visible = false
        resolve(true)
      }
      confirmState.onCancel = () => {
        confirmState.visible = false
        resolve(false)
      }
    })
  }

  const handleUnauthorized = () => {
    logout()
    router.push({ name: 'Login' })
  }

  // Toggle theme
  const toggleTheme = async () => {
    if (themeSaving.value) return
    themeSaving.value = true
    try {
      await updateTheme(isDarkMode.value ? 'light' : 'dark')
    } finally {
      themeSaving.value = false
    }
  }

  // Select tag filter
  const handleSelectTag = (tag) => {
    selectedTag.value = tag
    isSidebarOpen.value = false
  }

  // Fetch notes
  const fetchNotes = async () => {
    loading.value = true
    error.value = ''
    try {
      const data = await api.getNotes()
      notes.value = data
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        handleUnauthorized()
      } else {
        error.value = 'Could not load notes. Please verify your database connection.'
      }
    } finally {
      loading.value = false
    }
  }

  // Initialize notes — called once from Dashboard
  const initNotes = () => {
    if (user.value && !initialized) {
      initialized = true
      fetchNotes()
    }
  }

  // Watch for user changes
  watch(() => user.value?.id, (newId, oldId) => {
    if (newId && newId !== oldId) {
      initialized = true
      fetchNotes()
    }
    if (!newId) {
      notes.value = []
      initialized = false
    }
  })

  // Computed: filtered notes
  const filteredNotes = computed(() => {
    return notes.value.filter(note => {
      const matchesTag = selectedTag.value ? (note.tags || []).includes(selectedTag.value) : true
      const q = searchQuery.value.trim().toLowerCase()
      const matchesSearch = q === '' ||
        note.title.toLowerCase().includes(q) ||
        note.content.toLowerCase().includes(q) ||
        (note.tags || []).some(t => t.toLowerCase().includes(q))
      return matchesTag && matchesSearch
    })
  })

  // Computed: unique tags
  const allTags = computed(() => {
    return Array.from(
      new Set(notes.value.flatMap(note => note.tags || []))
    ).sort()
  })

  // Computed: pinned and other
  const pinnedNotes = computed(() => filteredNotes.value.filter(n => n.pinned))
  const otherNotes = computed(() => filteredNotes.value.filter(n => !n.pinned))

  // Pin / Unpin toggle
  const handleTogglePin = async (e, note) => {
    e.stopPropagation()
    if (pinningIds.has(note.id)) return
    pinningIds.add(note.id)
    try {
      const updated = { ...note, pinned: !note.pinned }
      const result = await api.updateNote(note.id, updated)
      notes.value = notes.value.map(n => n.id === note.id ? result : n)
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        handleUnauthorized()
      } else {
        error.value = 'Failed to update pin status.'
      }
    } finally {
      pinningIds.delete(note.id)
    }
  }

  // Open Create Modal
  const handleOpenCreateModal = () => {
    editingNote.value = null
    noteForm.title = ''
    noteForm.content = ''
    noteForm.tags = []
    noteForm.color = 'slate'
    noteForm.pinned = false
    tagInput.value = ''
    isModalOpen.value = true
  }

  // Open Edit Modal
  const handleOpenEditModal = (note) => {
    editingNote.value = note
    noteForm.title = note.title
    noteForm.content = note.content
    noteForm.tags = [...(note.tags || [])]
    noteForm.color = note.color || 'slate'
    noteForm.pinned = note.pinned || false
    tagInput.value = ''
    isModalOpen.value = true
  }

  // Delete Note — uses ConfirmDialog, not window.confirm
  const handleDeleteNote = async (e, id) => {
    e.stopPropagation()
    const confirmed = await showConfirm(
      'Delete Note',
      'Are you sure you want to delete this note? This action cannot be undone.'
    )
    if (!confirmed) return
    if (deletingIds.has(id)) return
    deletingIds.add(id)
    try {
      await api.deleteNote(id)
      notes.value = notes.value.filter(n => n.id !== id)
      showToast('Note deleted successfully.', 'success')
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        handleUnauthorized()
      } else {
        showToast('Failed to delete the note.', 'error')
      }
    } finally {
      deletingIds.delete(id)
    }
  }

  // Form Submit — uses Toast, not alert()
  const handleFormSubmit = async () => {
    if (!noteForm.title.trim() && !noteForm.content.trim()) {
      showToast('Note cannot be completely empty.', 'warning')
      return
    }
    modalSaving.value = true
    try {
      const payload = {
        title: noteForm.title,
        content: noteForm.content,
        tags: noteForm.tags,
        color: noteForm.color,
        pinned: noteForm.pinned
      }
      let result
      if (editingNote.value) {
        result = await api.updateNote(editingNote.value.id, payload)
        notes.value = notes.value.map(n => n.id === editingNote.value.id ? result : n)
        showToast('Note updated successfully.', 'success')
      } else {
        result = await api.createNote(payload)
        notes.value = [result, ...notes.value].sort((a, b) => {
          if (a.pinned !== b.pinned) return b.pinned ? 1 : -1
          return new Date(b.updatedAt) - new Date(a.updatedAt)
        })
        showToast('Note created successfully.', 'success')
      }
      isModalOpen.value = false
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        handleUnauthorized()
      } else {
        showToast('Failed to save the note.', 'error')
      }
    } finally {
      modalSaving.value = false
    }
  }

  // Tag helpers
  const handleAddTag = () => {
    const trimmed = tagInput.value.trim().toLowerCase()
    if (trimmed && !noteForm.tags.includes(trimmed)) {
      noteForm.tags.push(trimmed)
    }
    tagInput.value = ''
  }

  const handleRemoveTag = (tagToRemove) => {
    noteForm.tags = noteForm.tags.filter(t => t !== tagToRemove)
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return {
    notes,
    loading,
    error,
    pinningIds,
    deletingIds,
    modalSaving,
    isDarkMode,
    themeSaving,
    isSidebarOpen,
    searchQuery,
    selectedTag,
    isModalOpen,
    editingNote,
    noteForm,
    tagInput,
    confirmState,
    toasts,
    filteredNotes,
    allTags,
    pinnedNotes,
    otherNotes,
    initNotes,
    fetchNotes,
    handleSelectTag,
    handleTogglePin,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleDeleteNote,
    handleFormSubmit,
    handleAddTag,
    handleRemoveTag,
    formatDate,
    toggleTheme,
    showToast,
    dismissToast,
    showConfirm
  }
}
