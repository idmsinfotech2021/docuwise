const express = require('express');
const router = express.Router();
const { saveQuestions, getQuestions } = require('../controllers/questionConfigController');
const { verifyUser } = require('../middlewares/authMiddleware');

router.post('/save', verifyUser, saveQuestions);
router.get('/', verifyUser, getQuestions);

module.exports = router;
