const Employee = require("../model/Employee");

const getAllEmployees = async (req, res)=> {

    const employees = await Employee.find();
    if(!employees) return res.json({"message" : "No Employees found"});
    res.json(employees);
}

const createNewEmployee = async (req, res)=> {
    
    if(!req?.body?.firstname || !req?.body?.lastname) {
        return res.status(400).json({"message" : "Firstname & Lastname are required."});
    }

    try {

        const result = await Employee.create({
            firstname : req.body.firstname,
            lastname : req.body.lastname
        });

        res.status(201).json(result);
    }catch(err) {
        console.error(err);
    }
}

const updateEmployee = async (req, res)=> {
    
    if(!req?.body?.id) {
        return res.status(400).json({"message" : "please enter ID of specific employee"});
    }

    const emp = await Employee.findOne({_id : req.body.id}).exec(); // "_id is always by deafult added in mongoDB"

    if(!emp) {
        return res.status(204).json({"message" : "please enter a valid ID"});
    }

    if(req.body?.firstname) emp.firstname = req.body.firstname;
    if(req.body?.lastname) emp.lastname = req.body.lastname;

    const result = await emp.save();

    res.json(result);
}

const deleteEmployee = async (req, res)=> {

    if(!req?.body?.id) {
        return res.status(400).json({"message" : "please enter ID of specific employee"});
    }

    const emp = await Employee.findOne({_id : req.body.id}).exec(); // "_id is always by deafult added in mongoDB"

    if(!emp) {
        return res.status(204).json({"message" : "please enter a valid ID"});
    }

    const result = await Employee.deleteOne({_id : req.body.id});
    res.json(result);
}

const getEmployee = async (req, res)=> {
    if(!req?.params?.id) {
        return res.status(400).json({"message" : "please enter ID of specific employee"});
    }

    const emp = await Employee.findOne({_id : req.params.id}).exec(); // "_id is always by deafult added in mongoDB"

    if(!emp) {
        return res.status(204).json({"message" : "please enter a valid ID"});
    }

    const result = await Employee.findOne({_id : req.params.id});
    res.json(result);
}

module.exports = {
    getAllEmployees, 
    createNewEmployee, 
    updateEmployee,
    deleteEmployee, 
    getEmployee
}
