const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");
//const authJwt = require("./helpers/jwt");
//const errorHandler = require("./helpers/error-handler");

app.use(cors());
app.options("*", cors());

//middleware
app.use(express.json());
app.use(morgan("tiny"));
//app.use(authJwt());
//app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
//app.use(errorHandler);

const usersRoutes = require("./routes/users");
const therapistsRoutes =require("./routes/therapists")
const assessmentsRoutes =require("./routes/assessments")
const api = process.env.API_URL;

app.use(`${api}/users`, usersRoutes);
app.use(`${api}/therapists`, therapistsRoutes)
app.use(`${api}/assessments`, assessmentsRoutes)
//Database
mongoose.connect(process.env.CONNECTION_STRING,{
useNewUrlParser:true,
useUnifiedTopology: true,
dbName:'Inspiron'

}).then(() => {
  console.log("Database Connection is ready...");
})
.catch((err) => {
  console.log(err);
});
//Server
app.listen(3000, () => {
  console.log("server is running http://localhost:3000");
});
