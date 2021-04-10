const db = require("../models");
const { validationResult, body, query } = require("express-validator");

class CrudController {
  constructor(model_name, main_field) {
    this.model = db[model_name];
    this.model_name = model_name;
    this.main_field = main_field;
    this.init();
  }

  async init() {
    this.table_fields = {};

    this.model
      .describe()
      .then((modelDesc) => {
        const ignoreColumns = ["id", "created_at", "updated_at"];

        for (const key in modelDesc) {
          if (!ignoreColumns.includes(key)) {
            this.table_fields[key] = modelDesc[key]["type"];
          }
        }

        this.constructorError = false;
      })
      .catch((e) => {
        console.error(e);
        this.constructorError = true;
      });
  }

  


  /**
   * Creación de nuevos registros. 
   * 
   * Los campos del JSON tienen que llamarse igual que las columnas de la tabla
   * para que funcione la inserción. Además, hay que definir un campo 'base'
   * al momento de instanciar la clase para hacer la validación de que no se 
   * están creando registros duplicados.
   * 
   */
  async create(req, res) {
    if (this.constructorError) {
      console.error(`Error en el constructor: ${this.model}`);
      return res.status(500).send();
    }

    let record_exists = false;
    let query_clause = {};
    query_clause[this.main_field] = req.body[this.main_field];
    try {
      record_exists = await this.model.findOne({
        where: query_clause,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json();
    }

    if (!!record_exists) {
      return res.status(400).json({
        mensaje: `Registro ya existe`,
      });
    }

    query_clause = {}
    for (const field in this.table_fields) {
      query_clause[field] = req.body[field]
    }

    try {
      await this.model.create(query_clause);
    } catch (error) {
      console.error(error);
      return res.status(500).send();
    }
    console.log("success");
    return res.status(200).json({
      mensaje: `Registro creado correctamente`,
    });
  }

  /**
   * Actualización de campos
   *  
   * Los campos del JSON tiene que contener el campo 'id' para identificar
   * el registro a actualizar. Los demás campos serán las demás columnas de
   * la tabla.
   */
  async update(req, res) {
    if (this.constructorError) {
      console.error(`Error en el constructor: ${this.model}`);
      return res.status(500).send();
    }

    let update_clause = {}
    for (const field in this.table_fields) {
      update_clause[field] = req.body[field]
    }

    let where_clause = {
      id: req.body.id
    }

    if (Object.keys(where_clause).length === 0) {
      console.error(`Clausula where en update vacía. ${this.model}`);
      return res.status(500).send();
    }
    
    try {
      var [numActualizados] = await this.model.update(
        update_clause,
        {
          where: where_clause,
        }
      );
    } catch (error) {
      console.error(error);
      return res.status(500).json();
    }
  
    if (numActualizados < 1) {
      return res.status(400).json({ mensaje: "El registro a actualizar no existe" });
    }
  
    return res.status(200).json({
      mensaje: "Registro actualizado correctamente",
    });
  }

  /**
   * Borrado de registros
   * 
   * Solo se utiliza el campo 'id' en el JSON del request para identificar
   * el registro a eliminar.
   */
  async delete(req, res) {

    let where_clause = {
      id: req.body.id
    };

    if (Object.keys(where_clause).length === 0) {
      console.error(`Clausula where en delete vacía. ${this.model}`);
      return res.status(500).send();
    }

    try {
      var numBorrados = await this.model.destroy({
        where: where_clause,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json();
    }
  
    if (numBorrados < 1) {
      return res.status(400).json({ mensaje: "El registro a borrar no existe" });
    }
  
    return res.status(200).json({
      mensaje: "Registro eliminado correctamente",
    });
  }
}



module.exports = {
  CrudController,
};

