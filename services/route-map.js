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
    icono: "mdi-account",
    ruta: "",
    submodulos: [],
  },
  Ventanillas: {
    nombre: "Ventanillas",
    icono: "mdi-clipboard-list",
    ruta: "",
    submodulos: [],
  },
  Usuarios: {
    nombre: "Usuarios",
    icono: "mdi-cart",
    ruta: "",
    submodulos: [],
  },
  Escuelas: {
    nombre: "Escuelas",
    icono: "mdi-point-of-sale",
    ruta: "",
    submodulos: [],
  },
  Institutos: {
    nombre: "Institutos",
    icono: "mdi-sale",
    ruta: "",
    submodulos: [],
  },
  Programas: {
    nombre: "Programas",
    icono: "mdi-file-document",
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
    ruta: "customer-kardex",
    acciones: [],
  },
  "Listado de ventanillas": {
    nombre: "Listado de ventanillas",
    ruta: "card-status",
    acciones: [],
  },
  "Listado de usuarios": {
    nombre: "Listado de usuarios",
    ruta: "new-affiliation",
    acciones: [],
  },
  "Listado de escuelas": {
    nombre: "Listado de escuelas",
    ruta: "",
    acciones: [],
  },
  "Listado de institutos": {
    nombre: "Listado de institutos",
    ruta: "",
    acciones: [],
  },
  "Listado de programas": {
    nombre: "Listado de programas",
    ruta: "rules-table",
    acciones: [],
  },
};
