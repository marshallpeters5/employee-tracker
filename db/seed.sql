INSERT INTO departments (department_name) VALUES
  ('Sales'),
  ('Engineering'),
  ('Finance');

INSERT INTO roles (title, salary, department_id) VALUES
  ('Salesperson', 50000, 1),
  ('Engineer', 60000, 2),
  ('Manager', 70000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
  ('John', 'Doe', 1, NULL),
  ('Jane', 'Smith', 2, 1),
  ('Mike', 'Johnson', 3, 1);
