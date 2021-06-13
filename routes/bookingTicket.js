const express = require("express");
const router = express.Router();
const DB = require("../db/sql");
const { validationResult, check } = require("express-validator");

router.get("/tickets/all", async(req, res) => {
    const sql =
        "SELECT * FROM booking_ticket INNER JOIN movie_show WHERE booking_ticket.MOV_ID = movie_show.MOV_ID;";
    try {
        DB.query(sql, async(err, result) => {
            if (err) return res.json({ error: "Error: Unable to Fetch, Try Again" });
            return res.json({
                success: "successfully Fetched!",
                data: result,
            });
        });
    } catch (error) {
        return res.json({ error: "Error: Unable to Fetch, Try Again" });
    }
});

router.post(
    "/ticket/create", [
        check("VENUE", "Error: Movie Language is invalid").isLength({
            min: 3,
            max: 20,
        }),
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json({ error: errors.errors[0].msg });
        }
        //query for creating table, runs only for once
        // const sql = `CREATE TABLE booking_ticket(
        // TCK_ID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        // TCK_NO INT NOT NULL UNIQUE,
        // TCK_AVAILABLE INT NOT NULL DEFAULT 0,
        // VENUE VARCHAR(100) NOT NULL DEFAULT "unknown",
        // MOV_ID INT NOT NULL,
        // FOREIGN KEY booking_ticket(MOV_ID) REFERENCES movie_show(MOV_ID));`;

        const sql = "INSERT INTO booking_ticket SET ? ";
        try {
            await DB.query(sql, req.body, async(err, result) => {
                if (err)
                    return res.json({ error: "Error: Unable to Insert data try again!" });
                return res.json({ success: "Successfully Inserted Data" });
            });
        } catch (error) {
            return res.json({ error: "Error: Unable to Insert data try again!" });
        }
    }
);

router.delete("/ticket/delete", async(req, res) => {
    const sql = "DELETE FROM booking_ticket WHERE TCK_ID = ?";
    try {
        await DB.query(sql, req.query.tck_id, async(err, result) => {
            if (err) return res.json({ error: "Error: Unable to Delete!" });
            return res.json({ success: "Successfully Deleted!!" });
        });
    } catch (error) {
        return res.json({ error: "Error: Unable to Delete!" });
    }
});

module.exports = router;