const express = require('express');
const { recommendCrop, fertilizerAI, mandiAI, chatAI } = require('../controllers/aiController');

const router = express.Router();

router.post('/recommend-crop', recommendCrop);
router.post('/fertilizer-ai', fertilizerAI);
router.post('/mandi-ai', mandiAI);
router.post('/chat', chatAI);

module.exports = router;
