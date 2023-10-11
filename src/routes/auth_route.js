const express = require('express')
const createError = require('../utils/create_error')
const router = express.Router()
router.post('/register',(req,res,next)=>{
   const {username} = req.body
   if(!username) return next(createError("body required",400))
   res.status(200).json({msg:"test"})
})
module.exports = router