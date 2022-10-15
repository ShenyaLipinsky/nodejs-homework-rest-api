const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/contacts");
const { ctrlWrapper } = require("../../helpers");
const { validation, validationParams, auth } = require("../../middlewares");
const { schemas } = require("../../models/contacts/contacts");

router.get("/", auth, ctrlWrapper(ctrl.listContacts));

router.get(
  "/:contactId",
  auth,
  validationParams(schemas.validateId),
  ctrlWrapper(ctrl.getById)
);

router.post(
  "/",
  auth,
  validation(schemas.addSchema),
  ctrlWrapper(ctrl.addContact)
);

router.delete("/:contactId", auth, ctrlWrapper(ctrl.removeContact));

router.put(
  "/:contactId",
  auth,
  validationParams(schemas.validateId),
  validation(schemas.addSchema),
  ctrlWrapper(ctrl.updateContact)
);
router.patch(
  "/:contactId/favorite",
  auth,
  validationParams(schemas.validateId),
  validation(schemas.updateFavorite),
  ctrlWrapper(ctrl.updateStatusContact)
);

module.exports = router;
