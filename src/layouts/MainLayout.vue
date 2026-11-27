<template>
  <div class="layout-shell" :class="{ 'drawer-open': drawerOpen }">
    <!-- Backdrop móvil -->
    <div
      v-if="drawerOpen && isMobile"
      class="drawer-backdrop"
      @click="drawerOpen = false"
    />

    <!-- Barra lateral institucional (Rol Estudiante) -->
    <aside
      class="sidebar"
      :class="{
        'sidebar-collapsed': !drawerOpen && isMobile,
        'sidebar-mini': isSidebarMini
      }"
    >
      <div class="sidebar-inner">
        <div class="sidebar-brand">
          <img src="/logo-blanco.png" alt="UniPutumayo - Institución Universitaria del Putumayo" />
          <button
            class="collapse-btn"
            type="button"
            :aria-label="isSidebarMini ? 'Expandir el menú' : 'Contraer el menú'"
            :title="isSidebarMini ? 'Expandir el menú' : 'Contraer el menú'"
            @click="drawerOpen = !drawerOpen"
          >
            <ChevronRight v-if="isSidebarMini" :size="18" />
            <ChevronLeft v-else :size="18" />
          </button>
        </div>

        <div class="sidebar-user-mobile">
          <div class="user-name">{{ estudianteMock.nombreCompleto }}</div>
          <div class="user-doc">{{ estudianteMock.identificacion }}</div>
        </div>

        <nav class="sidebar-nav" aria-label="Menú principal de estudiante">
          <RouterLink
            to="/"
            class="nav-item"
            active-class="nav-item-active"
            exact-active-class="nav-item-active"
            :title="isSidebarMini ? 'Inicio' : undefined"
            @click="onNavClick"
          >
            <Home :size="19" class="nav-icon" />
            <span>Inicio</span>
          </RouterLink>

          <div class="nav-group">
            <button
              type="button"
              class="nav-item nav-group-trigger"
              :class="{ 'nav-item-active': isSidebarMini && route.path.startsWith('/matricula') }"
              :aria-expanded="matriculaExpanded && !isSidebarMini"
              :title="isSidebarMini ? 'Matrícula' : undefined"
              @click="toggleGroup('matricula')"
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
                to="/matricula/requisitos"
                class="nav-item nav-child"
                active-class="nav-item-active"
                @click="onNavClick"
              >
                <span class="flex-1">Req. Inscripción y Matrícula</span>
              </RouterLink>
              <RouterLink
                to="/matricula/registro-unidades"
                class="nav-item nav-child"
                active-class="nav-item-active"
                @click="onNavClick"
              >
                <span class="flex-1">Reg. de Unidades y Horario</span>
                <span class="sidebar-pronto-badge">Pronto</span>
              </RouterLink>
            </div>
          </div>

          <RouterLink
            to="/plan-estudios"
            class="nav-item"
            active-class="nav-item-active"
            :title="isSidebarMini ? 'Plan de Estudios' : undefined"
            @click="onNavClick"
          >
            <Layers :size="19" class="nav-icon" />
            <span>Plan de Estudios</span>
          </RouterLink>

          <RouterLink
            to="/notas-boletin"
            class="nav-item"
            active-class="nav-item-active"
            :title="isSidebarMini ? 'Notas y boletín' : undefined"
            @click="onNavClick"
          >
            <Award :size="19" class="nav-icon" />
            <span>Notas y boletín</span>
          </RouterLink>

          <RouterLink
            to="/cursos-grado"
            class="nav-item"
            active-class="nav-item-active"
            :title="isSidebarMini ? 'Cursos Req. Grado' : undefined"
            @click="onNavClick"
          >
            <GraduationCap :size="19" class="nav-icon" />
            <span>Cursos Req. Grado</span>
          </RouterLink>

          <RouterLink
            to="/bienestar"
            class="nav-item"
            active-class="nav-item-active"
            :title="isSidebarMini ? 'Actividades Bienestar U.' : undefined"
            @click="onNavClick"
          >
            <Heart :size="19" class="nav-icon" />
            <span>Actividades Bienestar U.</span>
          </RouterLink>

          <RouterLink
            to="/propuesta-grado"
            class="nav-item"
            active-class="nav-item-active"
            :title="isSidebarMini ? 'Inscribir Propuesta Grado' : undefined"
            @click="onNavClick"
          >
            <FileEdit :size="19" class="nav-icon" />
            <span>Inscribir Propuesta Grado</span>
          </RouterLink>

          <RouterLink
            to="/horas-sociales"
            class="nav-item"
            active-class="nav-item-active"
            :title="isSidebarMini ? 'Horas sociales (Ciecyt)' : undefined"
            @click="onNavClick"
          >
            <Clock :size="19" class="nav-icon" />
            <span>Horas sociales (Ciecyt)</span>
          </RouterLink>

          <RouterLink
            to="/evaluacion-docente"
            class="nav-item"
            active-class="nav-item-active"
            :title="isSidebarMini ? 'Evaluación Docente' : undefined"
            @click="onNavClick"
          >
            <Star :size="19" class="nav-icon" />
            <span>Evaluación Docente</span>
          </RouterLink>

          <div class="nav-group">
            <button
              type="button"
              class="nav-item nav-group-trigger"
              :class="{ 'nav-item-active': isSidebarMini && route.path.startsWith('/servicios') }"
              :aria-expanded="serviciosExpanded && !isSidebarMini"
              :title="isSidebarMini ? 'Servicios en Línea' : undefined"
              @click="toggleGroup('servicios')"
            >
              <Wifi :size="19" class="nav-icon" />
              <span class="flex-1">Servicios en Línea</span>
              <ChevronDown
                :size="17"
                class="group-arrow"
                :class="{ rotated: serviciosExpanded }"
              />
            </button>
            <div v-show="serviciosExpanded" class="nav-group-children">
              <RouterLink
                to="/servicios/solicitudes"
                class="nav-item nav-child"
                active-class="nav-item-active"
                @click="onNavClick"
              >
                <span>Solicitudes</span>
              </RouterLink>
              <RouterLink
                to="/servicios/paz-y-salvo"
                class="nav-item nav-child"
                active-class="nav-item-active"
                @click="onNavClick"
              >
                <span>Paz y Salvo</span>
              </RouterLink>
            </div>
          </div>
        </nav>

        <div class="sidebar-footer">
          <div>SIGEDIN Académico · v2.24.0</div>
          <div>Institución Universitaria del Putumayo</div>
          <div class="role-tag">Rol: Estudiante</div>
        </div>
      </div>
    </aside>

    <!-- Contenedor principal -->
    <div
      class="main-wrapper"
      :class="{
        'with-sidebar': drawerOpen && !isMobile,
        'with-sidebar-mini': isSidebarMini
      }"
    >
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

            <div ref="accountWrapRef" class="account-wrap">
              <button
                class="account-btn"
                type="button"
                aria-label="Mi cuenta"
                :aria-expanded="accountMenuOpen"
                @click.stop="accountMenuOpen = !accountMenuOpen"
              >
                <span class="avatar-circle">{{ estudianteMock.iniciales }}</span>
                <span class="account-info">
                  <span class="account-name">{{ estudianteMock.nombreCompleto }}</span>
                  <span class="account-id">{{ estudianteMock.identificacion }}</span>
                </span>
                <ChevronDown :size="16" class="account-chevron" />
              </button>

              <div v-if="accountMenuOpen" class="account-dropdown" @click.stop>
                <RouterLink
                  to="/hoja-de-vida"
                  class="dropdown-item"
                  @click="accountMenuOpen = false"
                >
                  <User :size="17" class="dropdown-icon" />
                  <span class="dropdown-label">Mis datos</span>
                </RouterLink>

                <RouterLink
                  to="/carnet"
                  class="dropdown-item"
                  @click="accountMenuOpen = false"
                >
                  <CreditCard :size="17" class="dropdown-icon" />
                  <span class="dropdown-label">Carnet</span>
                </RouterLink>

                <RouterLink
                  to="/calendario"
                  class="dropdown-item"
                  @click="accountMenuOpen = false"
                >
                  <Calendar :size="17" class="dropdown-icon" />
                  <span class="dropdown-label">Calendario académico</span>
                </RouterLink>

                <RouterLink
                  to="/notas-boletin"
                  class="dropdown-item"
                  @click="accountMenuOpen = false"
                >
                  <TrendingUp :size="17" class="dropdown-icon" />
                  <span class="dropdown-label">Informes</span>
                </RouterLink>

                <RouterLink
                  to="/biblioteca"
                  class="dropdown-item"
                  @click="accountMenuOpen = false"
                >
                  <BookOpen :size="17" class="dropdown-icon" />
                  <span class="dropdown-label">Biblioteca</span>
                  <span class="pronto-badge">Pronto</span>
                </RouterLink>

                <a
                  href="https://virtual.itp.edu.co/moodle2026-2/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="dropdown-item"
                  @click="accountMenuOpen = false"
                >
                  <Globe :size="17" class="dropdown-icon" />
                  <span class="dropdown-label">Moodle</span>
                  <ExternalLink :size="14" class="external-icon" />
                </a>

                <a
                  href="https://evadoc.itp.edu.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="dropdown-item"
                  @click="accountMenuOpen = false"
                >
                  <Star :size="17" class="dropdown-icon" />
                  <span class="dropdown-label">Evaluación institucional</span>
                  <ExternalLink :size="14" class="external-icon" />
                </a>

                <div class="dropdown-divider" />

                <button type="button" class="dropdown-item" @click="actualizarAplicacion">
                  <RefreshCw :size="17" class="dropdown-icon" />
                  <span class="dropdown-text-col">
                    <span class="dropdown-label">Actualizar la aplicación</span>
                    <span class="dropdown-sub">Borra la memoria del navegador y recarga</span>
                  </span>
                </button>

                <button type="button" class="dropdown-item dropdown-logout" @click="confirmarSalir">
                  <LogOut :size="17" class="dropdown-icon" />
                  <span class="dropdown-label">Salir</span>
                </button>
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
    <!-- Modal de aviso institucional (Biblioteca / Salir) -->
    <div v-if="systemModal" class="modal-overlay" @click.self="systemModal = null">
      <div class="modal-card">
        <div class="modal-header">
          <h3>{{ systemModal.title }}</h3>
          <button class="icon-btn" type="button" @click="systemModal = null">
            <X :size="18" />
          </button>
        </div>
        <p class="muted-text">{{ systemModal.message }}</p>
        <div class="modal-actions">
          <button class="btn-primary" type="button" @click="systemModal = null">Entendido</button>
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
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  CreditCard,
  ExternalLink,
  FileEdit,
  Globe,
  GraduationCap,
  Heart,
  Home,
  Layers,
  LogOut,
  Menu,
  Moon,
  RefreshCw,
  Star,
  Sun,
  TrendingUp,
  User,
  Wifi,
  X
} from 'lucide-vue-next'
import { estudianteMock } from '@/data/mockData'

const route = useRoute()
const isMobile = ref(window.innerWidth < 1024)
const drawerOpen = ref(window.innerWidth >= 1024)
const matriculaExpanded = ref(true)
const serviciosExpanded = ref(true)
const accountMenuOpen = ref(false)
const accountWrapRef = ref(null)
const ratingModalOpen = ref(false)
const ratingValue = ref(5)
const systemModal = ref(null)
const isDark = ref(document.documentElement.classList.contains('dark'))

const currentTitle = computed(() => route.meta?.title || 'SIGEDIN Académico')
const isSidebarMini = computed(() => !drawerOpen.value && !isMobile.value)

function toggleGroup(group) {
  if (isSidebarMini.value) {
    drawerOpen.value = true
    if (group === 'matricula') matriculaExpanded.value = true
    if (group === 'servicios') serviciosExpanded.value = true
    return
  }
  if (group === 'matricula') {
    matriculaExpanded.value = !matriculaExpanded.value
  } else if (group === 'servicios') {
    serviciosExpanded.value = !serviciosExpanded.value
  }
}

function handleResize() {
  const mobile = window.innerWidth < 1024
  if (mobile !== isMobile.value) {
    isMobile.value = mobile
    drawerOpen.value = !mobile
  }
}

function handleClickOutsideAccount(event) {
  if (!accountMenuOpen.value) return
  if (accountWrapRef.value && !accountWrapRef.value.contains(event.target)) {
    accountMenuOpen.value = false
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

function actualizarAplicacion() {
  accountMenuOpen.value = false
  sessionStorage.clear()
  window.location.reload()
}

function confirmarSalir() {
  accountMenuOpen.value = false
  systemModal.value = {
    title: 'Sesión finalizada (simulación)',
    message:
      'Se ha cerrado tu sesión de demostración para CAMILO ANDRES MARTINEZ LOPEZ en SIGEDIN Académico.'
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  document.addEventListener('click', handleClickOutsideAccount)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('click', handleClickOutsideAccount)
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
  overflow: hidden;
  transition: transform 0.22s ease, width 0.22s ease;
  display: flex;
  flex-direction: column;
}

.sidebar-collapsed {
  transform: translateX(-100%);
}

.sidebar-mini {
  width: var(--sidebar-collapsed-width);
}

.sidebar-mini .sidebar-brand img {
  opacity: 0;
  pointer-events: none;
}

.sidebar-mini .collapse-btn {
  top: 50%;
  right: 18px;
  transform: translateY(-50%);
}

.sidebar-mini .nav-item > span,
.sidebar-mini .group-arrow,
.sidebar-mini .sidebar-pronto-badge,
.sidebar-mini .sidebar-footer {
  opacity: 0;
  pointer-events: none;
}

.sidebar-mini .nav-group-children {
  max-height: 0;
  opacity: 0;
  pointer-events: none;
}

.sidebar-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar-brand {
  position: relative;
  height: 78px;
  flex-shrink: 0;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.sidebar-brand img {
  width: 185px;
  max-width: 185px;
  height: auto;
  flex-shrink: 0;
  transition: opacity 0.15s ease;
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
  transition: top 0.22s ease, right 0.22s ease, transform 0.22s ease, background-color 0.15s ease;
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
  padding: 8px 22px;
  font-size: 0.95rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.92);
  background: transparent;
  border: none;
  width: 100%;
  text-align: left;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.nav-item > span,
.group-arrow,
.sidebar-pronto-badge {
  transition: opacity 0.15s ease;
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
  overflow: hidden;
  max-height: 200px;
  transition: max-height 0.22s ease, opacity 0.18s ease;
}

.nav-child {
  padding-left: 48px;
  min-height: 40px;
  font-size: 0.9rem;
}

.sidebar-pronto-badge {
  font-size: 11px;
  font-weight: 600;
  line-height: 1.2;
  padding: 2px 7px;
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.45);
  flex-shrink: 0;
}

.sidebar-footer {
  padding: 14px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 0.75rem;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.82);
  white-space: nowrap;
  overflow: hidden;
  transition: opacity 0.15s ease;
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

.main-wrapper.with-sidebar-mini {
  padding-left: var(--sidebar-collapsed-width);
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
  min-width: 280px;
  width: max-content;
  max-width: calc(100vw - 24px);
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: 0 8px 24px rgba(15, 71, 102, 0.16);
  padding: 6px;
  z-index: 50;
  display: flex;
  flex-direction: column;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-size: 0.9rem;
  text-align: left;
  cursor: pointer;
}

.dropdown-item:hover {
  background: var(--bg-surface-muted);
}

.dropdown-icon {
  flex-shrink: 0;
  color: var(--text-secondary);
}

.dropdown-label {
  flex: 1;
  font-weight: 500;
}

.dropdown-text-col {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}

.dropdown-sub {
  font-size: 0.74rem;
  color: var(--text-secondary);
  margin-top: 2px;
}

.pronto-badge {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 1px 7px;
}

.external-icon {
  color: var(--text-secondary);
  flex-shrink: 0;
}

.dropdown-divider {
  height: 1px;
  background: var(--border-color);
  margin: 6px 8px;
}

.dropdown-logout {
  color: var(--color-danger);
}

.dropdown-logout .dropdown-icon {
  color: var(--color-danger);
}

.brand-stripe {
  height: 3px;
  background: linear-gradient(90deg, var(--color-green) 0 14%, var(--color-amber) 14% 100%);
}

.page-container {
  flex: 1;
  padding: 24px 28px 80px;
  width: 100%;
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

@media (max-width: 767px) {
  .toolbar-title {
    white-space: normal;
    overflow: visible;
    text-overflow: clip;
    line-height: 1.25;
    font-size: 1rem;
  }
}

@media (max-width: 599px) {
  .app-toolbar {
    padding: 8px 12px;
    gap: 8px;
  }

  .toolbar-title {
    font-size: 0.96rem;
  }

  .account-info {
    display: none;
  }

  .page-container {
    padding: 14px 14px 72px;
  }
}
</style>
