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



router.get('/add-employee', (req, res) => { 
    res.render('add-employee', {}); 
});

router.post('/add-employee', (req, res) => {
    var data = req.body;
    baseEmployee = {name: data.name, address: data.address, nin: data.nin, ban: data.ban, sortcode: data.sortcode, salary: data.salary, department: data.department, manager: data.manager == '_unchecked' ? 0 : 1}
    console.log(baseEmployee)

    if (data.salesOrTechnical == 'sales') {
        console.log("Adding sales employee")
        salesEmployee = {commission_rate: data.commission_rate, total_sales_value: data.total_sales_value}
        console.log(salesEmployee)
    } else if (data.salesOrTechnical == 'technical') {
        console.log("Adding technical employee")
        technicalEmployee = {cv: data.cv, photo: data.photo}
        console.log(technicalEmployee)
    } else {
        console.log("Adding non-technical/non-sales employee")
    }

    // call to database

    res.render('add-employee', {}); 
});

module.exports = router
