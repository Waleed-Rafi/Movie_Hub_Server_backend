const express = require("express");
const app = express();

require("dotenv").config();
require("./db/sql.js");

app.use(express.json());

const movieShow = require("./routes/movieShow");

const PORT = process.env.PORT || 5000;

app.use("/", movieShow);

app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`);
});