const mongoose = require("mongoose");

// !Create scehema (Collection)
const Contact = mongoose.model("contact", {
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
});

module.exports = Contact;
