const { Contact } = require("../../models/contacts/contacts");

const addContact = async (req, res) => {
  console.log(req.body);
  const result = await Contact.create(req.body);

  res.status(201).json(result);
};

module.exports = addContact;
