const express = require('express');
const router = express.Router();
//const data = {}
//data.employees = require("../../model/employees.json");
const {getEveryEmployee, addNewEmployee, updateEmployee, deleteEmployee, findAnEmployee} = require("../controllers/employeeController");
const ROLES = require("../config/roles_list");
const rolesVerify = require("../middleware/verifyRoles");

router.route('/')
    .get(getEveryEmployee)
    .post(rolesVerify(ROLES.ordinaryManager, ROLES.TopManagement), addNewEmployee)
    .put(rolesVerify(ROLES.ordinaryManager, ROLES.TopManagement), updateEmployee)
    .delete(rolesVerify(ROLES.TopManagement), deleteEmployee);


router.route("/:id")
    .get(findAnEmployee)

module.exports = router;