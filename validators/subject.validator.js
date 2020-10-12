'use strict'
const Joi = require('@hapi/joi')

const joiObject = {clave:Joi.string().required(),
name:Joi.string().required(),
career:Joi.string().required()}
const id = {id: Joi.number().positive().required()}
class SubjectValidator {
  get() {
    return Joi.object().keys({clave:Joi.string().required(),
name:Joi.string().required(),
career:Joi.string().required()}).options({allowUnknown:true, stripUnknown:true})
  }

  create() {
    return Joi.object().keys({clave:Joi.string().required(),
name:Joi.string().required(),
career:Joi.string().required()}).options({allowUnknown:true, stripUnknown:true})
  }

  update() {
    return Joi.object().keys({clave:Joi.string().required(),
name:Joi.string().required(),
career:Joi.string().required(), ...id}).options({allowUnknown:true, stripUnknown:true})
  }

  delete() {
    return Joi.object().keys(id).options({allowUnknown:true, stripUnknown:true})
  }
}

module.exports = new SubjectValidator()