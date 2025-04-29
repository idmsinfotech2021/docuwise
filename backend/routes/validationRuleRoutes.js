// /routes/validationRuleRoutes.js

const express = require('express');
const router = express.Router();
const {
  getValidationRules,
  addValidationRule,
  updateValidationRule,
  deleteValidationRule
} = require('../controllers/validationRuleController');
//const { protect } = require('../middlewares/authMiddleware'); // Ensure Admin-Only access
//const { adminOnly } = require('../middlewares/roleMiddleware');

// Protect all routes
//router.use(protect);
//router.use(adminOnly);

// Routes
router.get('/:docType', getValidationRules);
router.post('/:docType/add', addValidationRule);
router.put('/:docType/update/:ruleId', updateValidationRule);
router.delete('/:docType/delete/:ruleId', deleteValidationRule);

module.exports = router;
