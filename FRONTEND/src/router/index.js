import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

// ── Lazy-load de vistas ──────────────────────────────────
const HomeView           = () => import('@/views/turista/HomeView.vue')
const ExplorarView       = () => import('@/views/turista/ExplorarView.vue')
const AlojamientoDetalle = () => import('@/views/turista/AlojamientoDetalleView.vue')
const ReservaView        = () => import('@/views/turista/ReservaView.vue')
const MisReservasView    = () => import('@/views/turista/MisReservasView.vue')
const LoginView          = () => import('@/views/auth/LoginView.vue')
const RegisterView       = () => import('@/views/auth/RegisterView.vue')
const AnfitrionPanel     = () => import('@/views/anfitrion/AnfitrionPanelView.vue')
const NuevaPublicacion   = () => import('@/views/anfitrion/NuevaPublicacionView.vue')
const AdminDashboard     = () => import('@/views/admin/AdminDashboardView.vue')
const AdminUsuarios      = () => import('@/views/admin/AdminUsuariosView.vue')

const routes = [
  // ── Públicas ───────────────────────────────────────────
  { path: '/',               name: 'home',       component: HomeView },
  { path: '/explorar',       name: 'explorar',   component: ExplorarView },
  { path: '/alojamiento/:id',name: 'detalle',    component: AlojamientoDetalle },
  { path: '/login',          name: 'login',      component: LoginView,    meta: { guestOnly: true } },
  { path: '/register',       name: 'register',   component: RegisterView, meta: { guestOnly: true } },

  // ── Turista ────────────────────────────────────────────
  { path: '/reservar/:id',   name: 'reservar',   component: ReservaView,     meta: { requiresAuth: true, role: 'turista' } },
  { path: '/mis-reservas',   name: 'mis-reservas',component: MisReservasView, meta: { requiresAuth: true, role: 'turista' } },

  // ── Anfitrión ──────────────────────────────────────────
  { path: '/anfitrion',              name: 'anfitrion-panel',  component: AnfitrionPanel,   meta: { requiresAuth: true, role: 'anfitrion' } },
  { path: '/anfitrion/nueva',        name: 'nueva-publicacion',component: NuevaPublicacion, meta: { requiresAuth: true, role: 'anfitrion' } },
  { path: '/anfitrion/editar/:id',   name: 'editar-publicacion',component: NuevaPublicacion,meta: { requiresAuth: true, role: 'anfitrion' } },

  // ── Admin ──────────────────────────────────────────────
  { path: '/admin',          name: 'admin-dashboard', component: AdminDashboard, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/admin/usuarios', name: 'admin-usuarios',  component: AdminUsuarios,  meta: { requiresAuth: true, role: 'admin' } },

  // ── 404 ────────────────────────────────────────────────
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  },
})

// ── Navigation Guard ─────────────────────────────────────
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  // Solo para invitados (login/register)
  if (to.meta.guestOnly && auth.isLoggedIn) {
    return next(_redirectByRole(auth.userRole))
  }

  // Ruta protegida: necesita autenticación
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }

  // Verificar rol específico
  if (to.meta.role && auth.userRole !== to.meta.role) {
    return next(_redirectByRole(auth.userRole))
  }

  next()
})

function _redirectByRole(role) {
  if (role === 'admin')     return { name: 'admin-dashboard' }
  if (role === 'anfitrion') return { name: 'anfitrion-panel' }
  return { name: 'home' }
}

export default router
