/**
 * Funcion para calcular el offset y el limite para consultar
 * el listado de registros.
 *
 * @param {int} pagina
 * @param {int} resultados_por_pagina
 *
 * @returns {object} - Objeto conteniendo el offset y el limite para
 * realizar la consulta
 */
const calcularOffset = (pagina, resultados_por_pagina) => {
  const numPagina = parseInt(pagina);
  const numResultadosPP = parseInt(resultados_por_pagina);

  const calculo = numPagina * numResultadosPP;

  return {
    offset: calculo - numResultadosPP,
    limite: calculo,
  };
};

module.exports = {
  calcularOffset,
};
