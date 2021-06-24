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

exports.addTechnicalEmployee = async (technicalEmployee) => {
    let results = await db.query('INSERT INTO Technical_Employee SET ?', technicalEmployee)
    return results.insertId;
}

exports.addProject = async (project) => {
    let results = await db.query('INSERT INTO Project SET ?', project)
    return results.insertId;
}

exports.getProjects = async () => {
    let results = await db.query('SELECT project_id, project_name, emp_name FROM Project LEFT OUTER JOIN Technical_Project USING(project_id) LEFT OUTER JOIN Employee USING (emp_id);')
    projects = {} 
    for (index in results) {
        if (projects[results[index].project_id]) {
            projects[results[index].project_id].employees += ", " + results[index].emp_name;
            projects[results[index].project_id].num_employees += 1;
        } else {
            projects[results[index].project_id] = {project_id: results[index].project_id, project_name: results[index].project_name, employees: results[index].emp_name, num_employees: 0}
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
    console.log(employeeID)
    console.log(projectID)
    let results = await db.query('INSERT INTO Technical_Project VALUES (?, ?);', [employeeID, projectID]);
    return results;
}

exports.getTechnicalEmployees = async () => {
    let results = await db.query('SELECT emp_id as id, name FROM Technical_Employee JOIN Employee USING(emp_id)')
    return results;
}
