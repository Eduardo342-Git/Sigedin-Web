<template>
  <div class="paz-container">
    <section class="paz-section">
      <h2 class="section-heading">
        PAZ Y SALVO POR DEPENDENCIAS · PERIODO {{ matriculaActual.periodo }}
      </h2>

      <p class="intro-copy">
        Se genera el paz y salvo del semestre seleccionado. Puedes consultar el estado por dependencia o descargar el documento oficial para firma.
      </p>

      <!-- Selectores de Consulta (2 columnas) -->
      <div class="form-row-2">
        <div>
          <label for="paz-programa" class="form-label">Programa académico</label>
          <select id="paz-programa" v-model="programaSeleccionado" class="form-control">
            <option value="UNIP-MOCOA TECNOLOGIA EN DESARROLLO DE SOFTWARE (2026-2)">
              UNIP-MOCOA TECNOLOGIA EN DESARROLLO DE SOFTWARE (2026-2)
            </option>
          </select>
        </div>

        <div>
          <label for="paz-matricula" class="form-label">Matrícula semestre</label>
          <select id="paz-matricula" v-model="matriculaKey" class="form-control">
            <option v-for="m in matriculasDisponibles" :key="m.key" :value="m.key">
              {{ m.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- Tarjeta resumen con borde izquierdo verde -->
      <article class="paz-summary-card">
        <div class="paz-summary-left">
          <span class="badge badge-success">Al día en todas las dependencias</span>
          <p class="paz-desc">
            {{ estudianteMock.programaActual.programa }} · {{ matriculaActual.semestre }} · Periodo {{ matriculaActual.periodo }}
          </p>
        </div>

        <button type="button" class="paz-download-btn" @click="abrirPazYSalvoOficial">
          <Download :size="16" />
          <span>Descargar Paz y Salvo</span>
        </button>
      </article>

      <!-- Tabla de estado por dependencia -->
      <div class="table-card">
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Dependencia</th>
                <th>Observación</th>
                <th style="text-align: center;">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="dep in dependenciasOficiales" :key="dep.clave">
                <td><strong>{{ dep.nombre }}</strong></td>
                <td>{{ dep.observacion }}</td>
                <td style="text-align: center;">
                  <span class="badge badge-success">Al día</span>
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
import { computed, ref } from 'vue'
import { Download } from 'lucide-vue-next'
import { estudianteMock, pazYSalvoMock } from '@/data/mockData'

const CODIGO_VERIFICACION = `PYS-2026-${estudianteMock.identificacion}`

const matriculasDisponibles = [
  { key: '2026-2', periodo: '2026-2', semestre: 'SEXTO SEMESTRE', label: '2026-2 SEXTO SEMESTRE' },
  { key: '2026-1', periodo: '2026-1', semestre: 'QUINTO SEMESTRE', label: '2026-1 QUINTO SEMESTRE' },
  { key: '2025-2', periodo: '2025-2', semestre: 'CUARTO SEMESTRE', label: '2025-2 CUARTO SEMESTRE' }
]

const programaSeleccionado = ref('UNIP-MOCOA TECNOLOGIA EN DESARROLLO DE SOFTWARE (2026-2)')
const matriculaKey = ref('2026-2')

const matriculaActual = computed(
  () => matriculasDisponibles.find((m) => m.key === matriculaKey.value) || matriculasDisponibles[0]
)

const dependenciasOficiales = pazYSalvoMock.dependencias.map((d) => ({
  ...d,
  nombre:
    d.nombre === 'Bienestar universitario'
      ? 'Bienestar Universitario'
      : d.nombre === 'Sala de cómputo'
        ? 'Sala de Cómputo'
        : d.nombre
}))

function abrirPazYSalvoOficial() {
  const p = estudianteMock.programaActual
  const m = matriculaActual.value
  const hoy = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const filas = dependenciasOficiales
    .map(
      (d, idx) => `
      <tr>
        <td style="text-align:center;">${idx + 1}</td>
        <td><strong>${d.nombre}</strong></td>
        <td>${d.observacion}</td>
        <td style="text-align:center;"><strong>AL DÍA</strong></td>
        <td style="text-align:center; color:#64748b;">____________________</td>
      </tr>
    `
    )
    .join('')

  const html = `<!DOCTYPE html>
  <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>Paz y Salvo · ${m.periodo}</title>
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
        .sheet {
          width: 816px;
          min-height: 1056px;
          background: #ffffff;
          color: #111827;
          padding: 52px 60px;
          margin: 76px auto 32px;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.45);
          display: flex;
          flex-direction: column;
        }
        .inst-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 14px;
          border-bottom: 2px solid #185686;
          margin-bottom: 24px;
        }
        .brand-left { display: flex; align-items: center; gap: 12px; }
        .brand-texts h2 { margin: 0; font-size: 1rem; font-weight: 800; color: #185686; }
        .brand-texts p { margin: 2px 0 0; font-size: 0.72rem; font-weight: 600; color: #334155; }
        .doc-title {
          text-align: center;
          color: #185686;
          font-size: 1.15rem;
          font-weight: 800;
          margin: 0 0 16px;
          text-transform: uppercase;
        }
        .info-box {
          border: 1px solid #cbd5e1;
          background: #f8fafc;
          border-radius: 6px;
          padding: 12px 16px;
          font-size: 0.82rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px 18px;
          margin-bottom: 22px;
        }
        table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
        th {
          background: #185686;
          color: #ffffff;
          padding: 9px 10px;
          border: 1px solid #185686;
          text-align: left;
        }
        td { border: 1px solid #cbd5e1; padding: 11px 10px; }
        .validity-box {
          margin-top: auto;
          padding-top: 16px;
          border-top: 1px solid #cbd5e1;
          font-size: 0.76rem;
          color: #475569;
          line-height: 1.5;
        }
        .footer-note {
          margin-top: 10px;
          font-size: 0.78rem;
          font-weight: 600;
          color: #185686;
          display: flex;
          justify-content: space-between;
        }
        @media print {
          .no-print { display: none !important; }
          body { background: #ffffff; }
          .sheet { width: 100%; min-height: auto; margin: 0; padding: 0; box-shadow: none; }
        }
      </style>
    </head>
    <body>
      <div class="viewer-bar no-print">
        <span class="viewer-title">Vista previa — Paz y Salvo Institucional</span>
        <button class="print-btn" onclick="window.print()">Imprimir / Guardar como PDF</button>
      </div>
      <main class="sheet">
        <header class="inst-header">
          <div class="brand-left">
            <svg width="42" height="46" viewBox="0 0 42 46" fill="none">
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
          <div style="font-size:0.75rem; font-weight:600; color:#334155; text-align:right;">
            <div>Registro y Control Académico</div>
            <div>Sede ${p.sede}</div>
          </div>
        </header>

        <h1 class="doc-title">PAZ Y SALVO POR DEPENDENCIAS · PERIODO ${m.periodo}</h1>

        <div class="info-box">
          <div><strong>Estudiante:</strong> ${estudianteMock.nombreCompleto}</div>
          <div><strong>Identificación:</strong> ${estudianteMock.identificacion}</div>
          <div><strong>Programa:</strong> ${p.programa}</div>
          <div><strong>Código:</strong> ${p.codigoEstudiante}</div>
          <div><strong>Semestre:</strong> ${m.semestre}</div>
          <div><strong>Estado general:</strong> AL DÍA EN TODAS LAS DEPENDENCIAS</div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="text-align:center;">#</th>
              <th>Dependencia</th>
              <th>Observación</th>
              <th style="text-align:center;">Estado</th>
              <th style="text-align:center;">Firma / Sello</th>
            </tr>
          </thead>
          <tbody>${filas}</tbody>
        </table>

        <div class="validity-box">
          <strong>Nota de validez administrativa:</strong> Este documento certifica que el estudiante se encuentra
          al día con sus obligaciones institucionales en las dependencias listadas para el periodo ${m.periodo}.
          Su validez está sujeta a la verificación del código único institucional ante Registro y Control Académico.
          <div class="footer-note">
            <span>Código de verificación: ${CODIGO_VERIFICACION}</span>
            <span>Expedido el ${hoy}</span>
          </div>
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
.paz-container {
  max-width: 880px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.paz-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-heading {
  margin: 0;
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

.intro-copy {
  margin: 0;
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.paz-summary-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-left: 4px solid #65a30d;
  border-radius: 10px;
  box-shadow: var(--shadow-sm);
  padding: 18px 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
}

.paz-summary-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}

.paz-desc {
  margin: 0;
  font-size: 0.84rem;
  color: var(--text-secondary);
}

.paz-download-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background-color: #185686;
  color: #ffffff;
  font-size: 0.86rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
}

.paz-download-btn:hover {
  background-color: #0f4766;
}

.table-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}
</style>
