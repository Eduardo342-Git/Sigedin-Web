<template>
  <div class="page-stack">
    <!-- Fila superior -->
    <div class="top-action-row">
      <p class="intro-copy">
        Todo lo que puedes pedir y el estado de lo que ya pediste, en un solo lugar.
      </p>
      <button type="button" class="new-req-btn" @click="abrirModal()">
        + Nueva solicitud
      </button>
    </div>

    <!-- Estado vacío inicial -->
    <section v-if="!solicitudes.length" class="empty-dashed-box">
      <FileText :size="40" class="empty-doc-icon" />
      <h2 class="empty-title">Aún no has radicado solicitudes</h2>
      <p class="empty-sub">Usa «Nueva solicitud» para hacer la primera.</p>
    </section>

    <!-- Sección MIS SOLICITUDES RADICADAS -->
    <section v-else class="section-block">
      <div class="section-header-row">
        <h2 class="section-heading">MIS SOLICITUDES RADICADAS</h2>
        <button type="button" class="clear-link-btn" @click="limpiarSolicitudes">
          Limpiar historial
        </button>
      </div>

      <div class="table-card">
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Radicado</th>
                <th>Tipo de trámite</th>
                <th>Detalle / Justificación</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th style="text-align: right;">Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sol in solicitudes" :key="sol.id">
                <td class="nowrap-cell"><strong>{{ sol.radicado }}</strong></td>
                <td><strong>{{ sol.tipoLabel }}</strong></td>
                <td>{{ sol.detalle }}</td>
                <td class="nowrap-cell">{{ sol.fecha }}</td>
                <td class="nowrap-cell">
                  <span class="badge badge-info">{{ sol.estado }}</span>
                </td>
                <td style="text-align: right;">
                  <button
                    type="button"
                    class="retire-btn"
                    @click="eliminarSolicitud(sol.id)"
                  >
                    Retirar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Sección Inferior: TRÁMITES DISPONIBLES EN LÍNEA -->
    <section class="section-block">
      <div class="section-header-row">
        <h2 class="section-heading">TRÁMITES DISPONIBLES EN LÍNEA</h2>
      </div>

      <div class="shortcuts-grid">
        <button
          v-for="item in tramitesRapidos"
          :key="item.clave"
          type="button"
          class="shortcut-card"
          @click="abrirModal(item.clave)"
        >
          <div class="shortcut-top">
            <span class="shortcut-title">{{ item.etiqueta }}</span>
            <ArrowRight :size="16" class="shortcut-arrow" />
          </div>
          <p class="shortcut-desc">{{ item.descripcion }}</p>
        </button>
      </div>
    </section>

    <!-- Modal Nueva solicitud académica -->
    <div v-if="modalAbierto" class="modal-overlay" @click.self="modalAbierto = false">
      <div class="modal-card">
        <div class="modal-header">
          <div>
            <h3>Nueva solicitud académica</h3>
            <p class="modal-subtitle">
              Completa los campos del trámite seleccionado para generar tu radicado.
            </p>
          </div>
          <button type="button" class="modal-close-btn" aria-label="Cerrar" @click="modalAbierto = false">
            <X :size="18" />
          </button>
        </div>

        <form @submit.prevent="radicarSolicitud">
          <div class="modal-body">
            <div>
              <label for="req-tipo" class="form-label">Tipo de trámite *</label>
              <select id="req-tipo" v-model="form.tipo" class="form-control" required>
                <option
                  v-for="item in solicitudesCatalogoMock"
                  :key="item.clave"
                  :value="item.clave"
                >
                  {{ item.etiqueta }}
                </option>
              </select>
            </div>

            <!-- Campos dinámicos: Actualización de datos -->
            <div v-if="form.tipo === 'actualizacion'" class="form-row-2">
              <div>
                <label for="req-campo" class="form-label">Campo a corregir *</label>
                <select id="req-campo" v-model="form.campoCorregir" class="form-control" required>
                  <option value="Nombres / Apellidos">Nombres / Apellidos</option>
                  <option value="Número de documento">Número de documento</option>
                  <option value="Correo institucional">Correo institucional</option>
                  <option value="Teléfono / Dirección">Teléfono / Dirección</option>
                </select>
              </div>
              <div>
                <label for="req-nuevo-valor" class="form-label">Nuevo valor solicitado *</label>
                <input
                  id="req-nuevo-valor"
                  v-model.trim="form.nuevoValor"
                  type="text"
                  class="form-control"
                  placeholder="Ingresa el dato correcto"
                  required
                />
              </div>
            </div>

            <!-- Campos dinámicos: Habilitación, Supletorio o Cancelar unidades -->
            <div v-if="requiereUnidad" >
              <label for="req-unidad" class="form-label">Unidad de formación *</label>
              <select id="req-unidad" v-model="form.unidad" class="form-control" required>
                <option
                  v-for="u in unidadesPeriodoActual"
                  :key="u.codigo"
                  :value="`${u.codigo} · ${u.unidad}`"
                >
                  {{ u.codigo }} · {{ u.unidad }}
                </option>
              </select>
            </div>

            <div>
              <label for="req-detalle" class="form-label">Justificación / Observaciones *</label>
              <textarea
                id="req-detalle"
                v-model.trim="form.detalle"
                rows="4"
                class="form-control"
                placeholder="Describe brevemente el motivo de tu solicitud..."
                required
              />
            </div>
          </div>

          <div class="modal-footer">
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
import { ArrowRight, FileText, X } from 'lucide-vue-next'
import { boletinesPorPeriodoMock, solicitudesCatalogoMock } from '@/data/mockData'

const STORAGE_KEY = 'sigedin_solicitudes_radicadas'

const tramitesRapidos = [
  {
    clave: 'creditos',
    etiqueta: 'Créditos adicionales',
    descripcion: 'Solicitar ampliación de cupo de créditos en el periodo.'
  },
  {
    clave: 'actualizacion',
    etiqueta: 'Actualización de datos',
    descripcion: 'Corregir nombre, documento, correo o teléfono registrado.'
  },
  {
    clave: 'habilitacion',
    etiqueta: 'Habilitación',
    descripcion: 'Inscribir prueba de habilitación de unidad perdida.'
  },
  {
    clave: 'supletorio',
    etiqueta: 'Supletorio',
    descripcion: 'Solicitar presentación extemporánea de evaluación parcial o final.'
  },
  {
    clave: 'cancelacion',
    etiqueta: 'Cancelar unidades',
    descripcion: 'Retirar asignaturas matriculadas dentro del plazo vigente.'
  },
  {
    clave: 'aplazamiento',
    etiqueta: 'Aplazamiento de semestre',
    descripcion: 'Reservar cupo académico para el siguiente periodo.'
  }
]

const unidadesPeriodoActual = computed(() => boletinesPorPeriodoMock['2026-2'].unidades)

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
  campoCorregir: 'Nombres / Apellidos',
  nuevoValor: '',
  unidad: 'EC01 · ELECTIVA COMPLEMENTARIA I',
  detalle: ''
})

const requiereUnidad = computed(() =>
  ['habilitacion', 'supletorio', 'cancelacion'].includes(form.tipo)
)

const tipoSeleccionado = computed(() =>
  solicitudesCatalogoMock.find((s) => s.clave === form.tipo)
)

function abrirModal(clave = 'creditos') {
  form.tipo = clave
  modalAbierto.value = true
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(solicitudes.value))
}

function radicarSolicitud() {
  if (!form.detalle) return

  let detalleFinal = form.detalle
  if (form.tipo === 'actualizacion' && form.nuevoValor) {
    detalleFinal = `${form.campoCorregir} → ${form.nuevoValor}. ${form.detalle}`
  } else if (requiereUnidad.value && form.unidad) {
    detalleFinal = `[${form.unidad}] ${form.detalle}`
  }

  const numRad = String(Math.floor(100 + Math.random() * 899))
  const nueva = {
    id: Date.now(),
    radicado: `SOL-2026-${numRad}`,
    tipo: form.tipo,
    tipoLabel: tipoSeleccionado.value?.etiqueta || form.tipo,
    detalle: detalleFinal,
    fecha: new Date().toISOString().slice(0, 10),
    estado: 'En revisión'
  }

  solicitudes.value = [nueva, ...solicitudes.value]
  persist()

  form.nuevoValor = ''
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
  padding: 44px 24px;
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
  margin-top: 8px;
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

.clear-link-btn,
.retire-btn {
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}

.clear-link-btn:hover,
.retire-btn:hover {
  color: var(--color-danger);
}

.table-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.nowrap-cell {
  white-space: nowrap;
}

/* Grid de 3 columnas: Trámites disponibles */
.shortcuts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.shortcut-card {
  text-align: left;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 16px 18px;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: border-color 0.15s ease, transform 0.15s ease;
}

.shortcut-card:hover {
  border-color: #185686;
  transform: translateY(-1px);
}

:root.dark .shortcut-card:hover {
  border-color: #38bdf8;
}

.shortcut-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.shortcut-title {
  font-size: 0.94rem;
  font-weight: 700;
  color: #185686;
}

:root.dark .shortcut-title {
  color: var(--text-brand);
}

.shortcut-arrow {
  color: var(--text-secondary);
  flex-shrink: 0;
}

.shortcut-desc {
  margin: 0;
  font-size: 0.82rem;
  color: var(--text-secondary);
  line-height: 1.4;
}
</style>
