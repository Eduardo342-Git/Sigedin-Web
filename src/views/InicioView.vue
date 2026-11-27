<template>
  <div class="page-stack">
    <!-- 1. Tarjeta Superior de Bienvenida -->
    <section class="welcome-card">
      <div class="welcome-top-row">
        <div class="welcome-photo-box">
          <img
            v-if="fotoCarnet"
            :src="fotoCarnet"
            alt="Foto de perfil del estudiante"
            class="welcome-photo-img"
          />
          <span v-else class="welcome-photo-initials">{{ estudianteMock.iniciales }}</span>
        </div>

        <div class="welcome-body">
          <h2 class="welcome-greeting">{{ saludoDinamico }}, {{ estudianteMock.primerNombre }}</h2>
          <p class="welcome-subtitle">
            {{ estudianteMock.programaActual.programa }} •
            {{ estudianteMock.programaActual.semestre }} •
            Periodo {{ estudianteMock.programaActual.periodo }} •
            Estado: <strong>{{ estudianteMock.programaActual.estado }}</strong>
          </p>
        </div>
      </div>

      <div class="welcome-alert">
        <span>
          Tus datos personales llevan {{ estudianteMock.diasSinActualizarDatos }} días sin actualizarse.
        </span>
        <RouterLink to="/hoja-de-vida" class="alert-link">Actualizar mis datos</RouterLink>
      </div>
    </section>

    <!-- 2. Barra de Controles del Horario -->
    <section class="schedule-controls">
      <span class="controls-label">Horario de clases</span>

      <div class="controls-right">
        <div class="period-select-wrap">
          <label for="periodo-select" class="floating-label">Periodo</label>
          <select id="periodo-select" v-model="selectedPeriodo" class="period-select">
            <option v-for="p in periodosHorarioMock" :key="p.id" :value="p.id">
              {{ p.label }}
            </option>
          </select>
        </div>

        <button type="button" class="pdf-btn" @click="exportarPdf">
          <Download :size="16" />
          <span>PDF</span>
        </button>
      </div>
    </section>

    <div v-if="pdfFeedback" class="pdf-toast">
      {{ pdfFeedback }}
    </div>

    <!-- 3. Grilla Semanal de Horario (Tabla Matriz) -->
    <section class="matrix-card">
      <div class="matrix-scroll">
        <table class="schedule-matrix">
          <thead>
            <tr>
              <th class="col-hour">Hora</th>
              <th
                v-for="dia in diasSemana"
                :key="dia.num"
                :class="{ 'col-today': dia.num === diaActual }"
              >
                {{ dia.nombre }}<span v-if="dia.num === diaActual"> • hoy</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(franja, rowIdx) in franjasHorarioMock" :key="franja">
              <td class="hour-cell">{{ franja }}</td>
              <template v-for="dia in diasSemana" :key="`${rowIdx}-${dia.num}`">
                <td
                  v-if="getCellState(dia.num, rowIdx).type === 'block'"
                  :rowspan="getCellState(dia.num, rowIdx).block.rowSpan"
                  class="course-cell"
                  :class="{ 'course-cell-active': isSelectedBlock(getCellState(dia.num, rowIdx).block) }"
                  :style="getBlockStyle(getCellState(dia.num, rowIdx).block)"
                  @mouseenter="showCoursePopover($event, getCellState(dia.num, rowIdx).block)"
                  @mouseleave="hideCoursePopover"
                  @click.stop="toggleCoursePopover($event, getCellState(dia.num, rowIdx).block)"
                >
                  <div class="course-title">{{ getCellState(dia.num, rowIdx).block.unidad }}</div>
                  <div class="course-meta">
                    {{ getCellState(dia.num, rowIdx).block.docente }}
                    <template v-if="getCellState(dia.num, rowIdx).block.salon">
                      · {{ getCellState(dia.num, rowIdx).block.salon }}
                    </template>
                  </div>
                </td>
                <td v-else-if="getCellState(dia.num, rowIdx).type === 'empty'" class="empty-cell" />
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <p class="matrix-footnote">
      Las horas seguidas de una misma unidad se muestran unidas.
    </p>

    <!-- Popover flotante de detalle del curso -->
    <div
      v-if="selectedCourse"
      ref="popoverRef"
      class="course-popover"
      :style="popoverStyle"
      @click.stop
    >
      <div class="popover-title">{{ selectedCourse.unidad }}</div>
      <div class="popover-row">
        <User :size="15" class="popover-icon" />
        <span>{{ selectedCourse.docente }}</span>
      </div>
      <div class="popover-row">
        <Clock :size="15" class="popover-icon" />
        <span>{{ formatHorarioPopover(selectedCourse) }}</span>
      </div>
      <div class="popover-row">
        <MapPin :size="15" class="popover-icon" />
        <span>{{ selectedCourse.salon || 'Por definir' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { Clock, Download, MapPin, User } from 'lucide-vue-next'
import {
  estudianteMock,
  franjasHorarioMock,
  horariosPorPeriodoMock,
  periodosHorarioMock
} from '@/data/mockData'

const selectedPeriodo = ref('2026-2')
const selectedCourse = ref(null)
const popoverPos = ref({ top: 0, left: 0 })
const popoverRef = ref(null)
const pdfFeedback = ref('')
const fotoCarnet = ref(localStorage.getItem('sigedin_user_photo') || '')

function syncUserPhoto() {
  fotoCarnet.value = localStorage.getItem('sigedin_user_photo') || ''
}

const diasSemana = [
  { num: 1, nombre: 'Lunes' },
  { num: 2, nombre: 'Martes' },
  { num: 3, nombre: 'Miercoles' },
  { num: 4, nombre: 'Jueves' },
  { num: 5, nombre: 'Viernes' },
  { num: 6, nombre: 'Sabado' }
]

// En domingo (0) se resalta Jueves como referencia visual; de lunes a sábado el día real
const diaActual = computed(() => {
  const day = new Date().getDay()
  return day >= 1 && day <= 6 ? day : 4
})

const saludoDinamico = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Buenos días'
  if (hour < 18) return 'Buenas tardes'
  return 'Buenas noches'
})

const bloquesActivos = computed(() => horariosPorPeriodoMock[selectedPeriodo.value] || [])

const popoverStyle = computed(() => ({
  top: `${popoverPos.value.top}px`,
  left: `${popoverPos.value.left}px`
}))

function getCellState(diaNum, rowIdx) {
  const startBlock = bloquesActivos.value.find(
    (b) => b.dia === diaNum && b.rowStart === rowIdx
  )
  if (startBlock) {
    return { type: 'block', block: startBlock }
  }

  const covered = bloquesActivos.value.some(
    (b) => b.dia === diaNum && rowIdx > b.rowStart && rowIdx < b.rowStart + b.rowSpan
  )
  if (covered) {
    return { type: 'spanned' }
  }

  return { type: 'empty' }
}

function getBlockStyle(block) {
  if (block.bg) {
    return {
      backgroundColor: block.bg,
      color: block.color || '#1E293B'
    }
  }
  return {}
}

function isSelectedBlock(block) {
  return (
    selectedCourse.value &&
    selectedCourse.value.dia === block.dia &&
    selectedCourse.value.rowStart === block.rowStart &&
    selectedCourse.value.codigo === block.codigo
  )
}

function showCoursePopover(event, block) {
  const rect = event.currentTarget.getBoundingClientRect()
  const halfWidth = 155
  const clampedLeft = Math.max(
    halfWidth + 12,
    Math.min(window.innerWidth - halfWidth - 12, rect.left + rect.width / 2)
  )
  popoverPos.value = {
    top: Math.max(12, rect.top - 10),
    left: clampedLeft
  }
  selectedCourse.value = block
}

function hideCoursePopover() {
  selectedCourse.value = null
}

function toggleCoursePopover(event, block) {
  if (isSelectedBlock(block)) {
    selectedCourse.value = null
    return
  }
  showCoursePopover(event, block)
}

function formatHorarioPopover(block) {
  const horas = block.rowSpan === 1 ? '1 hora' : `${block.rowSpan} horas`
  const horarioTexto = block.horario.replace(' ', ' · ')
  return `${horarioTexto} (${horas})`
}

function closePopoverOnOutside(event) {
  if (!selectedCourse.value) return
  if (popoverRef.value && popoverRef.value.contains(event.target)) return
  selectedCourse.value = null
}

function closePopoverOnScroll() {
  if (selectedCourse.value) {
    selectedCourse.value = null
  }
}

function exportarPdf() {
  pdfFeedback.value = `Preparando vista de impresión / PDF para el horario ${selectedPeriodo.value}...`
  setTimeout(() => {
    window.print()
    pdfFeedback.value = ''
  }, 250)
}

onMounted(() => {
  document.addEventListener('click', closePopoverOnOutside)
  window.addEventListener('scroll', closePopoverOnScroll, true)
  window.addEventListener('profile-photo-updated', syncUserPhoto)
  window.addEventListener('storage', syncUserPhoto)
})

onUnmounted(() => {
  document.removeEventListener('click', closePopoverOnOutside)
  window.removeEventListener('scroll', closePopoverOnScroll, true)
  window.removeEventListener('profile-photo-updated', syncUserPhoto)
  window.removeEventListener('storage', syncUserPhoto)
})
</script>

<style scoped>
.page-stack {
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
}

/* 1. Tarjeta Superior de Bienvenida */
.welcome-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-left: 4px solid #f59e0b;
  border-radius: 4px;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.welcome-top-row {
  display: flex;
  align-items: stretch;
}

.welcome-photo-box {
  width: 82px;
  min-height: 100%;
  border-right: 1px solid var(--border-color);
  background-color: #185686;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.welcome-photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.welcome-photo-initials {
  color: #ffffff;
  font-size: 1.35rem;
  font-weight: 700;
}

.welcome-body {
  flex: 1;
  min-width: 0;
  padding: 18px 20px 14px;
}

.welcome-greeting {
  margin: 0;
  font-size: 1.55rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
}

.welcome-subtitle {
  margin: 6px 0 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.welcome-subtitle strong {
  color: var(--text-primary);
}

.welcome-alert {
  background-color: #fdf3e1;
  border-top: 1px solid #f3dfb8;
  padding: 10px 20px;
  font-size: 0.87rem;
  color: #7c4a03;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

:root.dark .welcome-alert {
  background-color: rgba(245, 158, 11, 0.14);
  border-top-color: rgba(245, 158, 11, 0.28);
  color: #fde68a;
}

.alert-link {
  font-weight: 700;
  text-decoration: underline;
  color: inherit;
}

/* 2. Barra de Controles del Horario */
.schedule-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.controls-label {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.controls-right {
  display: flex;
  align-items: center;
  gap: 10px;
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
  background-color: var(--bg-surface);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 9px 30px 8px 12px;
  font-size: 0.88rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  background-image: linear-gradient(45deg, transparent 50%, var(--text-secondary) 50%),
    linear-gradient(135deg, var(--text-secondary) 50%, transparent 50%);
  background-position: calc(100% - 14px) 15px, calc(100% - 9px) 15px;
  background-size: 5px 5px, 5px 5px;
  background-repeat: no-repeat;
}

.pdf-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
  background-color: var(--bg-surface);
  color: var(--text-primary);
  font-size: 0.84rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
}

.pdf-btn:hover {
  background-color: var(--bg-surface-muted);
}

.pdf-toast {
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  background: rgba(24, 86, 134, 0.12);
  color: var(--text-brand);
  font-size: 0.85rem;
  font-weight: 600;
}

/* 3. Grilla Semanal de Horario (Tabla Matriz) */
.matrix-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.matrix-scroll {
  width: 100%;
  overflow-x: auto;
}

.schedule-matrix {
  width: 100%;
  min-width: 780px;
  border-collapse: collapse;
  table-layout: fixed;
}

.schedule-matrix thead th {
  background-color: #185686;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.78rem;
  padding: 10px 10px;
  text-align: center;
  border-right: 1px solid rgba(255, 255, 255, 0.18);
  width: calc((100% - 130px) / 6);
}

.schedule-matrix thead th.col-hour {
  width: 130px;
  min-width: 130px;
  text-align: left;
  padding: 10px 12px;
  white-space: nowrap;
}

.schedule-matrix thead th.col-today {
  background-color: #6b8e23;
}

.schedule-matrix tbody td {
  border-top: 1px solid var(--border-color);
  border-right: 1px solid var(--border-color);
  vertical-align: top;
  height: 54px;
  padding: 10px 10px;
  line-height: 1.35;
}

.schedule-matrix tbody td:last-child {
  border-right: none;
}

.hour-cell {
  width: 130px;
  min-width: 130px;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-secondary);
  background-color: var(--bg-surface-muted);
  white-space: nowrap;
  padding: 10px 12px !important;
  vertical-align: top !important;
}

.empty-cell {
  background-color: var(--bg-surface);
}

.course-cell {
  box-sizing: border-box;
  background-color: var(--bg-surface);
  color: var(--text-primary);
  text-align: left !important;
  vertical-align: top !important;
  padding: 10px 10px !important;
  cursor: pointer;
  transition: filter 0.15s ease;
  box-shadow: inset 0 0 0 1px rgba(24, 86, 134, 0.14);
}

.course-cell:hover {
  filter: brightness(0.96);
}

.course-cell-active {
  box-shadow: inset 0 0 0 2px #f59e0b !important;
}

.course-title {
  font-size: 0.8rem;
  font-weight: 700;
  line-height: 1.3;
  text-transform: uppercase;
}

.course-meta {
  font-size: 0.72rem;
  line-height: 1.35;
  margin-top: 6px;
  opacity: 0.88;
}

.matrix-footnote {
  margin: -8px 0 0;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* Popover flotante de asignatura */
.course-popover {
  position: fixed;
  transform: translate(-50%, -100%);
  width: 310px;
  max-width: calc(100vw - 24px);
  background-color: #0e3a5d;
  color: #ffffff;
  border-radius: 8px;
  padding: 12px 14px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
  z-index: 70;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.course-popover::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 100%;
  transform: translateX(-50%);
  border-width: 7px 7px 0 7px;
  border-style: solid;
  border-color: #0e3a5d transparent transparent transparent;
}

.popover-title {
  font-size: 0.84rem;
  font-weight: 700;
  text-transform: uppercase;
  line-height: 1.3;
  margin-bottom: 2px;
}

.popover-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.92);
}

.popover-icon {
  flex-shrink: 0;
  opacity: 0.85;
}
</style>
