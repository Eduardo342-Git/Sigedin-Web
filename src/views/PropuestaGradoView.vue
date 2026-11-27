<template>
  <div class="page-stack">
    <p class="intro-copy">
      Consulta el estado de tus propuestas de grado (modalidad de grado), con las observaciones de cada etapa.
    </p>

    <!-- Selector desplegable Convocatoria de grado -->
    <div class="conv-field">
      <label for="convocatoria-select" class="conv-label">Convocatoria de grado</label>
      <select id="convocatoria-select" v-model="selectedConvId" class="conv-select">
        <option v-for="conv in convocatorias" :key="conv.id" :value="conv.id">
          {{ conv.label }}
        </option>
      </select>
    </div>

    <!-- Sección MIS PROPUESTAS -->
    <section class="section-block">
      <div class="section-header-row">
        <h2 class="section-heading">MIS PROPUESTAS</h2>
        <button
          type="button"
          class="new-prop-btn"
          :disabled="!convocatoriaActiva?.activa"
          @click="modalAbierto = true"
        >
          + Nueva propuesta
        </button>
      </div>

      <div v-if="propuestasFiltradas.length" class="proposals-list">
        <article v-for="prop in propuestasFiltradas" :key="prop.id" class="card proposal-card">
          <!-- Cabecera -->
          <div class="proposal-top">
            <div class="proposal-title-col">
              <div class="radicado-line">{{ prop.radicado }} · Radicada el {{ prop.fechaRadicacion }}</div>
              <h3 class="proposal-title">{{ prop.titulo }}</h3>
            </div>
            <span class="badge" :class="prop.etapaActual >= 2 ? 'badge-info' : 'badge-success'">
              {{ prop.estado }}
            </span>
          </div>

          <!-- Metadatos -->
          <div class="proposal-meta">
            <span><strong>Modalidad:</strong> {{ prop.modalidad }}</span>
            <span><strong>Director:</strong> {{ prop.director }}</span>
            <span><strong>Línea:</strong> {{ prop.linea }}</span>
            <span v-if="prop.coautor"><strong>Coautor:</strong> {{ prop.coautor }}</span>
          </div>

          <!-- Stepper Visual de 4 Etapas -->
          <div class="stepper" role="list" aria-label="Etapas de propuesta de grado">
            <div
              v-for="(etapa, idx) in etapas"
              :key="etapa"
              role="listitem"
              class="step-item"
              :class="getStepClass(prop.etapaActual, idx + 1)"
            >
              <div class="step-track-row">
                <span class="step-circle">
                  <Check v-if="idx + 1 < prop.etapaActual" :size="12" />
                  <span v-else>{{ idx + 1 }}</span>
                </span>
                <span v-if="idx < etapas.length - 1" class="step-connector" />
              </div>
              <span class="step-label">{{ etapa }}</span>
            </div>
          </div>

          <!-- Caja de Observación Actual -->
          <div v-if="prop.observacion" class="proposal-obs">
            <strong>Observación de etapa:</strong> {{ prop.observacion }}
          </div>
        </article>
      </div>

      <div v-else class="card empty-proposals">
        No tienes propuestas inscritas en esta convocatoria.
      </div>
    </section>

    <!-- Modal para + Nueva propuesta -->
    <div v-if="modalAbierto" class="modal-overlay" @click.self="modalAbierto = false">
      <div class="modal-card">
        <div class="modal-header">
          <div>
            <h3>Nueva propuesta de grado</h3>
            <p class="modal-subtitle">
              Completa los datos básicos para radicar tu propuesta en la convocatoria vigente.
            </p>
          </div>
          <button type="button" class="modal-close-btn" aria-label="Cerrar" @click="modalAbierto = false">
            <X :size="18" />
          </button>
        </div>

        <form @submit.prevent="guardarPropuesta">
          <div class="modal-body">
            <div>
              <label for="prop-titulo" class="form-label">Título de la propuesta *</label>
              <input
                id="prop-titulo"
                v-model.trim="form.titulo"
                type="text"
                class="form-control"
                required
                placeholder="Ej. Plataforma de seguimiento académico..."
              />
            </div>

            <div class="form-row-2">
              <div>
                <label for="prop-modalidad" class="form-label">Modalidad de grado *</label>
                <select id="prop-modalidad" v-model="form.modalidad" class="form-control">
                  <option value="Proyecto Aplicado">Proyecto Aplicado</option>
                  <option value="Diplomado de Profundización">Diplomado de Profundización</option>
                  <option value="Práctica Empresarial">Práctica Empresarial</option>
                  <option value="Monografía">Monografía</option>
                </select>
              </div>

              <div>
                <label for="prop-director" class="form-label">Director propuesto</label>
                <input
                  id="prop-director"
                  v-model.trim="form.director"
                  type="text"
                  class="form-control"
                  required
                  placeholder="Ej. ING. HENRY ROSERO"
                />
              </div>
            </div>

            <div>
              <label for="prop-coautor" class="form-label">
                <span>Integrante adicional / Coautor</span>
                <span class="label-hint">Opcional</span>
              </label>
              <input
                id="prop-coautor"
                v-model.trim="form.coautor"
                type="text"
                class="form-control"
                placeholder="Nombre completo del compañero (si aplica)"
              />
            </div>

            <div>
              <label for="prop-resumen" class="form-label">
                <span>Resumen / Objetivo general *</span>
                <span class="label-hint">{{ form.resumen.length }} / 400</span>
              </label>
              <textarea
                id="prop-resumen"
                v-model.trim="form.resumen"
                rows="3"
                maxlength="400"
                class="form-control"
                placeholder="Describe brevemente el objetivo principal de la propuesta..."
                required
              />
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-outline" @click="modalAbierto = false">Cancelar</button>
            <button type="submit" class="btn-primary">Radicar propuesta</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { Check, X } from 'lucide-vue-next'
import { propuestasGradoMock } from '@/data/mockData'

const STORAGE_KEY = 'sigedin_propuestas_grado_v2'

const etapas = [
  'Radicada',
  'Revisión de comité',
  'Evaluación de jurados',
  'Aprobación final'
]

const convocatorias = [
  {
    id: 2,
    label: 'CONVOCATORIA 2 · 16 de jun de 2026 al 26 de jun de 2026 · activa',
    activa: true
  },
  {
    id: 1,
    label: 'CONVOCATORIA 1 · 01 de may de 2026 al 19 de may de 2026',
    activa: false
  }
]

const selectedConvId = ref(2)
const modalAbierto = ref(false)

const form = reactive({
  titulo: '',
  modalidad: 'Proyecto Aplicado',
  director: '',
  coautor: '',
  resumen: ''
})

function loadPropuestas() {
  const base = propuestasGradoMock.misPropuestas.map((p) => ({
    ...p,
    convocatoriaId: 2,
    radicado: 'RAD-2026-084',
    fechaRadicacion: '20 jun 2026',
    linea: 'Ingeniería de Software',
    etapaActual: 2,
    observacion: 'Propuesta radicada ante el comité curricular para asignación de evaluadores.'
  }))

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const saved = JSON.parse(raw)
      if (Array.isArray(saved) && saved.length) {
        return saved
      }
    }
  } catch {
    // Usar lista base si falla lectura
  }
  return base
}

const propuestas = ref(loadPropuestas())

const convocatoriaActiva = computed(() =>
  convocatorias.find((c) => c.id === selectedConvId.value)
)

const propuestasFiltradas = computed(() =>
  propuestas.value.filter((p) => p.convocatoriaId === selectedConvId.value)
)

function getStepClass(etapaActual, stepIndex) {
  if (stepIndex < etapaActual) return 'step-done'
  if (stepIndex === etapaActual) return 'step-active'
  return 'step-pending'
}

function guardarPropuesta() {
  if (!form.titulo || !form.director || !form.resumen) return

  const randomNum = String(Math.floor(100 + Math.random() * 899))
  const nueva = {
    id: Date.now(),
    convocatoriaId: selectedConvId.value,
    radicado: `RAD-2026-${randomNum}`,
    fechaRadicacion: 'hoy',
    titulo: form.titulo,
    modalidad: form.modalidad,
    director: form.director.toUpperCase(),
    linea: 'Desarrollo de Software',
    coautor: form.coautor ? form.coautor.toUpperCase() : '',
    estado: 'Radicada',
    etapaActual: 1,
    observacion: `Objetivo general: ${form.resumen}`
  }

  propuestas.value = [nueva, ...propuestas.value]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(propuestas.value))

  form.titulo = ''
  form.director = ''
  form.coautor = ''
  form.resumen = ''
  modalAbierto.value = false
}
</script>

<style scoped>
.intro-copy {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.conv-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.conv-label {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text-primary);
}

.conv-select {
  width: 100%;
  appearance: none;
  background-color: var(--bg-surface);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 10px 36px 10px 12px;
  font-size: 0.9rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  background-image: linear-gradient(45deg, transparent 50%, var(--text-secondary) 50%),
    linear-gradient(135deg, var(--text-secondary) 50%, transparent 50%);
  background-position: calc(100% - 16px) 17px, calc(100% - 11px) 17px;
  background-size: 5px 5px, 5px 5px;
  background-repeat: no-repeat;
}

.section-block {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.section-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
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

.new-prop-btn {
  padding: 6px 14px;
  border-radius: 6px;
  border: 1px solid #185686;
  background-color: var(--bg-surface);
  color: #185686;
  font-size: 0.82rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
}

:root.dark .new-prop-btn {
  border-color: var(--text-brand);
  color: var(--text-brand);
}

.new-prop-btn:hover:not(:disabled) {
  background-color: var(--bg-surface-muted);
}

.new-prop-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.proposals-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.proposal-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.proposal-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  flex-wrap: wrap;
}

.proposal-title-col {
  flex: 1;
  min-width: 240px;
}

.radicado-line {
  font-size: 0.76rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.proposal-title {
  margin: 0;
  font-size: 1.02rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.35;
}

.proposal-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

/* Stepper Visual de 4 Etapas */
.stepper {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  padding: 12px 14px;
  border-radius: 8px;
  background-color: var(--bg-surface-muted);
  border: 1px solid var(--border-color);
}

.step-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.step-track-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.step-circle {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  font-size: 0.72rem;
  font-weight: 700;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.step-connector {
  flex: 1;
  height: 2px;
  background-color: var(--border-color);
}

.step-label {
  font-size: 0.76rem;
  font-weight: 600;
  line-height: 1.2;
}

.step-done .step-circle {
  background-color: #65a30d;
  color: #ffffff;
}

.step-done .step-connector {
  background-color: #65a30d;
}

.step-done .step-label {
  color: var(--text-primary);
}

.step-active .step-circle {
  background-color: #185686;
  color: #ffffff;
  box-shadow: 0 0 0 3px rgba(24, 86, 134, 0.2);
}

.step-active .step-label {
  color: #185686;
  font-weight: 700;
}

:root.dark .step-active .step-label {
  color: var(--text-brand);
}

.step-pending .step-circle {
  background-color: var(--bg-surface);
  border: 1.5px solid var(--border-color);
  color: var(--text-secondary);
}

.step-pending .step-label {
  color: var(--text-secondary);
}

.proposal-obs {
  padding: 10px 14px;
  border-radius: 6px;
  background: var(--bg-surface-muted);
  border-left: 3px solid #185686;
  font-size: 0.85rem;
  line-height: 1.45;
}

.empty-proposals {
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.92rem;
  padding: 28px 20px;
}

@media (max-width: 640px) {
  .stepper {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .step-connector {
    display: none;
  }
}
</style>
