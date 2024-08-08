const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CitySchema = new Schema({
    city_name: { type: String, required: true },
    city_description: { type: String, required: true },
    city_population: { type: String },
    city_state: { type: String },
    city_country: { type: String },
    city_language: { type: String },
    city_images: [{
        image_url: { type: String },
        image_description: { type: String },
        image_name: { type: String },
    }]
});

const City = mongoose.model('City', CitySchema);

module.exports = City;
