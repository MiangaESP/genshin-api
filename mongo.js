const mongoose = require('mongoose')

const { MONGO_DB_URI} = process.env

const connectionString = MONGO_DB_URI 

//conexion a mongodb
mongoose.connect(connectionString)
    .then(() => {
        console.log('Database connected')
    })
    .catch(err => {
        console.error(err)
    })
