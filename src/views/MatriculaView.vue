<template>
  <div class="page-stack">
    <section class="card">
      <div class="header-line">
        <div>
          <h2 class="card-title" style="margin-bottom: 4px;">Requisitos de Inscripción y Matrícula</h2>
          <p class="muted-text" style="margin: 0;">
            Periodo {{ requisitosMatriculaMock.periodo }} · {{ requisitosMatriculaMock.sede }} · {{ requisitosMatriculaMock.semestre }}
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
import { requisitosMatriculaMock } from '@/data/mockData'
</script>

<style scoped>
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
