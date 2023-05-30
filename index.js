const inquirer = require("inquirer");
const connection = require("./db/connection");

function displayMenu() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "menuChoice",
        message: "Please select an option:",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee Role",
          "Exit",
        ],
      },
    ])
    .then((answers) => {
      switch (answers.menuChoice) {
        case "View All Departments":
          viewAllDepartments();
          break;
        case "View All Roles":
          viewAllRoles();
          break;
        case "View All Employees":
          viewAllEmployees();
          break;
        case "Add a Department":
          addDepartment();
          break;
        case "Add a Role":
          addRole();
          break;
        case "Add an Employee":
          addEmployee();
          break;
        case "Update an Employee Role":
          updateEmployeeRole();
          break;
        case "Exit":
          console.log("Exiting the application.");
          connection.end();
          break;
      }
    });
}

function viewAllDepartments() {
  const query = "SELECT * FROM departments";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    displayMenu();
  });
}

function viewAllRoles() {
  const query = `SELECT roles.role_id, roles.title, departments.department_name, roles.salary
    FROM roles
    INNER JOIN departments ON roles.department_id = departments.department_id`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    displayMenu();
  });
}

function viewAllEmployees() {
  const query = `SELECT employees.employee_id, employees.first_name, employees.last_name,
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
        type: "input",
        name: "departmentName",
        message: "Enter the name of the department:",
      },
    ])
    .then((answers) => {
      const departmentName = answers.departmentName;
      const query = "INSERT INTO departments (department_name) VALUES (?)";
      connection.query(query, [departmentName], (err, res) => {
        if (err) throw err;
        console.log(
          `The department '${departmentName}' has been added successfully.`
        );
        displayMenu();
      });
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "roleName",
        message: "Enter the name of the role:",
      },
      {
        type: "input",
        name: "roleSalary",
        message: "Enter the salary for the role:",
      },
      {
        type: "input",
        name: "roleDepartment",
        message: "Enter the department for the role:",
      },
    ])
    .then((answers) => {
      const roleName = answers.roleName;
      const roleSalary = parseFloat(answers.roleSalary);
      const roleDepartment = answers.roleDepartment;
      const departmentQuery =
        "SELECT department_id FROM departments WHERE department_name = ?";
      connection.query(departmentQuery, [roleDepartment], (err, res) => {
        if (err) throw err;
        if (res.length === 0) {
          console.log(`The department '${roleDepartment}' does not exist.`);
          displayMenu();
        } else {
          const departmentId = res[0].department_id;
          const query =
            "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)";
          connection.query(
            query,
            [roleName, roleSalary, departmentId],
            (err, res) => {
              if (err) throw err;
              console.log(
                `The role '${roleName}' has been added successfully.`
              );
              displayMenu();
            }
          );
        }
      });
    });
}

function addEmployee() {
  const roleQuery = "SELECT role_id, title FROM roles";
  connection.query(roleQuery, (err, roles) => {
    if (err) throw err;
    const employeeQuery =
      "SELECT employee_id, first_name, last_name FROM employees";
    connection.query(employeeQuery, (err, employees) => {
      if (err) throw err;
      inquirer
        .prompt([
          {
            type: "input",
            name: "firstName",
            message: "Enter the employee's first name:",
          },
          {
            type: "input",
            name: "lastName",
            message: "Enter the employee's last name:",
          },
          {
            type: "list",
            name: "role",
            message: "Select the employee's role:",
            choices: roles.map((role) => ({
              name: role.title,
              value: role.role_id,
            })),
          },
          {
            type: "list",
            name: "manager",
            message: "Select the employee's manager:",
            choices: [
              { name: "None", value: null },
              ...employees.map((employee) => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.employee_id,
              })),
            ],
          },
        ])
        .then((answers) => {
          const firstName = answers.firstName;
          const lastName = answers.lastName;
          const roleId = answers.role;
          const managerId = answers.manager;
          const query =
            "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
          connection.query(
            query,
            [firstName, lastName, roleId, managerId],
            (err, res) => {
              if (err) throw err;
              console.log(
                `The employee '${firstName} ${lastName}' has been added successfully.`
              );
              displayMenu();
            }
          );
        });
    });
  });
}

function updateEmployeeRole() {
  const employeeQuery = 'SELECT employee_id, first_name, last_name FROM employees';
  connection.query(employeeQuery, (err, employees) => {
    if (err) throw err;
    const roleQuery = 'SELECT role_id, title FROM roles';
    connection.query(roleQuery, (err, roles) => {
      if (err) throw err;
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'employee',
            message: 'Select the employee to update:',
            choices: employees.map((employee) => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.employee_id })),
          },
          {
            type: 'list',
            name: 'role',
            message: 'Select the employee\'s new role:',
            choices: roles.map((role) => ({ name: role.title, value: role.role_id })),
          },
        ])
        .then((answers) => {
          const employeeId = answers.employee;
          const roleId = answers.role;
          const query = 'UPDATE employees SET role_id = ? WHERE employee_id = ?';
          connection.query(query, [roleId, employeeId], (err, res) => {
            if (err) throw err;
            console.log('The employee\'s role has been updated successfully.');
            displayMenu();
          });
        });
    });
  });
}

// Displays the main menu when the application starts. //
displayMenu();
