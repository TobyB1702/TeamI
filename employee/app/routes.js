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
    baseEmployee = {emp_name: data.name, address: data.address, nin: data.nin, ban: data.ban, sortcode: data.sortcode, salary: data.salary, department: data.department, manager: data.manager == '_unchecked' ? 0 : 1}

    id = await dbconnection.addBaseEmployee(baseEmployee)

    if (data.salesOrTechnical == 'sales') {
        salesEmployee = {emp_id: id, commission_rate: data.commission_rate, total_sales_value: data.total_sales_value}
        dbconnection.addSalesEmployee(salesEmployee)
    } else if (data.salesOrTechnical == 'technical') {
        technicalEmployee = {emp_id: id, cv: data.cv, photo: data.photo}
        dbconnection.addTechnicalEmployee(technicalEmployee)
    }

    res.render('add-employee', {});
});

router.post('/add-project', async (req, res) => {
    var data = req.body;
    project = {project_name: data.name}

    id = await dbconnection.addProject(project)

    res.render('add-project', {});
});

router.post('/assign-to-project', async (req, res) => {
    var data = req.body;

    id = await dbconnection.assignToProject(data.emp_id, data.project_id)

    res.redirect('list-projects');
});

module.exports = router
