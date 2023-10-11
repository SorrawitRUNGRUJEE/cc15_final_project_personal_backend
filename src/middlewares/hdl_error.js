module.exports = (err,req,res,next) =>{

    res.status(err.code).json({msg:err.message})
}