const { log } = require("console");
const express = require("express");
const app = express();
const path = require("path");
const { v4 } = require("uuid");

let CONTACTS = [
  { id: v4(), name: "Mirshod", value: "+998 99 099-57-52", marked: false },
];
app.use(express.json());

//get
app.get("/api/contacts", (req, res) => {
  setTimeout(() => {
    res.status(200).json(CONTACTS);
  }, 2000);
});

//post
app.post("/api/contacts", (req, res) => {
  const contact = { ...req.body, id: v4(), marked: false };
  CONTACTS.push(contact);
  res.status(201).json({ contact });
});
//delete
app.delete("/api/contacts/:id", (req, res) => {
  CONTACTS = CONTACTS.filter((el) => el.id !== req.params.id);
  res.status(200).json({ message: "Contact was delete succesfully" });
});

//put
app.put("/api/contacts/:id", (req, res) => {
  const indx = CONTACTS.find((el) => el.id === req.params.id);
  CONTACTS[indx] = req.body;
  res.json(CONTACTS[indx]);
});

app.use(express.static(path.resolve(__dirname, "client")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "index.html"));
});

app.listen(5000, () => {
  console.log("server 500 da yondi..");
});
