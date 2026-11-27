<template>
  <div class="page-stack">
    <section class="card">
      <h2 class="card-title">{{ planEstudiosMock.programa }} ({{ planEstudiosMock.plan }})</h2>
      <div class="grid-cards">
        <div class="stat-card">
          <div class="stat-label">Avance académico</div>
          <div class="stat-value">{{ planEstudiosMock.resumen.avance }}%</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Créditos aprobados</div>
          <div class="stat-value">
            {{ planEstudiosMock.resumen.creditosAprobados }} / {{ planEstudiosMock.resumen.creditosTotal }}
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Unidades aprobadas</div>
          <div class="stat-value">
            {{ planEstudiosMock.resumen.unidadesAprobadas }} / {{ planEstudiosMock.resumen.unidadesTotal }}
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Unidades en curso</div>
          <div class="stat-value">{{ planEstudiosMock.resumen.unidadesEnCurso }}</div>
        </div>
      </div>
    </section>

    <section v-for="semestre in planEstudiosMock.semestres" :key="semestre.id" class="card">
      <div class="sem-header">
        <h3 class="card-title" style="margin: 0;">{{ semestre.nombre }}</h3>
        <span class="badge badge-info">{{ semestre.creditos }} créditos</span>
      </div>
      <div class="units-grid">
        <div v-for="unidad in semestre.unidades" :key="unidad.codigo" class="unit-card">
          <div class="unit-top">
            <span class="unit-code">{{ unidad.codigo }}</span>
            <span
              class="badge"
              :class="unidad.estado === 'aprobada' ? 'badge-success' : 'badge-warning'"
            >
              {{ unidad.estado === 'aprobada' ? `Aprobada (${unidad.nota})` : 'En curso' }}
            </span>
          </div>
          <div class="unit-name">{{ unidad.nombre }}</div>
          <div class="unit-meta">{{ unidad.creditos }} créditos · Periodo {{ unidad.periodo }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { planEstudiosMock } from '@/data/mockData'
</script>

<style scoped>
.sem-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.units-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 10px;
}

.unit-card {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 12px;
  background: var(--bg-surface-muted);
}

.unit-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.unit-code {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text-brand);
}

.unit-name {
  font-weight: 600;
  font-size: 0.9rem;
  margin: 8px 0 4px;
}

.unit-meta {
  font-size: 0.78rem;
  color: var(--text-secondary);
}
</style>
