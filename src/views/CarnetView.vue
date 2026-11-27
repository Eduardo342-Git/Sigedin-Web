<template>
  <div class="carnet-page-wrap">
    <!-- 1. Cabecera de Página -->
    <header class="carnet-page-header">
      <h2 class="carnet-page-title">Mi carnet</h2>
      <p class="carnet-page-sub">
        Descárgalo en PDF para imprimirlo, o muestra el código QR desde tu celular.
      </p>
    </header>

    <!-- 2. Contenedor de Doble Cara -->
    <section class="cards-duo">
      <!-- TARJETA 1: FRENTE DEL CARNÉ -->
      <article class="pvc-card pvc-front">
        <!-- Sol dorado decorativo superior izquierdo -->
        <svg class="sun-deco" width="76" height="76" viewBox="0 0 80 80" fill="none" aria-hidden="true">
          <circle cx="14" cy="14" r="24" fill="#F59E0B" />
          <path d="M44 6L56 2M46 22L62 24M36 36L48 48M22 46L24 62M6 44L2 56" stroke="#F59E0B" stroke-width="3.5" stroke-linecap="round" />
        </svg>

        <div class="front-content">
          <div class="front-photo-frame">
            <img v-if="fotoCarnet" :src="fotoCarnet" alt="Foto del estudiante" class="front-photo-img" />
            <span v-else class="front-initials">{{ estudianteMock.iniciales }}</span>
          </div>

          <div class="front-name">{{ estudianteMock.nombreCompleto }}</div>
          <div class="front-doc">C.C. {{ estudianteMock.identificacion }}</div>
          <div class="front-role">ESTUDIANTE</div>
          <div class="front-program">{{ estudianteMock.programaActual.programa }}</div>
        </div>

        <div class="front-footer">
          <div class="mini-uni-brand">
            <svg width="24" height="26" viewBox="0 0 42 46" fill="none" aria-hidden="true">
              <circle cx="21" cy="11" r="6" fill="#80BF1F" />
              <circle cx="21" cy="11" r="3" fill="#F5A51D" />
              <path d="M7 15V27C7 35.28 13.27 41.5 21 41.5C28.73 41.5 35 35.28 35 27V15H28.5V27C28.5 31.69 25.14 35 21 35C16.86 35 13.5 31.69 13.5 27V15H7Z" fill="#185686" />
            </svg>
            <div class="mini-uni-texts">
              <strong>UNIPUTUMAYO</strong>
              <span>INSTITUCIÓN UNIVERSITARIA DEL PUTUMAYO</span>
            </div>
          </div>
          <div class="front-orange-bar" />
        </div>
      </article>

      <!-- TARJETA 2: REVERSO DEL CARNÉ -->
      <article class="pvc-card pvc-back">
        <div class="back-top-padding">
          <!-- Cabecera Institucional Doble -->
          <div class="back-header">
            <div class="mini-uni-brand">
              <svg width="22" height="24" viewBox="0 0 42 46" fill="none" aria-hidden="true">
                <circle cx="21" cy="11" r="6" fill="#80BF1F" />
                <circle cx="21" cy="11" r="3" fill="#F5A51D" />
                <path d="M7 15V27C7 35.28 13.27 41.5 21 41.5C28.73 41.5 35 35.28 35 27V15H28.5V27C28.5 31.69 25.14 35 21 35C16.86 35 13.5 31.69 13.5 27V15H7Z" fill="#185686" />
              </svg>
              <div class="mini-uni-texts">
                <strong>UNIPUTUMAYO</strong>
              </div>
            </div>

            <div class="back-edu-brand">
              <div class="edu-row">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" stroke="#7F1D1D" stroke-width="2" fill="#FEF2F2" />
                  <path d="M12 6L16 10V15C16 17 12 19 12 19C12 19 8 17 8 15V10L12 6Z" fill="#7F1D1D" />
                </svg>
                <span>Educación</span>
              </div>
              <div class="mini-flag">
                <span style="flex: 2; background: #FACC15;" />
                <span style="flex: 1; background: #1D4ED8;" />
                <span style="flex: 1; background: #DC2626;" />
              </div>
            </div>
          </div>

          <!-- Texto Legal -->
          <div class="back-legal">
            <p>
              Este carnet es personal e intransferible y todas las acciones realizadas con el carné
              se entienden como efectuadas por su titular, es deber del titular portarlo y presentarlo.
            </p>
            <p>
              En caso de hurto o pérdida informar de inmediato a Registro y Control Académico.
            </p>
          </div>

          <!-- Bloque QR Interactivo + Vencimiento -->
          <div class="back-qr-row">
            <button
              type="button"
              class="qr-trigger-btn"
              title="Toca para ampliar el QR"
              aria-label="Toca para ampliar el QR"
              @click="qrModalOpen = true"
            >
              <svg class="qr-svg-small" viewBox="0 0 100 100" aria-hidden="true">
                <rect width="100" height="100" fill="#ffffff" />
                <rect x="6" y="6" width="26" height="26" fill="none" stroke="#0f172a" stroke-width="5" />
                <rect x="14" y="14" width="10" height="10" fill="#0f172a" />
                <rect x="68" y="6" width="26" height="26" fill="none" stroke="#0f172a" stroke-width="5" />
                <rect x="76" y="14" width="10" height="10" fill="#0f172a" />
                <rect x="6" y="68" width="26" height="26" fill="none" stroke="#0f172a" stroke-width="5" />
                <rect x="14" y="76" width="10" height="10" fill="#0f172a" />
                <rect x="40" y="8" width="7" height="7" fill="#0f172a" />
                <rect x="52" y="8" width="9" height="7" fill="#0f172a" />
                <rect x="40" y="21" width="13" height="7" fill="#0f172a" />
                <rect x="8" y="40" width="9" height="7" fill="#0f172a" />
                <rect x="23" y="40" width="11" height="7" fill="#0f172a" />
                <rect x="40" y="40" width="20" height="20" fill="#185686" rx="2" />
                <rect x="66" y="40" width="8" height="8" fill="#0f172a" />
                <rect x="80" y="40" width="14" height="7" fill="#0f172a" />
                <rect x="8" y="53" width="13" height="9" fill="#0f172a" />
                <rect x="66" y="54" width="11" height="7" fill="#0f172a" />
                <rect x="82" y="52" width="12" height="12" fill="#0f172a" />
                <rect x="40" y="68" width="9" height="9" fill="#0f172a" />
                <rect x="55" y="68" width="11" height="7" fill="#0f172a" />
                <rect x="40" y="82" width="15" height="12" fill="#0f172a" />
                <rect x="63" y="80" width="13" height="14" fill="#0f172a" />
                <rect x="82" y="72" width="12" height="22" fill="#0f172a" />
              </svg>
            </button>

            <div class="qr-meta">
              <div class="qr-exp">Vence: <strong>11 de Diciembre de 2026</strong></div>
              <div class="qr-code-num">Cód. {{ estudianteMock.programaActual.codigoEstudiante }}</div>
            </div>
          </div>
        </div>

        <!-- Franja Naranja Inferior -->
        <div class="back-orange-footer">
          <div>Sede Mocoa: 3138052807 - 3103310083</div>
          <div>Subsede Sibundoy, Ampliación Colón: 3102434689</div>
          <div>Ampliación Valle del Guamuez: 3103284620</div>
          <div>Ampliación Puerto Asís: 3103307326</div>
          <div class="back-web">www.itp.edu.co · atencionalusuario@itp.edu.co</div>
        </div>
      </article>
    </section>

    <!-- 3. Botón de Acción y Notas Informativas -->
    <div class="carnet-actions-col">
      <button type="button" class="download-carnet-btn" @click="descargarPdfCarnet">
        <Printer :size="17" />
        <span>Descargar PDF para imprimir</span>
      </button>

      <div class="carnet-notes">
        <p>
          Tu carnet lleva un código QR para registrar tu asistencia en eventos. Toca el código para ampliarlo. Es personal: no lo compartas ni lo publiques.
        </p>
        <p>
          El PDF trae frente y reverso a tamaño real (54 × 85,6 mm). Imprímelo al 100 % y recorta por el borde.
        </p>
      </div>
    </div>

    <!-- Modal QR Ampliado -->
    <div v-if="qrModalOpen" class="modal-overlay" @click.self="qrModalOpen = false">
      <div class="modal-card qr-modal-card">
        <div class="modal-header">
          <div>
            <h3>Código QR Estudiantil</h3>
            <p class="modal-subtitle">{{ estudianteMock.nombreCompleto }}</p>
          </div>
          <button type="button" class="modal-close-btn" aria-label="Cerrar" @click="qrModalOpen = false">
            <X :size="18" />
          </button>
        </div>
        <div class="qr-modal-body">
          <svg class="qr-svg-large" viewBox="0 0 100 100" aria-label="Código QR ampliado">
            <rect width="100" height="100" fill="#ffffff" />
            <rect x="6" y="6" width="26" height="26" fill="none" stroke="#0f172a" stroke-width="5" />
            <rect x="14" y="14" width="10" height="10" fill="#0f172a" />
            <rect x="68" y="6" width="26" height="26" fill="none" stroke="#0f172a" stroke-width="5" />
            <rect x="76" y="14" width="10" height="10" fill="#0f172a" />
            <rect x="6" y="68" width="26" height="26" fill="none" stroke="#0f172a" stroke-width="5" />
            <rect x="14" y="76" width="10" height="10" fill="#0f172a" />
            <rect x="40" y="8" width="7" height="7" fill="#0f172a" />
            <rect x="52" y="8" width="9" height="7" fill="#0f172a" />
            <rect x="40" y="21" width="13" height="7" fill="#0f172a" />
            <rect x="8" y="40" width="9" height="7" fill="#0f172a" />
            <rect x="23" y="40" width="11" height="7" fill="#0f172a" />
            <rect x="40" y="40" width="20" height="20" fill="#185686" rx="2" />
            <rect x="66" y="40" width="8" height="8" fill="#0f172a" />
            <rect x="80" y="40" width="14" height="7" fill="#0f172a" />
            <rect x="8" y="53" width="13" height="9" fill="#0f172a" />
            <rect x="66" y="54" width="11" height="7" fill="#0f172a" />
            <rect x="82" y="52" width="12" height="12" fill="#0f172a" />
            <rect x="40" y="68" width="9" height="9" fill="#0f172a" />
            <rect x="55" y="68" width="11" height="7" fill="#0f172a" />
            <rect x="40" y="82" width="15" height="12" fill="#0f172a" />
            <rect x="63" y="80" width="13" height="14" fill="#0f172a" />
            <rect x="82" y="72" width="12" height="22" fill="#0f172a" />
          </svg>
          <div class="qr-modal-code">Cód. {{ estudianteMock.programaActual.codigoEstudiante }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { Printer, X } from 'lucide-vue-next'
import { estudianteMock } from '@/data/mockData'

const fotoCarnet = ref(localStorage.getItem('sigedin_user_photo') || '')
const qrModalOpen = ref(false)

function syncUserPhoto() {
  fotoCarnet.value = localStorage.getItem('sigedin_user_photo') || ''
}

function descargarPdfCarnet() {
  const p = estudianteMock.programaActual
  const photoBlock = fotoCarnet.value
    ? `<img src="${fotoCarnet.value}" style="width:100%;height:100%;object-fit:cover;display:block;" />`
    : `<span style="color:#fff;font-weight:700;font-size:20px;">${estudianteMock.iniciales}</span>`

  const html = `<!DOCTYPE html>
  <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>Carnet Estudiantil · ${estudianteMock.nombreCompleto}</title>
      <style>
        * { box-sizing: border-box; }
        body {
          margin: 0;
          padding: 0;
          background: #323639;
          font-family: 'Fira Sans', Arial, sans-serif;
          color: #0f172a;
        }
        .viewer-bar {
          position: fixed;
          top: 0; left: 0; right: 0; height: 52px;
          background: #202124; color: #f1f5f9;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 24px; z-index: 100;
        }
        .print-btn {
          background: #185686; color: #fff; border: none; border-radius: 6px;
          padding: 8px 16px; font-size: 13px; font-weight: 600; cursor: pointer;
        }
        .sheet {
          width: 210mm; min-height: 297mm;
          background: #ffffff;
          margin: 76px auto 32px;
          padding: 24mm 18mm;
          box-shadow: 0 12px 35px rgba(0,0,0,0.45);
          display: flex; flex-direction: column; align-items: center; gap: 12mm;
        }
        .cut-note { font-size: 11px; color: #475569; text-align: center; }
        .cards-row { display: flex; gap: 14mm; justify-content: center; flex-wrap: wrap; }
        .cut-card {
          width: 54mm; height: 85.6mm;
          border: 1px dashed #94a3b8;
          background: #ffffff;
          display: flex; flex-direction: column; justify-content: space-between;
          overflow: hidden; position: relative;
        }
        .f-body { padding: 10mm 4mm 2mm; text-align: center; display: flex; flex-direction: column; align-items: center; }
        .f-photo {
          width: 22mm; height: 26mm; border-radius: 2mm; border: 1px solid #cbd5e1;
          background: #185686; overflow: hidden; display: flex; align-items: center; justify-content: center;
          margin-bottom: 3mm;
        }
        .f-name { font-size: 8.2pt; font-weight: 700; line-height: 1.2; }
        .f-doc { font-size: 7pt; color: #475569; margin-top: 1mm; }
        .f-role { font-size: 7pt; font-weight: 700; color: #65a30d; margin-top: 2mm; }
        .f-prog { font-size: 6.8pt; margin-top: 1mm; line-height: 1.2; }
        .f-foot { text-align: center; }
        .f-foot-brand { font-size: 7pt; font-weight: 800; color: #185686; margin-bottom: 1.5mm; }
        .orange-bar { height: 2.2mm; background: #F59E0B; }
        .b-top { padding: 4mm; font-size: 6pt; line-height: 1.35; color: #334155; }
        .b-head { font-weight: 800; color: #185686; margin-bottom: 2.5mm; display: flex; justify-content: space-between; }
        .b-qr { display: flex; align-items: center; gap: 3mm; margin-top: 3mm; }
        .b-footer { background: #F59E0B; color: #fff; padding: 2.5mm; font-size: 5.2pt; text-align: center; line-height: 1.3; }
        @media print {
          .no-print { display: none !important; }
          body { background: #fff; }
          .sheet { width: auto; min-height: auto; margin: 0; padding: 12mm; box-shadow: none; }
        }
      </style>
    </head>
    <body>
      <div class="viewer-bar no-print">
        <span>Vista previa — Carnet Estudiantil (54 × 85,6 mm)</span>
        <button class="print-btn" onclick="window.print()">Imprimir al 100 % / Guardar PDF</button>
      </div>
      <main class="sheet">
        <div class="cut-note">Escala real 54 × 85,6 mm · Imprimir al 100 % sin ajustar a página y recortar por la línea punteada.</div>
        <div class="cards-row">
          <div class="cut-card">
            <svg style="position:absolute;top:0;left:0;" width="38" height="38" viewBox="0 0 80 80">
              <circle cx="14" cy="14" r="24" fill="#F59E0B" />
            </svg>
            <div class="f-body">
              <div class="f-photo">${photoBlock}</div>
              <div class="f-name">${estudianteMock.nombreCompleto}</div>
              <div class="f-doc">C.C. ${estudianteMock.identificacion}</div>
              <div class="f-role">ESTUDIANTE</div>
              <div class="f-prog">${p.programa}</div>
            </div>
            <div class="f-foot">
              <div class="f-foot-brand">UNIPUTUMAYO</div>
              <div class="orange-bar"></div>
            </div>
          </div>
          <div class="cut-card">
            <div class="b-top">
              <div class="b-head"><span>UNIPUTUMAYO</span><span style="color:#7F1D1D;">Educación</span></div>
              <p style="margin:0 0 2mm;">Este carnet es personal e intransferible y todas las acciones realizadas con el carné se entienden como efectuadas por su titular, es deber del titular portarlo y presentarlo.</p>
              <p style="margin:0;">En caso de hurto o pérdida informar de inmediato a Registro y Control Académico.</p>
              <div class="b-qr">
                <svg width="42" height="42" viewBox="0 0 100 100">
                  <rect width="100" height="100" fill="#fff" />
                  <rect x="6" y="6" width="26" height="26" fill="none" stroke="#0f172a" stroke-width="5" />
                  <rect x="14" y="14" width="10" height="10" fill="#0f172a" />
                  <rect x="68" y="6" width="26" height="26" fill="none" stroke="#0f172a" stroke-width="5" />
                  <rect x="76" y="14" width="10" height="10" fill="#0f172a" />
                  <rect x="6" y="68" width="26" height="26" fill="none" stroke="#0f172a" stroke-width="5" />
                  <rect x="14" y="76" width="10" height="10" fill="#0f172a" />
                  <rect x="40" y="40" width="20" height="20" fill="#185686" />
                </svg>
                <div>
                  <div>Vence: <strong>11 de Diciembre de 2026</strong></div>
                  <div>Cód. ${p.codigoEstudiante}</div>
                </div>
              </div>
            </div>
            <div class="b-footer">
              <div>Sede Mocoa: 3138052807 - 3103310083</div>
              <div>Subsede Sibundoy, Ampliación Colón: 3102434689</div>
              <div>Ampliación Valle del Guamuez: 3103284620</div>
              <div>Ampliación Puerto Asís: 3103307326</div>
              <div>www.itp.edu.co · atencionalusuario@itp.edu.co</div>
            </div>
          </div>
        </div>
      </main>
    </body>
  </html>`

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank', 'noopener,noreferrer')
}

onMounted(() => {
  window.addEventListener('profile-photo-updated', syncUserPhoto)
  window.addEventListener('storage', syncUserPhoto)
})

onUnmounted(() => {
  window.removeEventListener('profile-photo-updated', syncUserPhoto)
  window.removeEventListener('storage', syncUserPhoto)
})
</script>

<style scoped>
.carnet-page-wrap {
  max-width: 880px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.carnet-page-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.carnet-page-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #185686;
}

:root.dark .carnet-page-title {
  color: var(--text-brand);
}

.carnet-page-sub {
  margin: 0;
  font-size: 0.88rem;
  color: var(--text-secondary);
}

/* Contenedor de doble cara */
.cards-duo {
  display: flex;
  justify-content: center;
  gap: 28px;
  flex-wrap: wrap;
}

.pvc-card {
  width: 270px;
  min-height: 428px;
  border-radius: 14px;
  overflow: hidden;
  background-color: #ffffff;
  color: #0f172a;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.14);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
}

/* FRENTE */
.sun-deco {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}

.front-content {
  padding: 52px 18px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
}

.front-photo-frame {
  width: 104px;
  height: 126px;
  border-radius: 10px;
  border: 2px solid #e2e8f0;
  background-color: #185686;
  overflow: hidden;
  display: grid;
  place-items: center;
  margin-bottom: 14px;
}

.front-photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.front-initials {
  color: #ffffff;
  font-size: 1.8rem;
  font-weight: 700;
}

.front-name {
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.25;
  color: #0f172a;
}

.front-doc {
  font-size: 0.82rem;
  color: #64748b;
  margin-top: 4px;
}

.front-role {
  font-size: 0.8rem;
  font-weight: 700;
  color: #65a30d;
  margin-top: 10px;
  letter-spacing: 0.04em;
}

.front-program {
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  line-height: 1.3;
  color: #1e293b;
  margin-top: 4px;
}

.front-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.mini-uni-brand {
  display: flex;
  align-items: center;
  gap: 6px;
}

.mini-uni-texts {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.mini-uni-texts strong {
  font-size: 0.72rem;
  font-weight: 800;
  color: #185686;
}

.mini-uni-texts span {
  font-size: 0.45rem;
  font-weight: 600;
  color: #475569;
}

.front-orange-bar {
  width: 100%;
  height: 8px;
  background-color: #f59e0b;
}

/* REVERSO */
.back-top-padding {
  padding: 16px 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
}

.back-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
}

.back-edu-brand {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.edu-row {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.72rem;
  font-weight: 700;
  color: #7f1d1d;
}

.mini-flag {
  width: 58px;
  height: 3px;
  display: flex;
  border-radius: 1px;
  overflow: hidden;
}

.back-legal {
  font-size: 0.72rem;
  line-height: 1.42;
  color: #334155;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.back-legal p {
  margin: 0;
}

.back-qr-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: auto;
  padding-top: 6px;
}

.qr-trigger-btn {
  padding: 4px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: #ffffff;
  cursor: pointer;
  flex-shrink: 0;
}

.qr-trigger-btn:hover {
  border-color: #185686;
}

.qr-svg-small {
  width: 78px;
  height: 78px;
  display: block;
}

.qr-meta {
  font-size: 0.7rem;
  line-height: 1.4;
  color: #334155;
}

.qr-code-num {
  margin-top: 4px;
  font-weight: 700;
  color: #185686;
}

.back-orange-footer {
  background: #f59e0b;
  color: #ffffff;
  padding: 10px 12px;
  font-size: 0.65rem;
  text-align: center;
  line-height: 1.35;
}

.back-web {
  margin-top: 3px;
  font-weight: 700;
}

/* Acciones y notas */
.carnet-actions-col {
  max-width: 568px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.download-carnet-btn {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border: none;
  border-radius: 6px;
  background-color: #185686;
  color: #ffffff;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
}

.download-carnet-btn:hover {
  background-color: #0f4766;
}

.carnet-notes {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.82rem;
  color: var(--text-secondary);
  line-height: 1.45;
  text-align: center;
}

.carnet-notes p {
  margin: 0;
}

/* Modal QR ampliado */
.qr-modal-card {
  max-width: 360px;
}

.qr-modal-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.qr-svg-large {
  width: 220px;
  height: 220px;
  padding: 8px;
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: 10px;
}

.qr-modal-code {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text-brand);
}
</style>
