<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <aside class="sidebar">
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
            <RouterLink to="/admin/dashboard">
              <i class="fas fa-users"></i>
              <span>Gestión de Usuarios</span>
            </RouterLink>
          </li>
          <li class="nav-item active">
            <RouterLink to="/admin/configuracion">
              <i class="fas fa-cog"></i>
              <span>Configuración</span>
            </RouterLink>
          </li>
        </ul>
      </nav>
      <div class="user-info">
        <div class="user-avatar"><i class="fas fa-user"></i></div>
        <div class="user-details">
          <h4>{{ currentUser.nombre }}</h4>
          <p>Admin</p>
        </div>
        <button class="logout-btn" @click="logout">
          <i class="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <div class="config-container">
        <div class="config-header">
          <h1>Configuración del Sistema</h1>
          <button class="btn btn-primary" @click="guardarConfiguracion">
            <i class="fas fa-save"></i> Guardar Cambios
          </button>
        </div>

        <div class="config-content">
          <section class="config-section">
            <h2>Información del Sistema</h2>
            <div class="form-row">
              <div class="form-field">
                <label>Nombre del Sistema</label>
                <input type="text" v-model="config.nombreSistema" />
              </div>
              <div class="form-field">
                <label>Versión</label>
                <input type="text" v-model="config.version" />
              </div>
            </div>
          </section>

          <section class="config-section">
            <h2>Horarios de Operación</h2>
            <div class="form-row">
              <div class="form-field">
                <label>Hora de inicio</label>
                <input type="time" v-model="config.horaInicio" />
              </div>
              <div class="form-field">
                <label>Hora de fin</label>
                <input type="time" v-model="config.horaFin" />
              </div>
            </div>
          </section>

          <section class="config-section">
            <h2>Configuración de Sesiones</h2>
            <div class="form-row">
              <div class="form-field">
                <label>Duración máxima (horas)</label>
                <input type="number" v-model.number="config.duracionMaxima" min="1" max="5" />
              </div>
              <div class="form-field">
                <label>Sesiones por tutor (máx)</label>
                <input type="number" v-model.number="config.sesionesMaximas" min="1" max="10" />
              </div>
            </div>
          </section>

          <section class="config-section">
            <h2>Materias Disponibles</h2>
            <div class="materias-container">
              <div class="materias-list">
                <div
                  class="materia-tag"
                  v-for="(materia, index) in config.materias"
                  :key="index"
                >
                  <span>{{ materia }}</span>
                  <button class="remove-btn" @click="removeMateria(index)">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
              <button class="btn btn-add" @click="showMateriaModal = true">
                <i class="fas fa-plus"></i> Agregar Materia
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>

    <!-- Modal -->
    <div class="modal" :class="{ hidden: !showMateriaModal }">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Agregar Nueva Materia</h3>
          <span class="close" @click="showMateriaModal = false">&times;</span>
        </div>
        <div class="modal-body">
          <div class="form-field">
            <label>Nombre de la materia</label>
            <input type="text" v-model="nuevaMateria" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showMateriaModal = false">Cancelar</button>
          <button class="btn btn-primary" @click="agregarMateria">Agregar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentUser = ref({})
const showMateriaModal = ref(false)
const nuevaMateria = ref('')
const config = ref({
  nombreSistema: '',
  version: '',
  horaInicio: '',
  horaFin: '',
  duracionMaxima: 2,
  sesionesMaximas: 5,
  materias: []
})

onMounted(() => {
  const storedUser = localStorage.getItem('currentUser')
  currentUser.value = storedUser
    ? JSON.parse(storedUser)
    : { id: 999, nombre: 'Carlos mendoza', email: 'admin@uleam.edu.ec', rol: 'admin' }

  localStorage.setItem('currentUser', JSON.stringify(currentUser.value))

  const storedConfig = JSON.parse(localStorage.getItem('systemConfig')) || {}
  config.value = {
    nombreSistema: storedConfig.nombreSistema || 'Sistema de Tutorías Académicas',
    version: storedConfig.version || 'v2.1.3',
    horaInicio: storedConfig.horaInicio || '08:00',
    horaFin: storedConfig.horaFin || '18:00',
    duracionMaxima: storedConfig.duracionMaxima || 2,
    sesionesMaximas: storedConfig.sesionesMaximas || 5,
    materias: storedConfig.materias || ['Matemáticas', 'Física', 'Química']
  }
})

function agregarMateria() {
  const materia = nuevaMateria.value.trim()
  if (!materia) return alert('Ingrese el nombre de la materia')
  if (config.value.materias.includes(materia)) return alert('Esta materia ya existe')
  config.value.materias.push(materia)
  nuevaMateria.value = ''
  showMateriaModal.value = false
}

function removeMateria(index) {
  if (!confirm('¿Eliminar esta materia?')) return
  config.value.materias.splice(index, 1)
}

function guardarConfiguracion() {
  localStorage.setItem('systemConfig', JSON.stringify(config.value))
  alert('Configuración guardada correctamente')
}

function logout() {
  if (confirm('¿Cerrar sesión?')) {
    localStorage.removeItem('currentUser')
    router.push('/')
  }
}
</script>

<style scoped src="../../assets/css/configuracion-admin.css"></style>
