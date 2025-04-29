const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/validation-kpis', dashboardController.getValidationKPIs);
router.get('/top-validation-errors', dashboardController.getTopValidationErrors);

module.exports = router;