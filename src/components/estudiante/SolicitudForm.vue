<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import logo from '../../assets/logo.png'

const router = useRouter()
const currentUser = ref(null)
const selectedMateria = ref('')
const fechaTutoria = ref('')
const horaTutoria = ref('')
const comentarios = ref('')
const showModal = ref(false)

const fechaMin = ref('')
const fechaMax = ref('')

// Objeto con las materias disponibles
const materias = {
  'algebra-lineal': {
    nombre: 'Álgebra Lineal',
    descripcion: 'Matrices, vectores, sistemas',
    icon: 'fa-calculator'
  },
  'calculo-multivariable': {
    nombre: 'Cálculo Multivariable',
    descripcion: 'Derivadas, integrales múltiples',
    icon: 'fa-chart-line'
  },
  'fisica-1': {
    nombre: 'Física I',
    descripcion: 'Mecánica, cinemática',
    icon: 'fa-atom'
  },
  'programacion': {
    nombre: 'Programación',
    descripcion: 'Algoritmos, estructuras',
    icon: 'fa-code'
  }
}

function logout() {
  if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
    localStorage.removeItem('currentUser')
    router.push('/')
  }
}

onMounted(() => {
  const data = localStorage.getItem('currentUser')
  if (!data) return router.push('/')
  currentUser.value = JSON.parse(data)
  setupDateLimits()
})

function setupDateLimits() {
  const today = new Date()
  const maxDate = new Date()
  maxDate.setDate(today.getDate() + 30)

  fechaMin.value = today.toISOString().split('T')[0]
  fechaMax.value = maxDate.toISOString().split('T')[0]
}

function selectMateria(m) {
  selectedMateria.value = m
}

function enviarSolicitud() {
  if (!selectedMateria.value || !fechaTutoria.value || !horaTutoria.value) {
    alert('Por favor, completa todos los campos obligatorios.')
    return
  }

  const nueva = {
    id: Date.now(),
    materia: selectedMateria.value,
    fecha: formatearFecha(fechaTutoria.value),
    hora: horaTutoria.value,
    comentarios: comentarios.value,
    usuario: {
      id: currentUser.value.id,
      nombre: currentUser.value.nombre,
      email: currentUser.value.email,
      carrera: currentUser.value.carrera || 'No especificada'
    },
    fechaCreacion: new Date().toISOString(),
    estado: 'pending'
  }

  const todas = JSON.parse(localStorage.getItem('solicitudesTutoria') || '[]')
  todas.push(nueva)
  localStorage.setItem('solicitudesTutoria', JSON.stringify(todas))

  showModal.value = true
}

function formatearFecha(fechaStr) {
  const fecha = new Date(fechaStr)
  return fecha.toLocaleDateString('es-EC')
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
            <router-link to="/estudiante/dashboard">
              <i class="fas fa-calendar-check"></i>
              <span>Mis sesiones</span>
            </router-link>
          </li>
          <li class="nav-item active">
            <router-link to="/estudiante/solicitar">
              <i class="fas fa-plus-circle"></i>
              <span>Solicitar Tutoría</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/estudiante/historial">
              <i class="fas fa-history"></i>
              <span>Historial</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/estudiante/perfil">
              <i class="fas fa-user"></i>
              <span>Perfil</span>
            </router-link>
          </li>
        </ul>
      </nav>

      <div class="user-info">
        <div class="user-avatar"><i class="fas fa-user"></i></div>
        <div class="user-details">
          <h4>{{ currentUser?.nombre }}</h4>
          <p>{{ currentUser?.rol || 'Estudiante' }}</p>
        </div>
        <button class="logout-btn" @click="logout"><i class="fas fa-sign-out-alt"></i></button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="header">
        <h1>Solicitar Nueva Tutoría</h1>
        <router-link to="/estudiante/dashboard" class="btn btn-secondary">
          <i class="fas fa-arrow-left"></i> Volver
        </router-link>
      </div>

      <div class="form-container">
        <form @submit.prevent="enviarSolicitud">
          <!-- Materias -->
          <div class="form-section">
            <h2>Selecciona la materia</h2>
            <div class="materias-grid">
              <div
                class="materia-card"
                v-for="(materia, id) in materias"
                :key="id"
                :class="{ selected: selectedMateria === id }"
                @click="selectMateria(id)"
              >
                <i class="fas" :class="materia.icon"></i>
                <h3>{{ materia.nombre }}</h3>
                <p>{{ materia.descripcion }}</p>
              </div>
            </div>
          </div>

          <!-- Fecha y hora -->
          <div class="form-section">
            <h2>Fecha y hora</h2>
            <div class="datetime-container">
              <div class="form-field">
                <label for="fechaTutoria">Fecha</label>
                <input
                  type="date"
                  id="fechaTutoria"
                  v-model="fechaTutoria"
                  :min="fechaMin"
                  :max="fechaMax"
                  required
                />
              </div>
              <div class="form-field">
                <label for="horaTutoria">Hora</label>
                <select id="horaTutoria" v-model="horaTutoria" required>
                  <option value="">Seleccionar hora</option>
                  <option value="08:00">08:00 - 08:45</option>
                  <option value="09:00">09:00 - 09:45</option>
                  <option value="10:00">10:00 - 10:45</option>
                  <option value="11:00">11:00 - 11:45</option>
                  <option value="14:00">14:00 - 14:45</option>
                  <option value="15:00">15:00 - 15:45</option>
                  <option value="16:00">16:00 - 16:45</option>
                  <option value="17:00">17:00 - 17:45</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Comentarios -->
          <div class="form-section">
            <h2>Comentarios adicionales</h2>
            <div class="form-field">
              <label for="comentarios">Describe qué temas necesitas repasar</label>
              <textarea
                id="comentarios"
                rows="4"
                v-model="comentarios"
                placeholder="Ej: Necesito ayuda con ecuaciones..."
              ></textarea>
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-full">
            <i class="fas fa-paper-plane"></i> Enviar Solicitud
          </button>
        </form>
      </div>
    </div>

    <!-- Modal de confirmación -->
    <div class="modal" v-if="showModal">
      <div class="modal-content">
        <h3>¡Solicitud enviada!</h3>
        <p>Tu solicitud ha sido enviada correctamente.</p>
        <div class="modal-actions">
          <router-link to="/estudiante/dashboard" class="btn btn-primary">
            Volver al Dashboard
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped src="../../assets/css/solicitar.css"></style>