import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import InicioView from '@/views/InicioView.vue'
import MatriculaView from '@/views/MatriculaView.vue'
import RegistroUnidadesView from '@/views/RegistroUnidadesView.vue'
import PlanEstudiosView from '@/views/PlanEstudiosView.vue'
import NotasBoletinView from '@/views/NotasBoletinView.vue'
import CursosGradoView from '@/views/CursosGradoView.vue'
import BienestarView from '@/views/BienestarView.vue'
import PropuestaGradoView from '@/views/PropuestaGradoView.vue'
import HorasSocialesView from '@/views/HorasSocialesView.vue'
import EvaluacionDocenteView from '@/views/EvaluacionDocenteView.vue'
import SolicitudesView from '@/views/SolicitudesView.vue'
import PazYSalvoView from '@/views/PazYSalvoView.vue'
import HojaVidaView from '@/views/HojaVidaView.vue'
import CarnetView from '@/views/CarnetView.vue'
import CalendarioView from '@/views/CalendarioView.vue'
import BibliotecaView from '@/views/BibliotecaView.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'inicio',
        component: InicioView,
        meta: { title: 'Inicio' }
      },
      {
        path: 'matricula',
        redirect: '/matricula/requisitos'
      },
      {
        path: 'matricula/requisitos',
        name: 'matricula-requisitos',
        component: MatriculaView,
        meta: { title: 'Requisitos' }
      },
      {
        path: 'matricula/registro-unidades',
        name: 'matricula-registro-unidades',
        component: RegistroUnidadesView,
        meta: { title: 'Reg. de Unidades y Horario' }
      },
      {
        path: 'plan-estudios',
        name: 'plan-estudios',
        component: PlanEstudiosView,
        meta: { title: 'Plan de Estudios' }
      },
      {
        path: 'notas-boletin',
        name: 'notas-boletin',
        component: NotasBoletinView,
        meta: { title: 'Notas y boletín' }
      },
      {
        path: 'cursos-grado',
        name: 'cursos-grado',
        component: CursosGradoView,
        meta: { title: 'Cursos requisito para grado' }
      },
      {
        path: 'bienestar',
        name: 'bienestar',
        component: BienestarView,
        meta: { title: 'Actividades de Bienestar' }
      },
      {
        path: 'propuesta-grado',
        name: 'propuesta-grado',
        component: PropuestaGradoView,
        meta: { title: 'Propuestas de grado' }
      },
      {
        path: 'horas-sociales',
        name: 'horas-sociales',
        component: HorasSocialesView,
        meta: { title: 'Horas sociales' }
      },
      {
        path: 'evaluacion-docente',
        name: 'evaluacion-docente',
        component: EvaluacionDocenteView,
        meta: { title: 'Evaluación Docente' }
      },
      {
        path: 'servicios',
        redirect: '/servicios/solicitudes'
      },
      {
        path: 'servicios/solicitudes',
        name: 'servicios-solicitudes',
        component: SolicitudesView,
        meta: { title: 'Solicitudes' }
      },
      {
        path: 'servicios/paz-y-salvo',
        name: 'servicios-paz-y-salvo',
        component: PazYSalvoView,
        meta: { title: 'Paz y salvo' }
      },
      {
        path: 'hoja-de-vida',
        name: 'hoja-de-vida',
        component: HojaVidaView,
        meta: { title: 'Mis datos' }
      },
      {
        path: 'carnet',
        name: 'carnet',
        component: CarnetView,
        meta: { title: 'Carnet' }
      },
      {
        path: 'calendario',
        name: 'calendario',
        component: CalendarioView,
        meta: { title: 'Calendario académico' }
      },
      {
        path: 'biblioteca',
        name: 'biblioteca',
        component: BibliotecaView,
        meta: { title: 'Biblioteca' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
