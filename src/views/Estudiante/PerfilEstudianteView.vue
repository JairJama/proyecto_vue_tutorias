<script setup>
import { ref, onMounted } from 'vue'
import logo from '../../assets/logo.png'

// Datos del usuario
const currentUser = ref(null)
const avatarInitials = ref('')
const showModal = ref(false)

// Campos del formulario de edición
const editNombre = ref('')
const editEmail = ref('')
const editCarrera = ref('')

// Inicialización
onMounted(() => {
  const userData = localStorage.getItem('currentUser')
  if (!userData) {
    window.location.href = '/'
    return
  }

  currentUser.value = JSON.parse(userData)
  updateUserDisplay()
})

// Iniciales del avatar
function updateUserDisplay() {
  if (!currentUser.value) return
  const nombres = currentUser.value.nombre.split(' ')
  avatarInitials.value = nombres.map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

function logout() {
  if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
    localStorage.removeItem('currentUser')
    window.location.href = '/'
  }
}

function openModal() {
  editNombre.value = currentUser.value?.nombre || ''
  editEmail.value = currentUser.value?.email || ''
  editCarrera.value = currentUser.value?.carrera || ''
  showModal.value = true
}

function guardarPerfil() {
  if (!editNombre.value.trim() || !editEmail.value.trim()) {
    alert('Complete los campos obligatorios')
    return
  }
  currentUser.value.nombre = editNombre.value
  currentUser.value.email = editEmail.value
  currentUser.value.carrera = editCarrera.value

  localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
  updateUserDisplay()
  showModal.value = false
  alert('Perfil actualizado correctamente')
}
</script>

<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="logo-section">
        <div class="logo">
          <div class="logo-circle">
            <img :src="logo" alt="ULEAM Logo" class="logo-image" />
          </div>
        </div>
      </div>

      <nav class="nav-menu">
        <ul>
          <li class="nav-item">
            <a href="/estudiante/dashboard"><i class="fas fa-calendar-check"></i><span>Mis sesiones</span></a>
          </li>
          <li class="nav-item">
            <a href="/estudiante/solicitar"><i class="fas fa-plus-circle"></i><span>Solicitar Tutoría</span></a>
          </li>
          <li class="nav-item">
            <a href="/estudiante/historial"><i class="fas fa-history"></i><span>Historial</span></a>
          </li>
          <li class="nav-item active">
            <a href="#"><i class="fas fa-user"></i><span>Perfil</span></a>
          </li>
        </ul>
      </nav>

      <div class="user-info">
        <div class="user-avatar"><i class="fas fa-user"></i></div>
        <div class="user-details">
          <h4>{{ currentUser?.nombre }}</h4>
          <p>Estudiante</p>
        </div>
        <button class="logout-btn" @click="logout">
          <i class="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="header">
        <h1>Mi Perfil</h1>
      </div>

      <!-- Perfil -->
      <div class="profile-card">
        <div class="profile-avatar">
          <span>{{ avatarInitials }}</span>
        </div>
        <div class="profile-info">
          <h2>{{ currentUser?.nombre }}</h2>
          <p>{{ currentUser?.email }}</p>
          <p>{{ currentUser?.carrera || 'Ingeniería en Sistemas' }}</p>
        </div>
        <button class="btn btn-primary" @click="openModal">
          <i class="fas fa-edit"></i> Editar Perfil
        </button>
      </div>

      <!-- Configuración -->
      <div class="section">
        <h2>Configuración</h2>
        <div class="config-grid">
          <button class="config-btn" @click="alert('Funcionalidad en desarrollo')">
            <i class="fas fa-lock"></i><span>Cambiar Contraseña</span>
          </button>
          <button class="config-btn" @click="alert('Funcionalidad en desarrollo')">
            <i class="fas fa-bell"></i><span>Notificaciones</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal" v-if="showModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Editar Perfil</h3>
          <span class="close" @click="showModal = false">&times;</span>
        </div>
        <div class="modal-body">
          <form>
            <div class="form-field">
              <label for="editNombre">Nombre completo</label>
              <input type="text" id="editNombre" v-model="editNombre" required />
            </div>
            <div class="form-field">
              <label for="editEmail">Correo electrónico</label>
              <input type="email" id="editEmail" v-model="editEmail" required />
            </div>
            <div class="form-field">
              <label for="editCarrera">Carrera</label>
              <input type="text" id="editCarrera" v-model="editCarrera" />
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showModal = false">Cancelar</button>
          <button class="btn btn-primary" @click="guardarPerfil">Guardar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped src="../../assets/css/PerfilEstudiante.css"></style>