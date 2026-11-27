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

    <!-- 2. Banner de Alerta Condicional -->
    <div v-if="selectedPeriodo === '2026-2'" class="partial-banner">
      Periodo en curso: las notas son parciales y el resultado final aún no está definido.
    </div>

    <!-- 3. Bloque 1: INFORMACIÓN DEL ESTUDIANTE (sin scroll horizontal en desktop) -->
    <section class="boletin-section">
      <h2 class="section-heading">INFORMACIÓN DEL ESTUDIANTE</h2>
      <div class="boletin-table-card">
        <div class="info-table-wrap">
          <table class="info-table">
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
                <td class="prog-col"><strong>{{ estudianteMock.programaActual.programa }}</strong></td>
                <td>{{ estudianteMock.programaActual.plan }}</td>
                <td>{{ boletinActual.semestre }}</td>
                <td>
                  <span class="pill-enrolled">{{ boletinActual.estadoEstudiante }}</span>
                </td>
                <td class="text-center">
                  <strong>{{ promedioPonderadoMostrar }}</strong>
                </td>
                <td class="text-center">
                  <strong :class="{ 'partial-amber': isPartialSemestre }">
                    {{ promedioSemestreMostrar }}
                  </strong>
                </td>
                <td class="text-center"><strong>{{ boletinActual.creditos }}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- 4. Bloque 2: UNIDADES DE FORMACIÓN + Simulador Corte #3 -->
    <section class="boletin-section">
      <div class="units-header-row">
        <h2 class="section-heading" style="margin: 0; border: none; padding: 0;">
          UNIDADES DE FORMACIÓN
        </h2>

        <div class="units-tools">
          <span class="weights-pill">Ver por porcentajes: 30% · 30% · 40%</span>
          <button
            v-if="boletinActual.enCurso"
            type="button"
            class="sim-btn"
            :class="{ active: simuladorActivo }"
            @click="simuladorActivo = !simuladorActivo"
          >
            <Calculator :size="15" />
            <span>{{ simuladorActivo ? 'Ocultar simulador' : 'Simular Corte #3' }}</span>
          </button>
        </div>
      </div>

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
                  <div v-if="simuladorActivo && boletinActual.enCurso" class="sim-cell">
                    <input
                      :value="simGrades[u.codigo] ?? ''"
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      placeholder="0.0"
                      class="sim-input"
                      :aria-label="`Simular Corte 3 para ${u.unidad}`"
                      @input="onSimInput(u.codigo, $event)"
                      @blur="onSimBlur(u.codigo, $event)"
                    />
                    <span class="min-req-badge">Mín: {{ calcMinCorte3(u) }}</span>
                  </div>
                  <span v-else :class="{ 'low-grade': isLowGrade(u.c3) }">{{ formatGrade(u.c3) }}</span>
                </td>
                <td class="text-center">
                  <strong
                    :class="{
                      'partial-amber': isPartialAmber(u),
                      'passing-grade': isPassingSimulated(u)
                    }"
                  >
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
        La definitiva se calcula con el peso de cada corte (30%, 30%, 40%). Las notas parciales por debajo de 3,0 aparecen resaltadas en ámbar.
      </p>
    </section>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { Calculator, Download } from 'lucide-vue-next'
import { boletinesPorPeriodoMock, estudianteMock } from '@/data/mockData'

const periodos = ['2026-2', '2026-1', '2025-2', '2024-2', '2024-1']
const selectedPeriodo = ref('2026-2')
const simuladorActivo = ref(false)
const simGrades = reactive({})

const boletinActual = computed(() => boletinesPorPeriodoMock[selectedPeriodo.value])

watch([selectedPeriodo, simuladorActivo], ([, activo], [, prevActivo]) => {
  if (!activo && prevActivo) {
    Object.keys(simGrades).forEach((k) => delete simGrades[k])
  }
})

watch(selectedPeriodo, () => {
  simuladorActivo.value = false
})

function onSimInput(codigo, event) {
  const raw = event.target.value
  if (raw === '') {
    simGrades[codigo] = null
    return
  }

  let num = parseFloat(raw)
  if (Number.isNaN(num)) {
    simGrades[codigo] = null
    event.target.value = ''
    return
  }

  if (num > 5) {
    num = 5
    event.target.value = '5'
  } else if (num < 0) {
    num = 0
    event.target.value = '0'
  } else if (raw.includes('.') && raw.split('.')[1].length > 1) {
    num = Math.floor(num * 10) / 10
    event.target.value = String(num)
  }

  simGrades[codigo] = num
}

function onSimBlur(codigo, event) {
  const raw = event.target.value
  if (raw === '') {
    simGrades[codigo] = null
    return
  }

  let num = parseFloat(raw)
  if (Number.isNaN(num)) {
    simGrades[codigo] = null
    event.target.value = ''
    return
  }

  num = Math.min(5, Math.max(0, Number(num.toFixed(1))))
  simGrades[codigo] = num
  event.target.value = num.toFixed(1)
}

function getEffectiveCorte3(u) {
  if (simuladorActivo.value && boletinActual.value.enCurso) {
    const val = simGrades[u.codigo]
    if (val !== '' && val !== null && val !== undefined && !Number.isNaN(Number(val))) {
      return Math.min(5, Math.max(0, Number(val)))
    }
  }
  return u.c3
}

function calcAcumulado(u) {
  const c3Val = getEffectiveCorte3(u)
  if (u.c1 === null && u.c2 === null && c3Val === null) {
    return null
  }
  const v1 = u.c1 ?? 0
  const v2 = u.c2 ?? 0
  const v3 = c3Val ?? 0
  return Number((v1 * 0.3 + v2 * 0.3 + v3 * 0.4).toFixed(1))
}

function calcMinCorte3(u) {
  const parcial = (u.c1 ?? 0) * 0.3 + (u.c2 ?? 0) * 0.3
  const needed = Math.max(0, (3.0 - parcial) / 0.4)
  return Math.min(5.0, Math.ceil(needed * 10) / 10).toFixed(1)
}

const promedioSemestreCalculado = computed(() => {
  let sumW = 0
  let sumC = 0
  for (const u of boletinActual.value.unidades) {
    const acum = calcAcumulado(u)
    if (acum !== null) {
      sumW += acum * u.creditos
      sumC += u.creditos
    }
  }
  return sumC > 0 ? Number((sumW / sumC).toFixed(2)) : null
})

const promedioSemestreMostrar = computed(() => {
  const val = boletinActual.value.enCurso
    ? promedioSemestreCalculado.value
    : boletinActual.value.promedioSemestre
  return val !== null && val !== undefined ? val.toFixed(2) : '—'
})

const promedioPonderadoMostrar = computed(() => {
  const val = boletinActual.value.promedioPonderado
  return val !== null && val !== undefined ? val.toFixed(2) : '—'
})

const isPartialSemestre = computed(
  () =>
    boletinActual.value.enCurso &&
    promedioSemestreCalculado.value !== null &&
    promedioSemestreCalculado.value < 3.0
)

function formatGrade(val) {
  return val !== null && val !== undefined ? val.toFixed(1) : '—'
}

function isLowGrade(val) {
  return val !== null && val !== undefined && val < 3.0
}

function isPartialAmber(u) {
  const acum = calcAcumulado(u)
  return acum !== null && acum < 3.0
}

function isPassingSimulated(u) {
  if (!simuladorActivo.value || !boletinActual.value.enCurso) return false
  const acum = calcAcumulado(u)
  return getEffectiveCorte3(u) !== null && acum !== null && acum >= 3.0
}

function calcAcumuladoOficial(u) {
  if (u.c1 === null && u.c2 === null && u.c3 === null) {
    return null
  }
  const v1 = u.c1 ?? 0
  const v2 = u.c2 ?? 0
  const v3 = u.c3 ?? 0
  return Number((v1 * 0.3 + v2 * 0.3 + v3 * 0.4).toFixed(1))
}

function descargarBoletin() {
  const b = boletinActual.value
  const p = estudianteMock.programaActual
  const totalHoras = b.unidades.reduce((acc, u) => acc + (u.ihs || 0), 0)

  let sumWOficial = 0
  let sumCOficial = 0
  for (const u of b.unidades) {
    if (u.c1 !== null || u.c2 !== null || u.c3 !== null) {
      const notaExacta = (u.c1 ?? 0) * 0.3 + (u.c2 ?? 0) * 0.3 + (u.c3 ?? 0) * 0.4
      sumWOficial += notaExacta * u.creditos
      sumCOficial += u.creditos
    }
  }
  const promSemestreOficial = b.enCurso
    ? sumCOficial > 0
      ? (sumWOficial / sumCOficial).toFixed(2)
      : '—'
    : b.promedioSemestre !== null && b.promedioSemestre !== undefined
      ? b.promedioSemestre.toFixed(2)
      : '—'
  const promPonderadoOficial =
    b.promedioPonderado !== null && b.promedioPonderado !== undefined
      ? b.promedioPonderado.toFixed(2)
      : '—'

  const filasHtml = b.unidades
    .map((u, idx) => {
      const acum = calcAcumuladoOficial(u)
      const estadoOficial = b.enCurso ? 'MATRICULADA' : 'APROBADA'
      return `
        <tr>
          <td class="c-center">${idx + 1}</td>
          <td class="c-nowrap">${u.codigo}</td>
          <td>${u.unidad}</td>
          <td class="c-center">${u.ihs}</td>
          <td class="c-center">${u.creditos}</td>
          <td class="c-center">${formatGrade(u.c1)}</td>
          <td class="c-center">${formatGrade(u.c2)}</td>
          <td class="c-center">${formatGrade(u.c3)}</td>
          <td class="c-center">—</td>
          <td class="c-center"><strong>${formatGrade(acum)}</strong></td>
          <td class="c-center">${u.faltas}</td>
          <td class="c-center">${estadoOficial}</td>
        </tr>
      `
    })
    .join('')

  const html = `<!DOCTYPE html>
  <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>Boletín de Calificaciones · ${b.periodo}</title>
      <style>
        * { box-sizing: border-box; }
        body {
          margin: 0;
          padding: 0;
          background-color: #323639;
          font-family: 'Fira Sans', Arial, sans-serif;
          color: #111827;
        }
        .viewer-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 52px;
          background-color: #202124;
          color: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
          z-index: 100;
        }
        .viewer-title { font-size: 0.92rem; font-weight: 600; }
        .print-btn {
          background-color: #185686;
          color: #ffffff;
          border: none;
          border-radius: 6px;
          padding: 8px 16px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
        }
        .print-btn:hover { background-color: #0f4766; }
        .sheet {
          width: 816px;
          min-height: 1056px;
          background: #ffffff;
          color: #111827;
          padding: 48px 52px;
          margin: 76px auto 32px;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.45);
        }
        .inst-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 14px;
          border-bottom: 2px solid #185686;
          margin-bottom: 18px;
        }
        .brand-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .brand-texts h2 {
          margin: 0;
          font-size: 1rem;
          font-weight: 800;
          color: #185686;
          letter-spacing: 0.03em;
        }
        .brand-texts p {
          margin: 2px 0 0;
          font-size: 0.72rem;
          color: #334155;
          font-weight: 600;
        }
        .brand-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }
        .edu-row {
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .edu-text {
          font-size: 0.92rem;
          font-weight: 700;
          color: #7f1d1d;
        }
        .co-flag {
          width: 96px;
          height: 5px;
          display: flex;
          border-radius: 2px;
          overflow: hidden;
        }
        .doc-title {
          text-align: center;
          color: #185686;
          font-size: 1.15rem;
          font-weight: 700;
          text-transform: uppercase;
          margin: 0 0 14px;
        }
        .ficha-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.78rem;
          margin-bottom: 18px;
        }
        .ficha-table td {
          border: 1px solid #cbd5e1;
          padding: 6px 9px;
        }
        .ficha-label {
          background-color: #f8fafc;
          font-weight: 700;
          color: #334155;
          width: 16%;
          white-space: nowrap;
        }
        .ficha-val {
          background-color: #ffffff;
          width: 34%;
        }
        .grades-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.74rem;
          margin-bottom: 16px;
        }
        .grades-table thead th {
          background-color: #185686;
          color: #ffffff;
          font-weight: 700;
          padding: 7px 6px;
          border: 1px solid #185686;
          text-align: left;
          white-space: nowrap;
        }
        .grades-table tbody td {
          border: 1px solid #cbd5e1;
          padding: 6px;
          vertical-align: middle;
        }
        .c-center { text-align: center !important; }
        .c-nowrap { white-space: nowrap; }
        .summary-line {
          color: #185686;
          font-weight: 700;
          font-size: 0.85rem;
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          padding: 10px 0;
          border-top: 1.5px solid #185686;
          border-bottom: 1px solid #cbd5e1;
          margin-bottom: 12px;
        }
        .glossary {
          font-size: 0.72rem;
          line-height: 1.45;
          color: #475569;
          margin: 0;
        }
        @media print {
          .no-print { display: none !important; }
          body { background: #ffffff; }
          .sheet {
            width: 100%;
            min-height: auto;
            margin: 0;
            padding: 0;
            box-shadow: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="viewer-bar no-print">
        <span class="viewer-title">Vista previa — Boletín de Calificaciones</span>
        <button class="print-btn" onclick="window.print()">Imprimir / Guardar como PDF</button>
      </div>

      <main class="sheet">
        <header class="inst-header">
          <div class="brand-left">
            <svg width="42" height="46" viewBox="0 0 42 46" fill="none" aria-label="Logo UNIPUTUMAYO">
              <circle cx="21" cy="11" r="6" fill="#80BF1F" />
              <circle cx="21" cy="11" r="3" fill="#F5A51D" />
              <path d="M7 15V27C7 35.28 13.27 41.5 21 41.5C28.73 41.5 35 35.28 35 27V15H28.5V27C28.5 31.69 25.14 35 21 35C16.86 35 13.5 31.69 13.5 27V15H7Z" fill="#185686" />
            </svg>
            <div class="brand-texts">
              <h2>UNIPUTUMAYO</h2>
              <p>INSTITUCIÓN UNIVERSITARIA DEL PUTUMAYO</p>
              <p>NIT. 800.247.940</p>
            </div>
          </div>

          <div class="brand-right">
            <div class="edu-row">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="#7F1D1D" stroke-width="2" fill="#FEF2F2" />
                <path d="M12 6L16 10V15C16 17 12 19 12 19C12 19 8 17 8 15V10L12 6Z" fill="#7F1D1D" />
              </svg>
              <span class="edu-text">Educación</span>
            </div>
            <div class="co-flag" aria-hidden="true">
              <span style="flex: 2; background: #FACC15;"></span>
              <span style="flex: 1; background: #1D4ED8;"></span>
              <span style="flex: 1; background: #DC2626;"></span>
            </div>
          </div>
        </header>

        <h1 class="doc-title">BOLETÍN DE CALIFICACIONES · ${b.periodo}</h1>

        <table class="ficha-table">
          <tbody>
            <tr>
              <td class="ficha-label">Sede</td>
              <td class="ficha-val">${p.sede}</td>
              <td class="ficha-label">Ciclo</td>
              <td class="ficha-val">${p.ciclo}</td>
            </tr>
            <tr>
              <td class="ficha-label">Programa</td>
              <td class="ficha-val">${p.programa}</td>
              <td class="ficha-label">Semestre</td>
              <td class="ficha-val">${b.semestre}</td>
            </tr>
            <tr>
              <td class="ficha-label">Estudiante</td>
              <td class="ficha-val">${estudianteMock.nombreCompleto}</td>
              <td class="ficha-label">Identificación</td>
              <td class="ficha-val">${estudianteMock.identificacion}</td>
            </tr>
            <tr>
              <td class="ficha-label">Código</td>
              <td class="ficha-val">${p.codigoEstudiante}</td>
              <td class="ficha-label">Plan de estudios</td>
              <td class="ficha-val">${p.plan}</td>
            </tr>
            <tr>
              <td class="ficha-label">Matrícula</td>
              <td class="ficha-val">99149</td>
              <td class="ficha-label">Estado</td>
              <td class="ficha-val">${b.estadoEstudiante}</td>
            </tr>
          </tbody>
        </table>

        <table class="grades-table">
          <thead>
            <tr>
              <th class="c-center">#</th>
              <th>CÓDIGO</th>
              <th>UNIDAD DE FORMACIÓN</th>
              <th class="c-center">IHS</th>
              <th class="c-center">CRE</th>
              <th class="c-center">C1 (30%)</th>
              <th class="c-center">C2 (30%)</th>
              <th class="c-center">C3 (40%)</th>
              <th class="c-center">HAB</th>
              <th class="c-center">DEF</th>
              <th class="c-center">FALT</th>
              <th class="c-center">ESTADO</th>
            </tr>
          </thead>
          <tbody>
            ${filasHtml}
          </tbody>
        </table>

        <div class="summary-line">
          <span>Promedio del semestre: ${promSemestreOficial}</span>
          <span>Promedio ponderado: ${promPonderadoOficial}</span>
          <span>Créditos: ${b.creditos}</span>
          <span>Horas semanales: ${totalHoras}</span>
        </div>

        <p class="glossary">
          C1: Corte #1 (30%) · C2: Corte #2 (30%) · C3: Corte #3 (40%) · HAB: Habilitación ·
          DEF: Definitiva acumulada · FALT: Faltas · IHS: Intensidad horaria semanal · CRE: Créditos.
          Observación: la nota de habilitación reemplaza la nota definitiva. Periodo en curso: las notas
          son parciales y el resultado final aún no está definido.
        </p>
      </main>
    </body>
  </html>`

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank', 'noopener,noreferrer')
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
  margin-bottom: 4px;
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

.units-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  padding-bottom: 8px;
  border-bottom: 1.5px solid #185686;
}

:root.dark .units-header-row {
  border-bottom-color: var(--text-brand);
}

.units-tools {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.weights-pill {
  font-size: 0.76rem;
  font-weight: 600;
  color: var(--text-secondary);
  background: var(--bg-surface-muted);
  border: 1px solid var(--border-color);
  border-radius: 999px;
  padding: 4px 10px;
}

.sim-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 6px;
  border: 1px solid #185686;
  background: var(--bg-surface);
  color: #185686;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

:root.dark .sim-btn {
  border-color: var(--text-brand);
  color: var(--text-brand);
}

.sim-btn.active {
  background-color: #185686;
  color: #ffffff;
}

.boletin-table-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

/* Información del Estudiante sin scroll horizontal en desktop */
.info-table-wrap {
  width: 100%;
  overflow-x: visible;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
}

.info-table thead th {
  background-color: #dce7f2;
  color: #1e293b;
  font-weight: 700;
  font-size: 0.75rem;
  padding: 9px 10px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
  white-space: nowrap;
}

:root.dark .info-table thead th {
  background-color: #1e324a;
  color: #e2e8f0;
}

.info-table tbody td {
  padding: 10px 10px;
  vertical-align: middle;
}

.prog-col {
  white-space: normal;
  line-height: 1.3;
}

/* Tabla de Unidades */
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
  width: 40%;
  min-width: 220px;
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
  padding: 2px 9px;
  border-radius: 999px;
  font-size: 0.72rem;
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

.sim-cell {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}

.sim-input {
  width: 62px;
  padding: 4px 6px;
  border-radius: 5px;
  border: 1.5px solid #185686;
  background-color: var(--bg-surface);
  color: var(--text-primary);
  font-size: 0.82rem;
  font-weight: 600;
  text-align: center;
}

:root.dark .sim-input {
  border-color: #38bdf8;
}

.min-req-badge {
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.partial-amber {
  display: inline-block;
  padding: 2px 7px;
  border-radius: 6px;
  background-color: rgba(245, 158, 11, 0.16);
  color: #b45309;
  font-weight: 700;
}

:root.dark .partial-amber {
  background-color: rgba(245, 158, 11, 0.2);
  color: #fcd34d;
}

.passing-grade {
  display: inline-block;
  padding: 2px 7px;
  border-radius: 6px;
  background-color: rgba(101, 163, 13, 0.16);
  color: #4d7c0f;
  font-weight: 700;
}

:root.dark .passing-grade {
  color: #bef264;
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

@media (max-width: 767px) {
  .info-table-wrap {
    overflow-x: auto;
  }
}
</style>
