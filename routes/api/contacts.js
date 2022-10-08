const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/contacts");
const { ctrlWrapper } = require("../../helpers");
const { validation, isValidId } = require("../../middlewares");
const { schemas } = require("../../models/contacts/contacts");

router.get("/", ctrlWrapper(ctrl.listContacts));

router.get("/:contactId", isValidId, ctrlWrapper(ctrl.getById));

router.post("/", validation(schemas.addSchema), ctrlWrapper(ctrl.addContact));

router.delete("/:contactId", isValidId, ctrlWrapper(ctrl.removeContact));

router.put(
  "/:contactId",
  isValidId,
  validation(schemas.addSchema),
  ctrlWrapper(ctrl.updateContact)
);
router.patch(
  "/:contactId/favorite",
  isValidId,
  validation(schemas.updateFavorite),
  ctrlWrapper(ctrl.updateStatusContact)
);

module.exports = router;
