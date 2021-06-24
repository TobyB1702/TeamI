CREATE DATABASE `Database_IT`;

USE `Database_IT`;

CREATE TABLE Employee (
    emp_id SMALLINT AUTO_INCREMENT,
    emp_name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
	nin CHAR(9) NOT NULL,
	ban CHAR(10) NOT NULL,
    sortcode CHAR(6) NOT NULL,
    salary DECIMAL(11, 2) NOT NULL,
    department ENUM('HR', 'FINANCE', 'SALES', 'TECHNICAL', 'TALENT') NOT NULL,
    manager bit NOT NULL,
    PRIMARY KEY (emp_id)
);

CREATE TABLE Technical_Employee (
    emp_id SMALLINT NOT NULL,
    cv LONGBLOB NOT NULL,
    photo LONGBLOB NOT NULL,
    PRIMARY KEY (emp_id),
    FOREIGN KEY (emp_id)
        REFERENCES Employee (emp_id)
);

CREATE TABLE Project (
    project_id SMALLINT NOT NULL AUTO_INCREMENT,
    project_name VARCHAR(100) NOT NULL,
    PRIMARY KEY (project_id)
);

CREATE TABLE Technical_Project (
    emp_id SMALLINT NOT NULL,
    project_id SMALLINT NOT NULL,
    PRIMARY KEY (emp_id , project_id),
    FOREIGN KEY (emp_id)
        REFERENCES Technical_Employee (emp_id),
    FOREIGN KEY (project_id)
        REFERENCES Project (Project_id)
);

CREATE TABLE Sales_Employee (
    emp_id SMALLINT NOT NULL,
    commission_rate DECIMAL(4,2) NOT NULL,
    total_sales_value DECIMAL(11, 2) NOT NULL,
    PRIMARY KEY (emp_id),
    FOREIGN KEY (emp_id)
        REFERENCES Employee (emp_id)
);

-- USE CASE 2 - See what employees are in what departments
CREATE View `Employee Summary` AS
SELECT department, emp_id, emp_name FROM Employee;

-- USE CASE 4 - Gross Pay
CREATE VIEW `Gross Pay` AS
SELECT emp_id, emp_name, salary FROM Employee LEFT OUTER JOIN Sales_Employee USING (emp_id) WHERE commission_rate IS NULL
UNION
SELECT emp_id, emp_name, salary + (commission_rate * total_sales_value) FROM Sales_Employee JOIN Employee USING (emp_id);


-- USE CASE 5 - See the employee with the highest sales total
CREATE VIEW `Highest Sales` AS
    SELECT
        emp_name, total_sales_value
    FROM
        Sales_Employee
            JOIN
        Employee USING (emp_id)
    ORDER BY total_sales_value DESC
    LIMIT 1;

-- USE CASE 6 Part 2
CREATE VIEW `Projects with employees` AS
    SELECT
        project_id, project_name, emp_id, emp_name
    FROM
        Project
            JOIN
        Technical_Project USING (project_id)
            JOIN
        Employee USING (emp_id);

-- USE CASE 7 Part 1 - Show which projects have no employees assigned to it
CREATE VIEW `Projects with no employees` AS
    SELECT
        project_id, project_name
    FROM
        Project
            LEFT OUTER JOIN
        Technical_Project USING (project_id)
    WHERE
        emp_id IS NULL;
        
DROP VIEW `Projects with no employees`;

-- USE CASE 7 Part 2 / USE CASE 6 Part 3 - Show which employees are not assigned to any project
CREATE VIEW `Employees with no projects` AS
    SELECT
        emp_id, emp_name
    FROM
        Technical_Employee
            JOIN
        Employee USING (emp_id)
            LEFT OUTER JOIN
        Technical_Project USING (emp_id)
    WHERE
        project_ID IS NULL;
        
DROP VIEW `Employees with no projects`;
