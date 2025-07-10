const express = require('express');
const app = express();
const cors = require('cors');
const  mongoose  = require('mongoose');
require('dotenv').config()
const routes = require('./routes/router')



// Mongo DB Connections
mongoose.connect(process.env.MONGODB_URI).then(response=>{
    console.log('MongoDB Connection Succeeded.')
}).catch(error=>{
    console.log('Error in DB connection: ' + error)
});


// Middleware Connections
app.use(cors())
app.use(express.json())
app.use(routes);


// Routes


// Connection
const PORT = process.env.PORT || 3000
app.listen(PORT, ()=>{
    console.log('App running in port: '+PORT)
})