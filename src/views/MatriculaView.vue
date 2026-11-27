<template>
  <div class="page-stack">
    <!-- 1. Encabezado de Página -->
    <header class="req-page-header">
      <h2 class="req-title">Requisitos de matrícula</h2>
      <p class="req-subtitle">
        {{ estudianteMock.programaActual.programa }} · {{ requisitosMatriculaMock.periodo }} · {{ requisitosMatriculaMock.semestre }}
      </p>
    </header>

    <!-- 2. Tarjeta Resumen de Progreso -->
    <section class="summary-progress-card">
      <div class="summary-top-row">
        <div class="summary-count">
          <strong>3</strong> de 3
          <span class="summary-count-label">obligatorios cargados</span>
        </div>

        <div class="summary-status">
          <span class="status-label">Estado general</span>
          <span class="pill-approved">Aprobado</span>
        </div>
      </div>

      <div class="progress-bar-track" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar-fill" />
      </div>

      <div class="closed-banner">
        <strong>El cargue está cerrado.</strong>
        <span>El plazo para cargar los documentos terminó el 26 ago 2026.</span>
      </div>
    </section>

    <p class="docs-note">
      Los documentos deben ser PDF (la foto del carné, JPG o PNG) de hasta 1.5 MB.
      Si algo es rechazado, verás la observación y podrás cargarlo de nuevo.
    </p>

    <!-- 3. Tarjetas Individuales de Requisitos Documentales -->
    <section class="req-cards-list">
      <!-- Requisito 1 -->
      <article class="req-item-card border-approved">
        <div class="req-item-top">
          <h3 class="req-item-title">REGISTRO DE MATERIAS (Firmado) *</h3>
          <span class="pill-approved">Aprobado</span>
        </div>

        <div v-if="expandedHelp === 1" class="req-help-box">
          Descarga tu registro de materias desde el portal académico, fírmalo y súbelo en formato PDF legible.
        </div>

        <div class="req-item-footer">
          <button type="button" class="help-link-btn" @click="toggleHelp(1)">
            ¿Qué debo subir?
          </button>
          <span class="legacy-source">Cargado en el sistema anterior</span>
        </div>
      </article>

      <!-- Requisito 2 -->
      <article class="req-item-card border-approved">
        <div class="req-item-top">
          <h3 class="req-item-title">
            RECIBO DE PAGO POR DERECHOS DE MATRICULA Y COMPLEMENTARIOS (CONSIGNACION DEL BANCO,
            Requiere sello de tesorería si fue cancelado en un banco diferente a BBVA o Pago en Línea) *
          </h3>
          <span class="pill-approved">Aprobado</span>
        </div>

        <div class="req-item-footer footer-end">
          <a href="#" class="view-doc-link" @click.prevent="abrirDocumentoPdf">
            <Eye :size="16" />
            <span>Ver documento</span>
          </a>
        </div>
      </article>

      <!-- Requisito 3 -->
      <article class="req-item-card border-approved">
        <div class="req-item-top">
          <h3 class="req-item-title">
            PAZ Y SALVO DEL SEMESTRE ANTERIOR - NO OBLIGATORIO PARA REINGRESOS. *
          </h3>
          <span class="pill-approved">Aprobado</span>
        </div>

        <div v-if="expandedHelp === 3" class="req-help-box">
          Adjunta el PDF del paz y salvo del periodo anterior con los sellos de las dependencias correspondientes.
        </div>

        <div class="req-item-footer">
          <button type="button" class="help-link-btn" @click="toggleHelp(3)">
            ¿Qué debo subir?
          </button>
          <span class="legacy-source">Cargado en el sistema anterior</span>
        </div>
      </article>

      <!-- Requisito 4 (Opcional) -->
      <article class="req-item-card border-pending">
        <div class="req-item-top">
          <h3 class="req-item-title">OTROS (REQUISITO NO OBLIGATORIO)</h3>
          <span class="pill-pending">Sin cargar</span>
        </div>
      </article>
    </section>

    <!-- Pie de acciones -->
    <footer class="req-submit-footer">
      <button type="button" class="submit-review-btn" disabled>
        Enviar para revisión
      </button>
      <p class="approved-caption">Tus documentos ya fueron aprobados.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Eye } from 'lucide-vue-next'
import { estudianteMock, requisitosMatriculaMock } from '@/data/mockData'

const expandedHelp = ref(null)

function toggleHelp(id) {
  expandedHelp.value = expandedHelp.value === id ? null : id
}

function abrirDocumentoPdf() {
  const texto = `COMPROBANTE DE PAGO - ${estudianteMock.nombreCompleto} - ${requisitosMatriculaMock.periodo}`
  const pdfContent = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj
4 0 obj << /Length 120 >> stream
BT /F1 14 Tf 50 720 Td (${texto}) Tj 0 -24 Td (Estado: APROBADO / VERIFICADO - Ref: BBVA-20262-99169) Tj ET
endstream endobj
5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000241 00000 n 
0000000412 00000 n 
trailer << /Size 6 /Root 1 0 R >>
startxref
482
%%EOF`
  const blob = new Blob([pdfContent], { type: 'application/pdf' })
  const pdfUrl = URL.createObjectURL(blob)
  window.open(pdfUrl, '_blank', 'noopener,noreferrer')
}
</script>

<style scoped>
.req-page-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.req-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #185686;
}

:root.dark .req-title {
  color: var(--text-brand);
}

.req-subtitle {
  margin: 0;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--text-secondary);
}

/* 2. Tarjeta Resumen de Progreso */
.summary-progress-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-left: 4px solid #65a30d;
  border-radius: 10px;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  padding: 18px 22px 0;
}

.summary-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.summary-count {
  font-size: 1.05rem;
  color: var(--text-primary);
}

.summary-count strong {
  font-size: 1.45rem;
  color: #185686;
}

:root.dark .summary-count strong {
  color: var(--text-brand);
}

.summary-count-label {
  display: block;
  font-size: 0.82rem;
  color: var(--text-secondary);
}

.summary-status {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-label {
  font-size: 0.82rem;
  color: var(--text-secondary);
}

.pill-approved {
  display: inline-block;
  padding: 3px 11px;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 700;
  background-color: rgba(101, 163, 13, 0.16);
  color: #4d7c0f;
}

:root.dark .pill-approved {
  color: #bef264;
}

.pill-pending {
  display: inline-block;
  padding: 3px 11px;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 600;
  background-color: var(--bg-surface-muted);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  white-space: nowrap;
}

.progress-bar-track {
  margin-top: 14px;
  height: 8px;
  border-radius: 999px;
  background-color: var(--border-color);
  overflow: hidden;
}

.progress-bar-fill {
  width: 100%;
  height: 100%;
  background-color: #185686;
  border-radius: 999px;
}

:root.dark .progress-bar-fill {
  background-color: #38bdf8;
}

.closed-banner {
  margin: 16px -22px 0;
  padding: 11px 22px;
  background-color: #fdf3e1;
  border-top: 1px solid #f3dfb8;
  border-left: 4px solid #f59e0b;
  font-size: 0.87rem;
  color: #7c4a03;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

:root.dark .closed-banner {
  background-color: rgba(245, 158, 11, 0.14);
  border-top-color: rgba(245, 158, 11, 0.28);
  color: #fde68a;
}

.docs-note {
  margin: -6px 0 0;
  font-size: 0.84rem;
  color: var(--text-secondary);
  line-height: 1.45;
}

/* 3. Tarjetas Individuales */
.req-cards-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.req-item-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  box-shadow: var(--shadow-sm);
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.border-approved {
  border-left: 4px solid #65a30d;
}

.border-pending {
  border-left: 4px solid var(--border-color);
}

.req-item-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 14px;
}

.req-item-title {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 700;
  line-height: 1.4;
  color: var(--text-primary);
}

.req-help-box {
  padding: 10px 12px;
  border-radius: 6px;
  background-color: var(--bg-surface-muted);
  border-left: 3px solid #185686;
  font-size: 0.84rem;
  color: var(--text-secondary);
}

.req-item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  padding-top: 8px;
  border-top: 1px solid var(--border-color);
}

.footer-end {
  justify-content: flex-end;
}

.help-link-btn {
  border: none;
  background: transparent;
  padding: 0;
  color: #185686;
  font-size: 0.84rem;
  font-weight: 600;
  cursor: pointer;
}

:root.dark .help-link-btn {
  color: var(--text-brand);
}

.help-link-btn:hover {
  text-decoration: underline;
}

.legacy-source {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.view-doc-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #185686;
  font-size: 0.84rem;
  font-weight: 600;
  text-decoration: none;
}

:root.dark .view-doc-link {
  color: var(--text-brand);
}

.view-doc-link:hover {
  text-decoration: underline;
}

/* Pie de acciones */
.req-submit-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.submit-review-btn {
  width: 100%;
  padding: 11px 16px;
  border: none;
  border-radius: 6px;
  background-color: #185686;
  color: #ffffff;
  font-size: 0.92rem;
  font-weight: 700;
  opacity: 0.55;
  cursor: not-allowed;
}

.approved-caption {
  margin: 0;
  font-size: 0.84rem;
  color: var(--text-secondary);
  text-align: center;
}
</style>
