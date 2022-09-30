const mongoose = require("mongoose");

const database = process.env.MONGO_URI || "mongodb://localhost:27017/contacts";
mongoose.connect(database);

mongoose.connection.on("connected", () => {
  console.log(`${database} connected`);
});
