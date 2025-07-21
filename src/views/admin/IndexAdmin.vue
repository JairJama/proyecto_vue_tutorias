<template>
  <div class="admin-view">
    <div class="admin-card">
      <div class="logo-circle">
        <i class="fas fa-shield-alt"></i>
      </div>
      <h1>Panel de Administrador</h1>
      <p>Acceso al sistema de gestión ULEAM</p>

      <RouterLink to="/admin/dashboard" class="btn btn-primary">
        <i class="fas fa-sign-in-alt"></i> Acceder al Panel
      </RouterLink>

      <RouterLink to="/" class="btn btn-secondary">
        <i class="fas fa-arrow-left"></i> Volver al Inicio
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
// No script logic required for this view
</script>

<style scoped>
.admin-view {
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.admin-card {
  background-color: white;
  padding: 40px 50px;
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 450px;
}

.logo-circle {
  width: 80px;
  height: 80px;
  border: 3px solid #8b5cf6;
  border-radius: 50%;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-circle i {
  color: #8b5cf6;
  font-size: 28px;
}

h1 {
  font-size: 24px;
  color: #1f2937;
  margin-bottom: 10px;
}

p {
  font-size: 15px;
  color: #6b7280;
  margin-bottom: 30px;
}

.btn {
  display: inline-block;
  padding: 12px 25px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  margin-top: 10px;
  transition: background-color 0.3s ease;
}

.btn i {
  margin-right: 8px;
}

.btn-primary {
  background-color: #8b5cf6;
  color: white;
}

.btn-primary:hover {
  background-color: #7c3aed;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
  margin-top: 10px;
  display: inline-block;
}

.btn-secondary:hover {
  background-color: #4b5563;
}
</style>
