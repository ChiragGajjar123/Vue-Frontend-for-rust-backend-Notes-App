import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'

import Login from '../components/Login.vue'
import Signup from '../components/Signup.vue'
import Dashboard from '../components/Dashboard.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guest: true }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    meta: { guest: true }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  const { user, loading } = useAuth()

  if (loading.value) {
    next()
    return
  }

  if (to.meta.requiresAuth && !user.value) {
    next({ name: 'Login', replace: true })
  } else if (to.meta.guest && user.value) {
    next({ name: 'Dashboard', replace: true })
  } else {
    next()
  }
})

export default router
