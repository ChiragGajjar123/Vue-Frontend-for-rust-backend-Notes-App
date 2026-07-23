import { ref, readonly } from 'vue'
import { api } from '../services/api'

// Singleton reactive state — shared across all components
const user = ref(null)
const loading = ref(true)

// Initialize from localStorage on module load
const storedUser = localStorage.getItem('notes_app_user')
const token = localStorage.getItem('notes_app_token')
if (storedUser && token) {
  try {
    user.value = JSON.parse(storedUser)
  } catch {
    localStorage.removeItem('notes_app_user')
    localStorage.removeItem('notes_app_token')
  }
}
loading.value = false

export function useAuth() {
  const login = async (email, password) => {
    const data = await api.login(email, password)
    const userProfile = {
      id: data.id,
      username: data.username,
      email: data.email,
      theme: data.theme || 'light'
    }
    localStorage.setItem('notes_app_token', data.accessToken)
    localStorage.setItem('notes_app_user', JSON.stringify(userProfile))
    user.value = userProfile
    return data
  }

  const signup = async (username, email, password) => {
    return await api.signup(username, email, password)
  }

  const updateTheme = async (newTheme) => {
    try {
      await api.updateTheme(newTheme)
      if (user.value) {
        const updatedUser = { ...user.value, theme: newTheme }
        localStorage.setItem('notes_app_user', JSON.stringify(updatedUser))
        user.value = updatedUser
      }
    } catch (err) {
      console.error('Failed to sync theme preference with backend:', err)
    }
  }

  const logout = () => {
    localStorage.removeItem('notes_app_token')
    localStorage.removeItem('notes_app_user')
    user.value = null
  }

  return {
    user,
    loading: readonly(loading),
    login,
    signup,
    updateTheme,
    logout
  }
}
