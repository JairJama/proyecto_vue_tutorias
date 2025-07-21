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
          <li class="nav-item active">
            <a href="#">
              <i class="fas fa-users"></i>
              <span>Gestión de Usuarios</span>
            </a>
          </li>
          <li class="nav-item">
            <a href="/admin/configuracion">
              <i class="fas fa-cog"></i>
              <span>Configuración</span>
            </a>
          </li>
        </ul>
      </nav>
      <div class="user-info">
        <div class="user-avatar">
          <i class="fas fa-user"></i>
        </div>
        <div class="user-details">
          <h4>{{ currentUser.nombre }}</h4>
          <p>Admin</p>
        </div>
        <button class="logout-btn" @click="logout">
          <i class="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="header">
        <h1>Gestión de Usuarios</h1>
        <button class="btn btn-primary" @click="openModal">
          <i class="fas fa-plus"></i>
          Nuevo Usuario
        </button>
      </div>

      <div class="filters">
        <button v-for="filter in filtros" :key="filter.value" :class="['filter-btn', { active: currentFilter === filter.value }]" @click="setFilter(filter.value)">
          {{ filter.label }}
        </button>
      </div>

      <div class="search-box">
        <input type="text" v-model="searchTerm" placeholder="Buscar usuario..." />
      </div>

      <div class="users-table">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id">
              <td>{{ user.nombre }}</td>
              <td>{{ user.email }}</td>
              <td><span :class="['role-badge', user.rol]">{{ getRoleName(user.rol) }}</span></td>
              <td>
                <div class="status">
                  <span :class="['status-dot', user.estado === 'activo' ? 'active' : 'inactive']"></span>
                  {{ user.estado === 'activo' ? 'Activo' : 'Inactivo' }}
                </div>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="action-btn edit" @click="openModal(user.id)"><i class="fas fa-edit"></i></button>
                  <button class="action-btn delete" @click="deleteUser(user.id)"><i class="fas fa-trash"></i></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal" :class="{ hidden: !modalVisible }">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editingUserId ? 'Editar Usuario' : 'Nuevo Usuario' }}</h3>
          <span class="close" @click="closeModal">&times;</span>
        </div>
        <div class="modal-body">
          <form @submit.prevent>
            <div class="form-field">
              <label>Nombre completo</label>
              <input type="text" v-model="form.nombre" required />
            </div>
            <div class="form-field">
              <label>Correo electrónico</label>
              <input type="email" v-model="form.email" required />
            </div>
            <div class="form-field">
              <label>Cédula</label>
              <input type="text" v-model="form.cedula" required />
            </div>
            <div class="form-field">
              <label>Rol</label>
              <select v-model="form.rol" required>
                <option value="">Seleccionar rol</option>
                <option value="estudiante">Estudiante</option>
                <option value="docente">Tutor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div class="form-field">
              <label>Contraseña</label>
              <input type="password" v-model="form.password" required />
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal">Cancelar</button>
          <button class="btn btn-primary" @click="saveUser">Guardar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const currentUser = ref({})
const usersData = ref([])
const currentFilter = ref('todos')
const searchTerm = ref('')
const modalVisible = ref(false)
const editingUserId = ref(null)
const router = useRouter()

const form = ref({
  nombre: '',
  email: '',
  cedula: '',
  rol: '',
  password: ''
})

const filtros = [
  { label: 'Todos', value: 'todos' },
  { label: 'Estudiantes', value: 'estudiante' },
  { label: 'Tutores', value: 'docente' },
  { label: 'Admin', value: 'admin' }
]

onMounted(() => {
  const stored = localStorage.getItem('currentUser')
  if (stored) {
    currentUser.value = JSON.parse(stored)
  } else {
    currentUser.value = {
      id: 999,
      nombre: 'Administrador',
      email: 'admin@uleam.edu.ec',
      rol: 'admin'
    }
    localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
  }
  loadUsers()
})

function loadUsers() {
  const stored = localStorage.getItem('registeredUsers')
  if (stored) {
    usersData.value = JSON.parse(stored)
  } else {
    usersData.value = [
      { id: 1, nombre: 'Ana García', email: 'ana.garcia@uleam.edu.ec', cedula: '0987654321', rol: 'estudiante', password: '123456', estado: 'activo' },
      { id: 2, nombre: 'Luis Martínez', email: 'l.martinez@uleam.edu.ec', cedula: '1234567890', rol: 'docente', password: '123456', estado: 'activo' },
      { id: 3, nombre: 'Pedro Sánchez', email: 'p.sanchez@uleam.edu.ec', cedula: '3456789012', rol: 'estudiante', password: '123456', estado: 'inactivo' },
      { id: 4, nombre: 'Administrador', email: 'admin@uleam.edu.ec', cedula: '1234567890', rol: 'admin', password: 'admin123', estado: 'activo' },
    ]
    localStorage.setItem('registeredUsers', JSON.stringify(usersData.value))
  }
}

const filteredUsers = computed(() => {
  return usersData.value.filter((u) => {
    const matchFilter = currentFilter.value === 'todos' || u.rol === currentFilter.value
    const matchSearch = u.nombre.toLowerCase().includes(searchTerm.value.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.value.toLowerCase())
    return matchFilter && matchSearch
  })
})

function openModal(id = null) {
  modalVisible.value = true
  if (id) {
    editingUserId.value = id
    const user = usersData.value.find(u => u.id === id)
    Object.assign(form.value, user)
  } else {
    editingUserId.value = null
    form.value = { nombre: '', email: '', cedula: '', rol: '', password: '' }
  }
}

function closeModal() {
  modalVisible.value = false
  editingUserId.value = null
}

function saveUser() {
  const { nombre, email, cedula, rol, password } = form.value
  if (!nombre || !email || !cedula || !rol || !password) {
    alert('Complete todos los campos')
    return
  }
  if (editingUserId.value) {
    const idx = usersData.value.findIndex(u => u.id === editingUserId.value)
    usersData.value[idx] = { ...usersData.value[idx], ...form.value, username: email }
  } else {
    usersData.value.push({
      id: Date.now(),
      ...form.value,
      username: email,
      estado: 'activo'
    })
  }
  localStorage.setItem('registeredUsers', JSON.stringify(usersData.value))
  closeModal()
  alert('Usuario guardado correctamente')
}

function deleteUser(id) {
  if (!confirm('Eliminar este usuario?')) return
  usersData.value = usersData.value.filter(u => u.id !== id)
  localStorage.setItem('registeredUsers', JSON.stringify(usersData.value))
  alert('Usuario eliminado')
}

function setFilter(f) {
  currentFilter.value = f
}

function getRoleName(rol) {
  return rol === 'estudiante' ? 'Estudiante' : rol === 'docente' ? 'Tutor' : rol === 'admin' ? 'Admin' : rol
}

function logout() {
  if (confirm('Cerrar sesión?')) {
    localStorage.removeItem('currentUser')
    router.push('/')
  }
}
</script>


<style scoped src="../../assets/css/dashboard-admin.css"></style>
