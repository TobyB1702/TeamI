const mysql = require('mysql')
const dbconfig = require('./dbconfig.json')
const util = require('util')

function wrapDB(dbconfig) {
    const pool = mysql.createPool(dbconfig)
    return {
        query(sql, args) {
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

exports.getGrossPay = async () => {
    let results = await db.query('select * from `Gross Pay`;') 
    return results;
}


exports.addBaseEmployee = async (baseEmployee) => {
    let results = await db.query('INSERT INTO Employee SET ?', baseEmployee)
    return results.insertId;
}

exports.addSalesEmployee = async (salesEmployee) => {
    let results = await db.query('INSERT INTO Sales_Employee SET ?', salesEmployee)
    return results.insertId;
}

exports.findEmployeeHighestPaid = async() => {
    let results = await db.query('Select * from `Highest Sales`') 
    return results;
}

exports.addTechnicalEmployee = async (technicalEmployee) => {
    let results = await db.query('INSERT INTO Technical_Employee SET ?', technicalEmployee)
    return results.insertId;
}

exports.addProject = async (project) => {
    let results = await db.query('INSERT INTO Project SET ?', project)
    return results.insertId;
}

exports.getProjects = async () => {
    let results = await db.query('SELECT project_id, project_name, emp_name, emp_id FROM Project LEFT OUTER JOIN Technical_Project USING(project_id) LEFT OUTER JOIN Employee USING (emp_id);')
    projects = {} 
    for (index in results) {
        if (projects[results[index].project_id]) {
            projects[results[index].project_id].employees += ", <br>" + results[index].emp_name + " (ID: "+results[index].emp_id+")";
            projects[results[index].project_id].num_employees += 1;
        } else {
            projects[results[index].project_id] = {project_id: results[index].project_id, project_name: results[index].project_name, employees: results[index].emp_name ? (results[index].emp_name + " (ID: "+results[index].emp_id+")") : "", num_employees: 0}
        }
    }
    var vals = Object.keys(projects).map(function(key) {
        return projects[key];
    });
    return vals;
}

exports.getProjectsWithNoEmployees = async () => {
    let results = await db.query('SELECT * FROM `Projects with no employees`;')
    console.log(results);
    return results;
}

exports.getUnassignedEmployees = async () => {
    let results = await db.query('SELECT * FROM Database_IT.`Employees with no projects`')
    console.log(results)
    return results;
}

exports.assignToProject = async (employeeID, projectID) => {
    let results = await db.query('INSERT INTO Technical_Project VALUES (?, ?);', [employeeID, projectID]);
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

