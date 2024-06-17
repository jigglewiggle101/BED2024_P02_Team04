const Joi = require("joi"); // Use uppercase 'Joi' when requiring the module

const validateUser = (req, res, next) => {
    const schema = Joi.object({
      id: Joi.number().integer().min(4).required(), // Changed to integer
      name: Joi.string().min(3).max(50),
      email: Joi.string().min(3).max(255),
      password: Joi.string().min(3).max(255).required()
    });

  const validation = schema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const errors = validation.error.details.map((error) => error.message);
    res.status(400).json({ message: "Validation error", errors });
    return;
  }

  next();
};

module.exports = validateUser;
