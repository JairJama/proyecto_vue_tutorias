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
            <router-link to="/tutor/dashboard"><i class="fas fa-inbox"></i><span>Solicitudes Pendientes</span></router-link>
          </li>
          <li class="nav-item active">
            <router-link to="/tutor/agenda"><i class="fas fa-calendar"></i><span>Agenda</span></router-link>
          </li>
          <li class="nav-item">
            <router-link to="/tutor/historial"><i class="fas fa-history"></i><span>Historial</span></router-link>
          </li>
          <li class="nav-item">
            <router-link to="/tutor/perfil"><i class="fas fa-user"></i><span>Perfil</span></router-link>
          </li>
        </ul>
      </nav>
      <div class="user-info">
        <div class="user-avatar"><i class="fas fa-user"></i></div>
        <div class="user-details">
          <h4 id="userName">{{ currentUser?.nombre }}</h4>
          <p id="userRole">Tutor</p>
        </div>
        <button class="logout-btn" @click="logout"><i class="fas fa-sign-out-alt"></i></button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="agenda-container">
        <div class="agenda-header">
          <div class="agenda-title">
            <h1>Mi Agenda</h1>
            <p id="currentDate">{{ formattedDate }}</p>
          </div>
          <div class="disponibilidad-toggle">
            <span>Disponible</span>
            <label class="switch">
              <input type="checkbox" v-model="isDisponible" @change="toggleDisponibilidad" />
              <span class="slider round"></span>
            </label>
          </div>
        </div>

        <div class="resumen-dia">
          <div class="resumen-info">
            <h2>Resumen del día</h2>
            <p><span>{{ resumen.sesiones }}</span> sesiones programadas • <span>{{ resumen.horas }}</span> horas <span>{{ resumen.minutos }}</span> minutos total</p>
          </div>
          <button class="btn btn-outline" @click="alert('Funcionalidad en desarrollo')">
            <i class="fas fa-clock"></i>
            Gestionar Horarios
          </button>
        </div>

        <div class="sesiones-container">
          <div class="sesiones-list" id="sesionesList">
            <div v-for="s in sesiones" :key="s.id" class="sesion-item">
              {{ s.materia }} - {{ s.estudiante.nombre }} ({{ s.fecha }} {{ s.hora }})
            </div>
          </div>
        </div>

        <div class="agenda-actions">
          <button class="btn btn-outline" @click="alert('Funcionalidad de vista semanal en desarrollo')">
            <i class="fas fa-calendar-week"></i>
            Ver Semana Completa
          </button>
          <button class="btn btn-primary" @click="modalVisible = true">
            <i class="fas fa-plus"></i>
            Nueva Sesión
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para Nueva Sesion -->
    <div class="modal" v-if="modalVisible">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Programar Nueva Sesión</h3>
          <span class="close" @click="modalVisible = false">&times;</span>
        </div>
        <div class="modal-body">
          <form @submit.prevent="guardarSesion">
            <div class="form-field">
              <label>Materia</label>
              <select v-model="form.materia" required>
                <option value="">Seleccionar materia</option>
                <option value="algebra-lineal">Álgebra Lineal</option>
                <option value="calculo-1">Cálculo I</option>
                <option value="fisica-mecanica">Física Mecánica</option>
                <option value="quimica-general">Química General</option>
                <option value="programacion">Programación</option>
              </select>
            </div>

            <div class="form-field">
              <label>Estudiante</label>
              <select v-model="form.estudiante" required>
                <option value="">Seleccionar estudiante</option>
                <option v-for="e in estudiantes" :value="e.id">{{ e.nombre }}</option>
              </select>
            </div>

            <div class="form-row">
              <div class="form-field">
                <label>Fecha</label>
                <input type="date" v-model="form.fecha" required />
              </div>
              <div class="form-field">
                <label>Hora</label>
                <input type="time" v-model="form.hora" required />
              </div>
            </div>

            <div class="form-field">
              <label>Duración</label>
              <select v-model="form.duracion" required>
                <option value="30">30 minutos</option>
                <option value="45">45 minutos</option>
                <option value="60">60 minutos</option>
              </select>
            </div>

            <div class="form-field">
              <label>Notas</label>
              <textarea v-model="form.notas" rows="3" placeholder="Notas..."></textarea>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="modalVisible = false">Cancelar</button>
              <button type="submit" class="btn btn-primary">Guardar Sesión</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentUser = ref(null)
const sesiones = ref([])
const isDisponible = ref(true)
const modalVisible = ref(false)

const form = ref({
  materia: '',
  estudiante: '',
  fecha: '',
  hora: '',
  duracion: 45,
  notas: '',
})

const estudiantes = [
  { id: 1, nombre: 'Ana García' },
  { id: 2, nombre: 'Mario López' },
  { id: 3, nombre: 'Carmen Ruiz' },
  { id: 4, nombre: 'Juan Pérez' },
  { id: 5, nombre: 'Laura Mendoza' },
]

const resumen = ref({ sesiones: 3, horas: 2, minutos: 15 })

const formattedDate = computed(() => {
  const d = new Date()
  return d.toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })
})

onMounted(() => {
  const data = localStorage.getItem('currentUser')
  if (!data) return (window.location.href = '/')

  currentUser.value = JSON.parse(data)
  if (currentUser.value.rol !== 'docente') {
    alert('Redirigiendo al panel de estudiante')
    return router.push('/estudiante/dashboard')
  }
})

function toggleDisponibilidad() {
  if (isDisponible.value) {
    alert('Ahora estás disponible para recibir solicitudes')
  } else {
    alert('Has pausado la recepción de solicitudes')
  }
}

function guardarSesion() {
  if (!form.value.materia || !form.value.estudiante || !form.value.fecha || !form.value.hora) {
    alert('Por favor completa todos los campos')
    return
  }

  const estudiante = estudiantes.find(e => e.id === parseInt(form.value.estudiante))

  const nuevaSesion = {
    id: Date.now(),
    materia: form.value.materia,
    estudiante: estudiante,
    fecha: form.value.fecha,
    hora: form.value.hora,
    duracion: parseInt(form.value.duracion),
    notas: form.value.notas,
    estado: 'pendiente',
    tutor: currentUser.value.id,
    fechaCreacion: new Date().toISOString(),
  }

  sesiones.value.push(nuevaSesion)
  modalVisible.value = false
  alert('Sesión programada correctamente')
}

function logout() {
  if (confirm('Cerrar sesión?')) {
    localStorage.removeItem('currentUser')
    router.push('/')
  }
}
</script>

<style scoped src="../../assets/css/agenda-tutor.css"></style>
