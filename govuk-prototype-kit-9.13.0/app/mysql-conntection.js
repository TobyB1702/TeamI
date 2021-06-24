const mysql = require('mysql');
const dbconfig = require('./dbconfig.json');
const util = require('util')

const db = wrapDB(dbconfig)

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

module.exports = db;