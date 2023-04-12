const data = {
    employees : require("../model/employees.json"),
    setEmployees : function(record) {
        this.employees = record;
    }
}

const getAllEmployees = (req, res)=> {
    res.json(data.employees);
}

const createNewEmployee = (req, res)=> {
    const newEmployee = {
        id : data.employees?.length ? data.employees[data.employees.length-1].id + 1 : 1,
        firstname : req.body.firstname,
        lastname : req.body.lastname,
        role : req.body.role
    }

    if(!newEmployee.firstname || !newEmployee.lastname) {
        res.status(400).json({"message" : "Firstname & Lastname are required."});
    }

    data.setEmployees([...data.employees, newEmployee]);
    res.status(201).json(data.employees);
}

const updateEmployee = (req, res)=> {
    const emp = data.employees.find(e => e.id === parseInt(req.body.id));

    if(!emp) {
        return res.status(400).json({"message" : "Employee id "+req.body.id+" is not found"});
    }

    if(req.body.firstname) emp.firstname = req.body.firstname;
    if(req.body.lastname) emp.lastname = req.body.lastname;
    if(req.body.role) emp.role = req.body.role;

    const filterArray = data.employees.filter(e => {
        return e.id != parseInt(req.body.id);
    });

    const unsortedArray = [...filterArray, emp];
    data.setEmployees(unsortedArray.sort(
        (a, b)=> a.id-b.id
    ));

    res.json(data.employees);
}

const deleteEmployee = (req, res)=> {
    const emp = data.employees.find(e=> {
        return e.id === parseInt(req.body.id)
    });

    if(!emp) {
        return res.status(400).json({"message" : "Employee id "+req.body.id+" is not found"});
    }

    const filterArray = data.employees.filter(e => {
        return e.id != parseInt(req.body.id);
    });
    data.setEmployees([...filterArray]);
    res.json(data.employees);
}

const getEmployee = (req, res)=> {
    const emp = data.employees.find(e=> {
        return e.id === parseInt(req.params.id)
    });

    if(!emp) {
        return res.status(400).json({"message" : "Employee id "+req.params.id+" is not found"});
    }

    res.json(emp);
}

module.exports = {
    getAllEmployees, 
    createNewEmployee, 
    updateEmployee,
    deleteEmployee, 
    getEmployee
}
