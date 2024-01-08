const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const dbConnect = require('./config/db');
const upload = require('./utils/imageUploader');

//routes
const userRoutes = require('./routes/user.routes')
const adminRoutes = require('./routes/admin.routes')


dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

//database connection establishment
dbConnect();

//=> public image folder to store and access images
app.use("/images", express.static(path.join(__dirname, "/images")))

//test route
app.get('/',(req, res)=>{
    res.send("Server running fine.")
})

//route binding
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/admin', adminRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log('Server running on port ', PORT));