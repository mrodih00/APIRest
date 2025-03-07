const express = require('express');
const { getReadingsBySensor, createReading, deleteReadingsBySensor, getReadingsByTimeRange } = require('../controllers/readings.controller');

const router = express.Router();

router.get('/:sensorId', getReadingsBySensor);
router.post('/', createReading);
router.delete('/:sensorId', deleteReadingsBySensor);
router.get('/time/:sensorId', getReadingsByTimeRange);

module.exports = router;
