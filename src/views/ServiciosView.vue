<template>
  <div class="page-stack">
    <section v-if="activeTab === 'hoja-vida'" class="card">
      <h2 class="card-title">Mis Datos Personales</h2>
      <div class="grid-cards">
        <div class="stat-card">
          <div class="stat-label">Nombre completo</div>
          <div style="font-weight: 700; margin-top: 4px;">{{ estudianteMock.nombreCompleto }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Identificación</div>
          <div style="font-weight: 700; margin-top: 4px;">{{ estudianteMock.identificacion }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Correo institucional</div>
          <div style="font-weight: 700; margin-top: 4px;">{{ estudianteMock.correoInstitucional }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Celular</div>
          <div style="font-weight: 700; margin-top: 4px;">{{ estudianteMock.celular }}</div>
        </div>
      </div>
    </section>

    <section v-else-if="activeTab === 'carnet'" class="card">
      <h2 class="card-title">Carnet Estudiantil Digital</h2>
      <p class="muted-text">
        <strong>{{ estudianteMock.nombreCompleto }}</strong> · Código {{ estudianteMock.programaActual.codigoEstudiante }} ·
        {{ estudianteMock.programaActual.programa }} ({{ estudianteMock.programaActual.sede }})
      </p>
      <span class="badge badge-success">Carnet vigente · Periodo {{ estudianteMock.programaActual.periodo }}</span>
    </section>

    <section v-else-if="activeTab === 'calendario'" class="card">
      <h2 class="card-title">Calendario Académico · {{ estudianteMock.programaActual.periodo }}</h2>
      <p class="muted-text" style="margin: 0;">
        Inicio de clases: 10 ago 2026 · Exámenes finales: 30 nov – 05 dic 2026 · Cierre de periodo: 12 dic 2026.
      </p>
    </section>

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
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { estudianteMock, pazYSalvoMock, solicitudesCatalogoMock } from '@/data/mockData'

const route = useRoute()
const activeTab = computed(() => route.query.tab || '')
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
