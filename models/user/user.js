const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { RequestError, handleSaveErrors } = require("../../helpers");

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },

    token: { type: String, default: "" },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleSaveErrors);

const registerSchema = Joi.object({
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
  password: Joi.string().min(6).required(),
  subscription: Joi.string()
    .valid("starter", "pro", "business")
    .optional()
    .error(
      RequestError(
        400,
        `Subscription only "starter", "pro", and "business" allowed `
      )
    ),
});

const loginSchema = Joi.object({
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
  password: Joi.string()
    .min(6)
    .required()
    .error(
      RequestError(
        400,
        "Password can't be empty and must contain more than 6 symbols"
      )
    ),
});

const schemas = {
  registerSchema,
  loginSchema,
};

const User = model("user", userSchema);

module.exports = {
  User,
  schemas,
};
