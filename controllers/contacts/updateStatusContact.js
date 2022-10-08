const { Contact } = require("../../models/contacts/contacts");

const RequestError = require("../../helpers");

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!result) {
    throw RequestError(404, `contact with ID ${contactId} not found`);
  }
  res.json(result);
};
module.exports = updateStatusContact;
