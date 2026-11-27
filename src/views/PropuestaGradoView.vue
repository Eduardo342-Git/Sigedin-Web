<template>
  <div class="page-stack">
    <section class="card">
      <h2 class="card-title">Convocatorias de Trabajo de Grado</h2>
      <div class="conv-list">
        <div v-for="conv in propuestasGradoMock.convocatorias" :key="conv.id" class="conv-item">
          <div>
            <strong>{{ conv.descripcion }}</strong>
            <div class="muted-text">Del {{ conv.inicio }} al {{ conv.fin }}</div>
          </div>
          <span class="badge" :class="conv.activa ? 'badge-warning' : 'badge-neutral'">
            {{ conv.abierta ? 'Abierta' : conv.activa ? 'Activa (cerrada)' : 'Cerrada' }}
          </span>
        </div>
      </div>
    </section>

    <section class="card">
      <h3 class="card-title">Mis Propuestas Registradas</h3>
      <div v-for="prop in propuestasGradoMock.misPropuestas" :key="prop.id" class="proposal-box">
        <div class="proposal-header">
          <strong>{{ prop.titulo }}</strong>
          <span class="badge badge-info">{{ prop.estado }}</span>
        </div>
        <div class="muted-text" style="margin-top: 6px;">
          Modalidad: {{ prop.modalidad }} · Director: {{ prop.director }}
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { propuestasGradoMock } from '@/data/mockData'
</script>

<style scoped>
.conv-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.conv-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: var(--radius-sm);
  background: var(--bg-surface-muted);
  border: 1px solid var(--border-color);
}

.proposal-box {
  padding: 14px;
  border-radius: var(--radius-sm);
  background: var(--bg-surface-muted);
  border: 1px solid var(--border-color);
}

.proposal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
