<template>
  <div class="page-stack">
    <section class="grid-cards">
      <div class="stat-card">
        <div class="stat-label">Periodo</div>
        <div class="stat-value">{{ boletinMock.periodo }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Promedio del semestre</div>
        <div class="stat-value">{{ boletinMock.resumen.promedioSemestre.toFixed(1) }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Total créditos</div>
        <div class="stat-value">{{ boletinMock.resumen.totalCreditos }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Intensidad horaria</div>
        <div class="stat-value">{{ boletinMock.resumen.totalHoras }} h/sem</div>
      </div>
    </section>

    <section class="card">
      <h2 class="card-title">Boletín de Calificaciones · Matrícula #{{ boletinMock.matricula }}</h2>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Unidad de Aprendizaje</th>
              <th>Créd.</th>
              <th>P1</th>
              <th>P2</th>
              <th>Final</th>
              <th>Definitiva</th>
              <th>Faltas</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in boletinMock.unidades" :key="u.codigo">
              <td><strong>{{ u.codigo }}</strong></td>
              <td>{{ u.unidad }}</td>
              <td>{{ u.creditos }}</td>
              <td>{{ u.p1.toFixed(1) }}</td>
              <td>{{ u.p2.toFixed(1) }}</td>
              <td>{{ u.examenFinal ? u.examenFinal.toFixed(1) : '—' }}</td>
              <td><strong>{{ u.definitiva.toFixed(1) }}</strong></td>
              <td>{{ u.faltas }}</td>
              <td><span class="badge badge-info">{{ u.estado }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { boletinMock } from '@/data/mockData'
</script>
