const mongoose = require("mongoose");

const database =
  "mongodb+srv://rioprayoga:rioprayoga@cluster0.ht4i4ji.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(database);

mongoose.connection.on("connected", () => {
  console.log(`${database} connected`);
});
