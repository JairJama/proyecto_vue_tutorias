import { createRouter, createWebHistory } from 'vue-router'

// Importaciones existentes
import HomeView from '../views/HomeView.vue'
import IndexAdmin from '../views/admin/IndexAdmin.vue'
import DashboardView from '../views/Estudiante/DashboardView.vue'
import SolicitarView from '../views/Estudiante/SolicitarView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/admin',
    name: 'admin',
    component: IndexAdmin,
  },
  {
    path: '/admin/dashboard',
    name: 'DashboardAdminTutor',
    component: () => import('../views/admin/DashboardAdminView.vue'),
  },
  {
    path: '/admin/configuracion',
    name: 'ConfiguracionAdmin',
    component: () => import('../views/admin/ConfiguracionAdminView.vue'),
  },
  {
    path: '/estudiante/dashboard',
    name: 'DashboardEstudiante',
    component: DashboardView,
  },
  {
    path: '/estudiante/solicitar',
    name: 'EstudianteSolicitar',
    component: SolicitarView,
  },
  {
    path: '/estudiante/historial',
    name: 'EstudianteHistorial',
    component: () => import('../views/Estudiante/HistorialView.vue'),
  },
  {
    path: '/estudiante/perfil',
    name: 'EstudiantePerfil',
    component: () => import('../views/Estudiante/PerfilEstudianteView.vue'),
  },
  {
    path: '/tutor/dashboard',
    name: 'DashboardTutor',
    component: () => import('../views/Tutor/DashboardTutorView.vue'),
  },
  {
    path: '/tutor/agenda',
    name: 'AgendaTutor',
    component: () => import('../views/Tutor/AgendaTutorView.vue'),
  },
  {
    path: '/tutor/historial',
    name: 'HistorialTutor',
    component: () => import('../views/Tutor/HistorialTutorView.vue'),
  },
  {
    path: '/tutor/perfil',
    name: 'PerfilTutor',
    component: () => import('../views/Tutor/PerfilTutorView.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
