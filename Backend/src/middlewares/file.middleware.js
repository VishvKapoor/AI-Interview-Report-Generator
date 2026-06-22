//This middleware is basically handling file uploads in our backend using multer.
const multer=require('multer')
const { size } = require('zod')


//this upload is a midlleware function
const upload=multer({
    storage:multer.memoryStorage(),
    limits:{
        fileSize:3*1024*1024//means 3 mb 
    }
})
module.exports={upload}