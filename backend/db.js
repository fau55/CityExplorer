const mongoose = require('mongoose');
const mongoURL = 'mongodb+srv://farahhashmi13sk:sag1yluM8pUlafjC@cluster0.vlsff.mongodb.net/CityExplore?retryWrites=true&w=majority&appName=Cluster0'

const connectToMongo = () =>{

    mongoose.connect(mongoURL).then(()=>{
        console.log('DataBase Connected!!');
    }).catch(()=>{
        
        console.log('DataBase Failded to Connect!!');
    })
}
module.exports = connectToMongo ;