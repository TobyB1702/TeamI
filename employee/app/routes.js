const express = require('express')
const router = express.Router()

router.get('/add-employee', (req, res) => {
    res.render('add-employee', {});
});

router.post('/add-employee', async (req, res) => {
    var data = req.body;
    baseEmployee = {emp_name: data.name, address: data.address, nin: data.nin, ban: data.ban, sortcode: data.sortcode, salary: data.salary, department: data.department, manager: data.manager == '_unchecked' ? 0 : 1}
    console.log(baseEmployee)
    id = await addBaseEmployee(baseEmployee)
    console.log(id)

    if (data.salesOrTechnical == 'sales') {
        console.log("Adding sales employee")
        salesEmployee = {emp_id: id, commission_rate: data.commission_rate, total_sales_value: data.total_sales_value}
        addSalesEmployee(salesEmployee)
        console.log(salesEmployee)
    } else if (data.salesOrTechnical == 'technical') {
        console.log("Adding technical employee")
        technicalEmployee = {emp_id: id, cv: data.cv, photo: data.photo}
        addTechnicalEmployee(technicalEmployee)
        console.log(technicalEmployee)
    } else {
        console.log("Adding non-technical/non-sales employee")
    }

    // call to database

    res.render('add-employee', {});
});

module.exports = router
