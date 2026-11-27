<template>
  <div class="cal-wrapper">
    <!-- 1. Barra Superior de Control -->
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

    <!-- Fila 2: Filtros Reales por Categoría -->
    <div class="cat-filter-row">
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

      <button
        v-if="activeCategories.size < categorias.length"
        type="button"
        class="see-all-btn"
        @click="verTodasCategorias"
      >
        Ver todas
      </button>
    </div>

    <!-- 2. Vista Mes en Layout Dividido -->
    <template v-if="vistaModo === 'mes'">
      <div class="month-split-layout">
        <!-- Columna Izquierda: Calendario Mensual Limpio -->
        <div class="month-left-col">
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
                  'class-day': resaltarClases && celda.inMonth && celda.hasClasses,
                  'is-selected': celda.iso === selectedDateIso
                }"
                :title="celda.events.map((e) => e.title).join(' · ') || undefined"
                @click="selectedDateIso = celda.iso"
              >
                <span class="day-num" :class="{ 'today-circle': celda.iso === TODAY_ISO }">
                  {{ celda.day }}
                </span>

                <div class="day-dots" aria-hidden="true">
                  <span
                    v-for="catKey in getUniqueCategoryKeys(celda.events)"
                    :key="catKey"
                    class="event-dot"
                    :style="{ backgroundColor: getCategoryObj(catKey).color }"
                  />
                </div>
              </button>
            </div>
          </section>

          <label class="classes-toggle-label">
            <input v-model="resaltarClases" type="checkbox" />
            <span class="class-tint-legend" />
            <span>Resaltar días con clases (Lun – Sáb)</span>
          </label>
        </div>

        <!-- Columna Derecha: Panel Fijo Detalle del día seleccionado -->
        <aside class="detail-panel-card">
          <div class="detail-head">
            <h3 class="detail-date-title">{{ tituloDiaSeleccionado }}</h3>
            <span class="detail-count">
              {{ eventosDiaSeleccionado.length }}
              {{ eventosDiaSeleccionado.length === 1 ? 'hito activo' : 'hitos activos' }}
            </span>
          </div>

          <div v-if="eventosDiaSeleccionado.length" class="detail-events-list">
            <article
              v-for="ev in eventosDiaSeleccionado"
              :key="ev.id"
              class="detail-event-item"
              :style="{ borderLeftColor: getCategoryObj(ev.category).color }"
            >
              <div class="detail-ev-title">{{ ev.title }}</div>
              <div class="detail-ev-meta">
                {{ formatNaturalRange(ev.start, ev.end) }} · {{ getCategoryObj(ev.category).label }}
              </div>
              <p class="detail-ev-desc">{{ ev.description }}</p>
            </article>
          </div>
          <p v-else class="muted-text" style="margin: 8px 0 0;">
            No hay hitos académicos registrados para esta fecha con los filtros activos.
          </p>
        </aside>
      </div>
    </template>

    <!-- 3. Vista Agenda Rediseñada -->
    <div v-else class="agenda-sections">
      <!-- En curso ahora -->
      <section class="agenda-group">
        <h3 class="section-heading">EN CURSO AHORA</h3>
        <div v-if="eventosEnCurso.length" class="agenda-cards-list">
          <article v-for="ev in eventosEnCurso" :key="ev.id" class="agenda-event-card">
            <div class="mini-cal-badge">
              <span class="mini-dow">{{ getShortDow(ev.start) }}</span>
              <span class="mini-day">{{ getDayNumber(ev.start) }}</span>
            </div>
            <div class="agenda-center" :style="{ borderLeftColor: getCategoryObj(ev.category).color }">
              <div class="agenda-ev-title">{{ ev.title }}</div>
              <div class="agenda-ev-meta">
                {{ formatNaturalRange(ev.start, ev.end) }} · {{ getCategoryObj(ev.category).label }}
              </div>
              <p class="agenda-ev-desc">{{ ev.description }}</p>
            </div>
            <span class="countdown-pill" :class="getCountdown(ev).cls">
              {{ getCountdown(ev).text }}
            </span>
          </article>
        </div>
        <p v-else class="muted-text" style="margin: 0;">No hay eventos en curso con los filtros actuales.</p>
      </section>

      <!-- Próximos eventos -->
      <section class="agenda-group">
        <h3 class="section-heading">PRÓXIMOS EVENTOS</h3>
        <div v-if="eventosProximos.length" class="agenda-cards-list">
          <article v-for="ev in eventosProximos" :key="ev.id" class="agenda-event-card">
            <div class="mini-cal-badge">
              <span class="mini-dow">{{ getShortDow(ev.start) }}</span>
              <span class="mini-day">{{ getDayNumber(ev.start) }}</span>
            </div>
            <div class="agenda-center" :style="{ borderLeftColor: getCategoryObj(ev.category).color }">
              <div class="agenda-ev-title">{{ ev.title }}</div>
              <div class="agenda-ev-meta">
                {{ formatNaturalRange(ev.start, ev.end) }} · {{ getCategoryObj(ev.category).label }}
              </div>
              <p class="agenda-ev-desc">{{ ev.description }}</p>
            </div>
            <span class="countdown-pill" :class="getCountdown(ev).cls">
              {{ getCountdown(ev).text }}
            </span>
          </article>
        </div>
        <p v-else class="muted-text" style="margin: 0;">No hay próximos eventos con los filtros actuales.</p>
      </section>

      <!-- Fechas aproximadas del periodo -->
      <section class="agenda-group">
        <h3 class="section-heading">FECHAS APROXIMADAS DEL PERIODO</h3>
        <div class="approx-grid">
          <article v-for="item in fechasAproximadas" :key="item.id" class="card approx-card">
            <div class="approx-title">{{ item.title }}</div>
            <div class="approx-meta">{{ item.window }}</div>
            <p class="approx-desc">{{ item.description }}</p>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const TODAY_ISO = '2026-11-27'

const vistaModo = ref('mes')
const currentYear = ref(2026)
const currentMonth = ref(10) // 0-indexed: 10 = Noviembre
const selectedDateIso = ref(TODAY_ISO)
const resaltarClases = ref(true)

const categorias = [
  { key: 'matricula', label: 'Inscripción y matrícula', color: '#2563EB', bg: 'rgba(37, 99, 235, 0.14)' },
  { key: 'clases', label: 'Clases y evaluaciones', color: '#EA580C', bg: 'rgba(234, 88, 12, 0.15)' },
  { key: 'tramites', label: 'Trámites académicos', color: '#0D9488', bg: 'rgba(13, 148, 136, 0.14)' },
  { key: 'grados', label: 'Grados', color: '#7C3AED', bg: 'rgba(124, 58, 237, 0.14)' }
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
    end: '2026-11-27',
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
    end: '2026-12-15',
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

const mesesCortos = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun',
  'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
]

const diasSemanaLargos = [
  'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
]

const diasSemanaCortos = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB']

const tituloMesActual = computed(() => `${mesesNombres[currentMonth.value]} de ${currentYear.value}`)

function toIso(dateObj) {
  const y = dateObj.getFullYear()
  const m = String(dateObj.getMonth() + 1).padStart(2, '0')
  const d = String(dateObj.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function parseIso(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

const eventosFiltrados = computed(() =>
  eventosCalendario.filter((ev) => activeCategories.value.has(ev.category))
)

const celdasMes = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const startOffset = (firstDay.getDay() + 6) % 7
  const gridStart = new Date(currentYear.value, currentMonth.value, 1 - startOffset)

  const cells = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i)
    const iso = toIso(d)
    const inMonth = d.getMonth() === currentMonth.value
    const dow = d.getDay()
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

function getUniqueCategoryKeys(events) {
  return [...new Set(events.map((e) => e.category))]
}

const eventosDiaSeleccionado = computed(() =>
  eventosFiltrados.value.filter(
    (ev) => selectedDateIso.value >= ev.start && selectedDateIso.value <= ev.end
  )
)

const tituloDiaSeleccionado = computed(() => {
  const dateObj = parseIso(selectedDateIso.value)
  return `${diasSemanaLargos[dateObj.getDay()]}, ${dateObj.getDate()} de ${mesesNombres[dateObj.getMonth()].toLowerCase()} de ${dateObj.getFullYear()}`
})

// Grupos para la Vista Agenda
const eventosEnCurso = computed(() =>
  eventosFiltrados.value.filter((ev) => TODAY_ISO >= ev.start && TODAY_ISO <= ev.end)
)

const eventosProximos = computed(() =>
  eventosFiltrados.value
    .filter((ev) => ev.start > TODAY_ISO)
    .sort((a, b) => a.start.localeCompare(b.start))
)

function getShortDow(iso) {
  return diasSemanaCortos[parseIso(iso).getDay()]
}

function getDayNumber(iso) {
  return parseIso(iso).getDate()
}

function formatNaturalDate(iso) {
  const d = parseIso(iso)
  return `${d.getDate()} de ${mesesCortos[d.getMonth()]}`
}

function formatNaturalRange(start, end) {
  return start === end
    ? formatNaturalDate(start)
    : `${formatNaturalDate(start)} – ${formatNaturalDate(end)}`
}

function getCountdown(ev) {
  const todayMs = parseIso(TODAY_ISO).getTime()
  const startMs = parseIso(ev.start).getTime()
  const endMs = parseIso(ev.end).getTime()
  const dayMs = 86400000

  if (TODAY_ISO === ev.end) {
    return { text: 'Termina hoy', cls: 'pill-amber' }
  }
  if (TODAY_ISO >= ev.start && TODAY_ISO <= ev.end) {
    return { text: 'En curso', cls: 'pill-green' }
  }
  const diffDays = Math.round((startMs - todayMs) / dayMs)
  if (diffDays === 1) return { text: 'Mañana', cls: 'pill-blue' }
  if (diffDays > 1) return { text: `En ${diffDays} días`, cls: 'pill-blue' }
  const agoDays = Math.round((todayMs - endMs) / dayMs)
  return { text: `Hace ${agoDays} días`, cls: 'pill-blue' }
}

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

function verTodasCategorias() {
  activeCategories.value = new Set(categorias.map((c) => c.key))
}

function getCategoryObj(key) {
  return categorias.find((c) => c.key === key) || categorias[0]
}
</script>

<style scoped>
.cal-wrapper {
  max-width: 1120px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 1. Barra Superior */
.cal-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
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
  font-size: 1.12rem;
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

/* Filtros por categoría */
.cat-filter-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

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
  opacity: 0.42;
}

.cat-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
}

.see-all-btn {
  border: none;
  background: transparent;
  color: #185686;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}

:root.dark .see-all-btn {
  color: var(--text-brand);
}

/* 2. Vista Mes en Layout Dividido */
.month-split-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 22px;
  align-items: start;
}

@media (min-width: 1024px) {
  .month-split-layout {
    grid-template-columns: 1.65fr 1fr;
  }
}

.month-left-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.month-grid-card {
  background-color: var(--bg-surface);
  border: 1.5px solid var(--border-strong, #cbd5e1);
  border-radius: 10px;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

:root.dark .month-grid-card {
  border-color: rgba(148, 163, 184, 0.3);
}

.weekday-header {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  background: var(--bg-surface-muted);
  border-bottom: 1px solid #cbd5e1;
}

:root.dark .weekday-header {
  border-bottom-color: rgba(148, 163, 184, 0.25);
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
  aspect-ratio: 1 / 0.88;
  min-height: 74px;
  border: none;
  border-right: 1px solid #cbd5e1;
  border-bottom: 1px solid #cbd5e1;
  background: var(--bg-surface);
  color: var(--text-primary);
  padding: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

:root.dark .day-cell {
  border-color: rgba(148, 163, 184, 0.25);
}

.day-cell:nth-child(7n) {
  border-right: none;
}

.day-cell.other-month {
  opacity: 0.36;
}

.day-cell.class-day {
  background-color: rgba(148, 163, 184, 0.08);
  box-shadow: inset 0 -2px 0 rgba(101, 163, 13, 0.28);
}

.day-cell:not(.other-month):hover:not(.is-selected) {
  background-color: rgba(24, 86, 134, 0.05);
}

.day-cell.is-selected {
  box-shadow: inset 0 0 0 2px #185686;
  background-color: rgba(24, 86, 134, 0.08);
}

:root.dark .day-cell.is-selected {
  box-shadow: inset 0 0 0 2px #38bdf8;
  background-color: rgba(56, 189, 248, 0.14);
}

.day-num {
  font-size: 0.95rem;
  font-weight: 600;
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 50%;
}

.today-circle {
  background-color: #185686;
  color: #ffffff;
  font-weight: 700;
}

.day-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  height: 8px;
}

.event-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.classes-toggle-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  color: var(--text-secondary);
  cursor: pointer;
  user-select: none;
}

.class-tint-legend {
  width: 14px;
  height: 10px;
  border-radius: 2px;
  background-color: rgba(148, 163, 184, 0.18);
  border-bottom: 2px solid rgba(101, 163, 13, 0.45);
}

/* Panel Lateral Fijo de Detalle */
.detail-panel-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 20px;
  box-shadow: var(--shadow-sm);
}

.detail-head {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 14px;
}

.detail-date-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.detail-count {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.detail-events-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-event-item {
  border-left: 4px solid #185686;
  padding: 8px 12px;
  background-color: var(--bg-surface-muted);
  border-radius: 0 6px 6px 0;
}

.detail-ev-title {
  font-weight: 700;
  font-size: 0.9rem;
}

.detail-ev-meta {
  font-size: 0.76rem;
  font-weight: 600;
  color: #185686;
  margin-top: 2px;
}

:root.dark .detail-ev-meta {
  color: var(--text-brand);
}

.detail-ev-desc {
  margin: 4px 0 0;
  font-size: 0.82rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

/* 3. Vista Agenda */
.agenda-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.agenda-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-heading {
  margin: 0;
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

.agenda-cards-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.agenda-event-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 14px 16px;
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.mini-cal-badge {
  width: 52px;
  height: 52px;
  border-radius: 8px;
  background: var(--bg-subtle);
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mini-dow {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--text-secondary);
  line-height: 1.1;
}

.mini-day {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.1;
}

.agenda-center {
  flex: 1;
  min-width: 220px;
  border-left: 4px solid #185686;
  padding-left: 12px;
}

.agenda-ev-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary);
}

.agenda-ev-meta {
  font-size: 0.78rem;
  font-weight: 600;
  color: #185686;
  margin-top: 2px;
}

:root.dark .agenda-ev-meta {
  color: var(--text-brand);
}

.agenda-ev-desc {
  margin: 4px 0 0;
  font-size: 0.82rem;
  color: var(--text-secondary);
}

.countdown-pill {
  padding: 4px 11px;
  border-radius: 999px;
  font-size: 0.74rem;
  font-weight: 700;
  white-space: nowrap;
}

.pill-amber {
  background: rgba(245, 158, 11, 0.16);
  color: #b45309;
}

:root.dark .pill-amber {
  color: #fcd34d;
}

.pill-green {
  background: rgba(101, 163, 13, 0.16);
  color: #4d7c0f;
}

:root.dark .pill-green {
  color: #bef264;
}

.pill-blue {
  background: rgba(24, 86, 134, 0.14);
  color: #185686;
}

:root.dark .pill-blue {
  color: #7dd3fc;
}

.approx-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 14px;
}

.approx-card {
  padding: 16px;
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

@media (max-width: 640px) {
  .day-cell {
    min-height: 68px;
    padding: 4px;
  }
}
</style>
