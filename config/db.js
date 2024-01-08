const mongoose = require('mongoose')

const dbConnect = () =>{
    mongoose.connect(process.env.MONGODB)
    .then((data) =>{
        console.log(`MongoDb connected: ${data.connection.host}`)
    }).catch((err)=>{
        console.log('Unable to connect with mongoDB',err )
    })
}

module.exports = dbConnect;