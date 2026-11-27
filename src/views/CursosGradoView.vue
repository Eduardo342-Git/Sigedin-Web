<template>
  <div class="page-stack">
    <!-- 1. Texto Introductorio Superior -->
    <p class="intro-copy">
      Inscríbete en los cursos que son requisito para tu grado (inglés, francés, deporte formativo).
      Al inscribirte quedas «Inscrito»; la matrícula del curso se formaliza después.
    </p>

    <!-- 2. Sección 1: CURSOS OFERTADOS -->
    <section class="section-block">
      <h2 class="section-heading">CURSOS OFERTADOS</h2>

      <!-- Barra de Filtros (2 columnas iguales) -->
      <div class="filters-grid">
        <div class="filter-field">
          <label for="filtro-sede">Sede</label>
          <select id="filtro-sede" v-model="filtroSede" class="filter-select">
            <option v-for="sede in sedes" :key="sede" :value="sede">{{ sede }}</option>
          </select>
        </div>

        <div class="filter-field">
          <label for="filtro-curso">Curso</label>
          <select id="filtro-curso" v-model="filtroCurso" class="filter-select">
            <option v-for="c in tiposCurso" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
      </div>

      <div class="table-card">
        <div class="table-wrap">
          <table class="cg-table">
            <thead>
              <tr>
                <th>Curso y horario</th>
                <th>Docente</th>
                <th class="text-center">Cupos</th>
                <th>Inscripción</th>
                <th class="text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="curso in cursosFiltrados" :key="curso.id">
                <td>
                  <div class="course-name">{{ curso.nombre }}</div>
                  <div class="course-detail">{{ curso.detalle }}</div>
                  <div class="course-sub">{{ curso.grupo }} · {{ curso.periodo }}</div>
                </td>
                <td>{{ curso.docente }}</td>
                <td class="text-center nowrap-cell">
                  {{ getCuposActuales(curso) }} de {{ curso.cupoMax }}
                </td>
                <td class="nowrap-cell">{{ curso.inscripcion }}</td>
                <td class="text-right nowrap-cell">
                  <div v-if="estaInscrito(curso.id)" class="enrolled-actions">
                    <span class="badge badge-success">Inscrito ✓</span>
                    <button
                      type="button"
                      class="retire-link"
                      @click="cancelarInscripcion(curso.id)"
                    >
                      Retirar
                    </button>
                  </div>
                  <button
                    v-else
                    type="button"
                    class="enroll-btn"
                    @click="inscribir(curso.id)"
                  >
                    Inscribirme
                  </button>
                </td>
              </tr>

              <tr v-if="!cursosFiltrados.length">
                <td colspan="5" class="empty-row">
                  No hay cursos ofertados que coincidan con los filtros seleccionados.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- 3. Sección 2: MIS CURSOS INSCRITOS -->
    <section class="section-block">
      <h2 class="section-heading">MIS CURSOS INSCRITOS</h2>

      <div class="table-card">
        <div class="table-wrap">
          <table class="cg-table">
            <thead>
              <tr>
                <th>Curso</th>
                <th>Docente</th>
                <th class="text-center">Nota</th>
                <th class="text-center">Estado</th>
                <th class="text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              <!-- Inscripciones activas nuevas -->
              <tr v-for="ins in cursosInscritosNuevos" :key="ins.id">
                <td>
                  <div class="course-name">{{ ins.nombre }}</div>
                  <div class="course-sub">
                    {{ ins.detalle }} · {{ ins.grupo }} · {{ ins.periodo }} · {{ ins.sede }}
                  </div>
                </td>
                <td>{{ ins.docente }}</td>
                <td class="text-center">—</td>
                <td class="text-center">
                  <span class="badge badge-info">Inscrito</span>
                </td>
                <td class="text-right nowrap-cell">
                  <button
                    type="button"
                    class="cancel-link"
                    @click="cancelarInscripcion(ins.id)"
                  >
                    Cancelar
                  </button>
                </td>
              </tr>

              <!-- Historial aprobado por defecto -->
              <tr v-for="hist in cursosGradoMock" :key="hist.id">
                <td>
                  <div class="course-name">Lengua extranjera inglés</div>
                  <div class="course-sub">
                    {{ hist.modalidad }} · Grupo {{ hist.grupo }} · {{ hist.periodo }} · {{ hist.sede }} - MOCOA
                  </div>
                </td>
                <td>{{ hist.docente }}</td>
                <td class="text-center"><strong>{{ hist.nota.toFixed(1) }}</strong></td>
                <td class="text-center">
                  <span class="badge badge-success">{{ hist.estado }}</span>
                </td>
                <td class="text-right muted-text">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { cursosGradoMock } from '@/data/mockData'

const STORAGE_KEY = 'sigedin_cursos_grado_v2'

const sedes = [
  'UNIP-MOCOA - MOCOA',
  'UNIP-SIBUNDOY - SIBUNDOY',
  'UNIP-PUERTO ASÍS'
]

const tiposCurso = [
  'Todos los cursos',
  'Deporte formativo',
  'Lengua extranjera inglés',
  'Francés'
]

const filtroSede = ref('UNIP-MOCOA - MOCOA')
const filtroCurso = ref('Todos los cursos')

const cursosOfertados = [
  {
    id: 4101,
    sede: 'UNIP-MOCOA - MOCOA',
    nombre: 'Deporte formativo',
    detalle: 'AJEDREZ · Miércoles 5:00 pm - 7:00 pm · Salón B104',
    grupo: 'Grupo A',
    periodo: '2026-2',
    docente: 'MAICON FREYDER CASANOVA RUEDA',
    cuposBase: 3,
    cupoMax: 16,
    inscripcion: '18 de ago al 19 de ago'
  },
  {
    id: 4102,
    sede: 'UNIP-MOCOA - MOCOA',
    nombre: 'Deporte formativo',
    detalle: 'VOLEIBOL · Jueves 4:00 pm - 6:00 pm · Polideportivo',
    grupo: 'Grupo A',
    periodo: '2026-2',
    docente: 'JUAN DIEGO FEIJOO BOTINA',
    cuposBase: 18,
    cupoMax: 30,
    inscripcion: '18 de ago al 19 de ago'
  },
  {
    id: 4103,
    sede: 'UNIP-MOCOA - MOCOA',
    nombre: 'Lengua extranjera inglés',
    detalle: 'A1 - Sábado 9:00 am - 11:00 am - Salón C101',
    grupo: 'Grupo A',
    periodo: '2026-2',
    docente: 'JULIETH STHEPANY QUIÑONEZ REVELO',
    cuposBase: 21,
    cupoMax: 30,
    inscripcion: '18 de ago al 19 de ago'
  },
  {
    id: 4104,
    sede: 'UNIP-MOCOA - MOCOA',
    nombre: 'Lengua extranjera inglés',
    detalle: 'B1 - Sábado 11:00 am - 1:00 pm - Aula A Salón 117',
    grupo: 'Grupo A',
    periodo: '2026-2',
    docente: 'FERNANDO ALEXANDER CORTEZ ORTIZ',
    cuposBase: 14,
    cupoMax: 25,
    inscripcion: '18 de ago al 19 de ago'
  },
  {
    id: 4105,
    sede: 'UNIP-MOCOA - MOCOA',
    nombre: 'Francés',
    detalle: 'Francés A1 - Viernes 6:30 pm - 8:30 pm - Salón C204',
    grupo: 'Grupo A',
    periodo: '2026-2',
    docente: 'CLARA INÉS MONTENEGRO',
    cuposBase: 11,
    cupoMax: 24,
    inscripcion: '18 de ago al 19 de ago'
  },
  {
    id: 4106,
    sede: 'UNIP-SIBUNDOY - SIBUNDOY',
    nombre: 'Lengua extranjera inglés',
    detalle: 'B1 - Sábado 8:00 am - 10:00 am - Salón S102',
    grupo: 'Grupo A',
    periodo: '2026-2',
    docente: 'ANDRÉS FELIPE JOJOA',
    cuposBase: 9,
    cupoMax: 25,
    inscripcion: '18 de ago al 19 de ago'
  },
  {
    id: 4107,
    sede: 'UNIP-SIBUNDOY - SIBUNDOY',
    nombre: 'Deporte formativo',
    detalle: 'BALONCESTO · Viernes 4:00 pm - 6:00 pm · Cancha Central',
    grupo: 'Grupo B',
    periodo: '2026-2',
    docente: 'MAICON FREYDER CASANOVA RUEDA',
    cuposBase: 12,
    cupoMax: 20,
    inscripcion: '18 de ago al 19 de ago'
  },
  {
    id: 4108,
    sede: 'UNIP-PUERTO ASÍS',
    nombre: 'Francés',
    detalle: 'Francés A1 - Sábado 10:00 am - 12:00 pm - Aula P201',
    grupo: 'Grupo A',
    periodo: '2026-2',
    docente: 'CLARA INÉS MONTENEGRO',
    cuposBase: 7,
    cupoMax: 20,
    inscripcion: '18 de ago al 19 de ago'
  }
]

function loadEnrolledIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const enrolledIds = ref(loadEnrolledIds())

const cursosFiltrados = computed(() =>
  cursosOfertados.filter((c) => {
    const matchSede = c.sede === filtroSede.value
    const matchCurso =
      filtroCurso.value === 'Todos los cursos' || c.nombre === filtroCurso.value
    return matchSede && matchCurso
  })
)

const cursosInscritosNuevos = computed(() =>
  cursosOfertados.filter((c) => enrolledIds.value.includes(c.id))
)

function estaInscrito(id) {
  return enrolledIds.value.includes(id)
}

function getCuposActuales(curso) {
  return curso.cuposBase + (estaInscrito(curso.id) ? 1 : 0)
}

function persistEnrolled() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(enrolledIds.value))
}

function inscribir(id) {
  if (!enrolledIds.value.includes(id)) {
    enrolledIds.value = [...enrolledIds.value, id]
    persistEnrolled()
  }
}

function cancelarInscripcion(id) {
  enrolledIds.value = enrolledIds.value.filter((item) => item !== id)
  persistEnrolled()
}
</script>

<style scoped>
.intro-copy {
  margin: 0;
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.section-block {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.section-heading {
  margin: 10px 0 0;
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

/* Barra de Filtros (2 columnas iguales) */
.filters-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.filter-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.filter-field label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-secondary);
}

.filter-select {
  width: 100%;
  appearance: none;
  background-color: var(--bg-surface);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 9px 32px 9px 12px;
  font-size: 0.88rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  background-image: linear-gradient(45deg, transparent 50%, var(--text-secondary) 50%),
    linear-gradient(135deg, var(--text-secondary) 50%, transparent 50%);
  background-position: calc(100% - 14px) 16px, calc(100% - 9px) 16px;
  background-size: 5px 5px, 5px 5px;
  background-repeat: no-repeat;
}

.table-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.cg-table {
  width: 100%;
  table-layout: auto;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.cg-table thead th {
  background-color: #dce7f2;
  color: #1e293b;
  font-weight: 700;
  font-size: 0.78rem;
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
  white-space: nowrap;
}

:root.dark .cg-table thead th {
  background-color: #1e324a;
  color: #e2e8f0;
}

.cg-table tbody td {
  padding: 12px 12px;
  border-bottom: 1px solid var(--border-color);
  vertical-align: middle;
  line-height: 1.35;
}

.cg-table tbody tr:last-child td {
  border-bottom: none;
}

.course-name {
  font-weight: 700;
  color: var(--text-primary);
}

.course-detail {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 2px;
}

.course-sub {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 2px;
}

.text-center {
  text-align: center !important;
}

.text-right {
  text-align: right !important;
}

.nowrap-cell {
  white-space: nowrap;
}

.enroll-btn {
  border: none;
  border-radius: 6px;
  background-color: #185686;
  color: #ffffff;
  padding: 6px 14px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
}

.enroll-btn:hover {
  background-color: #0f4766;
}

.enrolled-actions {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.retire-link,
.cancel-link {
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  padding: 2px 4px;
  text-decoration: underline;
}

.retire-link:hover,
.cancel-link:hover {
  color: var(--color-danger);
}

.empty-row {
  text-align: center;
  color: var(--text-secondary);
  padding: 24px 12px !important;
}

@media (max-width: 640px) {
  .filters-grid {
    grid-template-columns: 1fr;
  }
}
</style>
