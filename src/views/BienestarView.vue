<template>
  <div class="page-stack">
    <section class="card">
      <h2 class="card-title">Actividades de Bienestar Universitario · Sede {{ bienestarMock.sede }}</h2>
      <p class="muted-text" style="margin-bottom: 16px;">
        Inscríbete a las jornadas deportivas, culturales y de desarrollo humano disponibles.
      </p>

      <div class="activities-grid">
        <article v-for="act in actividades" :key="act.id" class="activity-card">
          <div class="activity-top">
            <span class="badge badge-info">{{ act.categoria }}</span>
            <span class="badge" :class="act.inscrito ? 'badge-success' : 'badge-neutral'">
              {{ act.inscrito ? 'Inscrito' : `${act.cuposDisponibles} cupos` }}
            </span>
          </div>
          <h3 class="activity-title">{{ act.titulo }}</h3>
          <div class="activity-meta">
            <div><strong>Fecha:</strong> {{ act.fecha }} ({{ act.horario }})</div>
            <div><strong>Lugar:</strong> {{ act.lugar }}</div>
          </div>
          <button
            type="button"
            :class="act.inscrito ? 'btn-outline' : 'btn-primary'"
            @click="toggleInscripcion(act)"
          >
            {{ act.inscrito ? 'Cancelar inscripción' : 'Inscribirme' }}
          </button>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { bienestarMock } from '@/data/mockData'

const actividades = reactive(bienestarMock.actividades.map((a) => ({ ...a })))

function toggleInscripcion(act) {
  act.inscrito = !act.inscrito
}
</script>

<style scoped>
.activities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 14px;
}

.activity-card {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 16px;
  background: var(--bg-surface-muted);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.activity-top {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.activity-title {
  margin: 0;
  font-size: 0.98rem;
  line-height: 1.35;
}

.activity-meta {
  font-size: 0.84rem;
  color: var(--text-secondary);
  flex: 1;
}
</style>
