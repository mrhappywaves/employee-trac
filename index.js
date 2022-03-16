const inquirer = require('inquirer');
const Department = require('./model/Department');
const Role = require('./model/Role');
const Employee = require('./model/Employee');
const db = require('./util/database');

const displayMenu = () => {
    inquirer.prompt([
        {
            type: 'list',
            message: 'Choose operation:',
            name: 'operation',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add department',
                'Add a role',
                'Add an employee',
                'Update an employees role',
                'Update an employees manager',
                'Delete an employee',
                'Exit',
            ],
        }
    ])
        .then(answer => {
            switch (answer.operation) {
                case 'View all departments':
                    viewDepartments();
                    break;
                case 'View all roles':
                    viewRoles();
                    break;
                case 'View all employees':
                    viewEmployees();
                    break;
                case 'Add department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Update an employees role':
                    updateEmployeeRole();
                    break;
                case 'Update an employees manager':
                    updateEmployeeManager();
                    break;
                case 'Delete an employee':
                    deleteEmployee();
                    break;
                case 'Exit':
                    process.exit();
            }
        });
}

const viewDepartments = () => {
    Department.findAll({ raw: true })
        .then(departments => {
            console.table(departments, ['id', 'name']);
            displayMenu();
        })
}

const viewRoles = () => {
    Role.findAll({
        raw: true,
        include: [{
            model: Department,
        }]
    })
        .then(roles => {
            console.table(roles, ['id', 'title', 'salary', 'Department.name']);
            displayMenu();
        })
}

const viewEmployees = () => {
    Employee.findAll(
        {
            raw: true,
            include: [{
                model: Role
            }]
        })
        .then(employees => {
            console.table(employees, ['id', 'first_name', 'last_name', 'Role.title', 'manager_id']);
            displayMenu();
        })
}

const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Enter department name:',
            name: 'name',
        }
    ])
        .then(answer => {
            Department.create({
                name: answer.name,
            })
                .then(() => {
                    console.log(`Department ${answer.name} added successfully.`);
                    displayMenu();
                })
                .catch(err => {
                    console.log(err);
                    displayMenu();
                })
        })
}

const addRole = () => {
    let departmentArray = [];

    Department.findAll({ raw: true })
        .then(departments => {
            departments.forEach(department => {
                departmentArray.push(department.id + ' ' + department.name);
            });

            inquirer.prompt([
                {
                    type: 'input',
                    message: 'Enter role title:',
                    name: 'title',
                },
                {
                    type: 'input',
                    message: 'Enter role salary:',
                    name: 'salary',
                },
                {
                    type: 'list',
                    message: 'Choose department:',
                    name: 'department',
                    choices: departmentArray,
                }
            ])
                .then(answer => {
                    let departmentId = null;
                    departments.forEach(department => {
                        if (department.id + ' ' + department.name === answer.department) {
                            departmentId = department.id;
                        }
                    });
                    Role.create({
                        title: answer.title,
                        salary: answer.salary,
                        department_id: departmentId,
                    })
                        .then(() => {
                            console.log(`Role ${answer.title} added successfully.`);
                            displayMenu();
                        })
                        .catch(err => {
                            console.log(err);
                            displayMenu();
                        })
                })
        })
}

const addEmployee = () => {
    let roleArray = [];
    let managerArray = [];

    Role.findAll({ raw: true })
        .then(roles => {
            roles.forEach(role => {
                roleArray.push(role.title);
            });
            Employee.findAll({ raw: true })
                .then(employees => {
                    employees.forEach(employee => {
                        managerArray.push(employee.first_name + ' ' + employee.last_name);
                    })

                    inquirer.prompt([
                        {
                            type: 'input',
                            message: 'Enter employee first name:',
                            name: 'first_name',
                        },
                        {
                            type: 'input',
                            message: 'Enter employee last name:',
                            name: 'last_name',
                        },
                        {
                            type: 'list',
                            message: 'Choose role:',
                            name: 'role',
                            choices: roleArray,
                        },
                        {
                            type: 'list',
                            message: 'Choose manager:',
                            name: 'manager',
                            choices: managerArray,
                        }
                    ])
                        .then(answer => {
                            let roleId = null;
                            let managerId = null;
                            roles.forEach(role => {
                                if (role.title === answer.role) {
                                    roleId = role.id;
                                }
                            });
                            employees.forEach(employee => {
                                if (employee.first_name + ' ' + employee.last_name === answer.manager) {
                                    managerId = employee.id;
                                }
                            });
                            Employee.create({
                                first_name: answer.first_name,
                                last_name: answer.last_name,
                                role_id: roleId,
                                manager_id: managerId,
                            })
                                .then(() => {
                                    console.log(`Employee ${answer.first_name} ${answer.last_name} added successfully.`);
                                    displayMenu();
                                })
                                .catch(err => {
                                    console.log(err);
                                    displayMenu();
                                })
                        })
                })
        })
}

const updateEmployeeRole = () => {
    let employeeArray = [];
    let roleArray = [];

    Employee.findAll({ raw: true })
        .then(employees => {
            employees.forEach(employee => {
                employeeArray.push(employee.first_name + ' ' + employee.last_name);
            });
            Role.findAll({ raw: true })
                .then(roles => {
                    roles.forEach(role => {
                        roleArray.push(role.title);
                    })

                    inquirer.prompt([
                        {
                            type: 'list',
                            message: 'Choose employee:',
                            name: 'employee',
                            choices: employeeArray,
                        },
                        {
                            type: 'list',
                            message: 'Choose role:',
                            name: 'role',
                            choices: roleArray,
                        }
                    ])
                        .then(answer => {
                            let employeeId = null;
                            let roleId = null;
                            employees.forEach(employee => {
                                if (employee.first_name + ' ' + employee.last_name === answer.employee) {
                                    employeeId = employee.id;
                                }
                            });
                            roles.forEach(role => {
                                if (role.title === answer.role) {
                                    roleId = role.id;
                                }
                            });
                            Employee.update({
                                role_id: roleId,
                            }, {
                                where: {
                                    id: employeeId
                                }
                            })
                                .then(() => {
                                    console.log(`Employee ${answer.employee} role updated successfully.`);
                                    displayMenu();
                                })
                        }
                        )
                })
        })
        .catch(err => {
            console.log(err);
            displayMenu();
        })
}

const updateEmployeeManager = () => {
    let employeeArray = [];
    Employee.findAll({ raw: true })
        .then(employees => {
            employees.forEach(employee => {
                employeeArray.push(employee.first_name + ' ' + employee.last_name);
            });
            inquirer.prompt([
                {
                    type: 'list',
                    message: 'Choose employee:',
                    name: 'employee',
                    choices: employeeArray,
                },
                {
                    type: 'list',
                    message: 'Choose manager:',
                    name: 'manager',
                    choices: employeeArray,
                }
            ])
                .then(answer => {
                    if (answer.manager === answer.employee) {
                        console.log('Employee cannot be their own manager.');
                        displayMenu();
                    } else {
                        let employeeId = null;
                        let managerId = null;
                        employees.forEach(employee => {
                            if (employee.first_name + ' ' + employee.last_name === answer.employee) {
                                employeeId = employee.id;
                            }
                        });
                        employees.forEach(employee => {
                            if (employee.first_name + ' ' + employee.last_name === answer.manager) {
                                managerId = employee.id;
                            }
                        });
                        Employee.update({
                            manager_id: managerId,
                        }, {
                            where: {
                                id: employeeId
                            }
                        })
                            .then(() => {
                                console.log(`Employee ${answer.employee} manager updated successfully.`);
                                displayMenu();
                            })
                    }
                })
        })
        .catch(err => {
            console.log(err);
            displayMenu();
        })
}

const deleteEmployee = () => {
    let employeeArray = [];
    Employee.findAll({ raw: true })
        .then(employees => {
            employees.forEach(employee => {
                employeeArray.push(employee.id + ' ' + employee.first_name + ' ' + employee.last_name);
            });
            inquirer.prompt([
                {
                    type: 'list',
                    message: 'Choose employee to delete:',
                    name: 'employee',
                    choices: employeeArray,
                }
            ])
                .then(answer => {
                    let employeeId = null;
                    employees.forEach(employee => {
                        if (employee.id + ' ' + employee.first_name + ' ' + employee.last_name === answer.employee) {
                            employeeId = employee.id;
                        }
                    });
                    Employee.destroy({
                        where: {
                            id: employeeId
                        }
                    })
                        .then(() => {
                            console.log(`Employee ${answer.employee} deleted successfully.`);
                            displayMenu();
                        })
                })
        })
        .catch(err => {
            console.log(err);
            displayMenu();
        })
}

// Remove force: true and bulk data creation once testing is done
db.sync({ force: true })
    .then(() => {
        console.log('Database connected, inserting sample data...');
        return Department.bulkCreate([
            { name: 'Engineering' },
            { name: 'HR' },
            { name: 'Sales' },
            { name: 'Marketing' },
            { name: 'IT' },
            { name: 'Accounting' },
        ]);
    }
    ).then(() => {
        return Role.bulkCreate([
            { title: 'CEO', salary: 100000, department_id: 1 },
            { title: 'CTO', salary: 80000, department_id: 1 },
            { title: 'COO', salary: 70000, department_id: 1 },
            { title: 'CMO', salary: 60000, department_id: 1 },
            { title: 'CXO', salary: 50000, department_id: 1 },
            { title: 'HR Manager', salary: 40000, department_id: 2 },
            { title: 'HR Assistant', salary: 30000, department_id: 2 },
            { title: 'Sales Manager', salary: 20000, department_id: 3 },
            { title: 'Sales Assistant', salary: 10000, department_id: 3 },
            { title: 'Marketing Manager', salary: 20000, department_id: 4 },
            { title: 'Marketing Assistant', salary: 10000, department_id: 4 },
            { title: 'IT Manager', salary: 20000, department_id: 5 },
            { title: 'IT Assistant', salary: 10000, department_id: 5 },
            { title: 'Accounting Manager', salary: 20000, department_id: 6 },
            { title: 'Accounting Assistant', salary: 10000, department_id: 6 },
        ]);
    })
    .then(() => {
        return Employee.bulkCreate([
            { first_name: 'John', last_name: 'Doe', role_id: 1, manager_id: null },
            { first_name: 'Jane', last_name: 'Doe', role_id: 2, manager_id: 1 },
            { first_name: 'Jack', last_name: 'Doe', role_id: 3, manager_id: 1 },
            { first_name: 'Jill', last_name: 'Doe', role_id: 4, manager_id: 1 },
            { first_name: 'Joe', last_name: 'Doe', role_id: 5, manager_id: 1 },
            { first_name: 'Jenny', last_name: 'Doe', role_id: 6, manager_id: 1 },
            { first_name: 'John', last_name: 'Doe', role_id: 7, manager_id: 2 },
            { first_name: 'Jane', last_name: 'Doe', role_id: 8, manager_id: 2 },
            { first_name: 'Jack', last_name: 'Doe', role_id: 9, manager_id: 2 },
            { first_name: 'Jill', last_name: 'Doe', role_id: 10, manager_id: 2 },
            { first_name: 'Joe', last_name: 'Doe', role_id: 11, manager_id: 2 },
            { first_name: 'Jenny', last_name: 'Doe', role_id: 12, manager_id: 2 },
            { first_name: 'John', last_name: 'Doe', role_id: 13, manager_id: 3 },
            { first_name: 'Jane', last_name: 'Doe', role_id: 14, manager_id: 3 },
            { first_name: 'Jack', last_name: 'Doe', role_id: 15, manager_id: 3 },
        ]);
    })
    .then(() => {
        console.log('Sample data inserted\nLaunching app...');
        displayMenu();
    })
    .catch(err => console.log(err));