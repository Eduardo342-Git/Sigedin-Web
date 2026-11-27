<template>
  <div class="cal-wrapper">
    <!-- 1. Barra Superior de Navegación del Mes -->
    <div class="cal-top-bar">
      <div class="cal-nav-left">
        <button type="button" class="today-btn" @click="irAHoy">Hoy</button>
        <div class="month-arrows">
          <button type="button" class="arrow-btn" aria-label="Mes anterior" @click="cambiarMes(-1)">
            <ChevronLeft :size="17" />
          </button>
          <button type="button" class="arrow-btn" aria-label="Mes siguiente" @click="cambiarMes(1)">
            <ChevronRight :size="17" />
          </button>
        </div>
      </div>

      <h2 class="cal-month-title">{{ tituloMesActual }}</h2>

      <div class="view-segmented" role="group" aria-label="Vista del calendario">
        <button
          type="button"
          class="seg-btn"
          :class="{ active: vistaModo === 'mes' }"
          @click="vistaModo = 'mes'"
        >
          Mes
        </button>
        <button
          type="button"
          class="seg-btn"
          :class="{ active: vistaModo === 'agenda' }"
          @click="vistaModo = 'agenda'"
        >
          Agenda
        </button>
      </div>
    </div>

    <!-- 2. Píldoras de Filtro por Categoría -->
    <div class="cat-pills">
      <button
        v-for="cat in categorias"
        :key="cat.key"
        type="button"
        class="cat-pill"
        :class="{ inactive: !activeCategories.has(cat.key) }"
        @click="toggleCategory(cat.key)"
      >
        <span class="cat-dot" :style="{ backgroundColor: cat.color }" />
        <span>{{ cat.label }}</span>
      </button>
    </div>

    <!-- 3. Vista Mensual (LUN a DOM) -->
    <template v-if="vistaModo === 'mes'">
      <section class="month-grid-card">
        <div class="weekday-header">
          <div v-for="d in diasHeader" :key="d" class="weekday-cell">{{ d }}</div>
        </div>

        <div class="days-grid">
          <button
            v-for="celda in celdasMes"
            :key="celda.iso"
            type="button"
            class="day-cell"
            :class="{
              'other-month': !celda.inMonth,
              'class-day': celda.inMonth && celda.hasClasses,
              'is-today': celda.iso === TODAY_ISO,
              'is-selected': celda.iso === selectedDateIso
            }"
            @click="selectedDateIso = celda.iso"
          >
            <div class="day-number-row">
              <span class="day-num" :class="{ 'today-circle': celda.iso === TODAY_ISO }">
                {{ celda.day }}
              </span>
            </div>

            <div class="day-events">
              <div
                v-for="ev in celda.events.slice(0, 2)"
                :key="ev.id"
                class="event-strip"
                :style="getStripStyle(ev.category)"
              >
                {{ ev.title }}
              </div>
              <div v-if="celda.events.length > 2" class="more-events">
                +{{ celda.events.length - 2 }} más
              </div>
            </div>
          </button>
        </div>
      </section>

      <div class="cal-legend">
        <span class="legend-rect" />
        <span>Días con clases</span>
      </div>

      <!-- 4. Panel Inferior de Detalle del Día Seleccionado -->
      <section class="card day-detail-card">
        <div class="detail-head">
          <h3 class="detail-date-title">{{ tituloDiaSeleccionado }}</h3>
          <span class="detail-count">
            {{ eventosDiaSeleccionado.length }}
            {{ eventosDiaSeleccionado.length === 1 ? 'fecha importante' : 'fechas importantes' }}
          </span>
        </div>

        <div v-if="eventosDiaSeleccionado.length" class="detail-events-list">
          <article
            v-for="ev in eventosDiaSeleccionado"
            :key="ev.id"
            class="detail-event-item"
            :style="{ borderLeftColor: getCategoryColor(ev.category) }"
          >
            <div class="detail-ev-title">{{ ev.title }}</div>
            <div class="detail-ev-meta">
              {{ formatRange(ev.start, ev.end) }} · {{ getCategoryLabel(ev.category) }}
            </div>
            <p class="detail-ev-desc">{{ ev.description }}</p>
          </article>
        </div>
        <p v-else class="muted-text" style="margin: 8px 0 0;">
          No hay eventos programados para esta fecha con los filtros activos.
        </p>
      </section>
    </template>

    <!-- Vista Agenda Cronológica -->
    <section v-else class="card agenda-card">
      <h3 class="agenda-title">Agenda cronológica · {{ tituloMesActual }}</h3>
      <div v-if="eventosMesAgenda.length" class="detail-events-list">
        <article
          v-for="ev in eventosMesAgenda"
          :key="ev.id"
          class="detail-event-item"
          :style="{ borderLeftColor: getCategoryColor(ev.category) }"
        >
          <div class="detail-ev-title">{{ ev.title }}</div>
          <div class="detail-ev-meta">
            {{ formatRange(ev.start, ev.end) }} · {{ getCategoryLabel(ev.category) }}
          </div>
          <p class="detail-ev-desc">{{ ev.description }}</p>
        </article>
      </div>
      <p v-else class="muted-text" style="margin: 0;">
        No hay eventos registrados en este mes para las categorías seleccionadas.
      </p>
    </section>

    <!-- Sección Fechas aproximadas -->
    <section class="approx-section">
      <h3 class="approx-heading">Fechas aproximadas</h3>
      <div class="approx-grid">
        <article v-for="item in fechasAproximadas" :key="item.id" class="card approx-card">
          <div class="approx-title">{{ item.title }}</div>
          <div class="approx-meta">{{ item.window }}</div>
          <p class="approx-desc">{{ item.description }}</p>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const TODAY_ISO = '2026-11-26'

const vistaModo = ref('mes')
const currentYear = ref(2026)
const currentMonth = ref(10) // 0-indexed: 10 = Noviembre
const selectedDateIso = ref(TODAY_ISO)

const categorias = [
  { key: 'matricula', label: 'Inscripción y matrícula', color: '#2563EB', bg: 'rgba(37, 99, 235, 0.12)', text: '#1D4ED8' },
  { key: 'clases', label: 'Clases y evaluaciones', color: '#F97316', bg: 'rgba(249, 115, 22, 0.13)', text: '#C2410C' },
  { key: 'tramites', label: 'Trámites académicos', color: '#0D9488', bg: 'rgba(13, 148, 136, 0.12)', text: '#0F766E' },
  { key: 'grados', label: 'Grados', color: '#9333EA', bg: 'rgba(147, 51, 234, 0.12)', text: '#7E22CE' }
]

const activeCategories = ref(new Set(categorias.map((c) => c.key)))
const diasHeader = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM']

const eventosCalendario = [
  {
    id: 1,
    title: 'Segundos parciales',
    category: 'clases',
    start: '2026-10-26',
    end: '2026-11-06',
    description: 'Aplicación de evaluaciones correspondientes al Corte #2 (30%).'
  },
  {
    id: 2,
    title: 'Reporte de notas a SIGEDIN',
    category: 'clases',
    start: '2026-11-09',
    end: '2026-11-13',
    description: 'Publicación de calificaciones del segundo corte en la plataforma.'
  },
  {
    id: 3,
    title: 'Inscripción de aspirantes',
    category: 'matricula',
    start: '2026-11-10',
    end: '2026-11-30',
    description: 'Proceso de inscripción para aspirantes nuevos periodo 2027-1.'
  },
  {
    id: 4,
    title: 'Solicitudes de reingreso',
    category: 'tramites',
    start: '2026-11-16',
    end: '2026-11-26',
    description: 'Radicación en línea para estudiantes que retoman programa académico.'
  },
  {
    id: 5,
    title: 'Finalización de clases',
    category: 'clases',
    start: '2026-11-26',
    end: '2026-11-28',
    description: 'Cierre de sesiones académicas ordinarias del periodo 2026-2.'
  },
  {
    id: 6,
    title: 'Exámenes finales',
    category: 'clases',
    start: '2026-11-30',
    end: '2026-12-05',
    description: 'Evaluaciones finales correspondientes al Corte #3 (40%).'
  },
  {
    id: 7,
    title: 'Solicitud de habilitaciones',
    category: 'tramites',
    start: '2026-12-07',
    end: '2026-12-09',
    description: 'Inscripción de exámenes habilitatorios y supletorios.'
  },
  {
    id: 8,
    title: 'Habilitaciones',
    category: 'clases',
    start: '2026-12-10',
    end: '2026-12-12',
    description: 'Presentación de pruebas de habilitación en sedes institucionales.'
  },
  {
    id: 9,
    title: 'Supletorios',
    category: 'clases',
    start: '2026-12-07',
    end: '2026-12-11',
    description: 'Evaluaciones supletorias autorizadas por coordinación de programa.'
  },
  {
    id: 10,
    title: 'Paz y salvo de grados',
    category: 'grados',
    start: '2026-11-23',
    end: '2026-12-14',
    description: 'Validación de requisitos académicos, idioma y horas sociales CIECYT.'
  }
]

const fechasAproximadas = [
  {
    id: 'ap1',
    title: 'Evaluación docente · Diálogo formativo',
    window: 'Mitad de semestre (por definir según facultad)',
    description: 'Espacio de retroalimentación académica entre docentes y estudiantes.'
  },
  {
    id: 'ap2',
    title: 'Evaluación docente · Encuesta',
    window: 'Últimas dos semanas del periodo 2026-2',
    description: 'Diligenciamiento obligatorio en línea previo al cierre de notas.'
  }
]

const mesesNombres = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const diasSemanaLargos = [
  'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
]

const tituloMesActual = computed(() => `${mesesNombres[currentMonth.value]} de ${currentYear.value}`)

function toIso(dateObj) {
  const y = dateObj.getFullYear()
  const m = String(dateObj.getMonth() + 1).padStart(2, '0')
  const d = String(dateObj.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const eventosFiltrados = computed(() =>
  eventosCalendario.filter((ev) => activeCategories.value.has(ev.category))
)

const celdasMes = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const startOffset = (firstDay.getDay() + 6) % 7 // Lunes = 0
  const gridStart = new Date(currentYear.value, currentMonth.value, 1 - startOffset)

  const cells = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i)
    const iso = toIso(d)
    const inMonth = d.getMonth() === currentMonth.value
    const dow = d.getDay() // 1..6 = Lun..Sab
    const hasClasses = dow >= 1 && dow <= 6 && iso <= '2026-11-28' && iso >= '2026-08-10'
    const events = eventosFiltrados.value.filter((ev) => iso >= ev.start && iso <= ev.end)

    cells.push({
      iso,
      day: d.getDate(),
      inMonth,
      hasClasses,
      events
    })
  }
  return cells
})

const eventosDiaSeleccionado = computed(() =>
  eventosFiltrados.value.filter(
    (ev) => selectedDateIso.value >= ev.start && selectedDateIso.value <= ev.end
  )
)

const tituloDiaSeleccionado = computed(() => {
  const [y, m, d] = selectedDateIso.value.split('-').map(Number)
  const dateObj = new Date(y, m - 1, d)
  return `${diasSemanaLargos[dateObj.getDay()]}, ${d} de ${mesesNombres[m - 1].toLowerCase()} de ${y}`
})

const eventosMesAgenda = computed(() => {
  const monthStart = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-01`
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
  const monthEnd = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
  return eventosFiltrados.value.filter((ev) => ev.end >= monthStart && ev.start <= monthEnd)
})

function cambiarMes(delta) {
  const next = new Date(currentYear.value, currentMonth.value + delta, 1)
  currentYear.value = next.getFullYear()
  currentMonth.value = next.getMonth()
}

function irAHoy() {
  currentYear.value = 2026
  currentMonth.value = 10
  selectedDateIso.value = TODAY_ISO
}

function toggleCategory(key) {
  const next = new Set(activeCategories.value)
  if (next.has(key)) {
    next.delete(key)
  } else {
    next.add(key)
  }
  activeCategories.value = next
}

function getCategoryObj(key) {
  return categorias.find((c) => c.key === key) || categorias[0]
}

function getCategoryColor(key) {
  return getCategoryObj(key).color
}

function getCategoryLabel(key) {
  return getCategoryObj(key).label
}

function getStripStyle(key) {
  const cat = getCategoryObj(key)
  return {
    backgroundColor: cat.bg,
    borderLeft: `3px solid ${cat.color}`,
    color: 'var(--text-primary)'
  }
}

function formatRange(start, end) {
  return start === end ? start : `${start} al ${end}`
}
</script>

<style scoped>
.cal-wrapper {
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* 1. Barra Superior */
.cal-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 2px;
}

.cal-nav-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.today-btn {
  border: 1px solid #185686;
  color: #185686;
  background: var(--bg-surface);
  border-radius: 6px;
  padding: 5px 12px;
  font-size: 0.82rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
}

:root.dark .today-btn {
  border-color: var(--text-brand);
  color: var(--text-brand);
}

.month-arrows {
  display: inline-flex;
  gap: 4px;
}

.arrow-btn {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background: var(--bg-surface);
  color: var(--text-primary);
  display: grid;
  place-items: center;
  cursor: pointer;
}

.arrow-btn:hover {
  background: var(--bg-surface-muted);
}

.cal-month-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.view-segmented {
  display: inline-flex;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  overflow: hidden;
  background: var(--bg-surface-muted);
}

.seg-btn {
  border: none;
  background: transparent;
  color: var(--text-secondary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 5px 14px;
  font-size: 0.82rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
}

.seg-btn.active {
  background-color: #185686;
  color: #ffffff;
}

/* 2. Píldoras de Categoría */
.cat-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.cat-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border-radius: 999px;
  border: 1px solid var(--border-color);
  background: var(--bg-surface);
  color: var(--text-primary);
  padding: 4px 12px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

.cat-pill.inactive {
  opacity: 0.45;
}

.cat-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* 3. Cuadrícula Mensual */
.month-grid-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.weekday-header {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  background: var(--bg-surface-muted);
  border-bottom: 1px solid var(--border-color);
}

.weekday-cell {
  text-align: center;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-secondary);
  padding: 8px 4px;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
}

.day-cell {
  min-height: 112px;
  border: none;
  border-right: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-surface);
  color: var(--text-primary);
  padding: 8px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
}

.day-cell:nth-child(7n) {
  border-right: none;
}

.day-cell.other-month {
  opacity: 0.42;
}

.day-cell.class-day {
  background-color: rgba(148, 163, 184, 0.08);
}

.day-cell.is-selected {
  background-color: rgba(24, 86, 134, 0.07);
}

.day-cell.is-today {
  box-shadow: inset 0 0 0 1.5px #185686;
}

.day-number-row {
  display: flex;
  justify-content: flex-end;
}

.day-num {
  font-size: 0.78rem;
  font-weight: 600;
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  border-radius: 50%;
}

.today-circle {
  background-color: #185686;
  color: #ffffff;
  font-weight: 700;
}

.day-events {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.event-strip {
  font-size: 0.7rem;
  font-weight: 600;
  line-height: 1.3;
  padding: 3px 7px;
  border-radius: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.more-events {
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--text-secondary);
  padding-left: 2px;
}

.cal-legend {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.78rem;
  color: var(--text-secondary);
}

.legend-rect {
  width: 14px;
  height: 10px;
  border-radius: 2px;
  background-color: rgba(148, 163, 184, 0.25);
  border: 1px solid var(--border-color);
}

/* 4. Detalle del día y Fechas aproximadas */
.detail-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.detail-date-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
}

.detail-count {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.detail-events-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-event-item {
  border-left: 4px solid #185686;
  padding: 6px 12px;
  background-color: var(--bg-surface-muted);
  border-radius: 0 6px 6px 0;
}

.detail-ev-title {
  font-weight: 700;
  font-size: 0.92rem;
}

.detail-ev-meta {
  font-size: 0.78rem;
  font-weight: 600;
  color: #185686;
  margin-top: 2px;
}

:root.dark .detail-ev-meta {
  color: var(--text-brand);
}

.detail-ev-desc {
  margin: 4px 0 0;
  font-size: 0.83rem;
  color: var(--text-secondary);
}

.agenda-title {
  margin: 0 0 12px;
  font-size: 1rem;
}

.approx-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.approx-heading {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-secondary);
}

.approx-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
}

.approx-card {
  padding: 14px 16px;
}

.approx-title {
  font-weight: 700;
  font-size: 0.9rem;
}

.approx-meta {
  font-size: 0.78rem;
  color: #185686;
  font-weight: 600;
  margin-top: 3px;
}

:root.dark .approx-meta {
  color: var(--text-brand);
}

.approx-desc {
  margin: 6px 0 0;
  font-size: 0.82rem;
  color: var(--text-secondary);
}

@media (max-width: 680px) {
  .day-cell {
    min-height: 68px;
    padding: 4px;
  }

  .event-strip {
    font-size: 0.6rem;
  }
}
</style>
