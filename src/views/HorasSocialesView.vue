<template>
  <div class="page-stack">
    <!-- Encabezado Descriptivo Superior -->
    <p class="intro-copy">
      Tus participaciones en propuestas de horas sociales del Ciecyt. Las horas cuentan cuando cumples tu parte y el Ciecyt finaliza la propuesta.
    </p>

    <!-- Bloque de Progreso del Programa -->
    <section class="section-block">
      <h2 class="section-heading">{{ estudianteMock.programaActual.programa }}</h2>
      <div class="program-sub">
        {{ estudianteMock.programaActual.ciclo }} · SNIES {{ estudianteMock.programaActual.snies }}
      </div>
      <div class="hours-count-row">
        <div class="hours-count-line">
          <strong>{{ horasSocialesMock.acumuladas }}</strong> de {{ horasSocialesMock.requeridas }} horas ·
          <span class="status-complete">
            {{ horasSocialesMock.completo ? 'Completo' : 'En progreso' }}
          </span>
        </div>
        <span class="verify-code-tag">Código de verificación: {{ CODIGO_VERIFICACION }}</span>
      </div>
      <div class="progress-track" role="progressbar" :aria-valuenow="porcentajeHoras" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-fill" :style="{ width: `${porcentajeHoras}%` }" />
      </div>
    </section>

    <!-- Sección MIS PROPUESTAS -->
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
                    @click="abrirCertificadoOficial(item)"
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
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { estudianteMock, horasSocialesMock } from '@/data/mockData'

const CODIGO_VERIFICACION = 'CIECYT-2026-8841'

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

function abrirCertificadoOficial(item) {
  const p = estudianteMock.programaActual
  const hoy = new Date()
  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ]
  const fechaFormal = `Expedido en Mocoa, Putumayo, a los ${hoy.getDate()} días del mes de ${meses[hoy.getMonth()]} de ${hoy.getFullYear()}`

  const html = `<!DOCTYPE html>
  <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>Constancia de Horas Sociales (CIECYT) · ${CODIGO_VERIFICACION}</title>
      <style>
        * { box-sizing: border-box; }
        body {
          margin: 0;
          padding: 0;
          background-color: #323639;
          font-family: 'Fira Sans', Arial, sans-serif;
          color: #111827;
        }
        .viewer-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 52px;
          background-color: #202124;
          color: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
          z-index: 100;
        }
        .viewer-title { font-size: 0.92rem; font-weight: 600; }
        .print-btn {
          background-color: #185686;
          color: #ffffff;
          border: none;
          border-radius: 6px;
          padding: 8px 16px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
        }
        .print-btn:hover { background-color: #0f4766; }
        .sheet {
          width: 816px;
          min-height: 1056px;
          background: #ffffff;
          color: #111827;
          padding: 56px 64px;
          margin: 76px auto 32px;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.45);
          display: flex;
          flex-direction: column;
        }
        .inst-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          padding-bottom: 16px;
          border-bottom: 2px solid #185686;
          margin-bottom: 34px;
        }
        .brand-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .brand-texts h2 {
          margin: 0;
          font-size: 1rem;
          font-weight: 800;
          color: #185686;
        }
        .brand-texts p {
          margin: 2px 0 0;
          font-size: 0.72rem;
          font-weight: 600;
          color: #334155;
        }
        .letterhead-right {
          text-align: right;
          font-size: 0.74rem;
          line-height: 1.4;
          color: #334155;
          font-weight: 600;
        }
        .solemn-title {
          text-align: center;
          font-size: 0.96rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 8px;
        }
        .hace-constar {
          text-align: center;
          font-size: 1.2rem;
          font-weight: 800;
          color: #185686;
          margin: 0 0 28px;
          letter-spacing: 0.04em;
        }
        .formal-body {
          margin: 0 0 28px;
          font-size: 0.96rem;
          line-height: 1.75;
          text-align: justify;
        }
        .tech-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.84rem;
          margin-bottom: 36px;
        }
        .tech-table td {
          border: 1px solid #cbd5e1;
          padding: 10px 12px;
          vertical-align: top;
        }
        .tech-label {
          width: 30%;
          background-color: #f8fafc;
          font-weight: 700;
          color: #334155;
        }
        .issue-date {
          font-size: 0.88rem;
          color: #334155;
          margin: 0 0 64px;
        }
        .signature-block {
          margin-top: auto;
          text-align: center;
        }
        .sig-line {
          width: 340px;
          margin: 0 auto 8px;
          border-top: 1.5px solid #1e293b;
        }
        .sig-title {
          font-size: 0.84rem;
          font-weight: 700;
          color: #111827;
        }
        .sig-sub {
          font-size: 0.78rem;
          color: #475569;
          margin-top: 2px;
        }
        .verify-footer {
          margin-top: 28px;
          padding-top: 12px;
          border-top: 1px solid #cbd5e1;
          font-size: 0.74rem;
          color: #475569;
          text-align: center;
          font-weight: 600;
        }
        @media print {
          .no-print { display: none !important; }
          body { background: #ffffff; }
          .sheet {
            width: 100%;
            min-height: auto;
            margin: 0;
            padding: 0;
            box-shadow: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="viewer-bar no-print">
        <span class="viewer-title">Vista previa — Constancia de Horas Sociales (CIECYT)</span>
        <button class="print-btn" onclick="window.print()">Imprimir / Guardar como PDF</button>
      </div>

      <main class="sheet">
        <header class="inst-header">
          <div class="brand-left">
            <svg width="42" height="46" viewBox="0 0 42 46" fill="none" aria-label="Logo UNIPUTUMAYO">
              <circle cx="21" cy="11" r="6" fill="#80BF1F" />
              <circle cx="21" cy="11" r="3" fill="#F5A51D" />
              <path d="M7 15V27C7 35.28 13.27 41.5 21 41.5C28.73 41.5 35 35.28 35 27V15H28.5V27C28.5 31.69 25.14 35 21 35C16.86 35 13.5 31.69 13.5 27V15H7Z" fill="#185686" />
            </svg>
            <div class="brand-texts">
              <h2>UNIPUTUMAYO</h2>
              <p>INSTITUCIÓN UNIVERSITARIA DEL PUTUMAYO</p>
              <p>NIT. 800.247.940</p>
            </div>
          </div>

          <div class="letterhead-right">
            <div>CENTRO DE INVESTIGACIÓN, EXTENSIÓN Y PROYECCIÓN SOCIAL · CIECYT</div>
            <div>Sede Mocoa · Putumayo</div>
          </div>
        </header>

        <h1 class="solemn-title">EL CENTRO DE INVESTIGACIÓN, EXTENSIÓN Y PROYECCIÓN SOCIAL (CIECYT)</h1>
        <h2 class="hace-constar">HACE CONSTAR QUE:</h2>

        <p class="formal-body">
          <strong>${estudianteMock.nombreCompleto}</strong>, identificado(a) con cédula de ciudadanía N.°
          <strong>${estudianteMock.identificacion}</strong>, estudiante activo(a) del programa
          <strong>${p.programa}</strong> (SNIES ${p.snies}), cumplió satisfactoriamente con el requisito de
          <strong>sesenta (${item.horas}) horas</strong> de proyección social comunitaria en el periodo académico
          <strong>${item.periodo}</strong>.
        </p>

        <table class="tech-table">
          <tbody>
            <tr>
              <td class="tech-label">Proyecto / Propuesta</td>
              <td>${item.titulo}</td>
            </tr>
            <tr>
              <td class="tech-label">Supervisor Académico</td>
              <td>${item.supervisor} (${item.supervisorCorreo})</td>
            </tr>
            <tr>
              <td class="tech-label">Intensidad Certificada</td>
              <td>${item.horas} Horas (100% Cumplido)</td>
            </tr>
            <tr>
              <td class="tech-label">Estado Final</td>
              <td><strong>APROBADO Y FINALIZADO</strong></td>
            </tr>
          </tbody>
        </table>

        <p class="issue-date">${fechaFormal}.</p>

        <div class="signature-block">
          <div class="sig-line"></div>
          <div class="sig-title">COORDINACIÓN GENERAL DE PROYECCIÓN SOCIAL · CIECYT</div>
          <div class="sig-sub">Institución Universitaria del Putumayo</div>
        </div>

        <div class="verify-footer">
          Código de verificación digital: ${CODIGO_VERIFICACION}
        </div>
      </main>
    </body>
  </html>`

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank', 'noopener,noreferrer')
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
  margin: 18px 0 6px;
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

.hours-count-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.hours-count-line {
  font-size: 0.92rem;
  color: var(--text-primary);
}

.verify-code-tag {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-secondary);
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
</style>
