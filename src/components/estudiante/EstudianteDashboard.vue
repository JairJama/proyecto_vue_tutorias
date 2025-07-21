<script setup>
import { ref, onMounted } from 'vue'

const currentUser = ref(null)
const sesiones = ref([])
const solicitudes = ref([])

function logout() {
  if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
    localStorage.removeItem("currentUser")
    window.location.href = '/'
  }
}

function getMateriaName(materiaValue) {
  const materias = {
    "algebra-lineal": "Álgebra Lineal",
    "calculo-multivariable": "Cálculo Multivariable",
    "fisica-1": "Física I",
    "quimica-general": "Química General",
    programacion: "Programación",
    "matematicas-discretas": "Matemáticas Discretas",
  }
  return materias[materiaValue] || materiaValue
}

function estadoTexto(estado) {
  if (estado === "accepted") return "Aceptada"
  if (estado === "rejected") return "Rechazada"
  return "Pendiente"
}
function estadoColor(estado) {
  if (estado === "accepted") return "#10b981"
  if (estado === "rejected") return "#ef4444"
  return "#f59e0b"
}
function estadoIcon(estado) {
  if (estado === "accepted") return "fas fa-check-circle"
  if (estado === "rejected") return "fas fa-times-circle"
  return "fas fa-clock"
}

onMounted(() => {
  const data = localStorage.getItem("currentUser")
  if (!data) return (window.location.href = "/")

  currentUser.value = JSON.parse(data)
  if (currentUser.value.rol === "docente") return (window.location.href = "/dashboard-tutor")

  const allSesiones = JSON.parse(localStorage.getItem("sesionesProgramadas") || "[]")
  sesiones.value = allSesiones.filter(s => s.estudianteId === currentUser.value.id)

  const allSolicitudes = JSON.parse(localStorage.getItem("solicitudesTutoria") || "[]")
  solicitudes.value = allSolicitudes.filter(s => s.usuario.id === currentUser.value.id)
})
</script>

<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="logo-section">
        <div class="logo">
          <div class="logo-circle">
            <img src="../../assets/logo.png" alt="Logo" class="logo-image" />
          </div>
        </div>
      </div>
      <nav class="nav-menu">
        <ul>
          <li class="nav-item active">
            <router-link to="/estudiante/dashboard">
              <i class="fas fa-calendar-check"></i><span>Mis sesiones</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/estudiante/solicitar">
              <i class="fas fa-plus-circle"></i><span>Solicitar Tutoría</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/estudiante/historial">
              <i class="fas fa-history"></i><span>Historial</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/estudiante/perfil">
              <i class="fas fa-user"></i><span>Perfil</span>
            </router-link>
          </li>
        </ul>
      </nav>
      <div class="user-info">
        <div class="user-avatar"><i class="fas fa-user"></i></div>
        <div class="user-details">
          <h4>{{ currentUser?.nombre }}</h4>
          <p>{{ currentUser?.rol }}</p>
        </div>
        <button class="logout-btn" @click="logout">
          <i class="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="header">
        <h1>Mis Sesiones</h1>
        <router-link to="/estudiante/solicitar" class="btn btn-primary">
          <i class="fas fa-plus"></i> Nueva Solicitud
        </router-link>
      </div>

      <div class="section">
        <h2>Próximas Sesiones</h2>
        <div class="sesiones-grid">
          <div v-if="sesiones.length === 0" class="sesion-card">
            <h3>No tienes sesiones programadas</h3>
            <p>Cuando un tutor acepte tu solicitud, aparecerá aquí.</p>
          </div>
          <div v-for="sesion in sesiones" :key="sesion.id" class="sesion-card">
            <h3>{{ sesion.materiaNombre }}</h3>
            <p><strong>Tutor:</strong> {{ sesion.tutorNombre }}</p>
            <p><strong>Fecha:</strong> {{ sesion.fecha }}</p>
            <p><strong>Hora:</strong> {{ sesion.hora }}</p>
            <p><strong>Estado:</strong> <span style="color: #10b981; font-weight: bold;">Confirmada</span></p>
            <p v-if="sesion.comentarios"><strong>Notas:</strong> {{ sesion.comentarios }}</p>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Solicitudes Pendientes</h2>
        <div class="solicitudes-list">
          <div v-if="solicitudes.length === 0" class="solicitud-card">
            <h3>No tienes solicitudes</h3>
            <p>Solicita una nueva tutoría para comenzar.</p>
          </div>
          <div v-for="solicitud in solicitudes" :key="solicitud.id" class="solicitud-card">
            <h3>{{ getMateriaName(solicitud.materia) }}</h3>
            <p><strong>Fecha:</strong> {{ solicitud.fecha }}</p>
            <p><strong>Hora:</strong> {{ solicitud.hora }}</p>
            <p><strong>Estado:</strong>
              <span :style="{ color: estadoColor(solicitud.estado), fontWeight: 'bold' }">
                <i :class="estadoIcon(solicitud.estado)" style="margin-right: 5px;"></i>
                {{ estadoTexto(solicitud.estado) }}
              </span>
            </p>
            <p v-if="solicitud.tutorRespuesta"><strong>Tutor:</strong> {{ solicitud.tutorRespuesta }}</p>
            <p v-if="solicitud.estado === 'accepted'" style="color: #10b981; font-style: italic;">
              <i class="fas fa-info-circle"></i> Esta sesión aparece en "Próximas Sesiones"
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped src="../../assets/css/dashboard.css"></style>