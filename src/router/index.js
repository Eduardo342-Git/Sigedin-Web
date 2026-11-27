import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import InicioView from '@/views/InicioView.vue'
import MatriculaView from '@/views/MatriculaView.vue'
import PlanEstudiosView from '@/views/PlanEstudiosView.vue'
import NotasBoletinView from '@/views/NotasBoletinView.vue'
import CursosGradoView from '@/views/CursosGradoView.vue'
import BienestarView from '@/views/BienestarView.vue'
import PropuestaGradoView from '@/views/PropuestaGradoView.vue'
import HorasSocialesView from '@/views/HorasSocialesView.vue'
import EvaluacionDocenteView from '@/views/EvaluacionDocenteView.vue'
import ServiciosView from '@/views/ServiciosView.vue'

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
        name: 'matricula',
        component: MatriculaView,
        meta: { title: 'Req. Inscripción y Matrícula' }
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
        meta: { title: 'Cursos Req. Grado' }
      },
      {
        path: 'bienestar',
        name: 'bienestar',
        component: BienestarView,
        meta: { title: 'Actividades Bienestar U.' }
      },
      {
        path: 'propuesta-grado',
        name: 'propuesta-grado',
        component: PropuestaGradoView,
        meta: { title: 'Inscribir Propuesta Grado' }
      },
      {
        path: 'horas-sociales',
        name: 'horas-sociales',
        component: HorasSocialesView,
        meta: { title: 'Horas sociales (Ciecyt)' }
      },
      {
        path: 'evaluacion-docente',
        name: 'evaluacion-docente',
        component: EvaluacionDocenteView,
        meta: { title: 'Evaluación Docente' }
      },
      {
        path: 'servicios',
        name: 'servicios',
        component: ServiciosView,
        meta: { title: 'Servicios en Línea' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
