'use strict'

const express = require('express')
const router = express.Router();

/**
 * Authenticate routes via keycloak
 */
const test = require('../controllers/test-controller')
router.get('/test', test.save);

module.exports = router;