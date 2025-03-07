const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    correo: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});
module.exports = mongoose.model('User', UserSchema);