const Joi = require("joi");

//registration schema
const registerValidationSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().required(),
});

const loginValidationSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().required(),
});

module.exports = { registerValidationSchema, loginValidationSchema };
