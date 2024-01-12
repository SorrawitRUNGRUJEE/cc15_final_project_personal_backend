const Joi = require('joi')
const productSchema = Joi.object({
    title:Joi.string().trim().required(),
    fullDesc: Joi.string().trim().required(),
    briefDesc: Joi.string().trim().required(),
    price:Joi.number().min(0).required(),
})
const categorySchema = Joi.object({
    name:Joi.string().trim().required(),
    id:Joi.number().min(0),
    newName:Joi.string().trim()
})

const adminSchema = Joi.object({
    email:Joi.string().email().required(),
    username: Joi.string().trim().required(),
    password:Joi.string().pattern(/^[a-zA-Z0-9]{6,30}$/).trim().required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).trim().required().strip(),
})

const superAdminSchema = Joi.object({
    email:Joi.string().email().required(),
    username:Joi.string().trim().required(),
    password:Joi.string().trim().required(),
    superAdminPassword:Joi.string().required()
})

exports.superAdminSchema = superAdminSchema
exports.productSchema = productSchema
exports.categorySchema = categorySchema
exports.adminSchema = adminSchema