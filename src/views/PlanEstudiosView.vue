<template>
  <div class="page-stack">
    <!-- 1. Encabezado Superior (fuera de tarjetas) -->
    <header class="plan-top-header">
      <div>
        <h2 class="plan-program-title">{{ planEstudiosMock.programa }}</h2>
        <p class="plan-code-sub">Plan de estudios {{ planEstudiosMock.plan }}</p>
      </div>

      <button type="button" class="malla-btn" @click="abrirMallaModal">
        <Network :size="16" />
        <span>Malla académica</span>
      </button>
    </header>

    <!-- 2. Tarjeta de Resumen "Avance del plan" -->
    <section class="summary-card">
      <div class="summary-top">
        <!-- Gráfico circular SVG -->
        <div class="donut-box">
          <div class="donut-wrap">
            <svg class="donut-svg" viewBox="0 0 100 100" aria-hidden="true">
              <circle class="donut-track" cx="50" cy="50" r="40" />
              <circle
                class="donut-progress"
                cx="50"
                cy="50"
                r="40"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="dashOffset"
              />
            </svg>
            <span class="donut-percent">{{ avanceRedondeado }}%</span>
          </div>
          <span class="donut-caption">Avance del plan</span>
        </div>

        <!-- 6 columnas de métricas -->
        <div class="metrics-grid">
          <div class="metric-col">
            <div class="metric-value">
              {{ resumen.creditosAprobados }} / {{ resumen.creditosTotal }}
            </div>
            <div class="metric-label">Créditos aprobados</div>
          </div>
          <div class="metric-col">
            <div class="metric-value">
              {{ resumen.creditosEnCurso + resumen.creditosPendientes }}
            </div>
            <div class="metric-label">Créditos por cursar</div>
          </div>
          <div class="metric-col">
            <div class="metric-value">{{ resumen.unidadesAprobadas }}</div>
            <div class="metric-label">Unidades aprobadas</div>
          </div>
          <div class="metric-col">
            <div class="metric-value">{{ resumen.unidadesEnCurso }}</div>
            <div class="metric-label">Unidades en curso</div>
          </div>
          <div class="metric-col">
            <div class="metric-value">{{ unidadesPorCursar }}</div>
            <div class="metric-label">Unidades por cursar</div>
          </div>
          <div class="metric-col">
            <div class="metric-value metric-gpa">{{ promedioAcumulado }}</div>
            <div class="metric-label">Promedio acumulado</div>
          </div>
        </div>
      </div>

      <!-- Barra horizontal inferior + leyenda -->
      <div class="summary-bar-section">
        <div class="segmented-bar" role="progressbar" :aria-valuenow="avanceRedondeado" aria-valuemin="0" aria-valuemax="100">
          <div class="bar-approved" :style="{ width: `${pctAprobados}%` }" />
          <div class="bar-in-progress" :style="{ width: `${pctEnCurso}%` }" />
        </div>

        <div class="bar-legend">
          <span class="legend-item">
            <span class="legend-square sq-approved" />
            Aprobados: {{ resumen.creditosAprobados }} créditos
          </span>
          <span class="legend-item">
            <span class="legend-square sq-progress" />
            En curso: {{ resumen.creditosEnCurso }} créditos
          </span>
          <span class="legend-item">
            <span class="legend-square sq-pending" />
            Por cursar: {{ resumen.creditosPendientes }} créditos
          </span>
        </div>
      </div>
    </section>

    <!-- Barra discreta de filtro rápido en los acordeones -->
    <div class="accordions-toolbar">
      <div class="filter-pills">
        <button
          v-for="f in filtrosEstado"
          :key="f.key"
          type="button"
          class="filter-pill"
          :class="{ active: estadoFiltro === f.key }"
          @click="estadoFiltro = f.key"
        >
          {{ f.label }}
        </button>
      </div>

      <button type="button" class="toggle-all-btn" @click="toggleTodosSemestres">
        {{ todosExpandidos ? 'Contraer todos' : 'Expandir todos' }}
      </button>
    </div>

    <!-- 3. Lista de Acordeones Colapsables por Semestre -->
    <section class="accordions-list">
      <article
        v-for="sem in semestresFiltrados"
        :key="sem.id"
        class="accordion-card"
      >
        <button
          type="button"
          class="accordion-header"
          :aria-expanded="isSemesterOpen(sem.id)"
          @click="toggleSemester(sem.id)"
        >
          <div class="acc-left">
            <span class="acc-title">{{ formatSemesterTitle(sem.nombre) }}</span>
            <span v-if="isSemesterComplete(sem)" class="pill-complete">Completo</span>
          </div>

          <div class="acc-right">
            <div class="mini-progress-track">
              <div
                class="mini-progress-fill"
                :class="isSemesterComplete(sem) ? 'fill-complete' : 'fill-progress'"
                :style="{ width: `${getSemesterProgressPct(sem)}%` }"
              />
            </div>
            <span class="acc-stats">
              {{ getApprovedCount(sem) }} de {{ sem.totalUnidades }} unidades ·
              {{ getApprovedCredits(sem) }} de {{ sem.creditos }} créditos
            </span>
            <ChevronDown
              :size="18"
              class="acc-chevron"
              :class="{ rotated: isSemesterOpen(sem.id) }"
            />
          </div>
        </button>

        <div v-show="isSemesterOpen(sem.id)" class="accordion-body">
          <div class="table-wrap">
            <table class="units-table">
              <thead>
                <tr>
                  <th>Unidad de formación</th>
                  <th class="text-center">Créd.</th>
                  <th class="text-center">Nota</th>
                  <th class="text-center">Estado</th>
                  <th class="col-action" />
                </tr>
              </thead>
              <tbody>
                <template v-for="unidad in sem.unidadesVisibles" :key="unidad.codigo">
                  <tr
                    class="unit-row"
                    :class="{ 'row-expanded': expandedUnit === unidad.codigo }"
                    @click="toggleUnitDetail(unidad.codigo)"
                  >
                    <td>
                      <div class="unit-name-main">{{ unidad.nombre }}</div>
                      <div class="unit-code-sub">{{ unidad.codigo }} · {{ unidad.periodo }}</div>
                    </td>
                    <td class="text-center">{{ unidad.creditos }}</td>
                    <td class="text-center">
                      <strong>{{ unidad.nota !== null ? unidad.nota.toFixed(1) : '—' }}</strong>
                    </td>
                    <td class="text-center">
                      <span
                        class="status-pill"
                        :class="unidad.estado === 'aprobada' ? 'pill-approved' : 'pill-in-course'"
                      >
                        {{ unidad.estado === 'aprobada' ? 'Aprobada' : 'En curso' }}
                      </span>
                    </td>
                    <td class="col-action text-center">
                      <ChevronDown
                        :size="16"
                        class="row-chevron"
                        :class="{ rotated: expandedUnit === unidad.codigo }"
                      />
                    </td>
                  </tr>

                  <tr v-if="expandedUnit === unidad.codigo" class="unit-detail-row">
                    <td colspan="5">
                      <div class="unit-detail-grid">
                        <div>
                          <span class="detail-k">Prerrequisitos:</span>
                          <strong>{{ getUnitMeta(unidad).prerrequisitos }}</strong>
                        </div>
                        <div>
                          <span class="detail-k">Horas semanales:</span>
                          <strong>{{ getUnitMeta(unidad).ihs }} horas</strong>
                        </div>
                        <div>
                          <span class="detail-k">Componente:</span>
                          <strong>{{ getUnitMeta(unidad).componente }}</strong>
                        </div>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </article>
    </section>

    <!-- Modal Sobreexpuesto de Malla Académica con Rutas SVG -->
    <div v-if="showMallaModal" class="malla-overlay" @click.self="cerrarMallaModal">
      <div class="malla-modal">
        <div class="malla-modal-header">
          <div class="malla-header-top">
            <div>
              <h3>Malla académica · {{ planEstudiosMock.programa }}</h3>
              <p class="malla-sub">Plan {{ planEstudiosMock.plan }}</p>
            </div>
            <button type="button" class="close-btn" aria-label="Cerrar malla" @click="cerrarMallaModal">
              <X :size="18" />
            </button>
          </div>

          <div class="malla-legend-row">
            <div class="malla-legend-items">
              <span class="mleg-item"><span class="mleg-dot dot-approved" />Aprobada</span>
              <span class="mleg-item"><span class="mleg-dot dot-progress" />En curso</span>
              <span class="mleg-item"><span class="mleg-dot dot-failed" />Reprobada</span>
              <span class="mleg-item"><span class="mleg-dot dot-available" />Disponible</span>
              <span class="mleg-item"><span class="mleg-dot dot-blocked" />Bloqueada</span>
            </div>
            <span class="malla-guide-text">
              Toca una unidad para ver qué necesitas antes y qué abre después.
            </span>
          </div>
        </div>

        <div class="malla-columns-scroll" @click="selectedMallaCode = null">
          <div ref="mallaCanvasRef" class="malla-canvas">
            <!-- Capa SVG de conectores Bézier curvos -->
            <svg
              class="malla-svg-layer"
              :width="svgSize.width"
              :height="svgSize.height"
              aria-hidden="true"
            >
              <defs>
                <marker
                  id="malla-arrow-default"
                  markerWidth="7"
                  markerHeight="7"
                  refX="6"
                  refY="3.5"
                  orient="auto"
                >
                  <path d="M 0 0 L 7 3.5 L 0 7 z" class="arrow-head-default" />
                </marker>
                <marker
                  id="malla-arrow-active"
                  markerWidth="7"
                  markerHeight="7"
                  refX="6"
                  refY="3.5"
                  orient="auto"
                >
                  <path d="M 0 0 L 7 3.5 L 0 7 z" class="arrow-head-active" />
                </marker>
              </defs>

              <path
                v-for="edge in svgEdges"
                :key="edge.id"
                :d="edge.d"
                fill="none"
                class="malla-edge"
                :class="{
                  'edge-active': edge.active,
                  'edge-dimmed': selectedMallaCode && !edge.active
                }"
                :marker-end="edge.active ? 'url(#malla-arrow-active)' : 'url(#malla-arrow-default)'"
              />
            </svg>

            <!-- Columnas de Semestres -->
            <div class="malla-columns">
              <div v-for="sem in semestres" :key="sem.id" class="malla-col">
                <div class="malla-col-header">
                  <span>{{ formatSemesterTitle(sem.nombre) }}</span>
                  <small>{{ sem.creditos }} cr.</small>
                </div>
                <div class="malla-col-items">
                  <button
                    v-for="u in sem.unidades"
                    :key="u.codigo"
                    :ref="(el) => setNodeRef(u.codigo, el)"
                    type="button"
                    class="malla-node"
                    :class="[
                      u.estado === 'aprobada' ? 'node-approved' : 'node-progress',
                      {
                        'node-highlighted': isNodeInSelectedChain(u.codigo),
                        'node-dimmed': selectedMallaCode && !isNodeInSelectedChain(u.codigo)
                      }
                    ]"
                    @click.stop="toggleMallaCourse(u.codigo)"
                  >
                    <div class="node-title">{{ u.nombre }}</div>
                    <div class="node-meta">
                      {{ u.creditos }} créd.<template v-if="u.nota !== null"> · {{ u.nota.toFixed(1) }}</template>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import { ChevronDown, Network, X } from 'lucide-vue-next'
import { planEstudiosMock, prerrequisitosMallaMock } from '@/data/mockData'

const showMallaModal = ref(false)
// Por defecto semestres I-V colapsados y Sexto semestre (id: 6) expandido
const openSemesters = ref(new Set([6]))
const expandedUnit = ref(null)
const estadoFiltro = ref('todas')

const filtrosEstado = [
  { key: 'todas', label: 'Todas' },
  { key: 'aprobada', label: 'Aprobadas' },
  { key: 'en_curso', label: 'En curso' }
]

// Estado de la Malla Académica y rutas SVG
const selectedMallaCode = ref(null)
const mallaCanvasRef = ref(null)
const nodeRefs = new Map()
const svgSize = ref({ width: 0, height: 0 })
const svgEdges = ref([])

const resumen = computed(() => planEstudiosMock.resumen)
const semestres = computed(() => planEstudiosMock.semestres)

const avanceRedondeado = computed(() => Math.round(resumen.value.avance))
const pctAprobados = computed(() => Math.round((resumen.value.creditosAprobados / resumen.value.creditosTotal) * 100))
const pctEnCurso = computed(() => 100 - pctAprobados.value)
const unidadesPorCursar = computed(
  () => resumen.value.unidadesTotal - resumen.value.unidadesAprobadas - resumen.value.unidadesEnCurso
)

// Promedio acumulado ponderado por créditos de asignaturas aprobadas
const promedioAcumulado = computed(() => {
  let sumWeighted = 0
  let sumCredits = 0
  for (const sem of semestres.value) {
    for (const u of sem.unidades) {
      if (u.estado === 'aprobada' && u.nota !== null) {
        sumWeighted += u.nota * u.creditos
        sumCredits += u.creditos
      }
    }
  }
  return sumCredits > 0 ? (sumWeighted / sumCredits).toFixed(2) : '—'
})

const semestresFiltrados = computed(() =>
  semestres.value
    .map((sem) => {
      const unidadesVisibles =
        estadoFiltro.value === 'todas'
          ? sem.unidades
          : sem.unidades.filter((u) => u.estado === estadoFiltro.value)
      return {
        ...sem,
        totalUnidades: sem.unidades.length,
        unidadesVisibles
      }
    })
    .filter((sem) => sem.unidadesVisibles.length > 0)
)

const todosExpandidos = computed(
  () =>
    semestresFiltrados.value.length > 0 &&
    semestresFiltrados.value.every((s) => openSemesters.value.has(s.id))
)

const circumference = 2 * Math.PI * 40
const dashOffset = computed(() => circumference * (1 - avanceRedondeado.value / 100))

function formatSemesterTitle(nombre) {
  const lower = nombre.toLowerCase()
  return lower.charAt(0).toUpperCase() + lower.slice(1)
}

function isSemesterOpen(id) {
  return openSemesters.value.has(id)
}

function toggleSemester(id) {
  const next = new Set(openSemesters.value)
  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }
  openSemesters.value = next
}

function toggleTodosSemestres() {
  if (todosExpandidos.value) {
    openSemesters.value = new Set()
  } else {
    openSemesters.value = new Set(semestresFiltrados.value.map((s) => s.id))
  }
}

function toggleUnitDetail(codigo) {
  expandedUnit.value = expandedUnit.value === codigo ? null : codigo
}

function getApprovedCount(sem) {
  return sem.unidades.filter((u) => u.estado === 'aprobada').length
}

function getApprovedCredits(sem) {
  return sem.unidades
    .filter((u) => u.estado === 'aprobada')
    .reduce((acc, u) => acc + u.creditos, 0)
}

function isSemesterComplete(sem) {
  return sem.unidades.length > 0 && getApprovedCount(sem) === sem.unidades.length
}

function getSemesterProgressPct(sem) {
  if (!sem.unidades.length) return 0
  return Math.round((getApprovedCount(sem) / sem.unidades.length) * 100)
}

function getUnitMeta(unidad) {
  const code = unidad.codigo || ''
  let componente = 'Profesional específico'
  if (code.startsWith('BAS')) componente = 'Ciencias básicas'
  else if (code.startsWith('COM') || code.startsWith('INST')) componente = 'Formación institucional'
  else if (code.startsWith('EC')) componente = 'Electiva complementaria'

  const prereqMap = {
    BAS04: 'TD102 · Aplicación de las Matemáticas y Física',
    TD202: 'TD103 · Algoritmos y Programación I',
    BAS02: 'BAS01 · Cálculo Diferencial',
    TD301: 'TD201 · Estructura de Datos Orientada a Objetos',
    TD404: 'TD303 · Introducción a Base de Datos',
    TD403: 'TD302 · Definición y Análisis de Requerimientos',
    BAS03: 'BAS02 · Cálculo Integral',
    TD401: 'TD301 · Programación Orientada a Objetos',
    TD504: 'TD404 · Diseño de Base de Datos',
    TD501: 'TD401 · Programación Orientada a la Web',
    TD503: 'TD403 · Diseño de Sistemas de Información',
    TD505: 'TD405 · Redes y Comunicaciones I',
    INST05: 'INST04 · Metodología de la Investigación',
    TD603: 'TD503 · Pruebas de Software e Implementación',
    TD604: 'TD505 · Redes y Comunicaciones II'
  }

  return {
    prerrequisitos: prereqMap[code] || 'Ninguno',
    ihs: unidad.creditos * 2,
    componente
  }
}

// Lógica de cadena de prerrequisitos y conectores SVG en la Malla
const selectedChain = computed(() => {
  const start = selectedMallaCode.value
  if (!start) return { nodes: new Set(), edges: new Set() }

  const nodes = new Set([start])
  const edges = new Set()

  // Ancestros (qué necesitas antes)
  const upQueue = [start]
  while (upQueue.length) {
    const curr = upQueue.shift()
    for (const rel of prerrequisitosMallaMock) {
      if (rel.to === curr) {
        edges.add(`${rel.from}->${rel.to}`)
        if (!nodes.has(rel.from)) {
          nodes.add(rel.from)
          upQueue.push(rel.from)
        }
      }
    }
  }

  // Descendientes (qué abre después)
  const downQueue = [start]
  while (downQueue.length) {
    const curr = downQueue.shift()
    for (const rel of prerrequisitosMallaMock) {
      if (rel.from === curr) {
        edges.add(`${rel.from}->${rel.to}`)
        if (!nodes.has(rel.to)) {
          nodes.add(rel.to)
          downQueue.push(rel.to)
        }
      }
    }
  }

  return { nodes, edges }
})

function isNodeInSelectedChain(codigo) {
  return selectedMallaCode.value !== null && selectedChain.value.nodes.has(codigo)
}

function toggleMallaCourse(codigo) {
  selectedMallaCode.value = selectedMallaCode.value === codigo ? null : codigo
}

function setNodeRef(codigo, el) {
  if (el) nodeRefs.set(codigo, el)
  else nodeRefs.delete(codigo)
}

function computeSvgEdges() {
  const canvasEl = mallaCanvasRef.value
  if (!canvasEl) return

  const canvasRect = canvasEl.getBoundingClientRect()
  svgSize.value = {
    width: canvasEl.scrollWidth,
    height: canvasEl.scrollHeight
  }

  const nextEdges = []
  for (const rel of prerrequisitosMallaMock) {
    const fromEl = nodeRefs.get(rel.from)
    const toEl = nodeRefs.get(rel.to)
    if (!fromEl || !toEl) continue

    const fromRect = fromEl.getBoundingClientRect()
    const toRect = toEl.getBoundingClientRect()

    const x1 = fromRect.right - canvasRect.left
    const y1 = fromRect.top + fromRect.height / 2 - canvasRect.top
    const x2 = toRect.left - canvasRect.left
    const y2 = toRect.top + toRect.height / 2 - canvasRect.top
    const dx = Math.max(24, (x2 - x1) * 0.5)

    const d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`
    const edgeId = `${rel.from}->${rel.to}`

    nextEdges.push({
      id: edgeId,
      d,
      active: selectedChain.value.edges.has(edgeId)
    })
  }
  svgEdges.value = nextEdges
}

async function abrirMallaModal() {
  showMallaModal.value = true
  await nextTick()
  computeSvgEdges()
}

function cerrarMallaModal() {
  showMallaModal.value = false
  selectedMallaCode.value = null
}

watch(selectedMallaCode, () => {
  if (showMallaModal.value) {
    nextTick(computeSvgEdges)
  }
})

watch(showMallaModal, (isOpen) => {
  if (isOpen) {
    window.addEventListener('resize', computeSvgEdges)
  } else {
    window.removeEventListener('resize', computeSvgEdges)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', computeSvgEdges)
})
</script>

<style scoped>
/* 1. Encabezado Superior */
.plan-top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.plan-program-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #185686;
}

:root.dark .plan-program-title {
  color: var(--text-brand);
}

.plan-code-sub {
  margin: 2px 0 0;
  font-size: 0.86rem;
  color: var(--text-secondary);
}

.malla-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 14px;
  border: 1px solid #185686;
  border-radius: 6px;
  background-color: var(--bg-surface);
  color: #185686;
  font-size: 0.84rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
}

:root.dark .malla-btn {
  border-color: var(--text-brand);
  color: var(--text-brand);
}

.malla-btn:hover {
  background-color: var(--bg-surface-muted);
}

/* 2. Tarjeta de Resumen */
.summary-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-left: 4px solid #f59e0b;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  padding: 20px;
}

.summary-top {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.donut-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 112px;
}

.donut-wrap {
  position: relative;
  width: 92px;
  height: 92px;
  display: grid;
  place-items: center;
}

.donut-svg {
  width: 92px;
  height: 92px;
  transform: rotate(-90deg);
}

.donut-track {
  fill: none;
  stroke: var(--border-color);
  stroke-width: 9;
}

.donut-progress {
  fill: none;
  stroke: #185686;
  stroke-width: 9;
  stroke-linecap: round;
}

:root.dark .donut-progress {
  stroke: #38bdf8;
}

.donut-percent {
  position: absolute;
  font-size: 1.25rem;
  font-weight: 700;
  color: #185686;
}

:root.dark .donut-percent {
  color: var(--text-brand);
}

.donut-caption {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.metrics-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(6, minmax(95px, 1fr));
  gap: 12px;
}

.metric-col {
  border-left: 2px solid var(--border-color);
  padding-left: 11px;
}

.metric-value {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
}

.metric-gpa {
  color: #185686;
}

:root.dark .metric-gpa {
  color: var(--text-brand);
}

.metric-label {
  font-size: 0.76rem;
  color: var(--text-secondary);
  margin-top: 2px;
}

.summary-bar-section {
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid var(--border-color);
}

.segmented-bar {
  height: 10px;
  border-radius: 999px;
  background-color: var(--border-color);
  overflow: hidden;
  display: flex;
}

.bar-approved {
  background-color: #185686;
  height: 100%;
}

.bar-in-progress {
  background-color: #f59e0b;
  height: 100%;
}

.bar-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 10px;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.legend-square {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  display: inline-block;
}

.sq-approved {
  background-color: #185686;
}

.sq-progress {
  background-color: #f59e0b;
}

.sq-pending {
  background-color: var(--border-color);
}

/* Barra discreta de filtro rápido */
.accordions-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: -8px;
}

.filter-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.filter-pill {
  padding: 5px 12px;
  border-radius: 999px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-surface);
  color: var(--text-secondary);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

.filter-pill.active {
  background-color: #185686;
  border-color: #185686;
  color: #ffffff;
}

.toggle-all-btn {
  border: none;
  background: transparent;
  color: #185686;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 6px;
}

:root.dark .toggle-all-btn {
  color: var(--text-brand);
}

.toggle-all-btn:hover {
  text-decoration: underline;
}

/* 3. Acordeones por Semestre */
.accordions-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.accordion-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.accordion-header {
  width: 100%;
  border: none;
  background: transparent;
  padding: 14px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  cursor: pointer;
  color: var(--text-primary);
  text-align: left;
}

.accordion-header:hover {
  background-color: var(--bg-surface-muted);
}

.acc-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.acc-title {
  font-size: 1rem;
  font-weight: 700;
  color: #185686;
}

:root.dark .acc-title {
  color: var(--text-brand);
}

.pill-complete {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 2px 9px;
  border-radius: 999px;
  background-color: rgba(101, 163, 13, 0.14);
  color: #4d7c0f;
}

:root.dark .pill-complete {
  color: #bef264;
}

.acc-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mini-progress-track {
  width: 72px;
  height: 6px;
  border-radius: 999px;
  background-color: var(--border-color);
  overflow: hidden;
}

.mini-progress-fill {
  height: 100%;
  border-radius: 999px;
}

.fill-complete {
  background-color: #65a30d;
}

.fill-progress {
  background-color: var(--text-secondary);
}

.acc-stats {
  font-size: 0.82rem;
  color: var(--text-secondary);
}

.acc-chevron,
.row-chevron {
  color: var(--text-secondary);
  transition: transform 0.2s ease;
}

.acc-chevron.rotated,
.row-chevron.rotated {
  transform: rotate(180deg);
}

.accordion-body {
  border-top: 1px solid var(--border-color);
}

.units-table {
  width: 100%;
  table-layout: auto;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.units-table thead th {
  text-align: left;
  padding: 10px 12px;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text-secondary);
  background-color: var(--bg-surface-muted);
  border-bottom: 1px solid var(--border-color);
  white-space: nowrap;
}

.units-table thead th:first-child,
.units-table tbody td:first-child {
  width: 44%;
  min-width: 240px;
}

.units-table tbody td {
  padding: 12px 12px;
  font-size: 0.85rem;
  line-height: 1.35;
  vertical-align: middle;
  border-bottom: 1px solid var(--border-color);
}

.units-table tbody td:not(:first-child) {
  white-space: nowrap;
  padding: 11px 10px;
}

.units-table tbody tr:last-child td {
  border-bottom: none;
}

.unit-row {
  cursor: pointer;
}

.unit-row:hover {
  background-color: var(--bg-surface-muted);
}

.unit-name-main {
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--text-primary);
}

.unit-code-sub {
  font-size: 0.76rem;
  color: var(--text-secondary);
  margin-top: 2px;
}

.text-center {
  text-align: center !important;
}

.col-action {
  width: 44px;
}

.status-pill {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.pill-approved {
  background-color: rgba(101, 163, 13, 0.14);
  color: #4d7c0f;
}

:root.dark .pill-approved {
  color: #bef264;
}

.pill-in-course {
  background-color: rgba(24, 86, 134, 0.12);
  color: #185686;
}

:root.dark .pill-in-course {
  color: #7dd3fc;
}

.unit-detail-row td {
  background-color: var(--bg-surface-muted);
  padding: 12px 18px !important;
}

.unit-detail-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  font-size: 0.82rem;
}

.detail-k {
  color: var(--text-secondary);
  margin-right: 6px;
}

/* Modal Malla Académica (Modo Claro y Modo Oscuro + SVG) */
.malla-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: grid;
  place-items: center;
  padding: 16px;
  z-index: 65;
}

.malla-modal {
  width: 95vw;
  max-width: 1280px;
  max-height: 90vh;
  background-color: var(--bg-surface);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.malla-modal-header {
  padding: 16px 20px;
  background-color: var(--bg-surface);
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.malla-header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.malla-modal-header h3 {
  margin: 0;
  font-size: 1.05rem;
  color: var(--text-brand);
}

.malla-sub {
  margin: 2px 0 0;
  font-size: 0.82rem;
  color: var(--text-secondary);
}

.close-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: var(--bg-surface-muted);
  color: var(--text-primary);
  display: grid;
  place-items: center;
  cursor: pointer;
  flex-shrink: 0;
}

.malla-legend-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 0.78rem;
}

.malla-legend-items {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.mleg-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--text-secondary);
  font-weight: 600;
}

.mleg-dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  display: inline-block;
}

.dot-approved {
  background-color: #84cc16;
}

.dot-progress {
  background-color: #3b82f6;
}

.dot-failed {
  background-color: #ef4444;
}

.dot-available {
  border: 2px solid #3b82f6;
  background: transparent;
}

.dot-blocked {
  background-color: #94a3b8;
}

.malla-guide-text {
  color: var(--text-secondary);
  font-style: italic;
}

.malla-columns-scroll {
  overflow: auto;
  padding: 18px 20px 22px;
  background-color: var(--bg-app);
}

.malla-canvas {
  position: relative;
  min-width: max-content;
}

.malla-svg-layer {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 1;
}

.malla-edge {
  stroke: #94a3b8;
  stroke-width: 1.5;
  opacity: 0.45;
  transition: stroke 0.2s ease, opacity 0.2s ease, stroke-width 0.2s ease;
}

:root.dark .malla-edge {
  stroke: #64748b;
}

.malla-edge.edge-active {
  stroke: #185686;
  stroke-width: 2.3;
  opacity: 1;
}

:root.dark .malla-edge.edge-active {
  stroke: #38bdf8;
}

.malla-edge.edge-dimmed {
  opacity: 0.14;
}

.arrow-head-default {
  fill: #94a3b8;
}

:root.dark .arrow-head-default {
  fill: #64748b;
}

.arrow-head-active {
  fill: #185686;
}

:root.dark .arrow-head-active {
  fill: #38bdf8;
}

.malla-columns {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(6, minmax(175px, 1fr));
  gap: 26px;
}

.malla-col {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  overflow: hidden;
  align-self: start;
}

.malla-col-header {
  background: #185686;
  color: #ffffff;
  padding: 8px 10px;
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  justify-content: space-between;
}

.malla-col-items {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.malla-node {
  width: 100%;
  text-align: left;
  border-radius: 6px;
  padding: 9px 10px;
  font-size: 0.76rem;
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
}

.malla-node:hover {
  transform: translateY(-1px);
}

.node-approved {
  background-color: #e8f3dc;
  border: 1px solid #84cc16;
  color: #1e293b;
}

:root.dark .node-approved {
  background-color: rgba(132, 204, 22, 0.16);
  border-color: rgba(132, 204, 22, 0.45);
  color: #f1f5f9;
}

.node-progress {
  background-color: #dcebfa;
  border: 1px solid #3b82f6;
  color: #1e293b;
}

:root.dark .node-progress {
  background-color: rgba(59, 130, 246, 0.18);
  border-color: rgba(59, 130, 246, 0.5);
  color: #f1f5f9;
}

.node-highlighted {
  box-shadow: 0 0 0 2px #185686;
}

:root.dark .node-highlighted {
  box-shadow: 0 0 0 2px #38bdf8;
}

.node-dimmed {
  opacity: 0.35;
}

.node-title {
  font-weight: 700;
  line-height: 1.25;
  margin-bottom: 4px;
}

.node-meta {
  font-size: 0.72rem;
  opacity: 0.85;
}

@media (max-width: 960px) {
  .metrics-grid {
    grid-template-columns: repeat(auto-fit, minmax(125px, 1fr));
  }
}
</style>
