 function createError(msg,code){
    const error = new Error(msg)
    error.code = code
    
    return error
}

module.exports = createError