const cloudinary  = require('cloudinary').v2
require('dotenv').config()
const cloudName = process.env.CLOUD_NAME 
cloudinary.config({
    cloud_name:cloudName,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_SECRET_KEY,
    secure:true

})

module.exports = cloudinary