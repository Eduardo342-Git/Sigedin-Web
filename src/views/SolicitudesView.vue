<template>
  <div class="page-stack">
    <!-- Fila superior -->
    <div class="top-action-row">
      <p class="intro-copy">
        Todo lo que puedes pedir y el estado de lo que ya pediste, en un solo lugar.
      </p>
      <button type="button" class="new-req-btn" @click="modalAbierto = true">
        + Nueva solicitud
      </button>
    </div>

    <!-- Estado vacío inicial -->
    <section v-if="!solicitudes.length" class="empty-dashed-box">
      <FileText :size="40" class="empty-doc-icon" />
      <h2 class="empty-title">Aún no has radicado solicitudes</h2>
      <p class="empty-sub">Usa «Nueva solicitud» para hacer la primera.</p>
    </section>

    <!-- Tabla de solicitudes radicadas -->
    <section v-else class="card">
      <div class="list-header">
        <h2 class="card-title" style="margin: 0;">Solicitudes radicadas</h2>
        <button type="button" class="btn-outline clear-btn" @click="limpiarSolicitudes">
          Limpiar historial
        </button>
      </div>

      <div class="table-wrap" style="margin-top: 12px;">
        <table class="data-table">
          <thead>
            <tr>
              <th>Radicado</th>
              <th>Tipo de trámite</th>
              <th>Detalle / Justificación</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr v-for="sol in solicitudes" :key="sol.id">
              <td><strong>#{{ sol.radicado }}</strong></td>
              <td><strong>{{ sol.tipoLabel }}</strong></td>
              <td>{{ sol.detalle }}</td>
              <td>{{ sol.fecha }}</td>
              <td><span class="badge badge-info">{{ sol.estado }}</span></td>
              <td style="text-align: right;">
                <button
                  type="button"
                  class="remove-row-btn"
                  aria-label="Eliminar solicitud"
                  @click="eliminarSolicitud(sol.id)"
                >
                  <Trash2 :size="15" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Modal + Nueva solicitud -->
    <div v-if="modalAbierto" class="modal-overlay" @click.self="modalAbierto = false">
      <div class="modal-card">
        <div class="modal-header">
          <h3>Nueva solicitud académica</h3>
          <button type="button" class="close-btn" aria-label="Cerrar" @click="modalAbierto = false">
            <X :size="18" />
          </button>
        </div>

        <form class="req-form" @submit.prevent="radicarSolicitud">
          <div class="field-group">
            <label for="req-tipo">Tipo de trámite</label>
            <select id="req-tipo" v-model="form.tipo" class="contrast-input" required>
              <option
                v-for="item in solicitudesCatalogoMock"
                :key="item.clave"
                :value="item.clave"
              >
                {{ item.etiqueta }}
              </option>
            </select>
            <span v-if="tipoSeleccionado" class="field-hint">{{ tipoSeleccionado.descripcion }}</span>
          </div>

          <div v-if="form.tipo === 'actualizacion'" class="field-group">
            <label for="req-campo">Dato a corregir o actualizar</label>
            <input
              id="req-campo"
              v-model.trim="form.datoActualizar"
              type="text"
              class="contrast-input"
              placeholder="Ej. Correo personal, teléfono o dirección"
              required
            />
          </div>

          <div class="field-group">
            <label for="req-detalle">Justificación / Observaciones</label>
            <textarea
              id="req-detalle"
              v-model.trim="form.detalle"
              rows="4"
              class="contrast-input"
              placeholder="Describe brevemente el motivo de tu solicitud..."
              required
            />
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-outline" @click="modalAbierto = false">Cancelar</button>
            <button type="submit" class="new-req-btn">Radicar solicitud</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { FileText, Trash2, X } from 'lucide-vue-next'
import { solicitudesCatalogoMock } from '@/data/mockData'

const STORAGE_KEY = 'sigedin_solicitudes_radicadas'

function loadSolicitudes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const solicitudes = ref(loadSolicitudes())
const modalAbierto = ref(false)

const form = reactive({
  tipo: 'creditos',
  datoActualizar: '',
  detalle: ''
})

const tipoSeleccionado = computed(() =>
  solicitudesCatalogoMock.find((s) => s.clave === form.tipo)
)

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(solicitudes.value))
}

function radicarSolicitud() {
  if (!form.detalle) return

  const detalleFinal =
    form.tipo === 'actualizacion' && form.datoActualizar
      ? `${form.datoActualizar}: ${form.detalle}`
      : form.detalle

  const nueva = {
    id: Date.now(),
    radicado: String(Math.floor(10000 + Math.random() * 90000)),
    tipo: form.tipo,
    tipoLabel: tipoSeleccionado.value?.etiqueta || form.tipo,
    detalle: detalleFinal,
    fecha: new Date().toISOString().slice(0, 10),
    estado: 'Radicada'
  }

  solicitudes.value = [nueva, ...solicitudes.value]
  persist()

  form.datoActualizar = ''
  form.detalle = ''
  modalAbierto.value = false
}

function eliminarSolicitud(id) {
  solicitudes.value = solicitudes.value.filter((s) => s.id !== id)
  persist()
}

function limpiarSolicitudes() {
  solicitudes.value = []
  persist()
}
</script>

<style scoped>
.top-action-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.intro-copy {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.new-req-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 7px 14px;
  border: none;
  border-radius: 6px;
  background-color: #185686;
  color: #ffffff;
  font-size: 0.86rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
}

.new-req-btn:hover {
  background-color: #0f4766;
}

.empty-dashed-box {
  border: 1px dashed var(--border-color);
  border-radius: 10px;
  padding: 48px 24px;
  text-align: center;
  background-color: var(--bg-surface);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-doc-icon {
  color: var(--text-secondary);
  opacity: 0.7;
  margin-bottom: 12px;
}

.empty-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-primary);
}

.empty-sub {
  margin: 6px 0 0;
  font-size: 0.88rem;
  color: var(--text-secondary);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.clear-btn {
  padding: 6px 12px;
  font-size: 0.8rem;
}

.remove-row-btn {
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 4px;
}

.remove-row-btn:hover {
  color: var(--color-danger);
}

/* Modal y campos de alto contraste (Error #5) */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.54);
  display: grid;
  place-items: center;
  padding: 16px;
  z-index: 65;
}

.modal-card {
  width: 100%;
  max-width: 480px;
  background-color: var(--bg-surface);
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
  color: var(--text-primary);
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

.req-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-group label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-primary);
}

.contrast-input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1.5px solid #94a3b8;
  background-color: #f8fafc;
  color: #0f172a;
  font-family: inherit;
  font-size: 0.9rem;
}

.contrast-input:focus {
  outline: none;
  border-color: #185686;
  box-shadow: 0 0 0 3px rgba(24, 86, 134, 0.16);
}

:root.dark .contrast-input {
  background-color: #0f172a;
  border-color: #475569;
  color: #f8fafc;
}

:root.dark .contrast-input:focus {
  border-color: #38bdf8;
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2);
}

.field-hint {
  font-size: 0.78rem;
  color: var(--text-secondary);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 4px;
}
</style>
