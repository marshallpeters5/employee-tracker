const inquirer = require('inquirer');
const connection = require('./db/connection')

function displayMenu() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'menuChoice',
        message: 'Please select an option:',
        choices: [
          'View All Departments',
          'View All Roles',
          'View All Employees',
          'Add a Department',
          'Add a Role',
          'Add an Employee',
          'Update an Employee Role',
          'Exit',
        ],
      },
    ])
    .then((answers) => {
      switch (answers.menuChoice) {
        case 'View All Departments':
          viewAllDepartments();
          break;
        case 'View All Roles':
          viewAllRoles();
          break;
        case 'View All Employees':
          viewAllEmployees();
          break;
        case 'Add a Department':
          addDepartment();
          break;
        case 'Add a Role':
          addRole();
          break;
        case 'Add an Employee':
          addEmployee();
          break;
        case 'Update an Employee Role':
          updateEmployeeRole();
          break;
        case 'Exit':
          console.log('Exiting the application.');
          connection.end();
          break;
      }
    });
}

function viewAllDepartments() {
  const query = 'SELECT * FROM departments';
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    displayMenu();
  });
}

function viewAllRoles() {
  const query = 
    `SELECT roles.role_id, roles.title, departments.department_name, roles.salary
    FROM roles
    INNER JOIN departments ON roles.department_id = departments.department_id`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    displayMenu();
  });
}

function viewAllEmployees() {
  const query = 
    `SELECT employees.employee_id, employees.first_name, employees.last_name,
    roles.title AS job_title, departments.department_name, roles.salary,
    CONCAT(managers.first_name, ' ', managers.last_name) AS manager
    FROM employees
    INNER JOIN roles ON employees.role_id = roles.role_id
    INNER JOIN departments ON roles.department_id = departments.department_id
    LEFT JOIN employees AS managers ON employees.manager_id = managers.employee_id
  `;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    displayMenu();
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'departmentName',
        message: 'Enter the name of the department:',
      },
    ])
    .then((answers) => {
      const departmentName = answers.departmentName;
      const query = 'INSERT INTO departments (department_name) VALUES (?)';
      connection.query(query, [departmentName], (err, res) => {
        if (err) throw err;
        console.log(`The department '${departmentName}' has been added successfully.`);
        displayMenu();
      });
    });
}

// Displays the main menu when the application starts. // 
displayMenu();
