module.exports = {
  /**
   * Módulos principales
   *
   * Estos necesitarán tener las siguientes propiedades
   * - La llave del módulo tendrá que ser EXACTAMENTE igual a como está el módulo definido en el permiso de KEYCLOAK
   * - nombre: nombre del módulo, tendrá que ser EXACTAMENTE igual a como está el módulo definido en el permiso de KEYCLOAK
   * - icono: iconoo a mostrar en el menú lateral
   * - ruta: ruta principal del módulo (puede ser a un home del módulo o algo parecido)
   * - submodulos: arreglo vacío donde se llenarán los submódulos a la hora de definir los permisos del usuario
   */
  Trámites: {
    nombre: "Trámites",
    icono: "library_books",
    ruta: "",
    submodulos: [],
  },
  Ventanillas: {
    nombre: "Ventanillas",
    icono: "assignment_ind",
    ruta: "",
    submodulos: [],
  },
  Usuarios: {
    nombre: "Usuarios",
    icono: "group",
    ruta: "",
    submodulos: [],
  },
  Escuelas: {
    nombre: "Escuelas",
    icono: "account_balance",
    ruta: "",
    submodulos: [],
  },
  Institutos: {
    nombre: "Institutos",
    icono: "apartment",
    ruta: "",
    submodulos: [],
  },
  Programas: {
    nombre: "Programas",
    icono: "school",
    ruta: "",
    submodulos: [],
  },
  /**
   * Submódulos
   *
   * Estos necesitarán tener las siguientes propiedades
   * - La llave del submódulo tendrá que ser EXACTAMENTE igual a como está el submódulo definido en el permiso de KEYCLOAK
   * - nombre: nombre del submódulo, tendrá que ser EXACTAMENTE igual a como está el módulo definido en el permiso de KEYCLOAK
   * - ruta: ruta del submódulo (definida en el router)
   * - acciones: arreglo vacío donde se llenarán los permisos del usuario sobre el submódulo a la hora de definir los permisos del usuario
   */
  "Listado de trámites": {
    nombre: "Listado de trámites",
    ruta: "tramites",
    acciones: [],
  },
  "Listado de ventanillas": {
    nombre: "Listado de ventanillas",
    ruta: "ventanillas",
    acciones: [],
  },
  "Listado de usuarios": {
    nombre: "Listado de usuarios",
    ruta: "usuarios",
    acciones: [],
  },
  "Listado de escuelas": {
    nombre: "Listado de escuelas",
    ruta: "escuelas",
    acciones: [],
  },
  "Listado de institutos": {
    nombre: "Listado de institutos",
    ruta: "institutos",
    acciones: [],
  },
  "Listado de programas": {
    nombre: "Listado de programas",
    ruta: "programas",
    acciones: [],
  },
};
