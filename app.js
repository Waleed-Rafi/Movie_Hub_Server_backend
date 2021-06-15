const express = require("express");
const app = express();

require("dotenv").config();
require("./db/sql.js");

const movieShow = require("./routes/movieShow");
const bookingTicket = require("./routes/bookingTicket");
const customers = require("./routes/customers");

const cors = require("cors");
const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use("/", movieShow);
app.use("/", bookingTicket);
app.use("/", customers);

app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`);
});