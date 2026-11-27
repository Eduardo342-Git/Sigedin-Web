// Datos ficticios estructurados a partir de los endpoints reales de SIGEDIN Académico

export const estudianteMock = {
  identificacion: '1098765432',
  primerNombre: 'Camilo',
  nombres: 'CAMILO ANDRES',
  apellidos: 'MARTINEZ LOPEZ',
  nombreCompleto: 'CAMILO ANDRES MARTINEZ LOPEZ',
  iniciales: 'CM',
  correoInstitucional: 'cmartinez24@itp.edu.co',
  correoPersonal: 'camilo.martinez.demo@correo.com',
  celular: '3105550192',
  direccion: 'CRA 14 # 11-24',
  barrio: 'Centro',
  programaActual: {
    id: 36889,
    codigoEstudiante: '3115249981',
    sede: 'UNIP-MOCOA',
    jornada: 'NOCTURNA',
    snies: '105603',
    ciclo: 'TECNOLOGICO',
    programa: 'TECNOLOGIA EN DESARROLLO DE SOFTWARE',
    plan: '2024-TDS',
    semestre: 'SEXTO SEMESTRE - C',
    periodo: '2026-2',
    estado: 'MATRICULADO'
  },
  diasSinActualizarDatos: 98,
  limiteActualizarDatos: 90
}

export const franjasHorarioMock = [
  '8:00 – 9:00 a. m.',
  '9:00 – 10:00 a. m.',
  '10:00 – 11:00 a. m.',
  '11:00 a. m. – 12:00 p. m.',
  '6:30 – 7:30 p. m.',
  '7:30 – 8:30 p. m.',
  '8:45 – 9:45 p. m.',
  '9:45 – 10:45 p. m.'
]

export const periodosHorarioMock = [
  { id: '2026-2', label: '2026-2 • en curso', enCurso: true },
  { id: '2026-1', label: '2026-1', enCurso: false },
  { id: '2025-2', label: '2025-2', enCurso: false }
]

export const horariosPorPeriodoMock = {
  '2026-2': [
    {
      dia: 1,
      rowStart: 4,
      rowSpan: 2,
      codigo: 'TD602',
      unidad: 'PROYECTO DE SOFTWARE III',
      docente: 'LUIS JURADO',
      salon: 'SALON A119 - SALA DE COMPUTO 4',
      creditos: 1,
      horario: 'Lunes 6:30 – 8:30 p. m.'
    },
    {
      dia: 2,
      rowStart: 4,
      rowSpan: 2,
      codigo: 'TD603',
      unidad: 'METODOLOGÍA DE DESARROLLO DE SOFTWARE',
      docente: 'EDWARD ALEGRIA',
      salon: 'SALON A118 - SALA DE COMPUTO 5',
      creditos: 2,
      horario: 'Martes 6:30 – 8:30 p. m.'
    },
    {
      dia: 3,
      rowStart: 4,
      rowSpan: 2,
      codigo: 'TD603',
      unidad: 'METODOLOGÍA DE DESARROLLO DE SOFTWARE',
      docente: 'EDWARD ALEGRIA',
      salon: 'AULA C-209',
      creditos: 2,
      horario: 'Miércoles 6:30 – 8:30 p. m.'
    },
    {
      dia: 3,
      rowStart: 6,
      rowSpan: 2,
      codigo: 'EC01',
      unidad: 'ELECTIVA COMPLEMENTARIA I',
      docente: 'RAUL RODRIGUEZ',
      salon: 'SALON A119 - SALA DE COMPUTO 4',
      creditos: 2,
      horario: 'Miércoles 8:45 – 10:45 p. m.',
      bg: '#B7F072',
      color: '#1A2E05'
    },
    {
      dia: 4,
      rowStart: 4,
      rowSpan: 2,
      codigo: 'TD604',
      unidad: 'TELEMÁTICA',
      docente: 'DANIEL CERON',
      salon: 'SALON A119 - SALA DE COMPUTO 4',
      creditos: 2,
      horario: 'Jueves 6:30 – 8:30 p. m.'
    },
    {
      dia: 5,
      rowStart: 4,
      rowSpan: 2,
      codigo: 'TD601',
      unidad: 'PROGRAMACIÓN FRONTEND',
      docente: 'HENRY ROSERO',
      salon: 'SALON A118 - SALA DE COMPUTO 5',
      creditos: 2,
      horario: 'Viernes 6:30 – 8:30 p. m.'
    },
    {
      dia: 6,
      rowStart: 0,
      rowSpan: 4,
      codigo: 'TD605',
      unidad: 'ELECTIVA PROFESIONAL III',
      docente: 'RAUL RODRIGUEZ',
      salon: 'MODALIDAD VIRTUAL',
      creditos: 2,
      horario: 'Sábado 8:00 a. m. – 12:00 p. m.',
      bg: '#5B0E54',
      color: '#FFFFFF'
    }
  ],
  '2026-1': [
    {
      dia: 1,
      rowStart: 4,
      rowSpan: 2,
      codigo: 'TD501',
      unidad: 'PROGRAMACIÓN BACKEND',
      docente: 'HENRY ROSERO',
      salon: 'SALON A118 - SALA DE COMPUTO 5',
      creditos: 2,
      horario: 'Lunes 6:30 – 8:30 p. m.'
    },
    {
      dia: 2,
      rowStart: 4,
      rowSpan: 2,
      codigo: 'TD504',
      unidad: 'DESARROLLO DE BASE DE DATOS',
      docente: 'CARLOS MENESES',
      salon: 'SALON A119 - SALA DE COMPUTO 4',
      creditos: 1,
      horario: 'Martes 6:30 – 8:30 p. m.'
    },
    {
      dia: 4,
      rowStart: 4,
      rowSpan: 2,
      codigo: 'TD503',
      unidad: 'PRUEBAS DE SOFTWARE E IMPLEMENTACIÓN',
      docente: 'EDWARD ALEGRIA',
      salon: 'AULA C-204',
      creditos: 2,
      horario: 'Jueves 6:30 – 8:30 p. m.'
    },
    {
      dia: 5,
      rowStart: 6,
      rowSpan: 2,
      codigo: 'TD505',
      unidad: 'REDES Y COMUNICACIONES II',
      docente: 'DANIEL CERON',
      salon: 'SALON A119 - SALA DE COMPUTO 4',
      creditos: 2,
      horario: 'Viernes 8:45 – 10:45 p. m.',
      bg: '#B7F072',
      color: '#1A2E05'
    }
  ],
  '2025-2': [
    {
      dia: 1,
      rowStart: 4,
      rowSpan: 2,
      codigo: 'TD401',
      unidad: 'PROGRAMACIÓN ORIENTADA A LA WEB',
      docente: 'HENRY ROSERO',
      salon: 'SALON A118 - SALA DE COMPUTO 5',
      creditos: 2,
      horario: 'Lunes 6:30 – 8:30 p. m.'
    },
    {
      dia: 3,
      rowStart: 4,
      rowSpan: 2,
      codigo: 'TD404',
      unidad: 'DISEÑO DE BASE DE DATOS',
      docente: 'CARLOS MENESES',
      salon: 'SALON A119 - SALA DE COMPUTO 4',
      creditos: 2,
      horario: 'Miércoles 6:30 – 8:30 p. m.'
    },
    {
      dia: 6,
      rowStart: 0,
      rowSpan: 3,
      codigo: 'ING02',
      unidad: 'CURSO REQ. GRADO INGLÉS A2',
      docente: 'FERNANDO CORTEZ',
      salon: 'AULA B-102',
      creditos: 0,
      horario: 'Sábado 8:00 – 11:00 a. m.',
      bg: '#5B0E54',
      color: '#FFFFFF'
    }
  ]
}

export const boletinMock = {
  matricula: 99169,
  periodo: '2026-2',
  resumen: {
    promedioSemestre: 4.1,
    promedioPonderado: 3.9,
    totalCreditos: 11,
    totalHoras: 21
  },
  unidades: [
    { codigo: 'EC01', unidad: 'ELECTIVA COMPLEMENTARIA I', ihs: 2, creditos: 2, p1: 4.2, p2: 4.0, examenFinal: 4.3, definitiva: 4.2, faltas: 0, estado: 'MATRICULADA' },
    { codigo: 'TD605', unidad: 'ELECTIVA PROFESIONAL III', ihs: 4, creditos: 2, p1: 4.0, p2: 4.1, examenFinal: 0, definitiva: 4.1, faltas: 0, estado: 'MATRICULADA' },
    { codigo: 'TD603', unidad: 'METODOLOGÍA DE DESARROLLO DE SOFTWARE', ihs: 4, creditos: 2, p1: 3.8, p2: 4.2, examenFinal: 0, definitiva: 4.0, faltas: 1, estado: 'MATRICULADA' },
    { codigo: 'TD601', unidad: 'PROGRAMACIÓN FRONTEND', ihs: 4, creditos: 2, p1: 4.5, p2: 4.6, examenFinal: 0, definitiva: 4.6, faltas: 0, estado: 'MATRICULADA' },
    { codigo: 'TD602', unidad: 'PROYECTO DE SOFTWARE III', ihs: 3, creditos: 1, p1: 4.3, p2: 4.1, examenFinal: 0, definitiva: 4.2, faltas: 0, estado: 'MATRICULADA' },
    { codigo: 'TD604', unidad: 'TELEMÁTICA', ihs: 4, creditos: 2, p1: 3.6, p2: 3.9, examenFinal: 0, definitiva: 3.8, faltas: 2, estado: 'MATRICULADA' }
  ]
}

export const boletinesPorPeriodoMock = {
  '2026-2': {
    periodo: '2026-2',
    enCurso: true,
    semestre: 'SEXTO SEMESTRE - C',
    estadoEstudiante: 'MATRICULADO',
    promedioPonderado: null,
    promedioSemestre: null,
    creditos: 11,
    unidades: [
      { codigo: 'EC01', unidad: 'ELECTIVA COMPLEMENTARIA I', ihs: 2, creditos: 2, c1: null, c2: null, c3: null, faltas: 0, estado: 'En curso' },
      { codigo: 'TD605', unidad: 'ELECTIVA PROFESIONAL III', ihs: 4, creditos: 2, c1: null, c2: null, c3: null, faltas: 0, estado: 'En curso' },
      { codigo: 'TD603', unidad: 'METODOLOGÍA DE DESARROLLO DE SOFTWARE', ihs: 4, creditos: 2, c1: null, c2: null, c3: null, faltas: 0, estado: 'En curso' },
      { codigo: 'TD601', unidad: 'PROGRAMACIÓN FRONTEND', ihs: 4, creditos: 2, c1: null, c2: null, c3: null, faltas: 0, estado: 'En curso' },
      { codigo: 'TD602', unidad: 'PROYECTO DE SOFTWARE III', ihs: 3, creditos: 1, c1: null, c2: null, c3: null, faltas: 0, estado: 'En curso' },
      { codigo: 'TD604', unidad: 'TELEMÁTICA', ihs: 4, creditos: 2, c1: null, c2: null, c3: null, faltas: 0, estado: 'En curso' }
    ]
  },
  '2026-1': {
    periodo: '2026-1',
    enCurso: false,
    semestre: 'QUINTO SEMESTRE - C',
    estadoEstudiante: 'MATRICULADO',
    promedioPonderado: 3.91,
    promedioSemestre: 4.05,
    creditos: 12,
    unidades: [
      { codigo: 'TD504', unidad: 'DESARROLLO DE BASE DE DATOS', ihs: 2, creditos: 1, c1: 4.0, c2: 4.2, c3: 4.1, faltas: 0, estado: 'Aprobada' },
      { codigo: 'TD506', unidad: 'ELECTIVA PROFESIONAL II', ihs: 4, creditos: 2, c1: 4.2, c2: 4.4, c3: 4.3, faltas: 0, estado: 'Aprobada' },
      { codigo: 'TD501', unidad: 'PROGRAMACIÓN BACKEND', ihs: 4, creditos: 2, c1: 2.8, c2: 3.5, c3: 3.5, faltas: 1, estado: 'Aprobada' },
      { codigo: 'TD502', unidad: 'PROYECTO DE SOFTWARE II', ihs: 3, creditos: 1, c1: 3.9, c2: 4.1, c3: 4.0, faltas: 0, estado: 'Aprobada' },
      { codigo: 'TD503', unidad: 'PRUEBAS DE SOFTWARE E IMPLEMENTACIÓN', ihs: 4, creditos: 2, c1: 3.8, c2: 3.9, c3: 4.0, faltas: 0, estado: 'Aprobada' },
      { codigo: 'TD505', unidad: 'REDES Y COMUNICACIONES II', ihs: 4, creditos: 2, c1: 4.1, c2: 4.0, c3: 4.2, faltas: 0, estado: 'Aprobada' },
      { codigo: 'INST05', unidad: 'TÉCNICAS DE INVESTIGACIÓN', ihs: 3, creditos: 2, c1: 4.5, c2: 4.7, c3: 4.6, faltas: 0, estado: 'Aprobada' }
    ]
  },
  '2025-2': {
    periodo: '2025-2',
    enCurso: false,
    semestre: 'CUARTO SEMESTRE - C',
    estadoEstudiante: 'MATRICULADO',
    promedioPonderado: 3.85,
    promedioSemestre: 3.94,
    creditos: 15,
    unidades: [
      { codigo: 'TD404', unidad: 'DISEÑO DE BASE DE DATOS', ihs: 4, creditos: 2, c1: 3.5, c2: 3.8, c3: 3.8, faltas: 0, estado: 'Aprobada' },
      { codigo: 'TD403', unidad: 'DISEÑO DE SISTEMAS DE INFORMACIÓN', ihs: 4, creditos: 2, c1: 4.0, c2: 4.0, c3: 4.0, faltas: 0, estado: 'Aprobada' },
      { codigo: 'BAS03', unidad: 'ECUACIONES DIFERENCIALES', ihs: 4, creditos: 2, c1: 2.7, c2: 3.4, c3: 3.4, faltas: 2, estado: 'Aprobada' },
      { codigo: 'TD406', unidad: 'ELECTIVA PROFESIONAL I', ihs: 4, creditos: 2, c1: 4.0, c2: 4.2, c3: 4.1, faltas: 0, estado: 'Aprobada' },
      { codigo: 'INST04', unidad: 'METODOLOGÍA DE LA INVESTIGACIÓN', ihs: 3, creditos: 2, c1: 4.1, c2: 4.0, c3: 4.2, faltas: 0, estado: 'Aprobada' },
      { codigo: 'TD401', unidad: 'PROGRAMACIÓN ORIENTADA A LA WEB', ihs: 4, creditos: 2, c1: 3.8, c2: 4.0, c3: 3.9, faltas: 0, estado: 'Aprobada' },
      { codigo: 'TD402', unidad: 'PROYECTO DE SOFTWARE I', ihs: 3, creditos: 1, c1: 4.5, c2: 4.7, c3: 4.6, faltas: 0, estado: 'Aprobada' },
      { codigo: 'TD405', unidad: 'REDES Y COMUNICACIONES I', ihs: 4, creditos: 2, c1: 3.9, c2: 4.1, c3: 4.0, faltas: 0, estado: 'Aprobada' }
    ]
  },
  '2024-2': {
    periodo: '2024-2',
    enCurso: false,
    semestre: 'SEGUNDO SEMESTRE - C',
    estadoEstudiante: 'MATRICULADO',
    promedioPonderado: 3.74,
    promedioSemestre: 3.72,
    creditos: 13,
    unidades: [
      { codigo: 'BAS04', unidad: 'ÁLGEBRA LINEAL', ihs: 4, creditos: 2, c1: 3.7, c2: 3.9, c3: 3.8, faltas: 0, estado: 'Aprobada' },
      { codigo: 'TD202', unidad: 'ALGORÍTMOS Y PROGRAMACIÓN II', ihs: 4, creditos: 2, c1: 3.6, c2: 3.9, c3: 3.9, faltas: 0, estado: 'Aprobada' },
      { codigo: 'BAS01', unidad: 'CÁLCULO DIFERENCIAL', ihs: 4, creditos: 2, c1: 3.4, c2: 3.5, c3: 3.6, faltas: 1, estado: 'Aprobada' },
      { codigo: 'TD201', unidad: 'ESTRUCTURA DE DATOS ORIENTADA A OBJETOS', ihs: 5, creditos: 3, c1: 3.2, c2: 3.5, c3: 3.5, faltas: 0, estado: 'Aprobada' },
      { codigo: 'COM02', unidad: 'LECTURA CRÍTICA', ihs: 3, creditos: 2, c1: 4.1, c2: 4.3, c3: 4.2, faltas: 0, estado: 'Aprobada' }
    ]
  },
  '2024-1': {
    periodo: '2024-1',
    enCurso: false,
    semestre: 'PRIMER SEMESTRE - C',
    estadoEstudiante: 'MATRICULADO',
    promedioPonderado: 3.95,
    promedioSemestre: 3.95,
    creditos: 13,
    unidades: [
      { codigo: 'TD103', unidad: 'ALGORÍTMOS Y PROGRAMACIÓN I', ihs: 4, creditos: 2, c1: 4.2, c2: 4.4, c3: 4.3, faltas: 0, estado: 'Aprobada' },
      { codigo: 'TD104', unidad: 'INTRODUCCIÓN A LA INGENIERÍA DE SISTEMAS', ihs: 4, creditos: 2, c1: 3.1, c2: 3.4, c3: 3.4, faltas: 0, estado: 'Aprobada' },
      { codigo: 'INST01', unidad: 'PPI Y CPC', ihs: 2, creditos: 1, c1: 4.2, c2: 4.4, c3: 4.3, faltas: 0, estado: 'Aprobada' }
    ]
  }
}

export const planEstudiosMock = {
  programa: 'TECNOLOGIA EN DESARROLLO DE SOFTWARE',
  plan: '2024-TDS',
  resumen: {
    creditosTotal: 79,
    creditosAprobados: 68,
    creditosEnCurso: 11,
    creditosPendientes: 0,
    avance: 86.1,
    unidadesTotal: 39,
    unidadesAprobadas: 33,
    unidadesEnCurso: 6
  },
  semestres: [
    {
      id: 1,
      nombre: 'PRIMER SEMESTRE',
      creditos: 13,
      unidades: [
        { codigo: 'TD103', nombre: 'ALGORÍTMOS Y PROGRAMACIÓN I', creditos: 2, estado: 'aprobada', nota: 4.3, periodo: '2024-1' },
        { codigo: 'TD102', nombre: 'APLICACIÓN DE LAS MATEMÁTICAS Y FÍSICA', creditos: 2, estado: 'aprobada', nota: 3.8, periodo: '2024-2' },
        { codigo: 'COM01', nombre: 'COMUNICACIÓN ESCRITA', creditos: 2, estado: 'aprobada', nota: 3.3, periodo: '2024-2' },
        { codigo: 'TD104', nombre: 'INTRODUCCIÓN A LA INGENIERÍA DE SISTEMAS', creditos: 2, estado: 'aprobada', nota: 3.3, periodo: '2024-1' },
        { codigo: 'INST01', nombre: 'PPI Y CPC', creditos: 1, estado: 'aprobada', nota: 4.3, periodo: '2024-1' },
        { codigo: 'TD101', nombre: 'RAZONAMIENTO LÓGICO Y CUANTITATIVO', creditos: 4, estado: 'aprobada', nota: 3.8, periodo: '2024-2' }
      ]
    },
    {
      id: 2,
      nombre: 'SEGUNDO SEMESTRE',
      creditos: 13,
      unidades: [
        { codigo: 'BAS04', nombre: 'ÁLGEBRA LINEAL', creditos: 2, estado: 'aprobada', nota: 3.8, periodo: '2024-2' },
        { codigo: 'TD202', nombre: 'ALGORÍTMOS Y PROGRAMACIÓN II', creditos: 2, estado: 'aprobada', nota: 3.8, periodo: '2024-2' },
        { codigo: 'BAS01', nombre: 'CÁLCULO DIFERENCIAL', creditos: 2, estado: 'aprobada', nota: 3.5, periodo: '2024-2' },
        { codigo: 'INST02', nombre: 'CULTURA AMAZÓNICA', creditos: 2, estado: 'aprobada', nota: 4.2, periodo: '2024-1' },
        { codigo: 'TD201', nombre: 'ESTRUCTURA DE DATOS ORIENTADA A OBJETOS', creditos: 3, estado: 'aprobada', nota: 3.4, periodo: '2024-2' },
        { codigo: 'COM02', nombre: 'LECTURA CRÍTICA', creditos: 2, estado: 'aprobada', nota: 4.2, periodo: '2024-2' }
      ]
    },
    {
      id: 3,
      nombre: 'TERCER SEMESTRE',
      creditos: 15,
      unidades: [
        { codigo: 'BAS02', nombre: 'CÁLCULO INTEGRAL', creditos: 2, estado: 'aprobada', nota: 3.0, periodo: '2025-1' },
        { codigo: 'TD302', nombre: 'DEFINICIÓN Y ANÁLISIS DE REQUERIMIENTOS', creditos: 2, estado: 'aprobada', nota: 3.7, periodo: '2025-1' },
        { codigo: 'BAS05', nombre: 'ESTADÍSTICA Y PROBABILIDADES', creditos: 4, estado: 'aprobada', nota: 3.8, periodo: '2025-1' },
        { codigo: 'TD303', nombre: 'INTRODUCCIÓN A BASE DE DATOS', creditos: 2, estado: 'aprobada', nota: 3.9, periodo: '2025-1' },
        { codigo: 'TD301', nombre: 'PROGRAMACIÓN ORIENTADA A OBJETOS', creditos: 3, estado: 'aprobada', nota: 4.1, periodo: '2025-1' },
        { codigo: 'INST03', nombre: 'SOSTENIBILIDAD AMBIENTAL', creditos: 2, estado: 'aprobada', nota: 4.1, periodo: '2024-1' }
      ]
    },
    {
      id: 4,
      nombre: 'CUARTO SEMESTRE',
      creditos: 15,
      unidades: [
        { codigo: 'TD404', nombre: 'DISEÑO DE BASE DE DATOS', creditos: 2, estado: 'aprobada', nota: 3.7, periodo: '2025-2' },
        { codigo: 'TD403', nombre: 'DISEÑO DE SISTEMAS DE INFORMACIÓN', creditos: 2, estado: 'aprobada', nota: 4.0, periodo: '2025-2' },
        { codigo: 'BAS03', nombre: 'ECUACIONES DIFERENCIALES', creditos: 2, estado: 'aprobada', nota: 3.2, periodo: '2025-2' },
        { codigo: 'TD406', nombre: 'ELECTIVA PROFESIONAL I', creditos: 2, estado: 'aprobada', nota: 4.1, periodo: '2025-2' },
        { codigo: 'INST04', nombre: 'METODOLOGÍA DE LA INVESTIGACIÓN', creditos: 2, estado: 'aprobada', nota: 4.1, periodo: '2025-2' },
        { codigo: 'TD401', nombre: 'PROGRAMACIÓN ORIENTADA A LA WEB', creditos: 2, estado: 'aprobada', nota: 3.9, periodo: '2025-2' },
        { codigo: 'TD402', nombre: 'PROYECTO DE SOFTWARE I', creditos: 1, estado: 'aprobada', nota: 4.6, periodo: '2025-2' },
        { codigo: 'TD405', nombre: 'REDES Y COMUNICACIONES I', creditos: 2, estado: 'aprobada', nota: 4.0, periodo: '2025-2' }
      ]
    },
    {
      id: 5,
      nombre: 'QUINTO SEMESTRE',
      creditos: 12,
      unidades: [
        { codigo: 'TD504', nombre: 'DESARROLLO DE BASE DE DATOS', creditos: 1, estado: 'aprobada', nota: 4.1, periodo: '2026-1' },
        { codigo: 'TD506', nombre: 'ELECTIVA PROFESIONAL II', creditos: 2, estado: 'aprobada', nota: 4.3, periodo: '2026-1' },
        { codigo: 'TD501', nombre: 'PROGRAMACIÓN BACKEND', creditos: 2, estado: 'aprobada', nota: 3.3, periodo: '2026-1' },
        { codigo: 'TD502', nombre: 'PROYECTO DE SOFTWARE II', creditos: 1, estado: 'aprobada', nota: 4.0, periodo: '2026-1' },
        { codigo: 'TD503', nombre: 'PRUEBAS DE SOFTWARE E IMPLEMENTACIÓN', creditos: 2, estado: 'aprobada', nota: 3.9, periodo: '2026-1' },
        { codigo: 'TD505', nombre: 'REDES Y COMUNICACIONES II', creditos: 2, estado: 'aprobada', nota: 4.1, periodo: '2026-1' },
        { codigo: 'INST05', nombre: 'TÉCNICAS DE INVESTIGACIÓN', creditos: 2, estado: 'aprobada', nota: 4.6, periodo: '2026-1' }
      ]
    },
    {
      id: 6,
      nombre: 'SEXTO SEMESTRE',
      creditos: 11,
      unidades: [
        { codigo: 'EC01', nombre: 'ELECTIVA COMPLEMENTARIA I', creditos: 2, estado: 'en_curso', nota: null, periodo: '2026-2' },
        { codigo: 'TD605', nombre: 'ELECTIVA PROFESIONAL III', creditos: 2, estado: 'en_curso', nota: null, periodo: '2026-2' },
        { codigo: 'TD603', nombre: 'METODOLOGÍA DE DESARROLLO DE SOFTWARE', creditos: 2, estado: 'en_curso', nota: null, periodo: '2026-2' },
        { codigo: 'TD601', nombre: 'PROGRAMACIÓN FRONTEND', creditos: 2, estado: 'en_curso', nota: null, periodo: '2026-2' },
        { codigo: 'TD602', nombre: 'PROYECTO DE SOFTWARE III', creditos: 1, estado: 'en_curso', nota: null, periodo: '2026-2' },
        { codigo: 'TD604', nombre: 'TELEMÁTICA', creditos: 2, estado: 'en_curso', nota: null, periodo: '2026-2' }
      ]
    }
  ]
}

export const requisitosMatriculaMock = {
  periodo: '2026-2',
  sede: 'UNIP-MOCOA',
  semestre: 'SEXTO SEMESTRE',
  estadoGeneral: 'APROBADO',
  abierto: false,
  motivo: 'El plazo para cargar los documentos terminó el 26 ago 2026.',
  documentos: [
    { id: 1, nombre: 'Comprobante de pago de matrícula', estado: 'Aprobado', fecha: '2026-08-12' },
    { id: 2, nombre: 'Certificado de afiliación EPS / Salud', estado: 'Aprobado', fecha: '2026-08-14' },
    { id: 3, nombre: 'Documento de identidad vigente', estado: 'Aprobado', fecha: '2026-08-14' },
    { id: 4, nombre: 'Acta de compromiso estudiantil', estado: 'Aprobado', fecha: '2026-08-15' }
  ]
}

export const cursosGradoMock = [
  {
    id: 2907,
    periodo: '2025-2',
    sede: 'UNIP-MOCOA',
    curso: 'CURSO REQUISITO PARA GRADO LENGUA EXTRANJERA INGLÉS',
    modalidad: 'NIVEL A2 ESTUDIANTES - NIVELACIÓN',
    grupo: 'A',
    docente: 'FERNANDO ALEXANDER CORTEZ ORTIZ',
    estado: 'Aprobado',
    nota: 4.0
  }
]

export const bienestarMock = {
  sede: 'MOCOA',
  actividades: [
    {
      id: 101,
      titulo: 'Torneo Relámpago de Fútbol Sala Masculino y Femenino',
      categoria: 'Deporte y Recreación',
      fecha: '2026-11-28',
      horario: '17:00 - 20:00',
      lugar: 'Polideportivo Campus Mocoa',
      cuposDisponibles: 8,
      inscrito: false
    },
    {
      id: 102,
      titulo: 'Taller de Manejo del Estrés Académico y Técnicas de Estudio',
      categoria: 'Desarrollo Humano',
      fecha: '2026-12-02',
      horario: '18:00 - 19:30',
      lugar: 'Auditorio Principal Bloque B',
      cuposDisponibles: 14,
      inscrito: true
    },
    {
      id: 103,
      titulo: 'Jornada Cultural Amazónica y Muestra Artística',
      categoria: 'Cultura',
      fecha: '2026-12-05',
      horario: '15:00 - 19:00',
      lugar: 'Plazoleta Central',
      cuposDisponibles: 25,
      inscrito: false
    }
  ]
}

export const propuestasGradoMock = {
  convocatorias: [
    { id: 2, descripcion: 'CONVOCATORIA 2 - 2026', inicio: '2026-06-16', fin: '2026-06-27', activa: true, abierta: false },
    { id: 1, descripcion: 'CONVOCATORIA 1 - 2026', inicio: '2026-05-01', fin: '2026-05-20', activa: false, abierta: false }
  ],
  misPropuestas: [
    {
      id: 501,
      titulo: 'Sistema Web de Gestión Académica Responsiva para Estudiantes UniPutumayo',
      modalidad: 'Proyecto Aplicado',
      director: 'ING. HENRY ROSERO',
      estado: 'En revisión de comité'
    }
  ]
}

export const horasSocialesMock = {
  requeridas: 60,
  acumuladas: 60,
  completo: true,
  participaciones: [
    {
      id: 3132,
      periodo: '2026-2',
      titulo: 'Apoyo en alfabetización digital y desarrollo de portal comunitario',
      supervisor: 'ALVARO ADRIAN IZQUIERDO GOMEZ',
      supervisorCorreo: 'aizquierdo@itp.edu.co',
      horas: 60,
      estado: 'Cumple',
      certificable: true
    }
  ]
}

export const evaluacionDocenteMock = {
  periodo: '2026-2',
  estadoGeneral: 'Disponible',
  asignaturas: [
    { codigo: 'TD601', unidad: 'PROGRAMACIÓN FRONTEND', docente: 'HENRY ROSERO', completada: true },
    { codigo: 'TD602', unidad: 'PROYECTO DE SOFTWARE III', docente: 'LUIS JURADO', completada: true },
    { codigo: 'TD603', unidad: 'METODOLOGÍA DE DESARROLLO DE SOFTWARE', docente: 'EDWARD ALEGRIA', completada: false },
    { codigo: 'TD604', unidad: 'TELEMÁTICA', docente: 'DANIEL CERON', completada: false },
    { codigo: 'TD605', unidad: 'ELECTIVA PROFESIONAL III', docente: 'RAUL RODRIGUEZ', completada: false },
    { codigo: 'EC01', unidad: 'ELECTIVA COMPLEMENTARIA I', docente: 'RAUL RODRIGUEZ', completada: false }
  ]
}

export const solicitudesCatalogoMock = [
  { clave: 'creditos', etiqueta: 'Créditos adicionales', descripcion: 'Pedir más créditos de los permitidos en el semestre.' },
  { clave: 'actualizacion', etiqueta: 'Actualización de datos', descripcion: 'Corregir nombre, documento u otros datos que tú no puedes editar.' },
  { clave: 'habilitacion', etiqueta: 'Habilitación', descripcion: 'Habilitar una unidad que perdiste.' },
  { clave: 'supletorio', etiqueta: 'Supletorio', descripcion: 'Presentar un examen supletorio.' },
  { clave: 'cancelacion', etiqueta: 'Cancelar unidades', descripcion: 'Retirar unidades del semestre en curso.' },
  { clave: 'aplazamiento', etiqueta: 'Aplazamiento de semestre', descripcion: 'Aplazar o retirar el semestre y conservar tu cupo.' },
  { clave: 'reserva', etiqueta: 'Reserva de equipo de cómputo', descripcion: 'Reservar un equipo en la sala de cómputo de tu sede.' }
]

export const pazYSalvoMock = {
  periodo: '2026-2',
  alDia: true,
  dependencias: [
    { clave: 'almacen', nombre: 'Almacén', alDia: true, observacion: 'Sin pendientes' },
    { clave: 'tesoreria', nombre: 'Tesorería', alDia: true, observacion: 'Sin pendientes' },
    { clave: 'bienestar', nombre: 'Bienestar universitario', alDia: true, observacion: 'Sin pendientes' },
    { clave: 'laboratorio', nombre: 'Laboratorio', alDia: true, observacion: 'Sin pendientes' },
    { clave: 'salacomputo', nombre: 'Sala de cómputo', alDia: true, observacion: 'Sin pendientes' },
    { clave: 'biblioteca', nombre: 'Biblioteca', alDia: true, observacion: 'Sin pendientes' },
    { clave: 'laboratoriotic', nombre: 'Laboratorio TIC', alDia: true, observacion: 'Sin pendientes' }
  ]
}
