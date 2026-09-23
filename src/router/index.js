import { createRouter, createWebHistory } from 'vue-router'

const ChatView = () => import('../views/ChatView.vue')
const LoginView = () => import('../views/LoginView.vue')
const AdminView = () => import('../views/admin/AdminView.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/chat' },
    { path: '/chat/:sessionId?', name: 'chat', component: ChatView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/admin', name: 'admin', component: AdminView, meta: { requiresAuth: true } },
    { path: '/:pathMatch(.*)*', redirect: '/chat' },
  ],
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !localStorage.getItem('zhiku_token')) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.name === 'login' && localStorage.getItem('zhiku_token')) return { name: 'admin' }
})

export default router
