<script setup>
import { onMounted, ref } from 'vue'

import logo from '../../assets/logo.png'

const currentUser = ref(null)
const sesiones = ref([])

const totalSesiones = ref(0)
const horasTotales = ref(0)

const mostrarEstado = (estado) => {
  if (estado === 'completada') return 'Completada'
  if (estado === 'cancelada') return 'Cancelada'
  return estado
}

function logout() {
  if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
    localStorage.removeItem('currentUser')
    window.location.href = '/'
  }
}

onMounted(() => {
  const data = localStorage.getItem('currentUser')
  if (!data) return (window.location.href = '/')

  currentUser.value = JSON.parse(data)
  cargarHistorial()
})

function cargarHistorial() {
  // Simulamos carga de historial (puedes usar localStorage si deseas)
  sesiones.value = [
    {
      materia: 'Álgebra Lineal',
      tutor: 'Prof. García',
      fecha: '15/05/2025',
      hora: '15:30',
      estado: 'completada'
    },
    {
      materia: 'Cálculo I',
      tutor: 'Prof. López',
      fecha: '10/05/2025',
      hora: '10:00',
      estado: 'completada'
    },
    {
      materia: 'Física I',
      tutor: 'Prof. Martínez',
      fecha: '05/05/2025',
      hora: '16:00',
      estado: 'cancelada'
    }
  ]

  totalSesiones.value = sesiones.value.length
  horasTotales.value = Math.round(totalSesiones.value * 0.75)
}
</script>

<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="logo-section">
        <div class="logo">
          <div class="logo-circle">
            <img :src="logo" alt="Logo" class="logo-image" />
          </div>
        </div>
      </div>

      <nav class="nav-menu">
        <ul>
          <li class="nav-item">
            <a href="/estudiante/dashboard">
              <i class="fas fa-calendar-check"></i>
              <span>Mis sesiones</span>
            </a>
          </li>
          <li class="nav-item">
            <a href="/estudiante/solicitar">
              <i class="fas fa-plus-circle"></i>
              <span>Solicitar Tutoría</span>
            </a>
          </li>
          <li class="nav-item active">
            <a href="#">
              <i class="fas fa-history"></i>
              <span>Historial</span>
            </a>
          </li>
          <li class="nav-item">
            <a href="/estudiante/perfil">
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
          <p>{{ currentUser?.rol || 'Estudiante' }}</p>
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
          <div class="stat-number">{{ totalSesiones }}</div>
        </div>
        <div class="stat-card">
          <h3>Horas Totales</h3>
          <div class="stat-number">{{ horasTotales }}</div>
        </div>
      </div>

      <!-- Lista -->
      <div class="section">
        <h2>Sesiones Anteriores</h2>
        <div class="sesiones-list">
          <div
            v-for="sesion in sesiones"
            :key="sesion.fecha + sesion.hora"
            class="sesion-card"
            :class="sesion.estado"
          >
            <h3>{{ sesion.materia }}</h3>
            <p><strong>Tutor:</strong> {{ sesion.tutor }}</p>
            <p><strong>Fecha:</strong> {{ sesion.fecha }}</p>
            <p><strong>Hora:</strong> {{ sesion.hora }}</p>
            <span class="estado-badge" :class="sesion.estado">
              {{ mostrarEstado(sesion.estado) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped src="../../assets/css/HistorialEstudiante.css"></style>