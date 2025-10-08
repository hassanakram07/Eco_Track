const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
app.use(express.json());
app.use(cookieParser());

const db = require("./config/mongoose-connection");
const userRoute = require("./routes/userRoute");
const pickupRoute = require("./routes/pickupRoute");
require("dotenv").config();

app.use("/api/user", userRoute);
app.use("/api/pickups", pickupRoute);

app.listen(3000),
  () => {
    console.log("Server Is Running On Port 3000");
  };
