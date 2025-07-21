<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import '../assets/css/home.css'
import logo from '../assets/logo.png'

const router = useRouter()

const activeForm = ref('login')

const login = ref({
  username: '',
  password: ''
})

const register = ref({
  nombre: '',
  email: '',
  cedula: '',
  rol: '',
  password: '',
  confirmPassword: ''
})

const handleLogin = () => {
  const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
  const user = users.find(
    (u) =>
      (u.username === login.value.username || u.email === login.value.username) &&
      u.password === login.value.password
  )

  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user))
    if (user.rol === 'docente') {
      router.push('/tutor/dashboard')
    } else {
      router.push('/Estudiante/dashboard')
    }
  } else {
    alert('Credenciales incorrectas')
  }
}

const handleRegister = () => {
  const { nombre, email, cedula, rol, password, confirmPassword } = register.value

  if (!nombre || !email || !cedula || !rol || !password || !confirmPassword) {
    alert('Complete todos los campos')
    return
  }

  if (password !== confirmPassword) {
    alert('Las contraseñas no coinciden')
    return
  }

  const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
  if (users.find((u) => u.email === email)) {
    alert('Ya existe un usuario con ese email')
    return
  }

  const newUser = {
    id: Date.now(),
    nombre,
    email,
    cedula,
    rol,
    username: email,
    password,
    fechaRegistro: new Date().toISOString()
  }

  users.push(newUser)
  localStorage.setItem('registeredUsers', JSON.stringify(users))

  alert('Registro exitoso. Ahora puede iniciar sesión.')
  register.value = {
    nombre: '',
    email: '',
    cedula: '',
    rol: '',
    password: '',
    confirmPassword: ''
  }
  activeForm.value = 'login'
}
</script>

<template>
  <div class="container">
    <!-- Panel Izquierdo -->
    <div class="left-panel">
      <div class="logo">
        <div class="logo-circle">
          <img :src="logo" alt="ULEAM Logo" class="logo-image" />
        </div>
        <h1>Uleam</h1>
        <p>Sistema de Tutorías</p>
      </div>

      <div class="welcome-text">
        <h2>¡Bienvenido!</h2>
        <p>Conecta con tutores expertos y mejora tu rendimiento académico</p>
      </div>

      <div class="action-buttons">
        <button
          :class="['btn', activeForm === 'login' ? 'btn-primary' : 'btn-secondary']"
          @click="activeForm = 'login'"
        >
          Iniciar Sesión
        </button>
        <button
          :class="['btn', activeForm === 'register' ? 'btn-primary' : 'btn-secondary']"
          @click="activeForm = 'register'"
        >
          Registrarse
        </button>
      </div>
    </div>

    <!-- Panel Derecho -->
    <div class="right-panel">
      <!-- Login -->
      <div class="form-container" v-if="activeForm === 'login'">
        <h2>Iniciar Sesión</h2>
        <form @submit.prevent="handleLogin">
          <div class="input-group">
            <i class="fas fa-user"></i>
            <input v-model="login.username" type="text" placeholder="Usuario o Email" required />
          </div>
          <div class="input-group">
            <i class="fas fa-lock"></i>
            <input v-model="login.password" type="password" placeholder="Contraseña" required />
          </div>
          <button type="submit" class="btn btn-primary btn-full">Ingresar</button>
        </form>
      </div>

      <!-- Registro -->
      <div class="form-container" v-else>
        <h2>Crear Cuenta</h2>
        <form @submit.prevent="handleRegister">
          <div class="input-group">
            <i class="fas fa-user"></i>
            <input v-model="register.nombre" type="text" placeholder="Nombre completo" required />
          </div>
          <div class="input-group">
            <i class="fas fa-envelope"></i>
            <input v-model="register.email" type="email" placeholder="Correo electrónico" required />
          </div>
          <div class="input-group">
            <i class="fas fa-id-card"></i>
            <input v-model="register.cedula" type="text" placeholder="Cédula de identidad" required />
          </div>
          <div class="input-group">
            <i class="fas fa-user-tag"></i>
            <select v-model="register.rol" required>
              <option value="">Seleccionar rol</option>
              <option value="estudiante">Estudiante</option>
              <option value="docente">Docente</option>
            </select>
          </div>
          <div class="input-group">
            <i class="fas fa-lock"></i>
            <input v-model="register.password" type="password" placeholder="Contraseña" required />
          </div>
          <div class="input-group">
            <i class="fas fa-lock"></i>
            <input
              v-model="register.confirmPassword"
              type="password"
              placeholder="Confirmar contraseña"
              required
            />
          </div>
          <button type="submit" class="btn btn-primary btn-full">Registrarse</button>
        </form>
      </div>
    </div>
  </div>
</template>

