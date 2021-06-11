const express = require("express");
const router = express.Router();
const DB = require("../db/sql");
const { validationResult, check } = require("express-validator");

router.get("/movies/all", async(req, res) => {
    const sql = "SELECT * FROM movie_show ORDER BY MOV_ID DESC;";
    try {
        DB.query(sql, async(err, result) => {
            if (err) return res.json({ error: "Error: Unable to Fetch Data!" });
            return res.json({ success: "Successfully Fetched!", data: result });
        });
    } catch (error) {
        return res.json({ error: "Error: Unable to Fetch Data!" });
    }
});

router.get("/movie/find", async(req, res) => {
    const sql = "SELECT * FROM movie_show WHERE MOV_ID = ?";
    try {
        DB.query(sql, [req.query.mov_id], async(err, result) => {
            if (err) return res.json({ error: "Error: Unable to Fetch Data!" });
            return res.json({ success: "Successfully Fetched!", data: result });
        });
    } catch (error) {
        return res.json({ error: "Error: Unable to Fetch Data!" });
    }
});

router.post(
    "/movie/create", [
        check("MOV_NAME", "Error: Movie Name is invalid").isLength({
            min: 3,
            max: 50,
        }),
        check("MOV_LANG", "Error: Movie Language is invalid").isLength({
            min: 3,
            max: 20,
        }),
        check("MOV_THUMBNAIL", "Error: Movie Thumbnail is invalid").isLength({
            min: 20,
            max: 255,
        }),
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json({ error: errors.errors[0].msg });
        }
        //query for creating table, runs only for once
        // const sql = `CREATE TABLE movie_show(
        // MOV_ID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        // MOV_NAME VARCHAR(50) NOT NULL,
        // MOV_LANG VARCHAR(20) NOT NULL,
        // MOV_THUMBNAIL VARCHAR(255) NOT NULL,
        // MOV_HOUR TIME NOT NULL DEFAULT "03:00:00",
        // MOV_DATE DATE NOT NULL DEFAULT (current_date())
        // );`;
        const sql = "INSERT INTO movie_show SET ? ";
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

router.put("/movie/update", async(req, res) => {
    const sql = "UPDATE movie_show SET ? WHERE MOV_ID = ? ";
    try {
        await DB.query(sql, [req.body, req.body.MOV_ID], async(err, result) => {
            if (err)
                return res.json({
                    error: "Error: Unable to Update data try again!",
                });
            return res.json({ success: "Successfully Updated!!" });
        });
    } catch (error) {
        return res.json({ error: "Error: Unable to Update data try again!" });
    }
});

router.delete("/movie/delete", async(req, res) => {
    const sql = "DELETE FROM movie_show WHERE MOV_ID = ?";
    try {
        await DB.query(sql, req.query.mov_id, async(err, result) => {
            if (err) return res.json({ error: "Error: Unable to Delete!" });
            return res.json({ success: "Successfully Deleted!!" });
        });
    } catch (error) {
        return res.json({ error: "Error: Unable to Delete!" });
    }
});

module.exports = router;