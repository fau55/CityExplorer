const express = require('express')
const City = require('../models/City')
const router = express.Router()
// for checkig validations
const { body, validationResult } = require('express-validator')

router.post('/', [
    // city name should atleat have 3 letters
    body('city_name').isLength({ min: 3 })
], (req, res) => {
    // checking for errors 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    // City.create({
    //     name : req.body.name,
    //     description : req.body.description,
    //     image : req.body.image
    // }).then(city => res.json(city));

    const city = City(req.body)
    city.save().then(() => {
        res.status(200).json({city})
    })
})

router.get('/get/city', (req, res) => {
    City.find().then((city) => {
        res.status(200).json({ city })
    })
})

router.get('/get/city/by/name/:cityName', (req, res) => {
    let cityname = req.params.cityName.toLowerCase()
    City.findOne({ city_name: cityname }).then((city) => {
        res.status(200).json({ city })
    })
})

router.delete('/delete/cities', (req, res) => {
    City.deleteMany().then(() => {
        res.status(200).json({
            Message: 'Deleted All Successfull!'
        })
    })
})

router.delete('/delete/city/by/:cityName', (req, res) => {
    City.deleteOne({_id : req.params.cityName}).then(() => {
        res.status(200).json({
            Message: 'Deleted Successfull!'
        })
    })
})

router.get('/get/city-image/:cityName', (req, res) => {
    let cityName = req.params.cityName.toLowerCase();
    City.findOne({ city_name: cityName }).then((city) => {
        if (city) {
            res.status(200).json({ cityImage: city.city_images[0].image_url })
        }
        else {

            res.status(200).json({ cityImage: 'https://static.toiimg.com/photo/56759746.cms' })
        }
    })
})

router.post('/city/add/images/:cityName',(req,res)=>{
    let cityname = req.params.cityName.toLowerCase()
    City.findOne({city_name : cityname}).then((city)=>{
        city.city_images.push(req.body)
        city.save().then(()=>{
            res.status(200).json({city})
        })
    })
})
module.exports = router