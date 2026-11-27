<template>
  <div class="page-stack">
    <section class="card">
      <div class="header-line">
        <div>
          <h2 class="req-title">Requisitos de matrícula</h2>
          <p class="req-subtitle">
            {{ estudianteMock.programaActual.programa }} · {{ requisitosMatriculaMock.periodo }} · {{ requisitosMatriculaMock.semestre }}
          </p>
        </div>
        <span class="badge badge-success">{{ requisitosMatriculaMock.estadoGeneral }}</span>
      </div>
      <p class="notice-box">{{ requisitosMatriculaMock.motivo }}</p>
    </section>

    <section class="card">
      <h3 class="card-title">Documentos cargados</h3>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Documento</th>
              <th>Fecha de revisión</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="doc in requisitosMatriculaMock.documentos" :key="doc.id">
              <td>{{ doc.nombre }}</td>
              <td>{{ doc.fecha }}</td>
              <td><span class="badge badge-success">{{ doc.estado }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { estudianteMock, requisitosMatriculaMock } from '@/data/mockData'
</script>

<style scoped>
.req-title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: #185686;
}

:root.dark .req-title {
  color: var(--text-brand);
}

.req-subtitle {
  margin: 4px 0 0;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--text-secondary);
}

.header-line {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  flex-wrap: wrap;
}

.notice-box {
  margin: 14px 0 0;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  background: var(--bg-surface-muted);
  border-left: 4px solid var(--color-amber);
  font-size: 0.9rem;
}
</style>
