<!-- ModalConfirmacion.vue -->
<template>
  <div class="modal-overlay" @click.self="$emit('cerrar')">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <span class="close" @click="$emit('cerrar')">&times;</span>
      </div>
      <div class="modal-body">
        <div class="solicitud-details">
          <div class="detail-row">
            <span class="detail-label">Estudiante:</span>
            <span class="detail-value">{{ solicitud?.usuario?.nombre }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Materia:</span>
            <span class="detail-value">{{ getMateriaName(solicitud?.materia) }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Fecha:</span>
            <span class="detail-value">{{ solicitud?.fecha }} - {{ solicitud?.hora }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Comentarios:</span>
            <span class="detail-value">{{ solicitud?.comentarios || 'No hay comentarios' }}</span>
          </div>
        </div>

        <div class="response-form">
          <div class="form-field">
            <label for="responseComment">Comentario (opcional)</label>
            <textarea
              v-model="comentarioInterno"
              rows="4"
              placeholder="Añade un comentario para el estudiante..."
            ></textarea>
          </div>

          <div class="form-field checkbox-field">
            <label class="checkbox-label">
              <input type="checkbox" v-model="notificarInterno" />
              <span class="checkmark"></span>
              Notificar al estudiante por correo electrónico
            </label>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="$emit('cerrar')">Cancelar</button>
        <button
          class="btn"
          :class="accion === 'accept' ? 'btn-success' : 'btn-danger'"
          @click="confirmar"
        >
          <i class="fas" :class="accion === 'accept' ? 'fa-check' : 'fa-times'"></i>
          {{ accion === 'accept' ? 'Aceptar' : 'Rechazar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    solicitud: Object,
    accion: String,
    comentario: String,
    notificar: Boolean,
  },
  emits: ['cerrar', 'confirmar'],
  data() {
    return {
      comentarioInterno: this.comentario,
      notificarInterno: this.notificar,
    };
  },
  computed: {
    title() {
      return this.accion === 'accept' ? 'Aceptar Solicitud' : 'Rechazar Solicitud';
    },
  },
  methods: {
    getMateriaName(valor) {
      const materias = {
        'algebra-lineal': 'Álgebra Lineal',
        'calculo-multivariable': 'Cálculo Multivariable',
        'fisica-1': 'Física I',
        programacion: 'Programación',
      };
      return materias[valor] || valor;
    },
    confirmar() {
      this.$emit('confirmar', {
        comentario: this.comentarioInterno,
        notificar: this.notificarInterno,
      });
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 20px;
  width: 500px;
  max-width: 90%;
  border-radius: 8px;
  position: relative;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}
.modal-body {
  margin-top: 10px;
}
.modal-footer {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.close {
  cursor: pointer;
  font-size: 20px;
}
</style>