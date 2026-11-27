<template>
  <div class="paz-container">
    <section class="paz-section">
      <h2 class="section-heading">GENERAR PAZ Y SALVO</h2>

      <p class="paz-desc">
        Se genera el paz y salvo del semestre en curso. Elige el programa y la matrícula.
        Se genera un PDF que debes imprimir y llevar a firmar a cada dependencia.
      </p>

      <form class="paz-form" @submit.prevent="generarCertificado">
        <div class="field-group">
          <label for="paz-programa">Programa académico</label>
          <select id="paz-programa" v-model="programaSeleccionado" class="paz-select">
            <option value="UNIP-MOCOATECNOLOGIA EN DESARROLLO DE SOFTWARE (2026-2)">
              UNIP-MOCOATECNOLOGIA EN DESARROLLO DE SOFTWARE (2026-2)
            </option>
          </select>
        </div>

        <div class="field-group">
          <label for="paz-matricula">Matrícula semestre</label>
          <select id="paz-matricula" v-model="matriculaSeleccionada" class="paz-select">
            <option value="2026-2 SEXTO SEMESTRE">
              2026-2 SEXTO SEMESTRE
            </option>
          </select>
        </div>

        <button type="submit" class="paz-submit-btn">
          Generar Paz y Salvo
        </button>
      </form>
    </section>

    <!-- Vista previa del certificado generado -->
    <section v-if="certificadoVisible" class="card cert-preview-card">
      <div class="cert-top">
        <div>
          <h3 class="cert-title">Certificado de Paz y Salvo</h3>
          <p class="muted-text" style="margin: 2px 0 0;">
            {{ estudianteMock.nombreCompleto }} · {{ estudianteMock.identificacion }} · {{ matriculaSeleccionada }}
          </p>
        </div>
        <span class="badge badge-success">Al día en todas las dependencias</span>
      </div>

      <div class="table-wrap" style="margin-top: 14px;">
        <table class="data-table">
          <thead>
            <tr>
              <th>Dependencia</th>
              <th>Observación</th>
              <th>Estado</th>
              <th>Firma / Sello</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="dep in pazYSalvoMock.dependencias" :key="dep.clave">
              <td><strong>{{ dep.nombre }}</strong></td>
              <td>{{ dep.observacion }}</td>
              <td><span class="badge badge-success">Al día</span></td>
              <td class="muted-text">_________________</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="cert-actions">
        <button type="button" class="btn-outline" @click="imprimirPdf">
          Imprimir / Guardar PDF
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { estudianteMock, pazYSalvoMock } from '@/data/mockData'

const programaSeleccionado = ref('UNIP-MOCOATECNOLOGIA EN DESARROLLO DE SOFTWARE (2026-2)')
const matriculaSeleccionada = ref('2026-2 SEXTO SEMESTRE')
const certificadoVisible = ref(false)

function generarCertificado() {
  certificadoVisible.value = true
}

function imprimirPdf() {
  window.print()
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

.paz-desc {
  margin: 0;
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.paz-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 4px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-group label {
  font-size: 0.86rem;
  font-weight: 700;
  color: var(--text-primary);
}

.paz-select {
  width: 100%;
  appearance: none;
  background-color: var(--bg-surface);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 10px 36px 10px 12px;
  font-size: 0.9rem;
  font-family: inherit;
  cursor: pointer;
  background-image: linear-gradient(45deg, transparent 50%, var(--text-secondary) 50%),
    linear-gradient(135deg, var(--text-secondary) 50%, transparent 50%);
  background-position: calc(100% - 16px) 17px, calc(100% - 11px) 17px;
  background-size: 5px 5px, 5px 5px;
  background-repeat: no-repeat;
}

.paz-submit-btn {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 6px;
  background-color: #185686;
  color: #ffffff;
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
}

.paz-submit-btn:hover {
  background-color: #0f4766;
}

.cert-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  flex-wrap: wrap;
}

.cert-title {
  margin: 0;
  font-size: 1rem;
  color: var(--text-brand);
}

.cert-actions {
  margin-top: 14px;
  display: flex;
  justify-content: flex-end;
}
</style>
