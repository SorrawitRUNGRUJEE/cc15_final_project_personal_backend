 function createError(msg,code){
    const error = new Error(msg)
    error.code = code
    console.log(error)
    return error
}

module.exports = createError