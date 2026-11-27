<template>
  <div class="page-stack">
    <section class="card">
      <h2 class="card-title">Solicitudes Académicas en Línea</h2>
      <p class="muted-text" style="margin-bottom: 14px;">
        Selecciona el trámite que deseas radicar en el periodo actual.
      </p>
      <div class="services-grid">
        <div v-for="srv in solicitudesCatalogoMock" :key="srv.clave" class="service-card">
          <h3 class="service-title">{{ srv.etiqueta }}</h3>
          <p class="muted-text" style="margin: 0; flex: 1;">{{ srv.descripcion }}</p>
          <button type="button" class="btn-outline" @click="solicitar(srv)">
            Iniciar solicitud
          </button>
        </div>
      </div>
      <p v-if="mensaje" class="toast-msg">{{ mensaje }}</p>
    </section>

    <section class="card">
      <div class="paz-header">
        <h3 class="card-title" style="margin: 0;">Paz y Salvo · Periodo {{ pazYSalvoMock.periodo }}</h3>
        <span class="badge badge-success">
          {{ pazYSalvoMock.alDia ? 'Al día en todas las dependencias' : 'Con pendientes' }}
        </span>
      </div>
      <div class="table-wrap" style="margin-top: 12px;">
        <table class="data-table">
          <thead>
            <tr>
              <th>Dependencia</th>
              <th>Observación</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="dep in pazYSalvoMock.dependencias" :key="dep.clave">
              <td><strong>{{ dep.nombre }}</strong></td>
              <td>{{ dep.observacion }}</td>
              <td><span class="badge badge-success">Al día</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { pazYSalvoMock, solicitudesCatalogoMock } from '@/data/mockData'

const mensaje = ref('')

function solicitar(srv) {
  mensaje.value = `Borrador de solicitud "${srv.etiqueta}" iniciado en modo demostración.`
}
</script>

<style scoped>
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 12px;
}

.service-card {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 14px;
  background: var(--bg-surface-muted);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.service-title {
  margin: 0;
  font-size: 0.96rem;
}

.paz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.toast-msg {
  margin: 14px 0 0;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  background: rgba(24, 102, 143, 0.12);
  color: var(--text-brand);
  font-weight: 600;
  font-size: 0.88rem;
}
</style>
