const mongoose = require('mongoose');
const SensorSchema = new mongoose.Schema({
sensorId: String,
value: Number,
unit: String,
timestamps: Date,
createdAt: { type: Date, default: Date.now }
});
// Exportamos el modelo, el nombre debe estar en singular
module.exports = mongoose.model('Reading', SensorSchema);