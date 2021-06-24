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

exports.addBaseEmployee = async (baseEmployee) => {
    let results = await db.query('INSERT INTO Employee SET ?', baseEmployee) 
    return results.insertId; 
}

exports.addSalesEmployee = async (salesEmployee) => {
    let results = await db.query('INSERT INTO Sales_Employee SET ?', salesEmployee) 
    return results.insertId; 
}

exports.addTechnicalEmployee = async (technicalEmployee) => {
    let results = await db.query('INSERT INTO Technical_Employee SET ?', technicalEmployee) 
    return results.insertId; 
}

exports.addProject = async (project) => {
    let results = await db.query('INSERT INTO Project SET ?', project) 
    return results.insertId; 
}

exports.assignToProject = async (employeeID, projectID) => {
    let results = await db.query('INSERT INTO Technical_Project VALUES (?, ?)', employeeID, projectID)
    return results;
}

exports.getTechnicalEmployees = async () => {
    let results = await db.query('SELECT emp_id as id, name FROM Technical_Employee JOIN Employee USING(emp_id)')
    return results;
}
exports.getEmployee = async () => { 
    let results = await db.query('SELECT emp_id as id, emp_name as name, salary, department FROM Database_IT.Employee ORDER BY department') 
    return results;
 }

 exports.getAllEmployees = async () => { 
    let results = await db.query('SELECT * FROM Database_IT.Employee') 
    return results;
 }