<template>
  <div
    v-if="show"
    class="notification"
    :class="type"
    :style="{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: backgroundColor,
      color: 'white',
      padding: '12px 20px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      zIndex: 1001,
      transform: visible ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.3s ease',
      maxWidth: '300px',
      fontSize: '14px'
    }"
  >
    <div class="notification-content">
      <i class="fas" :class="iconClass"></i>
      <span>{{ message }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Notificacion',
  props: {
    show: Boolean,
    visible: Boolean,
    message: String,
    type: {
      type: String,
      default: 'success'
    }
  },
  computed: {
    backgroundColor() {
      switch (this.type) {
        case 'success':
          return '#10b981';
        case 'warning':
          return '#f59e0b';
        case 'info':
          return '#3b82f6';
        default:
          return '#10b981';
      }
    },
    iconClass() {
      switch (this.type) {
        case 'success':
          return 'fa-check-circle';
        case 'warning':
          return 'fa-exclamation-circle';
        case 'info':
          return 'fa-info-circle';
        default:
          return 'fa-check-circle';
      }
    }
  }
};
</script>

<style scoped>
.notification-content {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
