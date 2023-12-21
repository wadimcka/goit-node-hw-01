const fs = require("fs/promises");
const path = require("path");
const { stringify } = require("querystring");
const { v4: uuid } = require("uuid");

const contactsPath = path.join(__dirname, "db", "contacts.json");
console.log(contactsPath);

async function listContacts() {
  const buffer = await fs.readFile(contactsPath);
  const allContacts = JSON.parse(buffer);
  return allContacts;
}

async function getContactById(contactId) {
  const allContacts = await listContacts();
  const contact = allContacts.find((contact) => contact.id === contactId);
  return contact || null;
}

async function removeContact(contactId) {
  const allContacts = await listContacts();
  const contact = allContacts.findIndex((contact) => contact.id === contactId);
  if (contact === -1) {
    return null;
  }
  const [removedContact] = allContacts.splice(contact, 1);
  await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
  return [removedContact];
}

async function addContact(name, email, phone) {
  const allContacts = await listContacts();
  const newContact = { name, email, phone, id: uuid() };
  allContacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
  return newContact;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
