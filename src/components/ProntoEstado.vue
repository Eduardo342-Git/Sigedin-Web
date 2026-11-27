<template>
  <div class="empty-state-wrap">
    <div class="empty-state-box">
      <div class="icon-circle" aria-hidden="true">
        <BookOpen v-if="icon === 'book'" :size="28" />
        <Pencil v-else :size="28" />
      </div>

      <h2 class="empty-title">{{ title }}</h2>

      <p class="empty-subtitle">
        {{ line1 }}<br />
        {{ line2 }}
      </p>

      <div class="empty-actions">
        <RouterLink to="/" class="btn-legacy-primary">Volver al inicio</RouterLink>
        <button type="button" class="btn-legacy-link" @click="abrirSistemaAnterior">
          Sistema anterior
        </button>
      </div>

      <p v-if="avisoPortal" class="legacy-toast">{{ avisoPortal }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { BookOpen, Pencil } from 'lucide-vue-next'

defineProps({
  title: { type: String, required: true },
  line1: {
    type: String,
    default: 'Este módulo todavía no está disponible en la nueva versión.'
  },
  line2: {
    type: String,
    default: 'Mientras tanto puedes usarlo en el sistema anterior.'
  },
  icon: {
    type: String,
    default: 'pencil'
  }
})

const avisoPortal = ref('')

function abrirSistemaAnterior() {
  avisoPortal.value =
    'Redirección simulada al portal académico legado (estudiantes.uniputumayo.edu.co).'
}
</script>

<style scoped>
.empty-state-wrap {
  min-height: calc(100vh - 170px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
}

.empty-state-box {
  max-width: 440px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-circle {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: #185686;
  color: #ffffff;
  display: grid;
  place-items: center;
  margin-bottom: 16px;
}

.empty-title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
}

.empty-subtitle {
  margin: 10px 0 20px;
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--text-secondary);
}

.empty-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.btn-legacy-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  padding: 8px 18px;
  border-radius: var(--radius-sm);
  background-color: #185686;
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
}

.btn-legacy-primary:hover {
  background-color: #0f4766;
}

.btn-legacy-link {
  border: none;
  background: transparent;
  color: #185686;
  font-size: 0.9rem;
  font-weight: 600;
  min-height: 38px;
  padding: 8px 14px;
  white-space: nowrap;
  cursor: pointer;
}

:root.dark .btn-legacy-link {
  color: #7dd3fc;
}

.btn-legacy-link:hover {
  text-decoration: underline;
}

.legacy-toast {
  margin: 16px 0 0;
  padding: 9px 14px;
  border-radius: var(--radius-sm);
  background: rgba(24, 86, 134, 0.12);
  color: var(--text-brand);
  font-size: 0.84rem;
  font-weight: 600;
}
</style>
