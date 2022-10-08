const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleSaveErorrs } = require("../../middlewares");
const { RequestError } = require("../../helpers");

const phoneRegexp = /^[0-9]+$/;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
      match: phoneRegexp,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleSaveErorrs);

const addSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .required()
    .error(
      RequestError(
        400,
        "Name can't be empty and must contain more than 3 symbols"
      )
    ),
  email: Joi.string()
    .trim()
    .email({
      minDomainSegments: 2,
    })
    .required()
    .error(
      RequestError(
        400,
        "Email can't be empty and must contain domain more than 2 symbols"
      )
    ),

  phone: Joi.string()
    .pattern(phoneRegexp, "numbers")
    .trim()
    .min(6)
    .max(13)
    .required()
    .error(
      RequestError(
        400,
        "Phone can't be empty and must contain more than 6 and less than 13 symbols"
      )
    ),
  favorite: Joi.boolean().optional().default(false),
})
  .min(3)
  .required()
  .error(
    RequestError(
      400,
      "Invalid data, request must contain: (name, email, phone) = string format, favorite is optional."
    )
  );

const updateFavorite = Joi.object({
  favorite: Joi.boolean()
    .required()
    .error(RequestError(400, "missing field favorite")),
});

const schemas = {
  addSchema,
  updateFavorite,
};

const Contact = model("contact", contactSchema);

module.exports = {
  Contact,
  schemas,
};
