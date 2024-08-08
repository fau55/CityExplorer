const express = require('express')
const connectToMongo = require('./db')
connectToMongo() 
const app = express()
const port = 3500

// Importing required modules
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



// FOr Cors Error
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
//   next();
// });

// Available Routes
app.use('/api/cityExplore/', require('./routes/city'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

