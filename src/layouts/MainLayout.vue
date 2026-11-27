<template>
  <div class="layout-shell" :class="{ 'drawer-open': drawerOpen }">
    <!-- Backdrop móvil -->
    <div
      v-if="drawerOpen && isMobile"
      class="drawer-backdrop"
      @click="drawerOpen = false"
    />

    <!-- Barra lateral institucional (Rol Estudiante) -->
    <aside class="sidebar" :class="{ 'sidebar-collapsed': !drawerOpen }">
      <div class="sidebar-inner">
        <div class="sidebar-brand">
          <img src="/logo-blanco.png" alt="UniPutumayo - Institución Universitaria del Putumayo" />
          <button
            class="collapse-btn"
            type="button"
            aria-label="Ocultar el menú"
            @click="drawerOpen = false"
          >
            <ChevronLeft :size="18" />
          </button>
        </div>

        <div class="sidebar-user-mobile">
          <div class="user-name">{{ estudianteMock.nombreCompleto }}</div>
          <div class="user-doc">{{ estudianteMock.identificacion }}</div>
        </div>

        <nav class="sidebar-nav" aria-label="Menú principal de estudiante">
          <RouterLink to="/" class="nav-item" active-class="nav-item-active" exact-active-class="nav-item-active" @click="onNavClick">
            <Home :size="19" class="nav-icon" />
            <span>Inicio</span>
          </RouterLink>

          <div class="nav-group">
            <button
              type="button"
              class="nav-item nav-group-trigger"
              :aria-expanded="matriculaExpanded"
              @click="matriculaExpanded = !matriculaExpanded"
            >
              <ClipboardList :size="19" class="nav-icon" />
              <span class="flex-1">Matrícula</span>
              <ChevronDown
                :size="17"
                class="group-arrow"
                :class="{ rotated: matriculaExpanded }"
              />
            </button>
            <div v-show="matriculaExpanded" class="nav-group-children">
              <RouterLink
                to="/matricula"
                class="nav-item nav-child"
                active-class="nav-item-active"
                @click="onNavClick"
              >
                <span>Req. Inscripción y Matrícula</span>
              </RouterLink>
            </div>
          </div>

          <RouterLink to="/plan-estudios" class="nav-item" active-class="nav-item-active" @click="onNavClick">
            <Layers :size="19" class="nav-icon" />
            <span>Plan de Estudios</span>
          </RouterLink>

          <RouterLink to="/notas-boletin" class="nav-item" active-class="nav-item-active" @click="onNavClick">
            <Award :size="19" class="nav-icon" />
            <span>Notas y boletín</span>
          </RouterLink>

          <RouterLink to="/cursos-grado" class="nav-item" active-class="nav-item-active" @click="onNavClick">
            <GraduationCap :size="19" class="nav-icon" />
            <span>Cursos Req. Grado</span>
          </RouterLink>

          <RouterLink to="/bienestar" class="nav-item" active-class="nav-item-active" @click="onNavClick">
            <Heart :size="19" class="nav-icon" />
            <span>Actividades Bienestar U.</span>
          </RouterLink>

          <RouterLink to="/propuesta-grado" class="nav-item" active-class="nav-item-active" @click="onNavClick">
            <FileEdit :size="19" class="nav-icon" />
            <span>Inscribir Propuesta Grado</span>
          </RouterLink>

          <RouterLink to="/horas-sociales" class="nav-item" active-class="nav-item-active" @click="onNavClick">
            <Clock :size="19" class="nav-icon" />
            <span>Horas sociales (Ciecyt)</span>
          </RouterLink>

          <RouterLink to="/evaluacion-docente" class="nav-item" active-class="nav-item-active" @click="onNavClick">
            <Star :size="19" class="nav-icon" />
            <span>Evaluación Docente</span>
          </RouterLink>

          <RouterLink to="/servicios" class="nav-item" active-class="nav-item-active" @click="onNavClick">
            <Wifi :size="19" class="nav-icon" />
            <span>Servicios en Línea</span>
          </RouterLink>
        </nav>

        <div class="sidebar-footer">
          <div>SIGEDIN Académico · v2.24.0</div>
          <div>Institución Universitaria del Putumayo</div>
          <div class="role-tag">Rol: Estudiante</div>
        </div>
      </div>
    </aside>

    <!-- Contenedor principal -->
    <div class="main-wrapper" :class="{ 'with-sidebar': drawerOpen && !isMobile }">
      <!-- Cabecera superior -->
      <header class="app-header">
        <div class="app-toolbar">
          <button
            class="icon-btn menu-toggle"
            type="button"
            aria-label="Abrir o cerrar menú"
            @click="drawerOpen = !drawerOpen"
          >
            <Menu :size="20" />
          </button>

          <h1 class="toolbar-title">{{ currentTitle }}</h1>

          <div class="toolbar-actions">
            <button
              class="icon-btn"
              type="button"
              :aria-label="isDark ? 'Activar modo claro' : 'Activar modo oscuro'"
              :title="isDark ? 'Activar modo claro' : 'Activar modo oscuro'"
              @click="toggleTheme"
            >
              <Sun v-if="isDark" :size="19" />
              <Moon v-else :size="19" />
            </button>

            <div class="account-wrap">
              <button
                class="account-btn"
                type="button"
                aria-label="Mi cuenta"
                @click="accountMenuOpen = !accountMenuOpen"
              >
                <span class="avatar-circle">{{ estudianteMock.iniciales }}</span>
                <span class="account-info">
                  <span class="account-name">{{ estudianteMock.nombreCompleto }}</span>
                  <span class="account-id">{{ estudianteMock.identificacion }}</span>
                </span>
                <ChevronDown :size="16" class="account-chevron" />
              </button>

              <div v-if="accountMenuOpen" class="account-dropdown">
                <div class="dropdown-header">
                  <strong>{{ estudianteMock.nombreCompleto }}</strong>
                  <span>{{ estudianteMock.correoInstitucional }}</span>
                  <span class="badge badge-info" style="margin-top: 6px; width: fit-content;">
                    Estudiante · {{ estudianteMock.programaActual.codigoEstudiante }}
                  </span>
                </div>
                <RouterLink to="/" class="dropdown-item" @click="accountMenuOpen = false">
                  Mi ficha académica
                </RouterLink>
                <RouterLink to="/servicios" class="dropdown-item" @click="accountMenuOpen = false">
                  Solicitudes y Paz y Salvo
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
        <div class="brand-stripe" aria-hidden="true" />
      </header>

      <!-- Área de contenido -->
      <main class="page-container">
        <RouterView />
      </main>
    </div>

    <!-- Botón flotante de valoración -->
    <button
      class="rating-fab"
      type="button"
      aria-label="Valorar SIGEDIN"
      title="Valorar SIGEDIN"
      @click="ratingModalOpen = true"
    >
      <Star :size="21" />
    </button>

    <!-- Modal simple de valoración -->
    <div v-if="ratingModalOpen" class="modal-overlay" @click.self="ratingModalOpen = false">
      <div class="modal-card">
        <div class="modal-header">
          <h3>Valorar SIGEDIN Académico</h3>
          <button class="icon-btn" type="button" @click="ratingModalOpen = false">
            <X :size="18" />
          </button>
        </div>
        <p class="muted-text">¿Cómo ha sido tu experiencia usando la plataforma estudiantil?</p>
        <div class="stars-row">
          <button
            v-for="n in 5"
            :key="n"
            type="button"
            class="star-btn"
            :class="{ active: n <= ratingValue }"
            @click="ratingValue = n"
          >
            ★
          </button>
        </div>
        <div class="modal-actions">
          <button class="btn-outline" type="button" @click="ratingModalOpen = false">Cancelar</button>
          <button class="btn-primary" type="button" @click="submitRating">Enviar valoración</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  Award,
  ChevronDown,
  ChevronLeft,
  ClipboardList,
  Clock,
  FileEdit,
  GraduationCap,
  Heart,
  Home,
  Layers,
  Menu,
  Moon,
  Star,
  Sun,
  Wifi,
  X
} from 'lucide-vue-next'
import { estudianteMock } from '@/data/mockData'

const route = useRoute()
const isMobile = ref(window.innerWidth < 1024)
const drawerOpen = ref(window.innerWidth >= 1024)
const matriculaExpanded = ref(true)
const accountMenuOpen = ref(false)
const ratingModalOpen = ref(false)
const ratingValue = ref(5)
const isDark = ref(document.documentElement.classList.contains('dark'))

const currentTitle = computed(() => route.meta?.title || 'SIGEDIN Académico')

function handleResize() {
  const mobile = window.innerWidth < 1024
  if (mobile !== isMobile.value) {
    isMobile.value = mobile
    drawerOpen.value = !mobile
  }
}

function onNavClick() {
  accountMenuOpen.value = false
  if (isMobile.value) {
    drawerOpen.value = false
  }
}

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('sigedin_theme', isDark.value ? 'dark' : 'light')
}

function submitRating() {
  ratingModalOpen.value = false
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.layout-shell {
  min-height: 100vh;
  display: flex;
  background-color: var(--bg-app);
}

/* Sidebar */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: var(--sidebar-width);
  background-color: var(--color-sidebar-bg);
  color: #ffffff;
  z-index: 40;
  transition: transform 0.22s ease;
  display: flex;
  flex-direction: column;
}

.sidebar-collapsed {
  transform: translateX(-100%);
}

.sidebar-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
}

.sidebar-brand {
  position: relative;
  padding: 16px;
  text-align: center;
}

.sidebar-brand img {
  width: 100%;
  max-width: 190px;
  height: auto;
}

.collapse-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.14);
  color: rgba(255, 255, 255, 0.9);
  display: grid;
  place-items: center;
  cursor: pointer;
}

.collapse-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}

.sidebar-user-mobile {
  display: none;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.1);
}

.sidebar-user-mobile .user-name {
  font-size: 0.85rem;
  font-weight: 600;
}

.sidebar-user-mobile .user-doc {
  font-size: 0.76rem;
  opacity: 0.8;
}

.sidebar-nav {
  flex: 1;
  padding: 8px 0;
  display: flex;
  flex-direction: column;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
  padding: 8px 20px;
  font-size: 0.95rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.92);
  background: transparent;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.09);
}

.nav-item-active {
  background: rgba(255, 255, 255, 0.18);
  font-weight: 600;
  box-shadow: inset 4px 0 0 var(--color-amber);
}

.nav-icon {
  flex-shrink: 0;
  opacity: 0.95;
}

.nav-group-trigger {
  font-weight: 600;
}

.flex-1 {
  flex: 1;
}

.group-arrow {
  transition: transform 0.2s ease;
}

.group-arrow.rotated {
  transform: rotate(180deg);
}

.nav-group-children {
  background: rgba(0, 0, 0, 0.16);
}

.nav-child {
  padding-left: 48px;
  min-height: 40px;
  font-size: 0.9rem;
}

.sidebar-footer {
  padding: 14px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 0.75rem;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.82);
}

.role-tag {
  margin-top: 6px;
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  font-weight: 600;
}

.drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 35;
}

/* Main Wrapper & Header */
.main-wrapper {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  transition: padding-left 0.22s ease;
}

.main-wrapper.with-sidebar {
  padding-left: var(--sidebar-width);
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 30;
  background-color: var(--bg-header);
  backdrop-filter: blur(6px);
  border-bottom: 1px solid var(--border-color);
}

.app-toolbar {
  min-height: var(--header-min-height);
  padding: 6px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.toolbar-title {
  margin: 0;
  flex: 1;
  min-width: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: var(--text-primary);
  display: grid;
  place-items: center;
  cursor: pointer;
}

.icon-btn:hover {
  background: var(--bg-surface-muted);
}

.account-wrap {
  position: relative;
}

.account-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 6px;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
}

.account-btn:hover {
  background: var(--bg-surface-muted);
}

.avatar-circle {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #ffffff;
  font-weight: 700;
  font-size: 0.88rem;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.account-info {
  display: flex;
  flex-direction: column;
  text-align: left;
  line-height: 1.2;
}

.account-name {
  font-size: 0.85rem;
  font-weight: 600;
  max-width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.account-id {
  font-size: 0.74rem;
  color: var(--text-secondary);
}

.account-dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  width: 270px;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  padding: 8px;
  z-index: 50;
}

.dropdown-header {
  display: flex;
  flex-direction: column;
  padding: 8px 10px 10px;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.82rem;
}

.dropdown-header span {
  color: var(--text-secondary);
  font-size: 0.76rem;
}

.dropdown-item {
  display: block;
  padding: 9px 10px;
  border-radius: var(--radius-sm);
  font-size: 0.88rem;
  margin-top: 4px;
}

.dropdown-item:hover {
  background: var(--bg-surface-muted);
}

.brand-stripe {
  height: 3px;
  background: linear-gradient(90deg, var(--color-green) 0 14%, var(--color-amber) 14% 100%);
}

.page-container {
  flex: 1;
  padding: 20px 22px 84px;
  max-width: 1240px;
  width: 100%;
  margin: 0 auto;
}

/* Botón flotante de valoración */
.rating-fab {
  position: fixed;
  right: 18px;
  bottom: 18px;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: var(--bg-surface);
  color: var(--color-amber);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-md);
  display: grid;
  place-items: center;
  cursor: pointer;
  z-index: 32;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: grid;
  place-items: center;
  padding: 16px;
  z-index: 60;
}

.modal-card {
  width: 100%;
  max-width: 380px;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow-md);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.05rem;
}

.stars-row {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin: 16px 0;
}

.star-btn {
  font-size: 1.8rem;
  border: none;
  background: transparent;
  color: var(--border-color);
  cursor: pointer;
}

.star-btn.active {
  color: var(--color-amber);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

@media (max-width: 1023px) {
  .sidebar-user-mobile {
    display: block;
  }
}

@media (max-width: 599px) {
  .account-info {
    display: none;
  }

  .page-container {
    padding: 14px 14px 80px;
  }
}
</style>
