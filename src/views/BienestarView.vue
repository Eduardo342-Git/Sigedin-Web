<template>
  <div class="page-stack">
    <!-- 1. Texto guía superior -->
    <p class="intro-copy">
      Inscríbete en las actividades formativas y lúdicas de Bienestar Universitario de tu sede.
      Puedes cancelar tu inscripción cuando quieras, salvo en las que ya cumpliste.
    </p>

    <!-- 2. Encabezado ACTIVIDADES DE MOCOA + Filtros -->
    <section class="section-block">
      <div class="section-header-row">
        <h2 class="section-heading">ACTIVIDADES DE {{ bienestarMock.sede }}</h2>

        <div class="cat-pills">
          <button
            v-for="cat in categorias"
            :key="cat"
            type="button"
            class="cat-pill"
            :class="{ active: categoriaActiva === cat }"
            @click="categoriaActiva = cat"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Tarjetas de Actividades -->
      <div class="activities-grid">
        <article v-for="act in actividadesFiltradas" :key="act.id" class="activity-card">
          <div class="card-upper">
            <div class="activity-top">
              <span class="cat-badge">{{ act.categoria }}</span>
              <span
                class="status-badge"
                :class="act.inscrito ? 'badge-success' : 'badge-neutral'"
              >
                {{ act.inscrito ? `Inscrito · ${act.cuposDisponibles} cupos` : `${act.cuposDisponibles} cupos` }}
              </span>
            </div>

            <h3 class="activity-title">{{ act.titulo }}</h3>
            <p class="activity-desc">{{ act.descripcion }}</p>

            <div class="activity-meta">
              <div class="meta-line">
                <Calendar :size="14" class="meta-icon" />
                <span>{{ act.fecha }} · {{ act.horario }}</span>
              </div>
              <div class="meta-line">
                <MapPin :size="14" class="meta-icon" />
                <span>{{ act.lugar }}</span>
              </div>
              <div class="meta-line">
                <Clock :size="14" class="meta-icon" />
                <span>Horas válidas: {{ act.horas }}h</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            class="card-action-btn"
            :class="act.inscrito ? 'btn-cancel-act' : 'btn-enroll-act'"
            @click="toggleInscripcion(act)"
          >
            {{ act.inscrito ? 'Cancelar inscripción' : 'Inscribirme' }}
          </button>
        </article>
      </div>
    </section>

    <!-- 3. Sección Inferior: ACTIVIDADES CUMPLIDAS -->
    <section class="section-block">
      <div class="section-header-row">
        <h2 class="section-heading">ACTIVIDADES CUMPLIDAS</h2>
      </div>

      <div class="table-card">
        <div class="table-wrap">
          <table class="bienestar-table">
            <thead>
              <tr>
                <th>Actividad</th>
                <th>Área</th>
                <th class="text-center">Periodo</th>
                <th class="text-center">Horas</th>
                <th class="text-center">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="hist in actividadesCumplidas" :key="hist.id">
                <td><strong>{{ hist.actividad }}</strong></td>
                <td>{{ hist.area }}</td>
                <td class="text-center">{{ hist.periodo }}</td>
                <td class="text-center"><strong>{{ hist.horas }} h</strong></td>
                <td class="text-center">
                  <span class="badge badge-success">{{ hist.estado }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { Calendar, Clock, MapPin } from 'lucide-vue-next'
import { bienestarMock } from '@/data/mockData'

const STORAGE_KEY = 'sigedin_bienestar_inscritos'

const categorias = ['Todas', 'Deporte y Recreación', 'Desarrollo Humano', 'Cultura']
const categoriaActiva = ref('Todas')

const detallesExtra = {
  101: {
    descripcion: 'Encuentro deportivo por equipos con premiación institucional.',
    horas: 4
  },
  102: {
    descripcion: 'Estrategias prácticas para organizar tu tiempo y reducir el estrés.',
    horas: 2
  },
  103: {
    descripcion: 'Muestra cultural, música en vivo y expresiones artísticas regionales.',
    horas: 4
  }
}

const actividadesCumplidas = [
  {
    id: 901,
    actividad: 'Jornada de Inducción y Salud Preventiva',
    area: 'Salud Integral',
    periodo: '2025-2',
    horas: 6,
    estado: 'Cumplida'
  }
]

function loadSavedIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const savedIds = loadSavedIds()

const actividades = reactive(
  bienestarMock.actividades.map((a) => {
    const wasEnrolledInitially = a.inscrito
    const isEnrolledNow = savedIds !== null ? savedIds.includes(a.id) : wasEnrolledInitially
    let cupos = a.cuposDisponibles
    if (isEnrolledNow && !wasEnrolledInitially) cupos = Math.max(0, cupos - 1)
    if (!isEnrolledNow && wasEnrolledInitially) cupos += 1
    const extra = detallesExtra[a.id] || { descripcion: 'Actividad formativa de bienestar.', horas: 4 }
    return {
      ...a,
      descripcion: extra.descripcion,
      horas: extra.horas,
      inscrito: isEnrolledNow,
      cuposDisponibles: cupos
    }
  })
)

const actividadesFiltradas = computed(() =>
  categoriaActiva.value === 'Todas'
    ? actividades
    : actividades.filter((a) => a.categoria === categoriaActiva.value)
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
  gap: 16px;
}

.section-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
  padding-bottom: 8px;
  border-bottom: 1.5px solid #185686;
}

:root.dark .section-header-row {
  border-bottom-color: var(--text-brand);
}

.section-heading {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #185686;
}

:root.dark .section-heading {
  color: var(--text-brand);
}

.cat-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.cat-pill {
  padding: 4px 11px;
  border-radius: 999px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-surface);
  color: var(--text-secondary);
  font-size: 0.78rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
}

.cat-pill.active {
  background-color: #185686;
  border-color: #185686;
  color: #ffffff;
}

/* Grid de 3 columnas iguales */
.activities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  align-items: stretch;
}

.activity-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
}

.card-upper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.activity-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.cat-badge {
  white-space: nowrap;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 999px;
  background: rgba(24, 102, 143, 0.14);
  color: var(--color-primary);
  border: 1px solid rgba(24, 102, 143, 0.3);
}

:root.dark .cat-badge {
  color: #7dd3fc;
}

.status-badge {
  white-space: nowrap;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid transparent;
}

.activity-title {
  margin: 0;
  font-size: 0.98rem;
  font-weight: 700;
  line-height: 1.35;
  color: var(--text-primary);
}

.activity-desc {
  margin: 0;
  font-size: 0.82rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.activity-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.82rem;
  color: var(--text-secondary);
  margin-top: 2px;
}

.meta-line {
  display: flex;
  align-items: center;
  gap: 7px;
}

.meta-icon {
  flex-shrink: 0;
  opacity: 0.8;
}

.card-action-btn {
  width: 100%;
  padding: 9px 14px;
  border-radius: 6px;
  font-size: 0.86rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-enroll-act {
  border: none;
  background-color: #185686;
  color: #ffffff;
}

.btn-enroll-act:hover {
  background-color: #0f4766;
}

.btn-cancel-act {
  border: 1px solid var(--border-color);
  background-color: var(--bg-surface);
  color: var(--text-primary);
}

.btn-cancel-act:hover {
  background-color: var(--bg-surface-muted);
}

/* Tabla Actividades Cumplidas */
.table-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.bienestar-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.bienestar-table thead th {
  background-color: #dce7f2;
  color: #1e293b;
  font-weight: 700;
  font-size: 0.78rem;
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
  white-space: nowrap;
}

:root.dark .bienestar-table thead th {
  background-color: #1e324a;
  color: #e2e8f0;
}

.bienestar-table tbody td {
  padding: 12px;
  border-bottom: 1px solid var(--border-color);
  vertical-align: middle;
}

.bienestar-table tbody tr:last-child td {
  border-bottom: none;
}

.text-center {
  text-align: center !important;
}
</style>
