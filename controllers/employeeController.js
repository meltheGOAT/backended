const Employees = require("../model/Employees");


const getEveryEmployee = async (req, res) => {
    const employ = await Employees.find();
    if (!employ) return res.status(204).json({"message": "No employees found"});

   res.json(employ)
};

const addNewEmployee = async(req, res) => {
    if (!req?.body?.firstname || !req?.body?.lstname) {
        return res.status(400).json({"message": "The first name and last name are required"});
    }

    try {
        const resultSave = await Employees.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname
        });
        res.status(201).json({ "message": `Account for ${req.body.firstname} ${req.body.lastname} created`});
    }catch (error){
        console.error(error)
    }
};



const updateEmployee = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({"message": "ID Parameter is required"});
    }
    const employee = await Employees.findOne({_id: req.body.id}).exec();

    if(!employee) {
        return res.status(400).json({"message": `Employee ID ${req.body.id} not found` });
    }
    if (req.body.firstname) employee.firstname = req.body.firstname;
    if (req.body.lastname) employee.lastname =  req.body.lastname;
    
    const result = await employee.save();
    res.json(result);

};

const deleteEmployee = async (req, res) => {
    if (!req?.body?.id)return res.status(400).json({"message": "Employee ID required"});  
    const employee = await Employees.findOne({_id: req.body.id}).exec();

    if (!employee) {
        return res.status(400).json({"message": `Employee with ID ${req.body.id} doesn't exist` });
    }

    const result = await employee.deleteOne({_id: req.body.id});
    res.json(result);
}

const findAnEmployee = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": "Employee ID required" });
    
    const employee = await Employees.findOne({ _id: req.params.id }).exec();
    if(!employee) {
        return res.status(400).json({"message": `No employee with ${req.params.id} found on your database`});
    }
    res.json(employee);
};


module.exports = {getEveryEmployee, addNewEmployee, updateEmployee, deleteEmployee, findAnEmployee};