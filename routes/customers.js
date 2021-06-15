const express = require("express");
const router = express.Router();
const DB = require("../db/sql");
const { validationResult, check } = require("express-validator");

router.get("/customers/all", async(req, res) => {
    const sql = "SELECT * FROM customer ORDER BY CUSTOMER_ID DESC;";
    try {
        DB.query(sql, async(err, result) => {
            if (err) return res.json({ error: "Error: Unable to Fetch Data!" });
            return res.json({ success: "Successfully Fetched!", data: result });
        });
    } catch (error) {
        return res.json({ error: "Error: Unable to Fetch Data!" });
    }
});

router.post(
    "/customer/create", [
        check("CUSTOMER_NAME", "Error: Customer Name is invalid").isLength({
            min: 3,
            max: 50,
        }),
        check("CUSTOMER_EMAIL", "Error: Customer Email is invalid").isEmail(),
        check("CUSTOMER_ADDRESS", "Error: Customer Address is invalid").isLength({
            min: 5,
            max: 255,
        }),
        check("CUSTOMER_PHONE", "Error: Customer Phone is invalid")
        .optional()
        .isLength({
            min: 11,
            max: 15,
        }),
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json({ error: errors.errors[0].msg });
        }
        //query for creating table, runs only for once
        // const sql = `CREATE TABLE customer(
        // 	CUSTOMER_ID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        //     CUSTOMER_NAME VARCHAR(100) NOT NULL,
        //     CUSTOMER_EMAIL VARCHAR(150) NOT NULL DEFAULT "PRIVATE",
        //     CUSTOMER_ADDRESS VARCHAR(255) NOT NULL,
        //     CUSTOMER_PHONE VARCHAR(15) NOT NULL DEFAULT "PRIVATE"
        // );`;
        const sql = "INSERT INTO customer SET ? ";
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

router.delete("/customer/delete", async(req, res) => {
    const sql = "DELETE FROM customer WHERE CUSTOMER_ID = ?";
    try {
        await DB.query(sql, req.query.customer_id, async(err, result) => {
            if (err) return res.json({ error: "Error: Unable to Delete!" });
            return res.json({ success: "Successfully Deleted!!" });
        });
    } catch (error) {
        return res.json({ error: "Error: Unable to Delete!" });
    }
});

module.exports = router;