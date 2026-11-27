<template>
  <div class="page-stack">
    <section class="grid-cards">
      <div class="stat-card">
        <div class="stat-label">Horas requeridas</div>
        <div class="stat-value">{{ horasSocialesMock.requeridas }} h</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Horas acumuladas</div>
        <div class="stat-value">{{ horasSocialesMock.acumuladas }} h</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Estado del requisito</div>
        <div class="stat-value">
          <span class="badge badge-success" style="font-size: 0.92rem;">
            {{ horasSocialesMock.completo ? 'Cumplido' : 'Pendiente' }}
          </span>
        </div>
      </div>
    </section>

    <section class="card">
      <h2 class="card-title">Participaciones en Proyección Social (CIECYT)</h2>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Periodo</th>
              <th>Proyecto</th>
              <th>Supervisor</th>
              <th>Horas</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in horasSocialesMock.participaciones" :key="item.id">
              <td>{{ item.periodo }}</td>
              <td><strong>{{ item.titulo }}</strong></td>
              <td>
                {{ item.supervisor }}
                <div class="muted-text" style="font-size: 0.78rem;">{{ item.supervisorCorreo }}</div>
              </td>
              <td><strong>{{ item.horas }} h</strong></td>
              <td><span class="badge badge-success">{{ item.estado }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { horasSocialesMock } from '@/data/mockData'
</script>
