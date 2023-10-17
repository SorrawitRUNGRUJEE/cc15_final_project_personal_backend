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

exports.productSchema = productSchema
exports.categorySchema = categorySchema