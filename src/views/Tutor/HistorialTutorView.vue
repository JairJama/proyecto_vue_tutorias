<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="logo-section">
        <div class="logo">
          <div class="logo-circle">
            <img src="../../assets/logo.png" alt="ULEAM Logo" class="logo-image" />
          </div>
        </div>
      </div>
      <nav class="nav-menu">
        <ul>
          <li class="nav-item">
            <a href="/tutor/dashboard">
              <i class="fas fa-inbox"></i>
              <span>Solicitudes Pendientes</span>
            </a>
          </li>
          <li class="nav-item">
            <a href="/tutor/agenda">
              <i class="fas fa-calendar"></i>
              <span>Agenda</span>
            </a>
          </li>
          <li class="nav-item active">
            <a href="/tutor/historial">
              <i class="fas fa-history"></i>
              <span>Historial</span>
            </a>
          </li>
          <li class="nav-item">
            <a href="/tutor/perfil">
              <i class="fas fa-user"></i>
              <span>Perfil</span>
            </a>
          </li>
        </ul>
      </nav>
      <div class="user-info">
        <div class="user-avatar">
          <i class="fas fa-user"></i>
        </div>
        <div class="user-details">
          <h4>{{ currentUser?.nombre }}</h4>
          <p>Tutor</p>
        </div>
        <button class="logout-btn" @click="logout">
          <i class="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="header">
        <h1>Historial de Sesiones</h1>
      </div>

      <!-- Estadísticas -->
      <div class="stats-container">
        <div class="stat-card">
          <h3>Total Sesiones</h3>
          <div class="stat-number">{{ sesionesFiltradas.length }}</div>
        </div>
        <div class="stat-card">
          <h3>Horas Totales</h3>
          <div class="stat-number">{{ Math.round(sesionesFiltradas.length * 0.75) }}</div>
        </div>
      </div>

      <!-- Búsqueda -->
      <div class="search-section">
        <input type="text" v-model="searchTerm" placeholder="Buscar estudiante..." />
      </div>

      <!-- Lista de sesiones -->
      <div class="section">
        <h2>Sesiones Recientes</h2>
        <div class="sesiones-list">
          <div
            v-for="(sesion, index) in sesionesFiltradas"
            :key="index"
            class="sesion-card"
            :class="sesion.estado"
          >
            <div class="sesion-info">
              <h3>{{ sesion.materia }} - {{ sesion.estudiante }}</h3>
              <p><strong>Fecha:</strong> {{ sesion.fecha }}</p>
              <p><strong>Hora:</strong> {{ sesion.hora }}</p>
            </div>
            <span class="estado-badge" :class="sesion.estado">
              {{ sesion.estado === 'completada' ? 'Completada' : 'Cancelada' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentUser = ref(null)
const sesionesData = ref([])
const searchTerm = ref('')

const sesionesFiltradas = computed(() => {
  if (!searchTerm.value) return sesionesData.value
  return sesionesData.value.filter(s =>
    s.estudiante.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

function logout() {
  if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
    localStorage.removeItem("currentUser")
    router.push("/")
  }
}

onMounted(() => {
  const userData = localStorage.getItem('currentUser')
  if (!userData) return router.push('/')
  const parsed = JSON.parse(userData)
  if (parsed.rol !== 'docente') return router.push('/estudiante/dashboard')
  currentUser.value = parsed

  sesionesData.value = [
    {
      materia: "Álgebra Lineal",
      estudiante: "Ana García",
      fecha: "20/05/2025",
      hora: "15:30",
      estado: "completada",
    },
    {
      materia: "Cálculo I",
      estudiante: "Mario López",
      fecha: "18/05/2025",
      hora: "10:00",
      estado: "completada",
    },
    {
      materia: "Física I",
      estudiante: "Carmen Ruiz",
      fecha: "15/05/2025",
      hora: "16:00",
      estado: "cancelada",
    },
    {
      materia: "Álgebra Lineal",
      estudiante: "Juan Pérez",
      fecha: "12/05/2025",
      hora: "14:00",
      estado: "completada",
    }
  ]
})
</script>

<style scoped src="../../assets/css/historial-tutor.css"></style>
