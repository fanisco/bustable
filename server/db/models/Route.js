const mongoose = require('mongoose');
const routeSchema = new mongoose.Schema({
    name: String,
    type: String
}, { collection : 'routes' });
const Route = mongoose.model('Route', routeSchema);
module.exports = Route;
