<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const currentUser = ref(null)
const avatarInitials = ref('')
const especialidades = ref(['Álgebra', 'Cálculo', 'Física'])

const editModalOpen = ref(false)
const editNombre = ref('')
const editTitulo = ref('')
const editEmail = ref('')
const editTelefono = ref('')

const router = useRouter()

function logout() {
  if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
    localStorage.removeItem("currentUser")
    router.push("/")
  }
}

function openModal() {
  editNombre.value = currentUser.value?.nombre || ''
  editTitulo.value = currentUser.value?.titulo || ''
  editEmail.value = currentUser.value?.email || ''
  editTelefono.value = currentUser.value?.telefono || ''
  editModalOpen.value = true
}

function closeModal() {
  editModalOpen.value = false
}

function guardarPerfil() {
  if (!editNombre.value || !editEmail.value) {
    alert("Complete los campos obligatorios")
    return
  }

  currentUser.value.nombre = editNombre.value
  currentUser.value.titulo = editTitulo.value
  currentUser.value.email = editEmail.value
  currentUser.value.telefono = editTelefono.value

  localStorage.setItem("currentUser", JSON.stringify(currentUser.value))

  updateAvatarInitials()
  closeModal()
  alert("Perfil actualizado correctamente")
}

function updateAvatarInitials() {
  const initials = currentUser.value?.nombre?.split(" ").map(n => n.charAt(0)).join("").toUpperCase().substring(0, 2)
  avatarInitials.value = initials
}

onMounted(() => {
  const data = localStorage.getItem("currentUser")
  if (!data) return router.push("/")

  currentUser.value = JSON.parse(data)
  if (currentUser.value.rol !== "docente") return router.push("/estudiante/dashboard")

  updateAvatarInitials()
})
</script>

<template>
  <div class="dashboard-container">
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
          <li class="nav-item"><a href="/tutor/dashboard"><i class="fas fa-inbox"></i><span>Solicitudes Pendientes</span></a></li>
          <li class="nav-item"><a href="/tutor/agenda"><i class="fas fa-calendar"></i><span>Agenda</span></a></li>
          <li class="nav-item"><a href="/tutor/historial"><i class="fas fa-history"></i><span>Historial</span></a></li>
          <li class="nav-item active"><a href="/tutor/perfil"><i class="fas fa-user"></i><span>Perfil</span></a></li>
        </ul>
      </nav>

      <div class="user-info">
        <div class="user-avatar"><i class="fas fa-user"></i></div>
        <div class="user-details">
          <h4>{{ currentUser?.nombre }}</h4>
          <p>Tutor</p>
        </div>
        <button class="logout-btn" @click="logout"><i class="fas fa-sign-out-alt"></i></button>
      </div>
    </div>

    <div class="main-content">
      <div class="header"><h1>Mi Perfil</h1></div>

      <div class="profile-card">
        <div class="profile-avatar"><span>{{ avatarInitials }}</span></div>
        <div class="profile-info">
          <h2>{{ currentUser?.nombre }}</h2>
          <p>{{ currentUser?.titulo || 'Tutor de Matemáticas' }}</p>
          <p>{{ currentUser?.email }}</p>
          <p>{{ currentUser?.telefono || '+593 098 765 4321' }}</p>
        </div>
        <button class="btn btn-primary" @click="openModal"><i class="fas fa-edit"></i> Editar Perfil</button>
      </div>

      <div class="section">
        <h2>Especialidades</h2>
        <div class="especialidades-container">
          <span class="especialidad-tag" v-for="esp in especialidades" :key="esp">{{ esp }}</span>
        </div>
      </div>

      <div class="section">
        <h2>Configuración</h2>
        <div class="config-grid">
          <button class="config-btn" @click="alert('Funcionalidad en desarrollo')"><i class="fas fa-lock"></i><span>Cambiar Contraseña</span></button>
          <button class="config-btn" @click="alert('Funcionalidad en desarrollo')"><i class="fas fa-bell"></i><span>Notificaciones</span></button>
          <button class="config-btn" @click="alert('Funcionalidad en desarrollo')"><i class="fas fa-clock"></i><span>Horarios</span></button>
        </div>
      </div>
    </div>

    <div v-if="editModalOpen" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Editar Perfil</h3>
          <span class="close" @click="closeModal">&times;</span>
        </div>
        <div class="modal-body">
          <form @submit.prevent="guardarPerfil">
            <div class="form-field"><label>Nombre completo</label><input v-model="editNombre" type="text" required /></div>
            <div class="form-field"><label>Título profesional</label><input v-model="editTitulo" type="text" /></div>
            <div class="form-field"><label>Correo electrónico</label><input v-model="editEmail" type="email" required /></div>
            <div class="form-field"><label>Teléfono</label><input v-model="editTelefono" type="tel" /></div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal">Cancelar</button>
          <button class="btn btn-primary" @click="guardarPerfil">Guardar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped src="../../assets/css/perfil-tutor.css"></style>
