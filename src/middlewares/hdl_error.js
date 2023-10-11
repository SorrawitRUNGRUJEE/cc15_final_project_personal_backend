module.exports = (err,req,res,next) =>{
    console.log(err.message)
    res.status(err.code || 500).json({msg:err.message})
}