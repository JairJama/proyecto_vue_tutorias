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
          <li class="nav-item active"><a href="/tutor/dashboard"><i class="fas fa-inbox"></i><span>Solicitudes Pendientes</span></a></li>
          <li class="nav-item"><a href="/tutor/agenda"><i class="fas fa-calendar"></i><span>Agenda</span></a></li>
          <li class="nav-item"><a href="/tutor/historial"><i class="fas fa-history"></i><span>Historial</span></a></li>
          <li class="nav-item"><a href="/tutor/perfil"><i class="fas fa-user"></i><span>Perfil</span></a></li>
        </ul>
      </nav>

      <div class="user-info">
        <div class="user-avatar"><i class="fas fa-user"></i></div>
        <div class="user-details">
          <h4>{{ currentUser?.nombre || "Emily García" }}</h4>
          <p>Tutor</p>
        </div>
        <button class="logout-btn" @click="logout"><i class="fas fa-sign-out-alt"></i></button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="section-header"><h1>Solicitudes Pendientes</h1></div>

      <!-- Estadísticas -->
      <div class="stats-container">
        <div class="stat-card" v-for="(stat, i) in stats" :key="i">
          <div class="stat-content"><h3>{{ stat.title }}</h3><div class="stat-number">{{ stat.value }}</div></div>
          <div class="stat-icon"><i :class="stat.icon"></i></div>
        </div>
      </div>

      <!-- Solicitudes -->
      <div class="solicitudes-section">
        <h2>Nuevas Solicitudes</h2>

        <div class="solicitudes-list" v-if="!loading && solicitudesData.length">
          <div v-for="solicitud in solicitudesData" :key="solicitud.id" class="solicitud-card" :style="transitionStyle(solicitud.id)">
            <div class="solicitud-header">
              <div>
                <div class="solicitud-title">{{ getMateriaName(solicitud.materia) }}</div>
                <div class="solicitud-student">{{ solicitud.usuario.nombre }}</div>
              </div>
              <div class="solicitud-actions">
                <button class="btn btn-secondary reject-btn" @click="rechazarSolicitud(solicitud)"><i class="fas fa-times"></i> Rechazar</button>
                <button class="btn btn-success accept-btn" @click="aceptarSolicitud(solicitud)"><i class="fas fa-check"></i> Aceptar</button>
              </div>
            </div>
            <div class="solicitud-info">
              <div class="solicitud-datetime">{{ solicitud.fecha }} • {{ solicitud.hora }}</div>
              <div v-if="solicitud.comentarios" class="solicitud-comment">"{{ solicitud.comentarios }}"</div>
            </div>
          </div>
        </div>

        <div v-if="loading" class="loading-message">
          <i class="fas fa-spinner fa-spin"></i><p>Cargando solicitudes...</p>
        </div>

        <div v-if="!loading && solicitudesData.length === 0" class="no-solicitudes">
          <div class="no-solicitudes-icon"><i class="fas fa-inbox"></i></div>
          <h3>No hay solicitudes pendientes</h3>
          <p>Cuando los estudiantes soliciten tutorías, aparecerán aquí.</p>
        </div>
      </div>
    </div>

    <!-- Modal y Notifications -->
    <ModalConfirmacion v-if="showModal" :solicitud="selectedSolicitud" :accion="currentAction" :comentario="responseComment" :notificar="notifyStudent" @cerrar="closeModal" @confirmar="confirmarAccion" />
    <Notificacion :data="notification" />
  </div>
</template>

<script>
import ModalConfirmacion from '../../components/ModalConfirmacion.vue'
import Notificacion from '../../components/Notificacion.vue'

export default {
  name: 'DashboardTutor',
  components: { ModalConfirmacion, Notificacion },
  data() {
    return {
      currentUser: null,
      solicitudesData: [],
      loading: true,
      showModal: false,
      selectedSolicitud: null,
      currentAction: null,
      responseComment: '',
      notifyStudent: true,
      removingSolicitudId: null,
      notification: { show: false, visible: false, message: '', type: 'success', backgroundColor: '#10b981', iconClass: 'fa-check-circle' },
    }
  },
  computed: {
    stats() {
      return [
        { title: 'Solicitudes', value: this.solicitudesData.length, icon: 'fas fa-inbox' },
        { title: 'Sesiones Hoy', value: 2, icon: 'fas fa-calendar-day' },
        { title: 'Esta Semana', value: 8, icon: 'fas fa-calendar-week' }
      ]
    }
  },
  mounted() {
    this.checkAuthentication()
    this.loadSolicitudes()
  },
  methods: {
    checkAuthentication() {
      const data = localStorage.getItem('currentUser')
      if (!data) {
        const testUser = { id: 100, nombre: 'Emily García', rol: 'docente', email: '', materias: [] }
        localStorage.setItem('currentUser', JSON.stringify(testUser))
        this.currentUser = testUser
      } else {
        const user = JSON.parse(data)
        if (user.rol !== 'docente') return this.$router.push('/')
        this.currentUser = user
      }
    },
    loadSolicitudes() {
      this.loading = true
      setTimeout(() => {
        const todas = JSON.parse(localStorage.getItem('solicitudesTutoria') || '[]')
        this.solicitudesData = todas.filter(s => s.estado === 'pending')
        this.loading = false
      }, 800)
    },
    aceptarSolicitud(s) {
      this.selectedSolicitud = s
      this.currentAction = 'accept'
      this.showModal = true
    },
    rechazarSolicitud(s) {
      this.selectedSolicitud = s
      this.currentAction = 'reject'
      this.showModal = true
    },
    confirmarAccion(data) {
    const { comentario, notificar } = data;
    const solicitudId = this.selectedSolicitud.id;
    const todas = JSON.parse(localStorage.getItem('solicitudesTutoria') || '[]');
    const idx = todas.findIndex(s => Number(s.id) === Number(solicitudId));
    if (idx === -1) return;

    const estado = this.currentAction === 'accept' ? 'accepted' : 'rejected';
    todas[idx] = {
      ...todas[idx],
      estado,
      comentarioTutor: comentario,
      tutorId: this.currentUser.id,
      tutorRespuesta: this.currentUser.nombre,
      fechaRespuesta: new Date().toISOString()
    };
    localStorage.setItem('solicitudesTutoria', JSON.stringify(todas));
    this.solicitudesData = this.solicitudesData.filter(s => Number(s.id) !== Number(solicitudId));
    if (estado === 'accepted') this.crearSesionProgramada(todas[idx]);

    this.closeModal();
    const message = `Solicitud ${estado === 'accepted' ? 'aceptada' : 'rechazada'} correctamente`;
    this.showNotification(message, estado === 'accepted' ? 'success' : 'warning');
  },
    crearSesionProgramada(solicitud) {
      const sesiones = JSON.parse(localStorage.getItem('sesionesProgramadas') || '[]')
      sesiones.push({
        id: Date.now(),
        solicitudId: solicitud.id,
        estudianteId: solicitud.usuario.id,
        estudianteNombre: solicitud.usuario.nombre,
        estudianteEmail: solicitud.usuario.email,
        tutorId: this.currentUser.id,
        tutorNombre: this.currentUser.nombre,
        materia: solicitud.materia,
        materiaNombre: this.getMateriaName(solicitud.materia),
        fecha: solicitud.fecha,
        hora: solicitud.hora,
        comentarios: solicitud.comentarios,
        estado: 'programada',
        fechaCreacion: new Date().toISOString(),
      })
      localStorage.setItem('sesionesProgramadas', JSON.stringify(sesiones))
    },
    showNotification(message, type = 'success') {
      const types = {
        success: ['#10b981', 'fa-check-circle'],
        warning: ['#f59e0b', 'fa-exclamation-circle'],
        info: ['#3b82f6', 'fa-info-circle']
      }
      this.notification = {
        show: true,
        visible: true,
        message,
        type,
        backgroundColor: types[type][0],
        iconClass: types[type][1],
      }
      setTimeout(() => (this.notification.visible = false), 3000)
      setTimeout(() => (this.notification.show = false), 3300)
    },
    transitionStyle(id) {
      return {
        transition: 'all 0.3s ease',
        transform: this.removingSolicitudId === id ? 'translateX(-100%)' : 'translateX(0)',
        opacity: this.removingSolicitudId === id ? 0 : 1,
      }
    },
    getMateriaName(m) {
      const dict = {
        'algebra-lineal': 'Álgebra Lineal',
        'calculo-multivariable': 'Cálculo Multivariable',
        'fisica-1': 'Física I',
        programacion: 'Programación'
      }
      return dict[m] || m
    },
    closeModal() {
      this.showModal = false
      this.selectedSolicitud = null
      this.currentAction = null
    },
    logout() {
      if (confirm('Cerrar sesión?')) {
        localStorage.removeItem('currentUser')
        this.$router.push('/')
      }
    }
  }
}
</script>

<style scoped src="../../assets/css/dashboard-tutor.css"></style>