const inquirer = require('inquirer');
const connection = require('./db/connection')

// Works with inquirer to add a selection-menu in the terminal to decide which function to execute based on user input. //
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

// Calls this function to display the main menu when the application starts. // 
displayMenu();
