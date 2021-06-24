

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

export const addBaseEmployee = async (baseEmployee) => {
    let results = await db.query('INSERT INTO Employee SET ?', baseEmployee) 
    return results.insertId; 
}

export const addSalesEmployee = async (salesEmployee) => {
    let results = await db.query('INSERT INTO Sales_Employee SET ?', salesEmployee) 
    return results.insertId; 
}

export const addTechnicalEmployee = async (technicalEmployee) => {
    let results = await db.query('INSERT INTO Technical_Employee SET ?', technicalEmployee) 
    return results.insertId; 
}