const express = require('express')
const router = express.Router()


const mysql = require('mysql');
const dbconfig = require('./dbconfig.json');
const util = require('util')


function wrapDB(dbconfig) {
    const pool = mysql.createPool(dbconfig)
    return {
        query(sql, args) {
            console.log("in query in wrapper")
            return util.promisify(pool.query)
                .call(pool, sql, args)
        },
        release() {
            return util.promisify(pool.releaseConnection)
                .call(pool)
        }
    }
}

const db = wrapDB(dbconfig)


router.get('/getEmployee', async (req, res) => {
    const result = await db.query(
        "Select * from Employee"
    )
    console.log(result)
}
)


module.exports = router
