const { Contact } = require("../../models/contacts/contacts");
const { RequestError } = require("../../helpers");

const getById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findById(contactId);
  if (!result) {
    throw RequestError(404, "Contact not found");
  }
  res.json(result);
};

module.exports = getById;
