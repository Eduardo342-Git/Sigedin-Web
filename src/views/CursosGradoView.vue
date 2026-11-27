<template>
  <div class="page-stack">
    <section class="card">
      <h2 class="card-title">Cursos Requisito de Grado</h2>
      <p class="muted-text">Historial de cursos de nivelación o requisitos especiales inscritos.</p>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Periodo</th>
              <th>Curso</th>
              <th>Modalidad</th>
              <th>Docente</th>
              <th>Nota</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="curso in cursosGradoMock" :key="curso.id">
              <td>{{ curso.periodo }}</td>
              <td><strong>{{ curso.curso }}</strong></td>
              <td>{{ curso.modalidad }}</td>
              <td>{{ curso.docente }}</td>
              <td><strong>{{ curso.nota.toFixed(1) }}</strong></td>
              <td><span class="badge badge-success">{{ curso.estado }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { cursosGradoMock } from '@/data/mockData'
</script>
