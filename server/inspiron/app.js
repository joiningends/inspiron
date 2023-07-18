require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");


app.use(cors());
app.options("*", cors());

//middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
app.use(errorHandler);

const appointmentsRoutes = require("./routes/appointments");
const usersRoutes = require("./routes/users");
const therapistsRoutes =require("./routes/therapists")
const assessmentsRoutes =require("./routes/assessments")
const resetpasswordRoutes = require("./routes/passwordresets")
const categoriesRoutes = require("./routes/categories");
const paitentsRoutes = require("./routes/paitents");
const headingsRoutes = require("./routes/headings");
const PaymentsRoutes = require("./routes/payments");

const api = process.env.API_URL;
const PORT = process.env.PORT ||4000;

app.use(`${api}/appointments`, appointmentsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/therapists`,  therapistsRoutes);
app.use(`${api}/assessments`, assessmentsRoutes);
app.use(`${api}/passwordresets`, resetpasswordRoutes);
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/paitents`, paitentsRoutes);
app.use(`${api}/headings`, headingsRoutes);
app.use(`${api}/payments`, PaymentsRoutes);

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
app.listen(PORT, () => {
  console.log("server is running http://localhost:"+PORT);
});
