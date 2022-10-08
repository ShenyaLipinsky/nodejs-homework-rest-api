const { Contact } = require("../../models/contacts/contacts");

const listContacts = async (_, res) => {
  const result = await Contact.find({}, "-createdAt -updatedAt");
  res.json(result);
};

module.exports = listContacts;
