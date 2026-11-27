<template>
  <div class="page-stack">
    <!-- 2. Encabezado Descriptivo Superior -->
    <p class="intro-copy">
      Tus participaciones en propuestas de horas sociales del Ciecyt. Las horas cuentan cuando cumples tu parte y el Ciecyt finaliza la propuesta.
    </p>

    <!-- 3. Bloque de Progreso del Programa -->
    <section class="section-block">
      <h2 class="section-heading">{{ estudianteMock.programaActual.programa }}</h2>
      <div class="program-sub">
        {{ estudianteMock.programaActual.ciclo }} · SNIES {{ estudianteMock.programaActual.snies }}
      </div>
      <div class="hours-count-line">
        <strong>{{ horasSocialesMock.acumuladas }}</strong> de {{ horasSocialesMock.requeridas }} horas ·
        <span class="status-complete">
          {{ horasSocialesMock.completo ? 'Completo' : 'En progreso' }}
        </span>
      </div>
      <div class="progress-track" role="progressbar" :aria-valuenow="porcentajeHoras" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-fill" :style="{ width: `${porcentajeHoras}%` }" />
      </div>
    </section>

    <!-- 4. Sección MIS PROPUESTAS -->
    <section class="section-block">
      <h2 class="section-heading">MIS PROPUESTAS</h2>

      <div class="table-card">
        <div class="table-wrap">
          <table class="ciecyt-table">
            <thead>
              <tr>
                <th>Propuesta</th>
                <th>Supervisor</th>
                <th class="text-center">Horas</th>
                <th>Estado</th>
                <th class="text-right" />
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in participaciones" :key="item.id">
                <td>
                  <div class="prop-title">{{ item.titulo }}</div>
                  <div class="prop-sub">
                    {{ item.periodo }} · {{ estudianteMock.programaActual.programa }}
                  </div>
                </td>
                <td>
                  <div class="sup-name">{{ item.supervisor }}</div>
                  <div class="sup-mail">{{ item.supervisorCorreo }}</div>
                </td>
                <td class="text-center"><strong>{{ item.horas }}</strong></td>
                <td>
                  <div class="state-main">{{ item.estado }}</div>
                  <div class="state-sub">Propuesta finalizada</div>
                </td>
                <td class="text-right">
                  <button
                    type="button"
                    class="cert-btn"
                    @click="certificadoActivo = item"
                  >
                    Certificado
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Modal de vista previa del Certificado Institucional -->
    <div v-if="certificadoActivo" class="modal-overlay" @click.self="certificadoActivo = null">
      <div class="cert-modal">
        <div class="cert-modal-header">
          <h3>Certificado de Horas Sociales (CIECYT)</h3>
          <button type="button" class="close-btn" aria-label="Cerrar" @click="certificadoActivo = null">
            <X :size="18" />
          </button>
        </div>

        <div class="cert-preview">
          <div class="cert-institution">INSTITUCIÓN UNIVERSITARIA DEL PUTUMAYO</div>
          <div class="cert-subtitle">Centro de Investigación, Extensión y Proyección Social · CIECYT</div>
          <p class="cert-body">
            Certifica que <strong>{{ estudianteMock.nombreCompleto }}</strong>, identificado(a) con documento
            <strong>{{ estudianteMock.identificacion }}</strong>, estudiante del programa
            <strong>{{ estudianteMock.programaActual.programa }}</strong>, cumplió satisfactoriamente con
            <strong>{{ certificadoActivo.horas }} horas</strong> de proyección social en la propuesta:
          </p>
          <blockquote class="cert-project">“{{ certificadoActivo.titulo }}”</blockquote>
          <div class="cert-meta">
            <span><strong>Periodo:</strong> {{ certificadoActivo.periodo }}</span>
            <span><strong>Supervisor:</strong> {{ certificadoActivo.supervisor }}</span>
          </div>
        </div>

        <div class="cert-modal-actions">
          <button type="button" class="btn-outline" @click="certificadoActivo = null">Cerrar</button>
          <button type="button" class="btn-primary" @click="imprimirCertificado">
            Imprimir / Guardar PDF
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { X } from 'lucide-vue-next'
import { estudianteMock, horasSocialesMock } from '@/data/mockData'

const certificadoActivo = ref(null)

const participaciones = computed(() => [
  {
    ...horasSocialesMock.participaciones[0],
    titulo:
      'Desarrollo de una plataforma web institucional para fortalecer la comunicación, transparencia y participación comunitaria en proyectos de impacto regional'
  }
])

const porcentajeHoras = computed(() =>
  Math.min(100, Math.round((horasSocialesMock.acumuladas / horasSocialesMock.requeridas) * 100))
)

function imprimirCertificado() {
  window.print()
}
</script>

<style scoped>
.intro-copy {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.section-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-heading {
  margin: 28px 0 14px;
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

.program-sub {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 2px;
}

.hours-count-line {
  font-size: 0.92rem;
  color: var(--text-primary);
}

.status-complete {
  color: #4d7c0f;
  font-weight: 700;
}

:root.dark .status-complete {
  color: #bef264;
}

.progress-track {
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background-color: var(--border-color);
  overflow: hidden;
  margin-top: 2px;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  background-color: #185686;
}

:root.dark .progress-fill {
  background-color: #38bdf8;
}

/* Tabla MIS PROPUESTAS */
.table-card {
  margin-top: 4px;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.ciecyt-table {
  width: 100%;
  table-layout: auto;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.ciecyt-table thead th {
  background-color: #dce7f2;
  color: #1e293b;
  font-weight: 700;
  font-size: 0.78rem;
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
  white-space: nowrap;
}

.ciecyt-table thead th:first-child,
.ciecyt-table tbody td:first-child {
  width: 44%;
  min-width: 240px;
}

.ciecyt-table tbody td:not(:first-child) {
  white-space: nowrap;
  padding: 11px 10px;
}

:root.dark .ciecyt-table thead th {
  background-color: #1e324a;
  color: #e2e8f0;
}

.ciecyt-table tbody td {
  padding: 12px 12px;
  font-size: 0.85rem;
  line-height: 1.35;
  border-bottom: 1px solid var(--border-color);
  vertical-align: middle;
}

.ciecyt-table tbody tr:last-child td {
  border-bottom: none;
}

.prop-title {
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.35;
}

.prop-sub,
.sup-mail,
.state-sub {
  font-size: 0.76rem;
  color: var(--text-secondary);
  margin-top: 2px;
}

.sup-name {
  font-weight: 500;
  text-transform: uppercase;
}

.state-main {
  font-weight: 700;
  color: #4d7c0f;
}

:root.dark .state-main {
  color: #bef264;
}

.text-center {
  text-align: center !important;
}

.text-right {
  text-align: right !important;
}

.cert-btn {
  border: 1px solid #185686;
  color: #185686;
  background: var(--bg-surface);
  border-radius: 6px;
  padding: 6px 14px;
  font-size: 0.84rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
}

:root.dark .cert-btn {
  border-color: var(--text-brand);
  color: var(--text-brand);
}

.cert-btn:hover {
  background-color: var(--bg-surface-muted);
}

/* Modal Certificado */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.52);
  display: grid;
  place-items: center;
  padding: 16px;
  z-index: 65;
}

.cert-modal {
  width: 100%;
  max-width: 560px;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow-md);
}

.cert-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.cert-modal-header h3 {
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

.cert-preview {
  border: 1px dashed #185686;
  border-radius: var(--radius-sm);
  background: var(--bg-surface-muted);
  padding: 18px;
  text-align: center;
}

.cert-institution {
  font-weight: 700;
  font-size: 0.96rem;
  color: #185686;
}

:root.dark .cert-institution {
  color: var(--text-brand);
}

.cert-subtitle {
  font-size: 0.78rem;
  color: var(--text-secondary);
  margin-top: 2px;
}

.cert-body {
  margin: 14px 0 10px;
  font-size: 0.88rem;
  line-height: 1.5;
}

.cert-project {
  margin: 0 0 12px;
  font-style: italic;
  font-weight: 600;
  font-size: 0.88rem;
}

.cert-meta {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.cert-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
}
</style>
