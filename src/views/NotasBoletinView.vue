<template>
  <div class="page-stack">
    <!-- 1. Barra Superior de Acciones -->
    <div class="boletin-toolbar">
      <div class="period-select-wrap">
        <label for="boletin-periodo" class="floating-label">Periodo</label>
        <select id="boletin-periodo" v-model="selectedPeriodo" class="period-select">
          <option v-for="p in periodos" :key="p" :value="p">{{ p }}</option>
        </select>
      </div>

      <button type="button" class="download-pdf-btn" @click="descargarBoletin">
        <Download :size="16" />
        <span>Descargar boletín (PDF)</span>
      </button>
    </div>

    <p v-if="pdfFeedback" class="pdf-toast">{{ pdfFeedback }}</p>

    <!-- 2. Banner de Alerta Condicional -->
    <div v-if="selectedPeriodo === '2026-2'" class="partial-banner">
      Periodo en curso: las notas son parciales y el resultado final aún no está definido.
    </div>

    <!-- 3. Bloque 1: INFORMACIÓN DEL ESTUDIANTE -->
    <section class="boletin-section">
      <h2 class="section-heading">INFORMACIÓN DEL ESTUDIANTE</h2>
      <div class="boletin-table-card">
        <div class="table-wrap">
          <table class="boletin-table">
            <thead>
              <tr>
                <th>Programa</th>
                <th>Plan</th>
                <th>Semestre</th>
                <th>Estado</th>
                <th class="text-center">Prom. ponderado</th>
                <th class="text-center">Prom. semestre</th>
                <th class="text-center">Créditos</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>{{ estudianteMock.programaActual.programa }}</strong></td>
                <td>{{ estudianteMock.programaActual.plan }}</td>
                <td>{{ boletinActual.semestre }}</td>
                <td>
                  <span class="pill-enrolled">{{ boletinActual.estadoEstudiante }}</span>
                </td>
                <td class="text-center">
                  {{
                    boletinActual.promedioPonderado !== null
                      ? boletinActual.promedioPonderado.toFixed(2)
                      : '—'
                  }}
                </td>
                <td class="text-center">
                  {{
                    boletinActual.promedioSemestre !== null
                      ? boletinActual.promedioSemestre.toFixed(2)
                      : '—'
                  }}
                </td>
                <td class="text-center"><strong>{{ boletinActual.creditos }}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- 4. Bloque 2: UNIDADES DE FORMACIÓN -->
    <section class="boletin-section">
      <h2 class="section-heading">UNIDADES DE FORMACIÓN</h2>
      <div class="boletin-table-card">
        <div class="table-wrap">
          <table class="boletin-table">
            <thead>
              <tr>
                <th>Unidad de formación</th>
                <th class="text-center num-col">Créd.</th>
                <th class="text-center num-col">
                  <span>Corte #1</span>
                  <span class="cut-pct">(30%)</span>
                </th>
                <th class="text-center num-col">
                  <span>Corte #2</span>
                  <span class="cut-pct">(30%)</span>
                </th>
                <th class="text-center num-col">
                  <span>Corte #3</span>
                  <span class="cut-pct">(40%)</span>
                </th>
                <th class="text-center num-col">Acum.</th>
                <th class="text-center num-col">Faltas</th>
                <th class="text-center num-col">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in boletinActual.unidades" :key="u.codigo">
                <td>
                  <div class="unit-title">{{ u.unidad }}</div>
                  <div class="unit-sub">{{ u.codigo }} · {{ u.ihs }} h/sem</div>
                </td>
                <td class="text-center">{{ u.creditos }}</td>
                <td class="text-center">
                  <span :class="{ 'low-grade': isLowGrade(u.c1) }">{{ formatGrade(u.c1) }}</span>
                </td>
                <td class="text-center">
                  <span :class="{ 'low-grade': isLowGrade(u.c2) }">{{ formatGrade(u.c2) }}</span>
                </td>
                <td class="text-center">
                  <span :class="{ 'low-grade': isLowGrade(u.c3) }">{{ formatGrade(u.c3) }}</span>
                </td>
                <td class="text-center">
                  <strong :class="{ 'low-grade': isLowGrade(calcAcumulado(u)) }">
                    {{ formatGrade(calcAcumulado(u)) }}
                  </strong>
                </td>
                <td class="text-center">{{ u.faltas }}</td>
                <td class="text-center">
                  <span class="status-text" :class="u.estado === 'Aprobada' ? 'st-ok' : 'st-prog'">
                    {{ u.estado }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <p class="boletin-footnote">
        La definitiva se calcula con el peso de cada corte (30%, 30%, 40%). Las notas por debajo de 3,0 aparecen resaltadas.
      </p>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Download } from 'lucide-vue-next'
import { boletinesPorPeriodoMock, estudianteMock } from '@/data/mockData'

const periodos = ['2026-2', '2026-1', '2025-2', '2024-2', '2024-1']
const selectedPeriodo = ref('2026-2')
const pdfFeedback = ref('')

const boletinActual = computed(() => boletinesPorPeriodoMock[selectedPeriodo.value])

function calcAcumulado(u) {
  if (u.c1 === null && u.c2 === null && u.c3 === null) {
    return null
  }
  const v1 = u.c1 ?? 0
  const v2 = u.c2 ?? 0
  const v3 = u.c3 ?? 0
  return Number((v1 * 0.3 + v2 * 0.3 + v3 * 0.4).toFixed(1))
}

function formatGrade(val) {
  return val !== null && val !== undefined ? val.toFixed(1) : '—'
}

function isLowGrade(val) {
  return val !== null && val !== undefined && val < 3.0
}

function descargarBoletin() {
  pdfFeedback.value = `Generando boletín PDF del periodo ${selectedPeriodo.value}...`
  setTimeout(() => {
    window.print()
    pdfFeedback.value = ''
  }, 250)
}
</script>

<style scoped>
/* 1. Barra Superior de Acciones */
.boletin-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.period-select-wrap {
  position: relative;
}

.floating-label {
  position: absolute;
  top: -8px;
  left: 10px;
  padding: 0 5px;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-secondary);
  background: var(--bg-app);
}

.period-select {
  appearance: none;
  min-width: 140px;
  background-color: var(--bg-surface);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 9px 32px 8px 12px;
  font-size: 0.9rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  background-image: linear-gradient(45deg, transparent 50%, var(--text-secondary) 50%),
    linear-gradient(135deg, var(--text-secondary) 50%, transparent 50%);
  background-position: calc(100% - 14px) 15px, calc(100% - 9px) 15px;
  background-size: 5px 5px, 5px 5px;
  background-repeat: no-repeat;
}

.download-pdf-btn {
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

:root.dark .download-pdf-btn {
  border-color: var(--text-brand);
  color: var(--text-brand);
}

.download-pdf-btn:hover {
  background-color: var(--bg-surface-muted);
}

.pdf-toast {
  margin: 0;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  background: rgba(24, 86, 134, 0.12);
  color: var(--text-brand);
  font-size: 0.85rem;
  font-weight: 600;
}

/* 2. Banner de Alerta Condicional */
.partial-banner {
  background-color: #fdf3e1;
  border-left: 4px solid #f59e0b;
  border-radius: 6px;
  padding: 11px 16px;
  font-size: 0.9rem;
  color: #7c4a03;
  font-weight: 500;
}

:root.dark .partial-banner {
  background-color: rgba(245, 158, 11, 0.14);
  color: #fde68a;
}

/* 3 y 4. Bloques de Tablas */
.boletin-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-heading {
  margin: 8px 0 6px;
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

.boletin-table-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.boletin-table {
  width: 100%;
  table-layout: auto;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.boletin-table thead th {
  background-color: #dce7f2;
  color: #1e293b;
  font-weight: 700;
  font-size: 0.78rem;
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
  white-space: nowrap;
}

.boletin-table thead th:first-child,
.boletin-table tbody td:first-child {
  width: 44%;
  min-width: 240px;
}

.boletin-table thead th.num-col,
.boletin-table tbody td:not(:first-child) {
  white-space: nowrap;
  padding: 11px 10px;
}

:root.dark .boletin-table thead th {
  background-color: #1e324a;
  color: #e2e8f0;
}

.boletin-table tbody td {
  padding: 12px 12px;
  font-size: 0.85rem;
  line-height: 1.35;
  border-bottom: 1px solid var(--border-color);
  vertical-align: middle;
}

.boletin-table tbody tr:last-child td {
  border-bottom: none;
}

.text-center {
  text-align: center !important;
}

.pill-enrolled {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 0.74rem;
  font-weight: 700;
  background-color: rgba(101, 163, 13, 0.16);
  color: #4d7c0f;
}

:root.dark .pill-enrolled {
  color: #bef264;
}

.cut-pct {
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  opacity: 0.85;
}

.unit-title {
  font-weight: 700;
  font-size: 0.84rem;
  text-transform: uppercase;
  color: var(--text-primary);
}

.unit-sub {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 2px;
}

.low-grade {
  display: inline-block;
  padding: 2px 7px;
  border-radius: 6px;
  background-color: rgba(220, 38, 38, 0.12);
  color: #b91c1c;
  font-weight: 700;
}

:root.dark .low-grade {
  background-color: rgba(248, 113, 113, 0.18);
  color: #fca5a5;
}

.status-text {
  font-size: 0.82rem;
  font-weight: 600;
}

.st-ok {
  color: #4d7c0f;
}

:root.dark .st-ok {
  color: #bef264;
}

.st-prog {
  color: var(--text-secondary);
}

.boletin-footnote {
  margin: 0;
  font-size: 0.82rem;
  color: var(--text-secondary);
}
</style>
