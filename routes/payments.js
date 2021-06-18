const express = require("express");
const router = express.Router();
const DB = require("../db/sql");
const { validationResult, check } = require("express-validator");

router.get("/payments/all", async(req, res) => {
    const sql =
        "SELECT * FROM payments INNER JOIN customer WHERE payments.C_ID = customer.CUSTOMER_ID;";
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

router.post("/payment/create", async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ error: errors.errors[0].msg });
    }
    //query for creating table, runs only for once
    // const sql = `CREATE TABLE payments(
    // 	P_ID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    //     AMOUNT INT NOT NULL,
    //     DATE_OF_PAYMENT DATE NOT NULL,
    //     C_ID INT NOT NULL,
    //     FOREIGN KEY payments(C_ID) REFERENCES customer(CUSTOMER_ID) ON DELETE CASCADE
    // );`;

    const sql = "INSERT INTO payments SET ? ";
    try {
        await DB.query(sql, req.body, async(err, result) => {
            if (err)
                return res.json({ error: "Error: Unable to Insert data try again!" });
            return res.json({ success: "Successfully Inserted Data" });
        });
    } catch (error) {
        return res.json({ error: "Error: Unable to Insert data try again!" });
    }
});

router.delete("/payment/delete", async(req, res) => {
    const sql = "DELETE FROM payments WHERE P_ID = ?";
    try {
        await DB.query(sql, req.query.payment_id, async(err, result) => {
            if (err) return res.json({ error: "Error: Unable to Delete!" });
            return res.json({ success: "Successfully Deleted!!" });
        });
    } catch (error) {
        return res.json({ error: "Error: Unable to Delete!" });
    }
});

module.exports = router;