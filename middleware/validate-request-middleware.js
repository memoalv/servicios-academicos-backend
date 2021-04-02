"use strict";
const { validationResult } = require("express-validator");
const { verificarPermisos } = require("../services/auth-service");

module.exports = (permisos = null) => {
	return (req, res, next) => {
		if (permisos) {
			if (!verificarPermisos(permisos, req.tokenParseado.permisos)) {
				return res.status(401).send();
			}
		}

		const errors = validationResult(req);
	
		if (!errors.isEmpty()) {
				return res.status(400).json({ errors: errors.array() });
		}
		
		next();
	}
}