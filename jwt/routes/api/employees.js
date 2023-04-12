const express = require("express");
const router = express.Router();

const employeesController = require("../../controllers/employeesController");
const verifyJWT = require("../../myMiddleware/verifyJWT");

router.route('/')
    .get(verifyJWT, employeesController.getAllEmployees)
    .post(employeesController.createNewEmployee)
    .put(employeesController.updateEmployee) 
    .delete(employeesController.deleteEmployee);

router.route('/:id') // id is now a parameter
    .get(employeesController.getEmployee);

module.exports = router;