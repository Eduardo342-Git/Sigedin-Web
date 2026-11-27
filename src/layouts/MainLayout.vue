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
          <img
            v-if="!isSidebarMini"
            src="/logo-blanco.png"
            alt="UniPutumayo - Institución Universitaria del Putumayo"
          />
          <svg
            v-else
            class="brand-isotipo-svg"
            width="30"
            height="34"
            viewBox="0 0 30 34"
            fill="none"
            aria-label="UniPutumayo"
          >
            <circle cx="15" cy="8.5" r="4.5" fill="#FFFFFF" />
            <path
              d="M4 11V20.5C4 26.85 8.92 31.5 15 31.5C21.08 31.5 26 26.85 26 20.5V11H21V20.5C21 24.09 18.31 26.5 15 26.5C11.69 26.5 9 24.09 9 20.5V11H4Z"
              fill="#FFFFFF"
            />
          </svg>
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
          <div v-if="!isSidebarMini" class="nav-section-label">Gestión Académica</div>

          <RouterLink
            to="/"
            class="nav-item"
            active-class="nav-item-active"
            exact-active-class="nav-item-active"
            :title="isSidebarMini ? 'Inicio' : undefined"
            @click="onNavClick"
          >
            <Home :size="20" :stroke-width="1.85" class="nav-icon" />
            <span v-if="!isSidebarMini">Inicio</span>
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
              <ClipboardCheck :size="20" :stroke-width="1.85" class="nav-icon" />
              <span v-if="!isSidebarMini" class="flex-1">Matrícula</span>
              <ChevronDown
                v-if="!isSidebarMini"
                :size="17"
                class="group-arrow"
                :class="{ rotated: matriculaExpanded }"
              />
            </button>
            <div v-if="!isSidebarMini" v-show="matriculaExpanded" class="nav-group-children">
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
            <GitFork :size="20" :stroke-width="1.85" class="nav-icon" />
            <span v-if="!isSidebarMini">Plan de Estudios</span>
          </RouterLink>

          <RouterLink
            to="/notas-boletin"
            class="nav-item"
            active-class="nav-item-active"
            :title="isSidebarMini ? 'Notas y boletín' : undefined"
            @click="onNavClick"
          >
            <BarChart2 :size="20" :stroke-width="1.85" class="nav-icon" />
            <span v-if="!isSidebarMini">Notas y boletín</span>
          </RouterLink>

          <div v-if="!isSidebarMini" class="nav-section-label">Requisitos y Proyección</div>
          <div v-else class="nav-section-divider" />

          <RouterLink
            to="/cursos-grado"
            class="nav-item"
            active-class="nav-item-active"
            :title="isSidebarMini ? 'Cursos Req. Grado' : undefined"
            @click="onNavClick"
          >
            <GraduationCap :size="20" :stroke-width="1.85" class="nav-icon" />
            <span v-if="!isSidebarMini">Cursos Req. Grado</span>
          </RouterLink>

          <RouterLink
            to="/bienestar"
            class="nav-item"
            active-class="nav-item-active"
            :title="isSidebarMini ? 'Actividades Bienestar U.' : undefined"
            @click="onNavClick"
          >
            <Heart :size="20" :stroke-width="1.85" class="nav-icon" />
            <span v-if="!isSidebarMini">Actividades Bienestar U.</span>
          </RouterLink>

          <RouterLink
            to="/propuesta-grado"
            class="nav-item"
            active-class="nav-item-active"
            :title="isSidebarMini ? 'Inscribir Propuesta Grado' : undefined"
            @click="onNavClick"
          >
            <FileEdit :size="20" :stroke-width="1.85" class="nav-icon" />
            <span v-if="!isSidebarMini">Inscribir Propuesta Grado</span>
          </RouterLink>

          <RouterLink
            to="/horas-sociales"
            class="nav-item"
            active-class="nav-item-active"
            :title="isSidebarMini ? 'Horas sociales (Ciecyt)' : undefined"
            @click="onNavClick"
          >
            <HandHeart :size="20" :stroke-width="1.85" class="nav-icon" />
            <span v-if="!isSidebarMini">Horas sociales (Ciecyt)</span>
          </RouterLink>

          <div v-if="!isSidebarMini" class="nav-section-label">Portal y Trámites</div>
          <div v-else class="nav-section-divider" />

          <div class="nav-group">
            <button
              type="button"
              class="nav-item nav-group-trigger"
              :class="{ 'nav-item-active': isSidebarMini && route.path.startsWith('/servicios') }"
              :aria-expanded="serviciosExpanded && !isSidebarMini"
              :title="isSidebarMini ? 'Servicios en Línea' : undefined"
              @click="toggleGroup('servicios')"
            >
              <Settings :size="20" :stroke-width="1.85" class="nav-icon" />
              <span v-if="!isSidebarMini" class="flex-1">Servicios en Línea</span>
              <ChevronDown
                v-if="!isSidebarMini"
                :size="17"
                class="group-arrow"
                :class="{ rotated: serviciosExpanded }"
              />
            </button>
            <div v-if="!isSidebarMini" v-show="serviciosExpanded" class="nav-group-children">
              <RouterLink
                to="/servicios/solicitudes"
                class="nav-item nav-child"
                active-class="nav-item-active"
                @click="onNavClick"
              >
                <span class="flex-1">Solicitudes</span>
              </RouterLink>
              <RouterLink
                to="/servicios/paz-y-salvo"
                class="nav-item nav-child"
                active-class="nav-item-active"
                @click="onNavClick"
              >
                <span class="flex-1">Paz y Salvo</span>
              </RouterLink>
              <a
                href="https://virtual.itp.edu.co/moodle2026-2/"
                target="_blank"
                rel="noopener noreferrer"
                class="nav-item nav-child"
                @click.prevent="solicitarRedireccionExterna('Moodle UNIPUTUMAYO', 'https://virtual.itp.edu.co/moodle2026-2/')"
              >
                <span class="flex-1">Moodle</span>
                <ExternalLink :size="14" class="sidebar-ext-icon" />
              </a>
              <a
                href="https://evadoc.itp.edu.co"
                target="_blank"
                rel="noopener noreferrer"
                class="nav-item nav-child"
                @click.prevent="solicitarRedireccionExterna('Evaluación Docente UNIPUTUMAYO', 'https://evadoc.itp.edu.co')"
              >
                <span class="flex-1">Evaluación Docente</span>
                <ExternalLink :size="14" class="sidebar-ext-icon" />
              </a>
            </div>
          </div>
        </nav>

        <div v-if="!isSidebarMini" class="sidebar-footer">
          <div>SIGEDIN Académico · v2.25.0</div>
          <div>Institución Universitaria del Putumayo</div>
          <div class="sidebar-credits">Developed by <span class="credit-brand">LosTS</span></div>
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
            v-if="isMobile"
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
                <span class="avatar-circle">
                  <img
                    v-if="userPhoto"
                    :src="userPhoto"
                    alt="Foto de perfil"
                    class="avatar-photo-img"
                  />
                  <span v-else>{{ estudianteMock.iniciales }}</span>
                </span>
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
                  @click.prevent="solicitarRedireccionExterna('Moodle UNIPUTUMAYO', 'https://virtual.itp.edu.co/moodle2026-2/')"
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
                  @click.prevent="solicitarRedireccionExterna('Evaluación Institucional UNIPUTUMAYO', 'https://evadoc.itp.edu.co')"
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

                <button type="button" class="dropdown-item" @click="confirmarSalir">
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
    <!-- Modal de aviso institucional (Salir) -->
    <div v-if="systemModal" class="modal-overlay" @click.self="systemModal = null">
      <div class="modal-card">
        <div class="modal-header">
          <h3>{{ systemModal.title }}</h3>
          <button class="icon-btn" type="button" @click="systemModal = null">
            <X :size="18" />
          </button>
        </div>
        <div class="modal-body">
          <p class="muted-text" style="margin: 0;">{{ systemModal.message }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn-primary" type="button" @click="systemModal = null">Entendido</button>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmación de Redirección Externa -->
    <div v-if="externalRedirect" class="modal-overlay" @click.self="externalRedirect = null">
      <div class="modal-card external-modal-card">
        <div class="external-modal-body">
          <div class="external-icon-circle" aria-hidden="true">
            <ExternalLink :size="24" />
          </div>
          <h3 class="external-modal-title">Estás a punto de salir de SIGEDIN</h3>
          <p class="external-modal-desc">
            Serás redirigido al portal externo de
            <strong>{{ externalRedirect.name }}</strong>
            en una nueva pestaña del navegador:
          </p>
          <div class="external-url-box">{{ externalRedirect.url }}</div>
          <div class="external-modal-actions">
            <button type="button" class="btn-outline" @click="externalRedirect = null">
              Cancelar
            </button>
            <button type="button" class="btn-primary" @click="confirmarRedireccionExterna">
              Continuar y abrir
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, provide, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  BarChart2,
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  CreditCard,
  ExternalLink,
  FileEdit,
  GitFork,
  Globe,
  GraduationCap,
  HandHeart,
  Heart,
  Home,
  LogOut,
  Menu,
  Moon,
  RefreshCw,
  Settings,
  Star,
  Sun,
  TrendingUp,
  User,
  X
} from 'lucide-vue-next'
import { estudianteMock } from '@/data/mockData'

const route = useRoute()
const isMobile = ref(window.innerWidth < 1024)
const drawerOpen = ref(window.innerWidth >= 1024)
const matriculaExpanded = ref(false)
const serviciosExpanded = ref(false)
const accountMenuOpen = ref(false)
const accountWrapRef = ref(null)
const ratingModalOpen = ref(false)
const ratingValue = ref(5)
const systemModal = ref(null)
const externalRedirect = ref(null)
const isDark = ref(document.documentElement.classList.contains('dark'))
const userPhoto = ref(localStorage.getItem('sigedin_user_photo') || '')

function syncUserPhoto() {
  userPhoto.value = localStorage.getItem('sigedin_user_photo') || ''
}

function solicitarRedireccionExterna(name, url) {
  accountMenuOpen.value = false
  if (isMobile.value) {
    drawerOpen.value = false
  }
  externalRedirect.value = { name, url }
}

function confirmarRedireccionExterna() {
  if (!externalRedirect.value) return
  const targetUrl = externalRedirect.value.url
  externalRedirect.value = null
  window.open(targetUrl, '_blank', 'noopener,noreferrer')
}

provide('openExternalModal', solicitarRedireccionExterna)

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
  window.addEventListener('profile-photo-updated', syncUserPhoto)
  window.addEventListener('storage', syncUserPhoto)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('click', handleClickOutsideAccount)
  window.removeEventListener('profile-photo-updated', syncUserPhoto)
  window.removeEventListener('storage', syncUserPhoto)
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
  background: linear-gradient(180deg, #185686 0%, #12456d 55%, #0d3554 100%);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.08);
  color: #ffffff;
  z-index: 40;
  overflow: hidden;
  transition: transform 0.25s ease, width 0.25s ease;
  display: flex;
  flex-direction: column;
}

.sidebar-collapsed {
  transform: translateX(-100%);
}

.sidebar-mini {
  width: var(--sidebar-collapsed-width);
}

.sidebar-mini .sidebar-brand {
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 14px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.brand-isotipo-svg {
  width: 30px;
  height: 34px;
  flex-shrink: 0;
}

.sidebar-mini .collapse-btn {
  position: static;
  transform: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
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

.sidebar-mini .nav-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 42px;
  margin: 4px auto;
  padding: 0;
  border-radius: 10px;
  border-left: none;
}

.sidebar-mini .nav-item:hover {
  transform: none;
}

.nav-section-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.12);
  margin: 8px 16px;
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
  flex-shrink: 0;
  padding: 22px 18px 20px 22px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  overflow: hidden;
}

.sidebar-brand img {
  width: 152px;
  max-width: 152px;
  height: auto;
  flex-shrink: 0;
  transition: opacity 0.15s ease;
}

.collapse-btn {
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.9);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: background-color 0.15s ease;
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
  padding: 6px 0 12px;
  display: flex;
  flex-direction: column;
}

.nav-section-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.45);
  padding: 12px 18px 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 2px 10px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 0.92rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.92);
  background: transparent;
  border: none;
  border-left: 3px solid transparent;
  width: calc(100% - 20px);
  text-align: left;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.18s ease;
}

.nav-item > span,
.group-arrow,
.sidebar-pronto-badge {
  transition: opacity 0.15s ease;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.09);
  transform: translateX(2px);
}

.nav-item-active {
  background: rgba(255, 255, 255, 0.16);
  font-weight: 600;
  border-left: 3px solid #f59e0b;
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
  border-left: 1.5px solid rgba(255, 255, 255, 0.22);
  margin-left: 24px;
  padding: 2px 0;
  overflow: hidden;
  max-height: 240px;
  transition: max-height 0.22s ease, opacity 0.18s ease;
}

.nav-child {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin: 2px 10px 2px 8px;
  padding: 8px 12px;
  width: calc(100% - 18px);
  min-height: 36px;
  font-size: 0.86rem;
}

.nav-child > span.flex-1 {
  white-space: normal;
  line-height: 1.25;
  flex: 1;
  min-width: 0;
}

.sidebar-pronto-badge {
  flex-shrink: 0;
  font-size: 10px;
  font-weight: 600;
  line-height: 1.2;
  padding: 2px 6px;
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.45);
}

.sidebar-ext-icon {
  opacity: 0.72;
  flex-shrink: 0;
}

.sidebar-footer {
  padding: 14px 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.12);
  font-size: 0.72rem;
  line-height: 1.45;
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.72);
}

.sidebar-credits {
  margin-top: 5px;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.88);
}

.credit-brand {
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 2px;
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
  overflow: hidden;
}

.avatar-photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  display: block;
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

/* Modal de Redirección Externa */
.external-modal-card {
  max-width: 440px;
}

.external-modal-body {
  padding: 26px 24px 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.external-icon-circle {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(24, 86, 134, 0.12);
  color: #185686;
  display: grid;
  place-items: center;
  margin-bottom: 14px;
}

:root.dark .external-icon-circle {
  background: rgba(56, 189, 248, 0.16);
  color: #38bdf8;
}

.external-modal-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.external-modal-desc {
  margin: 8px 0 14px;
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.45;
}

.external-url-box {
  width: 100%;
  padding: 9px 12px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-subtle);
  color: var(--text-primary);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.78rem;
  word-break: break-all;
  margin-bottom: 18px;
}

.external-modal-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  width: 100%;
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

@media (max-width: 600px) {
  .app-toolbar {
    padding: 8px 12px;
    gap: 8px;
  }

  .toolbar-title {
    font-size: 1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 46vw;
  }

  .account-info {
    display: none;
  }

  .page-container {
    padding: 14px 14px 72px;
  }
}
</style>
