<template>
  <div class="page-stack">
    <section class="card">
      <div class="eval-header">
        <div>
          <h2 class="card-title" style="margin-bottom: 4px;">
            Evaluación Docente · Periodo {{ evaluacionDocenteMock.periodo }}
          </h2>
          <p class="muted-text" style="margin: 0;">
            Completa la evaluación de cada unidad matriculada para habilitar la consulta de notas finales.
          </p>
        </div>
        <span class="badge badge-info">
          {{ completadasCount }} / {{ evaluaciones.length }} completadas
        </span>
      </div>

      <div class="eval-list">
        <div v-for="item in evaluaciones" :key="item.codigo" class="eval-row">
          <div>
            <strong>{{ item.codigo }} · {{ item.unidad }}</strong>
            <div class="muted-text">Docente: {{ item.docente }}</div>
          </div>
          <button
            type="button"
            :class="item.completada ? 'btn-outline' : 'btn-primary'"
            :disabled="item.completada"
            @click="marcarCompletada(item)"
          >
            {{ item.completada ? 'Evaluada ✓' : 'Evaluar docente' }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { evaluacionDocenteMock } from '@/data/mockData'

const evaluaciones = reactive(evaluacionDocenteMock.asignaturas.map((a) => ({ ...a })))
const completadasCount = computed(() => evaluaciones.filter((e) => e.completada).length)

function marcarCompletada(item) {
  item.completada = true
}
</script>

<style scoped>
.eval-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.eval-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.eval-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  padding: 12px 14px;
  border-radius: var(--radius-sm);
  background: var(--bg-surface-muted);
  border: 1px solid var(--border-color);
}
</style>
