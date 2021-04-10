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

  async update(req, res) {

  }
}


module.exports = {
  CrudController,
};

