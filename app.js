const express = require("express");
const expressEjsLayouts = require("express-ejs-layouts");

const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

require("./utils/db");
const Contact = require("./model/contact");
const { body, validationResult, check } = require("express-validator");
const methodOverride = require("method-override");

const app = express();
const port = 3000;

// !Set Up method override
app.use(methodOverride("_method"));

// !Set Up EJS
app.set("view engine", "ejs");
app.use(expressEjsLayouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// ! Flash Configuration
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUnitialized: true,
  })
);

app.use(flash());

// !Page Home
app.get("/", (req, res) => {
  res.render("index", {
    title: "Home",
    layout: "layouts/main-layout",
  });
});

// !Page About
app.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
    layout: "layouts/main-layout",
  });
});

// !Page Contact
app.get("/contact", async (req, res) => {
  const contacts = await Contact.find();
  res.render("contact", {
    title: "Contact",
    layout: "layouts/main-layout",
    contacts,
    msg: req.flash("msg"),
  });
});

// !Page Add Contact
app.get("/contact/add", (req, res) => {
  res.render("addContact", {
    title: "Add Contact",
    layout: "layouts/main-layout",
  });
});

// !process add contact
app.post(
  "/contact",
  [
    body("name").custom(async (value) => {
      const duplicate = await Contact.findOne({ name: value });
      if (duplicate) {
        throw new Error("Contact with name is avaliable");
      }
      return true;
    }),
    check("email", "Email invalid").isEmail(),
    check("phoneNumber", "Phone Number invalid").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("addContact", {
        title: "Add Contact",
        layout: "layouts/main-layout",
        errors: errors.array(),
      });
    } else {
      Contact.insertMany(req.body, (error, result) => {
        req.flash("msg", "Data has been added!");
        res.redirect("/contact");
      });
    }
  }
);

// !delete process
app.delete("/contact", (req, res) => {
  Contact.deleteOne({ _id: req.body._id }, (error, result) => {
    req.flash("msg", "Data has been added!");
    res.redirect("/contact");
  });
});

// !Page Edit Contact
app.get("/contact/edit/:name", async (req, res) => {
  const contact = await Contact.findOne({ name: req.params.name });
  res.render("editContact", {
    layout: "layouts/main-layout",
    title: "Edit Contact",
    contact,
  });
});

// !Update Contact
app.put(
  "/contact",
  [
    body("name").custom(async (value, { req }) => {
      const duplicate = await Contact.findOne({ name: value });
      if (value !== req.body.oldName && duplicate) {
        throw new Error("Contact with name is avaliable");
      }
      return true;
    }),
    check("email", "Email invalid").isEmail(),
    check("phoneNumber", "Phone Number invalid").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("editContact", {
        title: "Edit Contact",
        layout: "layouts/main-layout",
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      Contact.updateOne(
        { _id: req.body._id },
        {
          $set: {
            name: req.body.name,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
          },
        }
      ).then((result) => {
        req.flash("msg", "Data has been updated!");
        res.redirect("/contact");
      });
    }
  }
);

// !Page Detail
app.get("/contact/:name", async (req, res) => {
  const contact = await Contact.findOne({ name: req.params.name });
  res.render("detail", {
    title: "Detail",
    layout: "layouts/main-layout",
    contact,
    msg: req.flash("msg"),
  });
});

// !Search Proses
app.post("/contact/search", async (req, res) => {
  const contact = await Contact.findOne({ name: req.body.name });
  res.render("detail", {
    title: "Detail",
    layout: "layouts/main-layout",
    contact,
    msg: req.flash("msg"),
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
