const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");
const { Appointment } = require("./models/appointment");
const {
  removeOldPendingAppointments,
} = require("./controller/appointmentController");

const path = require("path");

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
const therapistsRoutes = require("./routes/therapists");
const assessmentsRoutes = require("./routes/assessments");
const resetpasswordRoutes = require("./routes/passwordresets");
const categoriesRoutes = require("./routes/categories");
const paitentsRoutes = require("./routes/paitents");
const casessRoutes = require("./routes/casesummerys");
const headingsRoutes = require("./routes/headings");
const illnessesRoutes = require("./routes/illnesses");
const exprienceRoutes = require("./routes/expriences");

const PaymentsRoutes = require("./routes/payments");
const expertisesRoutes = require("./routes/expertise");
const clientsRoutes = require("./routes/clients");
const pricesRoutes = require("./routes/price");
const coinsRoutes = require("./routes/coins");
const medicenesRoutes = require("./routes/medicens");
const doseRoutes = require("./routes/doeses");
const labtestRoutes = require("./routes/labtests");
const ePrescriptionRoutes = require("./routes/eprescriptions");
const whatsappRoutes = require("./routes/whatsapp");

const _dirname = path.dirname("");
const buildPath = path.join(__dirname, "../client/build");
app.use(express.static(buildPath));
app.get("/*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html")),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    };
});
const api = process.env.API_URL;
const PORT = process.env.PORT || 5001;
app.use(`${api}/appointments`, appointmentsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/therapists`, therapistsRoutes);
app.use(`${api}/assessments`, assessmentsRoutes);
app.use(`${api}/passwordresets`, resetpasswordRoutes);
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/paitents`, paitentsRoutes);
app.use(`${api}/cases`, casessRoutes);

app.use(`${api}/headings`, headingsRoutes);
app.use(`${api}/illnesses`, illnessesRoutes);
app.use(`${api}/expriences`, exprienceRoutes);
app.use(`${api}/payments`, PaymentsRoutes);
app.use(`${api}/expetises`, expertisesRoutes);
app.use(`${api}/clients`, clientsRoutes);
app.use(`${api}/prices`, pricesRoutes);
app.use(`${api}/coins`, coinsRoutes);
app.use(`${api}/medicence`, medicenesRoutes);
app.use(`${api}/doses`, doseRoutes);
app.use(`${api}/labtests`, labtestRoutes);
app.use(`${api}/eprescriptions`, ePrescriptionRoutes);
app.use(`${api}/whatsapp`, whatsappRoutes);

// Start the scheduler

//Database
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "Inspiron",
  })
  .then(() => {
    console.log("Database Connection is ready...");

    setInterval(removeOldPendingAppointments, 1 * 60 * 1000);
  })
  .catch((err) => {
    console.log(err);
  });

//Server
app.listen(4000, () => {
  console.log("server is running http://localhost:4000");
});
