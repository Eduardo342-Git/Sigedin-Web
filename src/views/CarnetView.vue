<template>
  <div class="carnet-page">
    <article class="carnet-card">
      <!-- Cabecera institucional -->
      <header class="carnet-header">
        <img src="/logo-blanco.png" alt="UniPutumayo" class="carnet-logo" />
        <div class="carnet-badge-title">CARNET ESTUDIANTIL DIGITAL</div>
      </header>
      <div class="carnet-stripe" aria-hidden="true" />

      <!-- Foto / Avatar -->
      <div class="carnet-body">
        <div class="carnet-photo-frame">
          <img v-if="fotoCarnet" :src="fotoCarnet" alt="Foto del estudiante" class="carnet-photo" />
          <span v-else class="carnet-initials">{{ estudianteMock.iniciales }}</span>
        </div>

        <h2 class="carnet-name">{{ estudianteMock.nombreCompleto }}</h2>
        <span class="carnet-status">VIGENTE · PERIODO {{ estudianteMock.programaActual.periodo }}</span>

        <div class="carnet-details">
          <div class="detail-item">
            <span class="detail-label">ID / Documento</span>
            <strong>{{ estudianteMock.identificacion }}</strong>
          </div>
          <div class="detail-item">
            <span class="detail-label">Programa</span>
            <strong>{{ estudianteMock.programaActual.programa }}</strong>
          </div>
          <div class="detail-row-2">
            <div class="detail-item">
              <span class="detail-label">Código</span>
              <strong>{{ estudianteMock.programaActual.codigoEstudiante }}</strong>
            </div>
            <div class="detail-item">
              <span class="detail-label">Sede</span>
              <strong>{{ estudianteMock.programaActual.sede }}</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Pie del Carnet con QR simulado -->
      <footer class="carnet-footer">
        <svg class="qr-svg" viewBox="0 0 100 100" aria-label="Código QR estudiantil">
          <rect width="100" height="100" fill="#ffffff" rx="6" />
          <!-- Esquinas QR -->
          <rect x="8" y="8" width="24" height="24" fill="none" stroke="#0f172a" stroke-width="4" />
          <rect x="15" y="15" width="10" height="10" fill="#0f172a" />
          <rect x="68" y="8" width="24" height="24" fill="none" stroke="#0f172a" stroke-width="4" />
          <rect x="75" y="15" width="10" height="10" fill="#0f172a" />
          <rect x="8" y="68" width="24" height="24" fill="none" stroke="#0f172a" stroke-width="4" />
          <rect x="15" y="75" width="10" height="10" fill="#0f172a" />
          <!-- Módulos de datos -->
          <rect x="40" y="10" width="6" height="6" fill="#0f172a" />
          <rect x="52" y="10" width="8" height="6" fill="#0f172a" />
          <rect x="40" y="22" width="12" height="6" fill="#0f172a" />
          <rect x="10" y="40" width="8" height="6" fill="#0f172a" />
          <rect x="24" y="40" width="10" height="6" fill="#0f172a" />
          <rect x="40" y="40" width="18" height="18" fill="#185686" rx="2" />
          <rect x="64" y="40" width="8" height="8" fill="#0f172a" />
          <rect x="78" y="40" width="12" height="6" fill="#0f172a" />
          <rect x="10" y="52" width="12" height="8" fill="#0f172a" />
          <rect x="64" y="54" width="10" height="6" fill="#0f172a" />
          <rect x="80" y="52" width="10" height="10" fill="#0f172a" />
          <rect x="40" y="66" width="8" height="8" fill="#0f172a" />
          <rect x="54" y="66" width="10" height="6" fill="#0f172a" />
          <rect x="40" y="80" width="14" height="10" fill="#0f172a" />
          <rect x="62" y="78" width="12" height="12" fill="#0f172a" />
          <rect x="80" y="70" width="10" height="18" fill="#0f172a" />
        </svg>
        <div class="qr-code-text">CÓD. {{ estudianteMock.programaActual.codigoEstudiante }}</div>
      </footer>
    </article>

    <button type="button" class="print-carnet-btn" @click="imprimirCarnet">
      <Printer :size="17" />
      <span>Descargar / Imprimir Carnet</span>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Printer } from 'lucide-vue-next'
import { estudianteMock } from '@/data/mockData'

const fotoCarnet = ref(localStorage.getItem('sigedin_carnet_foto') || '')

function imprimirCarnet() {
  window.print()
}
</script>

<style scoped>
.carnet-page {
  max-width: 420px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.carnet-card {
  width: 100%;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.carnet-header {
  background-color: #185686;
  color: #ffffff;
  padding: 18px 20px 14px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.carnet-logo {
  max-width: 155px;
  height: auto;
}

.carnet-badge-title {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  opacity: 0.94;
}

.carnet-stripe {
  height: 4px;
  background: linear-gradient(90deg, var(--color-green) 0 18%, var(--color-amber) 18% 100%);
}

.carnet-body {
  padding: 20px 22px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.carnet-photo-frame {
  width: 108px;
  height: 108px;
  border-radius: 14px;
  background-color: #185686;
  color: #ffffff;
  display: grid;
  place-items: center;
  overflow: hidden;
  border: 3px solid var(--border-color);
  margin-bottom: 14px;
}

.carnet-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carnet-initials {
  font-size: 2rem;
  font-weight: 700;
}

.carnet-name {
  margin: 0;
  font-size: 1.08rem;
  font-weight: 700;
  color: var(--text-primary);
}

.carnet-status {
  margin-top: 8px;
  display: inline-block;
  padding: 3px 12px;
  border-radius: 999px;
  font-size: 0.74rem;
  font-weight: 700;
  background-color: rgba(101, 163, 13, 0.16);
  color: #4d7c0f;
}

:root.dark .carnet-status {
  color: #bef264;
}

.carnet-details {
  width: 100%;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
}

.detail-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  font-size: 0.85rem;
}

.detail-label {
  font-size: 0.74rem;
  color: var(--text-secondary);
}

.carnet-footer {
  background-color: var(--bg-surface-muted);
  border-top: 1px solid var(--border-color);
  padding: 14px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.qr-svg {
  width: 88px;
  height: 88px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.qr-code-text {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
}

.print-carnet-btn {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background-color: #185686;
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
}

.print-carnet-btn:hover {
  background-color: #0f4766;
}
</style>
