const express = require("express");

const { validation, auth } = require("../../middlewares");

const { ctrlWrapper } = require("../../helpers");

const { schemas } = require("../../models/user/user");

const ctrl = require("../../controllers/auth");

const router = express.Router();

router.post(
  "/register",
  validation(schemas.registerSchema),
  ctrlWrapper(ctrl.register)
);

router.post("/login", validation(schemas.loginSchema), ctrlWrapper(ctrl.login));

router.get("/current", auth, ctrlWrapper(ctrl.getCurrent));

router.get("/logout", auth, ctrlWrapper(ctrl.logout));

module.exports = router;
