const express = require('express');
const router = express.Router();
const catatanController = require('../controllers/catatanController');

// Rute untuk API Catatan
router.get('/', catatanController.getCatatan);
router.post('/', catatanController.createCatatan);
router.put('/:id', catatanController.updateCatatan);
router.delete('/:id', catatanController.deleteCatatan);

module.exports = router;