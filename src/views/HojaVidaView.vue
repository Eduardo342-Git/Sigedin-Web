<template>
  <div class="hv-container">
    <!-- Toast / Banner de confirmación de guardado -->
    <div v-if="saveToast" class="save-success-banner" role="status">
      ✓ Cambios guardados correctamente
    </div>

    <!-- 1. Tarjeta Maestra de Perfil (Identidad + Foto del carné) -->
    <section class="master-profile-card">
      <div class="master-avatar">
        <img v-if="draftPhoto" :src="draftPhoto" alt="Foto de perfil" class="master-avatar-img" />
        <span v-else>{{ estudianteMock.iniciales }}</span>
      </div>

      <div class="master-info">
        <h2 class="master-name">{{ estudianteMock.nombreCompleto }}</h2>
        <p class="master-sub">
          Código: {{ estudianteMock.programaActual.codigoEstudiante }} · {{ estudianteMock.programaActual.programa }}
        </p>
        <span class="master-badge">{{ fechaActualizacionTexto }}</span>
      </div>

      <div class="master-actions">
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
        <button v-if="draftPhoto" type="button" class="text-link-btn" @click="quitarFoto">
          Quitar foto
        </button>
        <button
          v-if="hasPendingChanges"
          type="button"
          class="text-link-btn discard-btn"
          @click="descartarCambios"
        >
          Descartar
        </button>
        <button
          type="button"
          class="save-primary-btn"
          :disabled="!hasPendingChanges"
          @click="guardarCambios"
        >
          Guardar cambios
        </button>
      </div>
    </section>

    <!-- 2. Tarjeta de Vinculación de Cuenta Institucional -->
    <section class="card hv-google-card">
      <div class="google-left">
        <div class="google-title-row">
          <span class="google-g-badge" aria-hidden="true">G</span>
          <h3>Cuenta de Google</h3>
        </div>
        <p v-if="googleVinculada" class="google-desc">
          Vinculada con <strong>{{ estudianteMock.correoInstitucional }}</strong> · Puedes usar «Continuar con Google» al iniciar sesión.
        </p>
        <p v-else class="google-desc">
          Cuenta desvinculada en esta sesión de demostración.
        </p>
      </div>
      <button type="button" class="text-link-btn" @click="googleVinculada = !googleVinculada">
        {{ googleVinculada ? 'Desvincular' : 'Vincular cuenta' }}
      </button>
    </section>

    <!-- 3. Sección RESUMEN DE MIS DATOS (Rejilla simétrica de 2 columnas) -->
    <section class="hv-section">
      <div class="section-header-row">
        <h2 class="section-heading">RESUMEN DE MIS DATOS</h2>
        <button type="button" class="outline-blue-btn" @click="cambioModalOpen = true">
          Solicitar cambio de datos
        </button>
      </div>

      <p v-if="cambioFeedback" class="feedback-banner">{{ cambioFeedback }}</p>

      <div class="two-col-grid">
        <!-- Columna Izquierda: Información básica -->
        <div class="card sub-card">
          <h3 class="sub-card-title">Información básica</h3>
          <div class="data-rows">
            <div class="data-row">
              <User :size="17" class="row-icon" />
              <div class="row-content">
                <span class="row-label">Nombre completo</span>
                <span class="row-value">{{ estudianteMock.nombreCompleto }}</span>
              </div>
              <Lock :size="16" class="lock-icon" title="Dato protegido" />
            </div>

            <div class="data-row">
              <IdCard :size="17" class="row-icon" />
              <div class="row-content">
                <span class="row-label">Identificación</span>
                <span class="row-value">{{ estudianteMock.identificacion }}</span>
              </div>
              <Lock :size="16" class="lock-icon" title="Dato protegido" />
            </div>

            <div class="data-row">
              <Calendar :size="17" class="row-icon" />
              <div class="row-content">
                <span class="row-label">Fecha de nacimiento</span>
                <span class="row-value">11 de jun de 2006</span>
              </div>
              <Lock :size="16" class="lock-icon" title="Dato protegido" />
            </div>

            <div class="data-row">
              <UserCheck :size="17" class="row-icon" />
              <div class="row-content">
                <span class="row-label">Género</span>
                <span class="row-value">Masculino</span>
              </div>
              <Lock :size="16" class="lock-icon" title="Dato protegido" />
            </div>
          </div>
        </div>

        <!-- Columna Derecha: Contacto y residencia -->
        <div class="card sub-card contact-sub-card">
          <div>
            <h3 class="sub-card-title">Contacto y residencia</h3>
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
                <Lock :size="16" class="lock-icon" title="Dato protegido" />
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
                      class="form-control inline-input"
                      @keyup.enter="applyInlineDraft(field.key)"
                    />
                    <button type="button" class="save-mini-btn" @click="applyInlineDraft(field.key)">
                      Aplicar
                    </button>
                    <button type="button" class="cancel-mini-btn" @click="cancelInlineEdit">
                      Cancelar
                    </button>
                  </div>
                  <span v-else class="row-value-inline">
                    <span>{{ draftContact[field.key] }}</span>
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

          <div class="contact-save-footer">
            <button
              v-if="hasPendingChanges"
              type="button"
              class="text-link-btn discard-btn"
              @click="descartarCambios"
            >
              Descartar
            </button>
            <button
              type="button"
              class="save-primary-btn"
              :disabled="!hasPendingChanges"
              @click="guardarCambios"
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </div>

      <p class="hv-footnote">
        Pulsa un dato con lápiz para modificarlo en borrador y luego presiona «Guardar cambios». Los que tienen candado requieren «Solicitar cambio de datos».
      </p>
    </section>

    <!-- 4. Banner Destacado -->
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

    <!-- 5. Sección Mis programas -->
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

    <!-- Modal Solicitar cambio de datos -->
    <div v-if="cambioModalOpen" class="modal-overlay" @click.self="cambioModalOpen = false">
      <div class="modal-card" style="max-width: 540px;">
        <div class="modal-header">
          <div>
            <h3>Solicitar cambio de datos</h3>
            <p class="modal-subtitle">
              La solicitud se radicará en Servicios en Línea para validación de Admisiones y Registro.
            </p>
          </div>
          <button type="button" class="modal-close-btn" aria-label="Cerrar" @click="cambioModalOpen = false">
            <X :size="18" />
          </button>
        </div>

        <form @submit.prevent="enviarSolicitudCambio">
          <div class="modal-body">
            <div>
              <label for="cambio-campo" class="form-label">Campo protegido a modificar *</label>
              <select id="cambio-campo" v-model="cambioForm.campo" class="form-control" required>
                <option value="Nombre completo">Nombre completo</option>
                <option value="Identificación">Identificación</option>
                <option value="Fecha de nacimiento">Fecha de nacimiento</option>
                <option value="Género">Género</option>
                <option value="Correo institucional">Correo institucional</option>
              </select>
            </div>

            <div>
              <label for="cambio-valor" class="form-label">Nuevo valor correcto *</label>
              <input
                id="cambio-valor"
                v-model.trim="cambioForm.nuevoValor"
                type="text"
                class="form-control"
                placeholder="Escribe exactamente como aparece en tu documento"
                required
              />
            </div>

            <div>
              <label for="cambio-soporte" class="form-label">
                <span>Soporte documental</span>
                <span class="label-hint">Opcional</span>
              </label>
              <input
                id="cambio-soporte"
                v-model.trim="cambioForm.soporte"
                type="text"
                class="form-control"
                placeholder="Ej. Copia de cédula o registro civil (referencia)"
              />
            </div>

            <div>
              <label for="cambio-motivo" class="form-label">Motivo de la corrección *</label>
              <textarea
                id="cambio-motivo"
                v-model.trim="cambioForm.motivo"
                rows="3"
                class="form-control"
                placeholder="Explica brevemente el motivo del cambio solicitado..."
                required
              />
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-outline" @click="cambioModalOpen = false">Cancelar</button>
            <button type="submit" class="btn-primary">Enviar solicitud</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Ver más datos -->
    <div v-if="moreModalOpen" class="modal-overlay" @click.self="moreModalOpen = false">
      <div class="modal-card">
        <div class="modal-header">
          <div>
            <h3>Datos complementarios</h3>
            <p class="modal-subtitle">Actualiza tu información de salud y contacto familiar.</p>
          </div>
          <button type="button" class="modal-close-btn" aria-label="Cerrar" @click="moreModalOpen = false">
            <X :size="18" />
          </button>
        </div>

        <form @submit.prevent="saveMoreData">
          <div class="modal-body">
            <div class="form-row-2">
              <div>
                <label for="extra-rh" class="form-label">Tipo de sangre (RH)</label>
                <select id="extra-rh" v-model="extraData.rh" class="form-control">
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="AB+">AB+</option>
                </select>
              </div>
              <div>
                <label for="extra-estrato" class="form-label">Estrato socioeconómico</label>
                <select id="extra-estrato" v-model="extraData.estrato" class="form-control">
                  <option value="1">Estrato 1</option>
                  <option value="2">Estrato 2</option>
                  <option value="3">Estrato 3</option>
                  <option value="4">Estrato 4</option>
                </select>
              </div>
            </div>

            <div>
              <label for="extra-eps" class="form-label">EPS *</label>
              <input id="extra-eps" v-model.trim="extraData.eps" type="text" class="form-control" required />
            </div>

            <div>
              <label for="extra-acudiente" class="form-label">Nombre del acudiente *</label>
              <input id="extra-acudiente" v-model.trim="extraData.acudiente" type="text" class="form-control" required />
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-outline" @click="moreModalOpen = false">Cancelar</button>
            <button type="submit" class="btn-primary">Guardar cambios</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import {
  Calendar,
  CheckCircle2,
  FolderOpen,
  IdCard,
  Lock,
  Mail,
  MapPin,
  Pencil,
  Smartphone,
  User,
  UserCheck,
  X
} from 'lucide-vue-next'
import { estudianteMock } from '@/data/mockData'

const CONTACT_KEY = 'sigedin_user_contact'
const PHOTO_KEY = 'sigedin_user_photo'
const EXTRA_KEY = 'sigedin_mis_datos_extra'
const SOLICITUDES_KEY = 'sigedin_solicitudes_radicadas'

const fileInputRef = ref(null)
const savedPhoto = ref(localStorage.getItem(PHOTO_KEY) || '')
const draftPhoto = ref(savedPhoto.value)
const fechaActualizacionTexto = ref(
  localStorage.getItem(CONTACT_KEY) || localStorage.getItem(PHOTO_KEY)
    ? 'Datos actualizados hoy'
    : 'Datos actualizados el 19 de ago de 2026'
)

const googleVinculada = ref(true)
const editingKey = ref(null)
const editDraft = ref('')
const moreModalOpen = ref(false)
const cambioModalOpen = ref(false)
const cambioFeedback = ref('')
const saveToast = ref(false)
let toastTimer = null

const cambioForm = reactive({
  campo: 'Nombre completo',
  nuevoValor: '',
  soporte: '',
  motivo: ''
})

function loadSavedContact() {
  const defaults = {
    correoPersonal: estudianteMock.correoPersonal,
    celular: estudianteMock.celular,
    direccionResidencia: `${estudianteMock.direccion} · ${estudianteMock.barrio} (Mocoa)`
  }
  try {
    const raw = localStorage.getItem(CONTACT_KEY)
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

const savedContact = reactive(loadSavedContact())
const draftContact = reactive({ ...savedContact })
const extraData = reactive(loadExtraData())

const contactoEditableFields = [
  { key: 'correoPersonal', label: 'Correo personal', type: 'email', icon: Mail, verified: true },
  { key: 'celular', label: 'Teléfono celular', type: 'tel', icon: Smartphone, verified: false },
  { key: 'direccionResidencia', label: 'Dirección / Municipio', type: 'text', icon: MapPin, verified: false }
]

const hasPendingChanges = computed(
  () =>
    draftPhoto.value !== savedPhoto.value ||
    draftContact.correoPersonal !== savedContact.correoPersonal ||
    draftContact.celular !== savedContact.celular ||
    draftContact.direccionResidencia !== savedContact.direccionResidencia
)

function compressImageDataUrl(dataUrl, maxDim = 400) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      let { width, height } = img
      if (width > maxDim || height > maxDim) {
        if (width >= height) {
          height = Math.round((height * maxDim) / width)
          width = maxDim
        } else {
          width = Math.round((width * maxDim) / height)
          height = maxDim
        }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(dataUrl)
        return
      }
      ctx.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }
    img.onerror = () => resolve(dataUrl)
    img.src = dataUrl
  })
}

function handleFotoChange(event) {
  const file = event.target.files?.[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) return

  const reader = new FileReader()
  reader.onload = async () => {
    const rawUrl = String(reader.result || '')
    draftPhoto.value = await compressImageDataUrl(rawUrl, 400)
  }
  reader.readAsDataURL(file)
}

function quitarFoto() {
  draftPhoto.value = ''
  if (fileInputRef.value) fileInputRef.value.value = ''
}

function startInlineEdit(key) {
  editingKey.value = key
  editDraft.value = draftContact[key] || ''
}

function cancelInlineEdit() {
  editingKey.value = null
  editDraft.value = ''
}

function applyInlineDraft(key) {
  if (!editDraft.value) return
  draftContact[key] = editDraft.value
  editingKey.value = null
}

function descartarCambios() {
  draftPhoto.value = savedPhoto.value
  Object.assign(draftContact, savedContact)
  editingKey.value = null
  if (fileInputRef.value) fileInputRef.value.value = ''
}

function guardarCambios() {
  if (draftPhoto.value) {
    localStorage.setItem(PHOTO_KEY, draftPhoto.value)
  } else {
    localStorage.removeItem(PHOTO_KEY)
  }
  savedPhoto.value = draftPhoto.value

  localStorage.setItem(CONTACT_KEY, JSON.stringify({ ...draftContact }))
  Object.assign(savedContact, draftContact)

  fechaActualizacionTexto.value = 'Datos actualizados hoy'
  window.dispatchEvent(new Event('profile-photo-updated'))

  saveToast.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    saveToast.value = false
  }, 3000)
}

function saveMoreData() {
  localStorage.setItem(EXTRA_KEY, JSON.stringify({ ...extraData }))
  moreModalOpen.value = false
}

function enviarSolicitudCambio() {
  if (!cambioForm.nuevoValor || !cambioForm.motivo) return

  let existentes = []
  try {
    const raw = localStorage.getItem(SOLICITUDES_KEY)
    existentes = raw ? JSON.parse(raw) : []
  } catch {
    existentes = []
  }

  const numRad = String(Math.floor(100 + Math.random() * 899))
  const radicado = `SOL-2026-${numRad}`
  const nueva = {
    id: Date.now(),
    radicado,
    tipo: 'actualizacion',
    tipoLabel: 'Actualización de datos',
    detalle: `${cambioForm.campo} → ${cambioForm.nuevoValor}. ${cambioForm.motivo}${cambioForm.soporte ? ` (Soporte: ${cambioForm.soporte})` : ''}`,
    fecha: new Date().toISOString().slice(0, 10),
    estado: 'En revisión'
  }

  localStorage.setItem(SOLICITUDES_KEY, JSON.stringify([nueva, ...existentes]))
  cambioFeedback.value = `Solicitud ${radicado} radicada correctamente. Puedes consultarla en Servicios en Línea → Solicitudes.`

  cambioForm.nuevoValor = ''
  cambioForm.soporte = ''
  cambioForm.motivo = ''
  cambioModalOpen.value = false
}

function syncFromExternal() {
  const p = localStorage.getItem(PHOTO_KEY) || ''
  savedPhoto.value = p
  draftPhoto.value = p
}

onMounted(() => {
  window.addEventListener('storage', syncFromExternal)
})

onUnmounted(() => {
  window.removeEventListener('storage', syncFromExternal)
  if (toastTimer) clearTimeout(toastTimer)
})
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

.save-success-banner {
  padding: 11px 16px;
  border-radius: 8px;
  border-left: 4px solid #65a30d;
  background-color: rgba(101, 163, 13, 0.16);
  color: #3f6212;
  font-size: 0.88rem;
  font-weight: 700;
}

:root.dark .save-success-banner {
  color: #bef264;
}

/* 1. Tarjeta Maestra de Perfil */
.master-profile-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-left: 4px solid #185686;
  border-radius: 10px;
  box-shadow: var(--shadow-sm);
  padding: 24px 28px;
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.master-avatar {
  width: 84px;
  height: 84px;
  border-radius: 10px;
  overflow: hidden;
  background-color: #185686;
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 700;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.master-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.master-info {
  flex: 1;
  min-width: 220px;
}

.master-name {
  margin: 0;
  font-size: 1.18rem;
  font-weight: 700;
  color: var(--text-primary);
}

.master-sub {
  margin: 4px 0 8px;
  font-size: 0.84rem;
  color: var(--text-secondary);
}

.master-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 0.74rem;
  font-weight: 600;
  background-color: var(--bg-surface-muted);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
}

.master-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  flex-shrink: 0;
}

.save-primary-btn {
  border: none;
  border-radius: 6px;
  background-color: #185686;
  color: #ffffff;
  padding: 7px 14px;
  font-size: 0.84rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
}

.save-primary-btn:hover:not(:disabled) {
  background-color: #0f4766;
}

.save-primary-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.outline-blue-btn {
  border: 1px solid #185686;
  color: #185686;
  background: var(--bg-surface);
  border-radius: 6px;
  padding: 7px 14px;
  font-size: 0.84rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
}

:root.dark .outline-blue-btn {
  border-color: var(--text-brand);
  color: var(--text-brand);
}

.outline-blue-btn:hover {
  background-color: var(--bg-surface-muted);
}

.text-link-btn {
  border: none;
  background: transparent;
  color: #185686;
  font-size: 0.84rem;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 6px;
}

:root.dark .text-link-btn {
  color: var(--text-brand);
}

.discard-btn {
  color: var(--text-secondary);
}

/* 2. Cuenta de Google */
.hv-google-card {
  padding: 16px 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  margin: 4px 0 0;
  font-size: 0.83rem;
  color: var(--text-secondary);
  line-height: 1.45;
}

/* 3. Resumen en 2 columnas */
.hv-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.section-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 6px;
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

.feedback-banner {
  margin: 0;
  padding: 10px 14px;
  border-radius: 8px;
  background-color: rgba(101, 163, 13, 0.14);
  color: #4d7c0f;
  font-size: 0.85rem;
  font-weight: 600;
}

:root.dark .feedback-banner {
  color: #bef264;
}

.two-col-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 20px;
}

.contact-sub-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 14px;
}

.contact-save-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}

.sub-card-title {
  margin: 0 0 10px;
  font-size: 0.94rem;
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
  font-size: 0.88rem;
  font-weight: 600;
}

.row-value-inline {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.88rem;
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

.inline-input {
  flex: 1;
  min-width: 160px;
  padding: 7px 10px;
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

/* 4. Banner Destacado */
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

/* 5. Mis programas */
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
</style>
