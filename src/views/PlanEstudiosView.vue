<template>
  <div class="page-stack">
    <!-- 1. Encabezado Superior (fuera de tarjetas) -->
    <header class="plan-top-header">
      <div>
        <h2 class="plan-program-title">{{ planEstudiosMock.programa }}</h2>
        <p class="plan-code-sub">Plan de estudios {{ planEstudiosMock.plan }}</p>
      </div>

      <button type="button" class="malla-btn" @click="showMallaModal = true">
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

        <!-- 5 columnas de métricas -->
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

    <!-- 3. Lista de Acordeones Colapsables por Semestre -->
    <section class="accordions-list">
      <article
        v-for="sem in semestres"
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
              {{ getApprovedCount(sem) }} de {{ sem.unidades.length }} unidades ·
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
                <template v-for="unidad in sem.unidades" :key="unidad.codigo">
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

    <!-- Modal de Malla Curricular Gráfica por Columnas -->
    <div v-if="showMallaModal" class="malla-overlay" @click.self="showMallaModal = false">
      <div class="malla-modal">
        <div class="malla-modal-header">
          <div>
            <h3>Malla Académica · {{ planEstudiosMock.programa }}</h3>
            <p class="muted-text" style="margin: 2px 0 0;">
              Plan {{ planEstudiosMock.plan }} · Vista por semestres
            </p>
          </div>
          <button type="button" class="close-btn" aria-label="Cerrar malla" @click="showMallaModal = false">
            <X :size="18" />
          </button>
        </div>

        <div class="malla-columns-scroll">
          <div class="malla-columns">
            <div v-for="sem in semestres" :key="sem.id" class="malla-col">
              <div class="malla-col-header">
                <span>{{ formatSemesterTitle(sem.nombre) }}</span>
                <small>{{ sem.creditos }} cr.</small>
              </div>
              <div class="malla-col-items">
                <div
                  v-for="u in sem.unidades"
                  :key="u.codigo"
                  class="malla-node"
                  :class="u.estado === 'aprobada' ? 'node-approved' : 'node-progress'"
                >
                  <div class="node-top">
                    <span>{{ u.codigo }}</span>
                    <span>{{ u.creditos }}c</span>
                  </div>
                  <div class="node-title">{{ u.nombre }}</div>
                  <div class="node-grade">
                    {{ u.nota !== null ? `Nota: ${u.nota.toFixed(1)}` : 'En curso' }}
                  </div>
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
import { computed, ref } from 'vue'
import { ChevronDown, Network, X } from 'lucide-vue-next'
import { planEstudiosMock } from '@/data/mockData'

const showMallaModal = ref(false)
// Por defecto semestres I-V colapsados y Sexto semestre (id: 6) expandido
const openSemesters = ref(new Set([6]))
const expandedUnit = ref(null)

const resumen = computed(() => planEstudiosMock.resumen)
const semestres = computed(() => planEstudiosMock.semestres)

const avanceRedondeado = computed(() => Math.round(resumen.value.avance))
const pctAprobados = computed(() => Math.round((resumen.value.creditosAprobados / resumen.value.creditosTotal) * 100))
const pctEnCurso = computed(() => 100 - pctAprobados.value)
const unidadesPorCursar = computed(
  () => resumen.value.unidadesTotal - resumen.value.unidadesAprobadas - resumen.value.unidadesEnCurso
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
  grid-template-columns: repeat(5, minmax(110px, 1fr));
  gap: 14px;
}

.metric-col {
  border-left: 2px solid var(--border-color);
  padding-left: 12px;
}

.metric-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
}

.metric-label {
  font-size: 0.78rem;
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

/* Modal Malla Académica */
.malla-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: grid;
  place-items: center;
  padding: 16px;
  z-index: 65;
}

.malla-modal {
  width: 100%;
  max-width: 1120px;
  max-height: 88vh;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.malla-modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.malla-modal-header h3 {
  margin: 0;
  font-size: 1.05rem;
  color: var(--text-brand);
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
}

.malla-columns-scroll {
  overflow: auto;
  padding: 16px 20px 20px;
}

.malla-columns {
  display: grid;
  grid-template-columns: repeat(6, minmax(185px, 1fr));
  gap: 12px;
}

.malla-col {
  background: var(--bg-surface-muted);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  overflow: hidden;
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
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.malla-node {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-left: 3px solid #65a30d;
  border-radius: 6px;
  padding: 8px;
  font-size: 0.76rem;
}

.malla-node.node-progress {
  border-left-color: #f59e0b;
}

.node-top {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  color: var(--text-secondary);
  font-size: 0.7rem;
}

.node-title {
  font-weight: 600;
  margin: 4px 0;
  line-height: 1.25;
}

.node-grade {
  font-size: 0.72rem;
  color: var(--text-secondary);
}

@media (max-width: 900px) {
  .metrics-grid {
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  }
}
</style>
