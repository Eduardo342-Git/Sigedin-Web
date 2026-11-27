<template>
  <div class="page-stack">
    <section class="card">
      <div class="welcome-row">
        <div>
          <span class="badge badge-success">{{ estudianteMock.programaActual.estado }}</span>
          <h2 class="welcome-title">{{ estudianteMock.nombreCompleto }}</h2>
          <p class="muted-text" style="margin: 4px 0 0;">
            {{ estudianteMock.programaActual.programa }} · {{ estudianteMock.programaActual.semestre }}
          </p>
        </div>
        <div class="student-meta">
          <div><strong>Código:</strong> {{ estudianteMock.programaActual.codigoEstudiante }}</div>
          <div><strong>Sede:</strong> {{ estudianteMock.programaActual.sede }} ({{ estudianteMock.programaActual.jornada }})</div>
          <div><strong>Periodo:</strong> {{ estudianteMock.programaActual.periodo }}</div>
        </div>
      </div>
    </section>

    <section class="grid-cards">
      <div class="stat-card">
        <div class="stat-label">Promedio Semestre Actual</div>
        <div class="stat-value">{{ boletinMock.resumen.promedioSemestre.toFixed(1) }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Promedio Ponderado</div>
        <div class="stat-value">{{ boletinMock.resumen.promedioPonderado.toFixed(1) }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Créditos Matriculados</div>
        <div class="stat-value">{{ boletinMock.resumen.totalCreditos }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Avance Plan de Estudios</div>
        <div class="stat-value">{{ planEstudiosMock.resumen.avance }}%</div>
      </div>
    </section>

    <section class="card">
      <h3 class="card-title">Horario Semanal · Periodo {{ horarioMock.periodo }}</h3>
      <div class="schedule-grid">
        <div v-for="dia in horarioMock.dias" :key="dia.dia" class="day-card">
          <div class="day-header">{{ dia.nombre }}</div>
          <div v-for="(bloque, idx) in dia.bloques" :key="idx" class="block-item">
            <div class="block-time">{{ bloque.inicio }} - {{ bloque.fin }}</div>
            <div class="block-subject">{{ bloque.unidad }}</div>
            <div class="block-meta">{{ bloque.docente }}</div>
            <div class="block-meta">{{ bloque.salon }}</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { boletinMock, estudianteMock, horarioMock, planEstudiosMock } from '@/data/mockData'
</script>

<style scoped>
.welcome-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
}

.welcome-title {
  margin: 8px 0 0;
  font-size: 1.25rem;
}

.student-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.88rem;
  color: var(--text-secondary);
}

.schedule-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.day-card {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--bg-surface-muted);
}

.day-header {
  background: var(--color-primary);
  color: #ffffff;
  font-weight: 600;
  font-size: 0.88rem;
  padding: 8px 12px;
}

.block-item {
  padding: 10px 12px;
  border-top: 1px solid var(--border-color);
}

.block-item:first-of-type {
  border-top: none;
}

.block-time {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text-brand);
}

.block-subject {
  font-size: 0.88rem;
  font-weight: 600;
  margin: 2px 0;
}

.block-meta {
  font-size: 0.78rem;
  color: var(--text-secondary);
}
</style>
