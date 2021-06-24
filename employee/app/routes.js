const express = require('express')
const router = express.Router()
const dbconnection = require('./dbconnection.js');

router.get('/list-projects', async (req, res) => {
    res.render('list-projects', { projects: await dbconnection.getProjects() })
});

router.get('/list-projects-no-employees', async (req, res) => {
    res.render('list-projects-no-employees', { projects: await dbconnection.getProjectsWithNoEmployees() })
});

router.get('/list-employees-not-assigned', async (req, res) => {
    res.render('list-employees-not-assigned', { employees: await dbconnection.getUnassignedEmployees() })
});

router.get('/assign-to-project', async (req, res) => {
    res.render('assign-to-project', { emp_id: req.body.emp_id, project_id: req.body.project_id })
});

router.post('/add-employee', async (req, res) => {
    var data = req.body;
    baseEmployee = { emp_name: data.name, address: data.address, nin: data.nin, ban: data.ban, sortcode: data.sortcode, salary: data.salary, department: data.department, manager: data.manager == '_unchecked' ? 0 : 1 }

    if (data.name <= 0) {
        res.render('add-employee', { errormessage: "Please enter a name." });
    } else if (data.address <= 0) {
        res.render('add-employee', { errormessage: "Please enter an address." });
    } else if (!/^(?!BG|GB|NK|KN|TN|NT|ZZ)[A-CEGHJ-PR-TW-Z][A-CEGHJ-NPR-TW-Z](?:\s*\d{2}){3}\s*[A-D]$/.test(data.nin)) {
        res.render('add-employee', { errormessage: "Invalid national insurance number. Example format: AA123456C" });
    } else if (!/^[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}$/.test(data.ban)) {
        res.render('add-employee', { errormessage: "Invalid bank account number. Example format: 12345678" });
    } else if (!/^(?!(?:0{6}|00-00-00))(?:\d{6}|\d\d-\d\d-\d\d)$/.test(data.sortcode)) {
        res.render('add-employee', { errormessage: "Invalid sortcode. Example format: 112233" });
    } else if (isNaN(parseFloat(data.salary)) || isNaN(data.salary) || data.salary <= 0) {
        res.render('add-employee', { errormessage: "Invalid salary. Ensure you have entered a numerical value with no characters." });
    } else if (!(data.department.toUpperCase() === "FINANCE" || data.department.toUpperCase() === "SALES" || data.department.toUpperCase() === "TECHNICAL" || data.department.toUpperCase() === "TALENT" || data.department.toUpperCase() === "HR")) {
        res.render('add-employee', { errormessage: "Invalid department. Must be Finance, Sales, Technical, Talent or HR." });
    } else {
        if (data.salesOrTechnical == 'sales') {
            id = await dbconnection.addBaseEmployee(baseEmployee)
            if (isNaN(parseFloat(data.commission_rate)) || isNaN(data.commission_rate) || data.commission_rate <= 0) {
                res.render('add-employee', { errormessage: "Invalid commission rate. Ensure you have entered a numerical value with no characters." });
            } else if (isNaN(parseFloat(data.total_sales_value)) || isNaN(data.total_sales_value) || data.total_sales_value <= 0) {
                res.render('add-employee', { errormessage: "Invalid total sales value. Ensure you have entered a numerical value with no characters." });
            } else {

                salesEmployee = { emp_id: id, commission_rate: data.commission_rate, total_sales_value: data.total_sales_value }
                await dbconnection.addSalesEmployee(salesEmployee)
                res.redirect('list-employees');
            }
        } else if (data.salesOrTechnical == 'technical') {
            id = await dbconnection.addBaseEmployee(baseEmployee)
            technicalEmployee = { emp_id: id, cv: data.cv, photo: data.photo }
            await dbconnection.addTechnicalEmployee(technicalEmployee)
            res.redirect('list-employees');
        } 

    }
});

router.get('/grossPayEmployee', async (req, res) => {
    res.render('grossPayEmployee', { employees: await dbconnection.getGrossPay() } )
});

router.post('/add-project', async (req, res) => {
    var data = req.body;
    project = { project_name: data.name }

    id = await dbconnection.addProject(project)
    res.render('add-project', {});
});

router.get('/highest-paid', async(req, res) => {
    const result = await dbconnection.findEmployeeHighestPaid()
    
    console.log(result)
    employee = {
        name: result[0].emp_name,
        total_sales_value: result[0].total_sales_value
    }
    console.log(employee);
    res.render('highest-paid.html', {employee:[employee]})
})

router.get('/hr-report', async (req, res) => { 
    res.render('hr-report', { employees : await dbconnection.getEmployee() } ) 
});

router.get('/list-employees', async (req, res) => { 
    res.render('list-employees', { employees : await dbconnection.getAllEmployees() } ) 
});

router.post('/assign-to-project', async (req, res) => {
    var data = req.body;

    if (isNaN(parseInt(data.emp_id)) || isNaN(data.emp_id)) {
        res.render('assign-to-project', { errormessage: "Employee ID is not a valid integer." });
    } else if (isNaN(parseInt(data.project_id)) || isNaN(data.project_id)) {
        res.render('assign-to-project', { errormessage: "Project ID is not a valid integer." });
    } else {
    id = await dbconnection.assignToProject(data.emp_id, data.project_id).catch((err) => { 
        res.render('assign-to-project', { errormessage: "Unable to assign employee ("+data.emp_id+") to project ("+data.project_id+"). Ensure the project and employee with those ids exist." });
    });
    if (id) res.redirect('list-projects');
}

});

module.exports = router
