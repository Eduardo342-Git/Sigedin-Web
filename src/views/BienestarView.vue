<template>
  <div class="page-stack">
    <p class="intro-copy">
      Inscríbete en las actividades formativas y lúdicas de Bienestar Universitario de tu sede.
      Puedes cancelar tu inscripción cuando quieras, salvo en las que ya cumpliste.
    </p>

    <section class="section-block">
      <h2 class="section-heading">ACTIVIDADES DE {{ bienestarMock.sede }}</h2>

      <div class="activities-grid">
        <article v-for="act in actividades" :key="act.id" class="activity-card">
          <div class="activity-top">
            <span class="badge badge-info">{{ act.categoria }}</span>
            <span class="badge" :class="act.inscrito ? 'badge-success' : 'badge-neutral'">
              {{ act.inscrito ? `Inscrito · ${act.cuposDisponibles} cupos` : `${act.cuposDisponibles} cupos` }}
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

const STORAGE_KEY = 'sigedin_bienestar_inscritos'

function loadSavedMap() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const savedIds = loadSavedMap()

const actividades = reactive(
  bienestarMock.actividades.map((a) => {
    const wasEnrolledInitially = a.inscrito
    const isEnrolledNow = savedIds !== null ? savedIds.includes(a.id) : wasEnrolledInitially
    let cupos = a.cuposDisponibles
    if (isEnrolledNow && !wasEnrolledInitially) cupos = Math.max(0, cupos - 1)
    if (!isEnrolledNow && wasEnrolledInitially) cupos += 1
    return { ...a, inscrito: isEnrolledNow, cuposDisponibles: cupos }
  })
)

function toggleInscripcion(act) {
  if (act.inscrito) {
    act.inscrito = false
    act.cuposDisponibles += 1
  } else if (act.cuposDisponibles > 0) {
    act.inscrito = true
    act.cuposDisponibles -= 1
  }
  const enrolledIds = actividades.filter((a) => a.inscrito).map((a) => a.id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(enrolledIds))
}
</script>

<style scoped>
.intro-copy {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.section-block {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.section-heading {
  margin: 28px 0 14px;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #185686;
  padding-bottom: 8px;
  border-bottom: 1.5px solid #185686;
}

:root.dark .section-heading {
  color: var(--text-brand);
  border-bottom-color: var(--text-brand);
}

.activities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 14px;
}

.activity-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  padding: 16px;
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
