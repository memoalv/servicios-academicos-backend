'use strict'

const express = require('express')
const router = express.Router();

router.use('/api', require('./api-routes'));

/**
 * Ping endpoint
 */
router.use('/api/status/ping', function(req, res) {
	res.send('pong')
});

module.exports = router;