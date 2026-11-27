<template>
  <div class="hv-container">
    <!-- 1. Tarjeta 1 — Cabecera de Identidad -->
    <section class="card hv-identity-card">
      <div class="hv-avatar">{{ estudianteMock.iniciales }}</div>
      <div>
        <h2 class="hv-name">{{ estudianteMock.nombreCompleto }}</h2>
        <p class="hv-updated">Datos actualizados el 19 de ago de 2026</p>
      </div>
    </section>

    <!-- 2. Tarjeta 2 — Foto del carnet -->
    <section class="card hv-photo-card">
      <div class="photo-preview-box">
        <img v-if="fotoCarnet" :src="fotoCarnet" alt="Foto del carnet" class="photo-img" />
        <span v-else>{{ estudianteMock.iniciales }}</span>
      </div>
      <div class="photo-info">
        <h3 class="photo-title">Foto del carnet</h3>
        <p class="photo-desc">
          Una foto de frente, con fondo claro y sin gafas oscuras. JPG, PNG o WebP de hasta 5 MB.
          La ajustamos automáticamente al tamaño del carnet.
        </p>
        <div class="photo-actions">
          <input
            ref="fileInputRef"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            @change="handleFotoChange"
          />
          <button type="button" class="outline-blue-btn" @click="fileInputRef?.click()">
            Subir foto
          </button>
          <button v-if="fotoCarnet" type="button" class="text-link-btn" @click="quitarFoto">
            Quitar foto
          </button>
        </div>
      </div>
    </section>

    <!-- 3. Tarjeta 3 — Cuenta de Google -->
    <section class="card hv-google-card">
      <div class="google-left">
        <div class="google-title-row">
          <span class="google-g-badge" aria-hidden="true">G</span>
          <h3>Cuenta de Google</h3>
        </div>
        <p class="google-desc" v-if="googleVinculada">
          Vinculada con <strong>{{ estudianteMock.correoInstitucional }}</strong> · desde el 1 nov.<br />
          En la pantalla de inicio puedes usar «Continuar con Google».
        </p>
        <p class="google-desc" v-else>
          Cuenta desvinculada en esta sesión de demostración.
        </p>
      </div>
      <button type="button" class="text-link-btn" @click="toggleGoogle">
        {{ googleVinculada ? 'Desvincular' : 'Volver a vincular' }}
      </button>
    </section>

    <!-- 4. Sección RESUMEN DE MIS DATOS -->
    <section class="hv-section">
      <h2 class="section-heading">RESUMEN DE MIS DATOS</h2>

      <!-- Sub-tarjeta Información básica -->
      <div class="card sub-card">
        <h3 class="sub-card-title">Información básica</h3>
        <div class="data-rows">
          <div class="data-row">
            <IdCard :size="17" class="row-icon" />
            <div class="row-content">
              <span class="row-label">Identificación</span>
              <span class="row-value">{{ estudianteMock.identificacion }}</span>
            </div>
            <Lock :size="16" class="lock-icon" title="Solo editable en Admisiones y Registro" />
          </div>

          <div class="data-row">
            <Calendar :size="17" class="row-icon" />
            <div class="row-content">
              <span class="row-label">Fecha de nacimiento</span>
              <span class="row-value">11 de jun de 2006</span>
            </div>
            <Lock :size="16" class="lock-icon" title="Solo editable en Admisiones y Registro" />
          </div>

          <div class="data-row">
            <User :size="17" class="row-icon" />
            <div class="row-content">
              <span class="row-label">Género</span>
              <span class="row-value">Masculino</span>
            </div>
            <Lock :size="16" class="lock-icon" title="Solo editable en Admisiones y Registro" />
          </div>
        </div>
      </div>

      <!-- Sub-tarjeta Contacto -->
      <div class="card sub-card">
        <h3 class="sub-card-title">Contacto</h3>
        <div class="data-rows">
          <div class="data-row">
            <Mail :size="17" class="row-icon" />
            <div class="row-content">
              <span class="row-label">Correo institucional</span>
              <span class="row-value-inline">
                <span>{{ estudianteMock.correoInstitucional }}</span>
                <CheckCircle2 :size="15" class="verified-icon" />
              </span>
            </div>
            <Lock :size="16" class="lock-icon" title="Solo editable en Admisiones y Registro" />
          </div>

          <div
            v-for="field in contactoEditableFields"
            :key="field.key"
            class="data-row"
          >
            <component :is="field.icon" :size="17" class="row-icon" />
            <div class="row-content">
              <span class="row-label">{{ field.label }}</span>
              <div v-if="editingKey === field.key" class="inline-edit-wrap">
                <input
                  v-model.trim="editDraft"
                  :type="field.type"
                  class="contrast-input"
                  @keyup.enter="saveInlineEdit(field.key)"
                />
                <button type="button" class="save-mini-btn" @click="saveInlineEdit(field.key)">
                  Guardar
                </button>
                <button type="button" class="cancel-mini-btn" @click="cancelInlineEdit">
                  Cancelar
                </button>
              </div>
              <span v-else class="row-value-inline">
                <span>{{ editableData[field.key] }}</span>
                <CheckCircle2 v-if="field.verified" :size="15" class="verified-icon" />
              </span>
            </div>
            <button
              v-if="editingKey !== field.key"
              type="button"
              class="pencil-btn"
              :aria-label="`Editar ${field.label}`"
              @click="startInlineEdit(field.key)"
            >
              <Pencil :size="16" />
            </button>
          </div>
        </div>
      </div>

      <!-- Sub-tarjeta Dónde vives -->
      <div class="card sub-card">
        <h3 class="sub-card-title">Dónde vives</h3>
        <div class="data-rows">
          <div
            v-for="field in viviendaEditableFields"
            :key="field.key"
            class="data-row"
          >
            <MapPin :size="17" class="row-icon" />
            <div class="row-content">
              <span class="row-label">{{ field.label }}</span>
              <div v-if="editingKey === field.key" class="inline-edit-wrap">
                <input
                  v-model.trim="editDraft"
                  type="text"
                  class="contrast-input"
                  @keyup.enter="saveInlineEdit(field.key)"
                />
                <button type="button" class="save-mini-btn" @click="saveInlineEdit(field.key)">
                  Guardar
                </button>
                <button type="button" class="cancel-mini-btn" @click="cancelInlineEdit">
                  Cancelar
                </button>
              </div>
              <span v-else class="row-value">{{ editableData[field.key] }}</span>
            </div>
            <button
              v-if="editingKey !== field.key"
              type="button"
              class="pencil-btn"
              :aria-label="`Editar ${field.label}`"
              @click="startInlineEdit(field.key)"
            >
              <Pencil :size="16" />
            </button>
          </div>
        </div>
      </div>

      <p class="hv-footnote">
        Pulsa un dato con lápiz para cambiarlo. Los que tienen candado solo se corrigen en Admisiones y Registro.
      </p>
    </section>

    <!-- 5. Banner Destacado -->
    <section class="more-data-banner">
      <div class="banner-left">
        <FolderOpen :size="26" class="banner-icon" />
        <div>
          <h3 class="banner-title">Consulta y completa más de tus datos</h3>
          <p class="banner-sub">
            Tipo de sangre, EPS, lugar de nacimiento y residencia, acudiente y más.
            Revísalos para que tu información esté al día.
          </p>
        </div>
      </div>
      <button type="button" class="banner-white-btn" @click="moreModalOpen = true">
        Ver más datos →
      </button>
    </section>

    <!-- 6. Sección Mis programas -->
    <section class="programs-block">
      <div class="programs-label">Mis programas</div>
      <div class="card program-card">
        <div class="program-top">
          <div>
            <h3 class="program-name">{{ estudianteMock.programaActual.programa }}</h3>
            <p class="program-sub">
              {{ estudianteMock.programaActual.ciclo }} · {{ estudianteMock.programaActual.sede }} · {{ estudianteMock.programaActual.jornada }}
            </p>
          </div>
          <span class="olive-badge">{{ estudianteMock.programaActual.estado }}</span>
        </div>

        <div class="program-divider" />

        <div class="program-grid">
          <div>
            <div class="pg-label">Código</div>
            <div class="pg-value">{{ estudianteMock.programaActual.codigoEstudiante }}</div>
          </div>
          <div>
            <div class="pg-label">Plan</div>
            <div class="pg-value">{{ estudianteMock.programaActual.plan }}</div>
          </div>
          <div>
            <div class="pg-label">Inicio</div>
            <div class="pg-value">12 de julio de 2024</div>
          </div>
          <div>
            <div class="pg-label">SNIES</div>
            <div class="pg-value">{{ estudianteMock.programaActual.snies }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal Ver más datos -->
    <div v-if="moreModalOpen" class="modal-overlay" @click.self="moreModalOpen = false">
      <div class="modal-card">
        <div class="modal-header">
          <h3>Datos complementarios</h3>
          <button type="button" class="close-btn" aria-label="Cerrar" @click="moreModalOpen = false">
            <X :size="18" />
          </button>
        </div>

        <form class="more-form" @submit.prevent="saveMoreData">
          <div class="field-group">
            <label for="extra-rh">Tipo de sangre (RH)</label>
            <select id="extra-rh" v-model="extraData.rh" class="contrast-input">
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="AB+">AB+</option>
            </select>
          </div>
          <div class="field-group">
            <label for="extra-eps">EPS</label>
            <input id="extra-eps" v-model.trim="extraData.eps" type="text" class="contrast-input" required />
          </div>
          <div class="field-group">
            <label for="extra-estrato">Estrato socioeconómico</label>
            <select id="extra-estrato" v-model="extraData.estrato" class="contrast-input">
              <option value="1">Estrato 1</option>
              <option value="2">Estrato 2</option>
              <option value="3">Estrato 3</option>
              <option value="4">Estrato 4</option>
            </select>
          </div>
          <div class="field-group">
            <label for="extra-acudiente">Nombre del acudiente</label>
            <input id="extra-acudiente" v-model.trim="extraData.acudiente" type="text" class="contrast-input" required />
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-outline" @click="moreModalOpen = false">Cancelar</button>
            <button type="submit" class="save-mini-btn" style="padding: 9px 16px;">Guardar cambios</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import {
  Calendar,
  CheckCircle2,
  FolderOpen,
  IdCard,
  Lock,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Smartphone,
  User,
  X
} from 'lucide-vue-next'
import { estudianteMock } from '@/data/mockData'

const DATA_KEY = 'sigedin_mis_datos'
const PHOTO_KEY = 'sigedin_carnet_foto'
const EXTRA_KEY = 'sigedin_mis_datos_extra'

const fileInputRef = ref(null)
const fotoCarnet = ref(localStorage.getItem(PHOTO_KEY) || '')
const googleVinculada = ref(true)
const editingKey = ref(null)
const editDraft = ref('')
const moreModalOpen = ref(false)

function loadEditableData() {
  const defaults = {
    correoPersonal: estudianteMock.correoPersonal,
    celular: estudianteMock.celular,
    telefono: estudianteMock.celular,
    barrio: estudianteMock.barrio,
    direccion: estudianteMock.direccion
  }
  try {
    const raw = localStorage.getItem(DATA_KEY)
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults
  } catch {
    return defaults
  }
}

function loadExtraData() {
  const defaults = {
    rh: 'O+',
    eps: 'EMSSANAR EPS',
    estrato: '2',
    acudiente: 'MARIA ELENA LOPEZ'
  }
  try {
    const raw = localStorage.getItem(EXTRA_KEY)
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults
  } catch {
    return defaults
  }
}

const editableData = reactive(loadEditableData())
const extraData = reactive(loadExtraData())

const contactoEditableFields = [
  { key: 'correoPersonal', label: 'Correo personal', type: 'email', icon: Mail, verified: true },
  { key: 'celular', label: 'Celular', type: 'tel', icon: Smartphone, verified: false },
  { key: 'telefono', label: 'Teléfono', type: 'tel', icon: Phone, verified: false }
]

const viviendaEditableFields = [
  { key: 'barrio', label: 'Barrio o vereda' },
  { key: 'direccion', label: 'Dirección' }
]

function handleFotoChange(event) {
  const file = event.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    const result = String(reader.result || '')
    fotoCarnet.value = result
    localStorage.setItem(PHOTO_KEY, result)
  }
  reader.readAsDataURL(file)
}

function quitarFoto() {
  fotoCarnet.value = ''
  localStorage.removeItem(PHOTO_KEY)
}

function toggleGoogle() {
  googleVinculada.value = !googleVinculada.value
}

function startInlineEdit(key) {
  editingKey.value = key
  editDraft.value = editableData[key] || ''
}

function cancelInlineEdit() {
  editingKey.value = null
  editDraft.value = ''
}

function saveInlineEdit(key) {
  if (!editDraft.value) return
  editableData[key] = editDraft.value
  localStorage.setItem(DATA_KEY, JSON.stringify({ ...editableData }))
  editingKey.value = null
}

function saveMoreData() {
  localStorage.setItem(EXTRA_KEY, JSON.stringify({ ...extraData }))
  moreModalOpen.value = false
}
</script>

<style scoped>
.hv-container {
  max-width: 880px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Tarjeta 1 */
.hv-identity-card {
  display: flex;
  align-items: center;
  gap: 14px;
}

.hv-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background-color: #185686;
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 700;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.hv-name {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
}

.hv-updated {
  margin: 2px 0 0;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* Tarjeta 2 */
.hv-photo-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.photo-preview-box {
  width: 68px;
  height: 68px;
  border-radius: 8px;
  background-color: #185686;
  color: #ffffff;
  font-size: 1.25rem;
  font-weight: 700;
  display: grid;
  place-items: center;
  overflow: hidden;
  flex-shrink: 0;
}

.photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-title {
  margin: 0;
  font-size: 0.96rem;
  font-weight: 700;
}

.photo-desc {
  margin: 4px 0 10px;
  font-size: 0.83rem;
  color: var(--text-secondary);
  line-height: 1.45;
}

.photo-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.outline-blue-btn {
  border: 1px solid #185686;
  color: #185686;
  background: var(--bg-surface);
  border-radius: 6px;
  padding: 6px 14px;
  font-size: 0.84rem;
  font-weight: 600;
  cursor: pointer;
}

:root.dark .outline-blue-btn {
  border-color: var(--text-brand);
  color: var(--text-brand);
}

.text-link-btn {
  border: none;
  background: transparent;
  color: #185686;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 6px;
}

:root.dark .text-link-btn {
  color: var(--text-brand);
}

/* Tarjeta 3 */
.hv-google-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 14px;
  flex-wrap: wrap;
}

.google-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.google-title-row h3 {
  margin: 0;
  font-size: 0.96rem;
}

.google-g-badge {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #4285f4;
  color: #ffffff;
  font-size: 0.78rem;
  font-weight: 700;
  display: grid;
  place-items: center;
}

.google-desc {
  margin: 6px 0 0;
  font-size: 0.83rem;
  color: var(--text-secondary);
  line-height: 1.45;
}

/* Sección RESUMEN DE MIS DATOS */
.hv-section {
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
  padding-bottom: 6px;
  border-bottom: 1.5px solid #185686;
}

:root.dark .section-heading {
  color: var(--text-brand);
  border-bottom-color: var(--text-brand);
}

.sub-card-title {
  margin: 0 0 10px;
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--text-primary);
}

.data-rows {
  display: flex;
  flex-direction: column;
}

.data-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-top: 1px solid var(--border-color);
}

.data-row:first-child {
  border-top: none;
  padding-top: 2px;
}

.row-icon {
  color: var(--text-secondary);
  flex-shrink: 0;
}

.row-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.row-label {
  font-size: 0.76rem;
  color: var(--text-secondary);
}

.row-value {
  font-size: 0.9rem;
  font-weight: 600;
}

.row-value-inline {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  font-weight: 600;
}

.verified-icon {
  color: #65a30d;
  flex-shrink: 0;
}

.lock-icon {
  color: var(--text-secondary);
  opacity: 0.75;
  flex-shrink: 0;
}

.pencil-btn {
  border: none;
  background: transparent;
  color: #185686;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
}

:root.dark .pencil-btn {
  color: var(--text-brand);
}

.pencil-btn:hover {
  background: var(--bg-surface-muted);
}

.inline-edit-wrap {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}

.contrast-input {
  flex: 1;
  min-width: 180px;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1.5px solid #94a3b8;
  background-color: #f8fafc;
  color: #0f172a;
  font-family: inherit;
  font-size: 0.88rem;
}

:root.dark .contrast-input {
  background-color: #0f172a;
  border-color: #475569;
  color: #f8fafc;
}

.save-mini-btn {
  border: none;
  border-radius: 6px;
  background-color: #185686;
  color: #ffffff;
  padding: 7px 12px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
}

.cancel-mini-btn {
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-surface);
  color: var(--text-primary);
  padding: 7px 12px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
}

.hv-footnote {
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* 5. Banner Destacado */
.more-data-banner {
  background-color: #0e4268;
  border-left: 4px solid #f59e0b;
  border-radius: var(--radius-md);
  padding: 18px 20px;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.banner-left {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  flex: 1;
  min-width: 240px;
}

.banner-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.banner-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
}

.banner-sub {
  margin: 4px 0 0;
  font-size: 0.84rem;
  color: rgba(255, 255, 255, 0.86);
  line-height: 1.45;
}

.banner-white-btn {
  border: none;
  border-radius: 6px;
  background: #ffffff;
  color: #0e4268;
  padding: 9px 14px;
  font-size: 0.86rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}

/* 6. Mis programas */
.programs-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.programs-label {
  font-size: 0.86rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.program-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  flex-wrap: wrap;
}

.program-name {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
}

.program-sub {
  margin: 3px 0 0;
  font-size: 0.82rem;
  color: var(--text-secondary);
}

.olive-badge {
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.74rem;
  font-weight: 700;
  background-color: rgba(101, 163, 13, 0.18);
  color: #4d7c0f;
}

:root.dark .olive-badge {
  color: #bef264;
}

.program-divider {
  height: 1px;
  background: var(--border-color);
  margin: 14px 0;
}

.program-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.pg-label {
  font-size: 0.76rem;
  color: var(--text-secondary);
}

.pg-value {
  font-size: 0.9rem;
  font-weight: 600;
}

/* Modal */
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
  max-width: 450px;
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

.more-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.field-group label {
  font-size: 0.84rem;
  font-weight: 700;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 6px;
}
</style>
