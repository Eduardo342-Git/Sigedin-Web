<template>
  <div class="page-stack">
    <p class="intro-copy">
      Inscríbete en los cursos que son requisito para tu grado (inglés, francés, deporte formativo).
      Al inscribirte quedas «Inscrito»; la matrícula del curso se formaliza después.
    </p>

    <section class="section-block">
      <h2 class="section-heading">CURSOS INSCRITOS Y OFERTADOS</h2>

      <div class="card">
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Periodo</th>
                <th>Curso</th>
                <th>Modalidad</th>
                <th>Docente</th>
                <th>Nota</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="curso in cursosGradoMock" :key="curso.id">
                <td>{{ curso.periodo }}</td>
                <td><strong>{{ curso.curso }}</strong></td>
                <td>{{ curso.modalidad }}</td>
                <td>{{ curso.docente }}</td>
                <td><strong>{{ curso.nota.toFixed(1) }}</strong></td>
                <td><span class="badge badge-success">{{ curso.estado }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="offered-grid">
        <article v-for="oferta in cursosOfertados" :key="oferta.id" class="offered-card">
          <div class="offered-top">
            <span class="badge badge-info">{{ oferta.periodo }} · {{ oferta.sede }}</span>
            <span class="badge" :class="oferta.inscrito ? 'badge-success' : 'badge-neutral'">
              {{ oferta.inscrito ? 'Inscrito' : 'Disponible' }}
            </span>
          </div>
          <h3 class="offered-title">{{ oferta.curso }}</h3>
          <div class="offered-meta">
            <div><strong>Modalidad:</strong> {{ oferta.modalidad }}</div>
            <div><strong>Horario:</strong> {{ oferta.horario }} · Grupo {{ oferta.grupo }}</div>
          </div>
          <button
            type="button"
            :class="oferta.inscrito ? 'btn-outline' : 'btn-primary'"
            @click="toggleInscripcion(oferta)"
          >
            {{ oferta.inscrito ? 'Cancelar inscripción' : 'Inscribirme' }}
          </button>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { cursosGradoMock } from '@/data/mockData'

const STORAGE_KEY = 'sigedin_cursos_grado_inscritos'

function loadSavedIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const savedIds = loadSavedIds()

const cursosOfertados = reactive(
  [
    {
      id: 3101,
      periodo: '2026-2',
      sede: 'UNIP-MOCOA',
      curso: 'DEPORTE FORMATIVO — NIVEL I',
      modalidad: 'PRESENCIAL',
      grupo: 'B',
      horario: 'Sábados 2:00 – 4:00 p. m.'
    },
    {
      id: 3102,
      periodo: '2026-2',
      sede: 'UNIP-MOCOA',
      curso: 'LENGUA EXTRANJERA INGLÉS — NIVEL B1',
      modalidad: 'NIVELACIÓN ESTUDIANTES',
      grupo: 'A',
      horario: 'Sábados 8:00 – 11:00 a. m.'
    }
  ].map((c) => ({ ...c, inscrito: savedIds.includes(c.id) }))
)

function toggleInscripcion(oferta) {
  oferta.inscrito = !oferta.inscrito
  const ids = cursosOfertados.filter((c) => c.inscrito).map((c) => c.id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
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

.offered-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 14px;
}

.offered-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.offered-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.offered-title {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.35;
}

.offered-meta {
  font-size: 0.84rem;
  color: var(--text-secondary);
  flex: 1;
}
</style>
