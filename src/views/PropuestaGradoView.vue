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
          <div class="proposal-top">
            <h3 class="proposal-title">{{ prop.titulo }}</h3>
            <span class="badge badge-info">{{ prop.estado }}</span>
          </div>
          <div class="proposal-meta">
            <span><strong>Modalidad:</strong> {{ prop.modalidad }}</span>
            <span><strong>Director:</strong> {{ prop.director }}</span>
          </div>
          <div v-if="prop.observacion" class="proposal-obs">
            <strong>Observación de etapa:</strong> {{ prop.observacion }}
          </div>
        </article>
      </div>

      <div v-else class="card empty-proposals">
        No tienes propuestas inscritas en esta convocatoria.
      </div>
    </section>

    <!-- Modal para registrar nueva propuesta simulada -->
    <div v-if="modalAbierto" class="modal-overlay" @click.self="modalAbierto = false">
      <div class="modal-card">
        <div class="modal-header">
          <h3>Nueva propuesta de grado</h3>
          <button type="button" class="close-btn" aria-label="Cerrar" @click="modalAbierto = false">
            <X :size="18" />
          </button>
        </div>

        <form class="prop-form" @submit.prevent="guardarPropuesta">
          <div class="form-field">
            <label for="prop-titulo">Título de la propuesta</label>
            <input
              id="prop-titulo"
              v-model.trim="form.titulo"
              type="text"
              required
              placeholder="Ej. Plataforma de seguimiento académico..."
            />
          </div>

          <div class="form-field">
            <label for="prop-modalidad">Modalidad</label>
            <select id="prop-modalidad" v-model="form.modalidad">
              <option value="Proyecto Aplicado">Proyecto Aplicado</option>
              <option value="Trabajo de Investigación">Trabajo de Investigación</option>
              <option value="Pasantía Institucional">Pasantía Institucional</option>
            </select>
          </div>

          <div class="form-field">
            <label for="prop-director">Director sugerido</label>
            <input
              id="prop-director"
              v-model.trim="form.director"
              type="text"
              required
              placeholder="Ej. ING. HENRY ROSERO"
            />
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-outline" @click="modalAbierto = false">Cancelar</button>
            <button type="submit" class="btn-primary">Registrar propuesta</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { X } from 'lucide-vue-next'
import { propuestasGradoMock } from '@/data/mockData'

const STORAGE_KEY = 'sigedin_propuestas_grado'

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
  director: ''
})

function loadPropuestas() {
  const base = propuestasGradoMock.misPropuestas.map((p) => ({
    ...p,
    convocatoriaId: 2,
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

function guardarPropuesta() {
  if (!form.titulo || !form.director) return

  const nueva = {
    id: Date.now(),
    convocatoriaId: selectedConvId.value,
    titulo: form.titulo,
    modalidad: form.modalidad,
    director: form.director.toUpperCase(),
    estado: 'Radicada (simulación)',
    observacion: 'Registrada en borrador estudiantil pendiente de revisión de comité.'
  }

  propuestas.value = [nueva, ...propuestas.value]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(propuestas.value))

  form.titulo = ''
  form.director = ''
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
  margin-top: 28px;
  margin-bottom: 14px;
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
  gap: 12px;
}

.proposal-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  flex-wrap: wrap;
}

.proposal-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.proposal-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  margin-top: 8px;
  font-size: 0.86rem;
  color: var(--text-secondary);
}

.proposal-obs {
  margin-top: 10px;
  padding: 9px 12px;
  border-radius: var(--radius-sm);
  background: var(--bg-surface-muted);
  border-left: 3px solid #185686;
  font-size: 0.84rem;
}

.empty-proposals {
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.92rem;
  padding: 28px 20px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.52);
  display: grid;
  place-items: center;
  padding: 16px;
  z-index: 65;
}

.modal-card {
  width: 100%;
  max-width: 460px;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow-md);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.05rem;
}

.close-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: var(--bg-surface-muted);
  color: var(--text-primary);
  display: grid;
  place-items: center;
  cursor: pointer;
}

.prop-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-field label {
  font-size: 0.84rem;
  font-weight: 600;
}

.form-field input,
.form-field select {
  padding: 9px 11px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
  background: var(--bg-surface-muted);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 0.9rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 6px;
}
</style>
