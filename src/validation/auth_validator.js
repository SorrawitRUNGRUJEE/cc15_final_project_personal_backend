const Joi = require('joi')
const registerSchema = Joi.object({
    email:Joi.string().email().required(),
    username: Joi.string().trim().required(),
    region: Joi.string().trim().required(),
    password:Joi.string().pattern(/^[a-zA-Z0-9]{6,30}$/).trim().required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).trim().required().strip(),
})
const loginSchema = Joi.object({
    username: Joi.string().required(),
    password:Joi.string().required(),
})

exports.registerSchema = registerSchema
exports.loginSchema = loginSchema