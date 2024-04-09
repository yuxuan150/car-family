# Stage 3
# Part1:

## DDL commands for the tables:
    -- Users Table
    CREATE TABLE users (
        UserID INT AUTO_INCREMENT PRIMARY KEY,
        UserName VARCHAR(255) NOT NULL,
        Email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        location_id INT,
        FOREIGN KEY (location_id) REFERENCES location(locationID)
    );
    
    -- Location Table
    CREATE TABLE location (
        locationID INT AUTO_INCREMENT PRIMARY KEY,
        city_name VARCHAR(50) NOT NULL UNIQUE,
        latitude FLOAT NOT NULL,
        longitude FLOAT NOT NULL
    );
    
    -- CarModels Table
    CREATE TABLE CarModels (
      CarID INT AUTO_INCREMENT PRIMARY KEY,
      Model VARCHAR(255) NOT NULL,
      year YEAR NOT NULL,
      miles VARCHAR(255) NOT NULL,
      color VARCHAR(50),
      price VARCHAR(255) NOT NULL,
      company_id INT NOT NULL,
      location_id INT,
      FOREIGN KEY (company_id) REFERENCES company(company_id),
      FOREIGN KEY (location_id) REFERENCES location(locationID)
    );
    
    -- Recall Table
    CREATE TABLE recall (
        recallID INT AUTO_INCREMENT PRIMARY KEY,
        reason TEXT,
        report_received_date YEAR NOT NULL,
        consequence_summary TEXT,
        component VARCHAR(255),
        CarID INT,
        FOREIGN KEY (CarID) REFERENCES CarModels(CarID)
    );
    
    -- Company Table
    CREATE TABLE company (
        company_id INT AUTO_INCREMENT PRIMARY KEY,
        company_name VARCHAR(255) NOT NULL,
        created_date INT NOT NULL
    );
    -- located
    CREATE TABLE located (
        located_id INT AUTO_INCREMENT PRIMARY KEY,
        locationID INT UNIQUE NOT NULL,
        company_id INT UNIQUE NOT NULL,
        FOREIGN KEY (company_id) REFERENCES company(company_id),
        FOREIGN KEY (locationID) REFERENCES location(locationID)
    );
# Screenshots of Database & Tables:
1. gcloud sql connect team088 --user=root
2. type password : team088
3. use stage3;
4. show tables;
<img width="215" alt="Screenshot 2024-04-08 at 12 37 49 PM" src="https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/a1a969a1-3cca-4f1a-9ec0-ef531d29f38b">

## CarModels rows
<img width="386" alt="Screenshot 2024-04-08 at 12 39 23 PM" src="https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/f9e43b44-a527-4529-9247-60d774486709">

## company rows
<img width="330" alt="Screenshot 2024-04-08 at 12 39 41 PM" src="https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/d3a24a3a-c684-43b3-bc78-ca98bccaa2bf">

## location rows
<img width="370" alt="Screenshot 2024-04-08 at 12 40 05 PM" src="https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/71c92c9f-62f3-47ab-8479-bbe287afab12">

## recall rows
<img width="394" alt="Screenshot 2024-04-08 at 12 40 38 PM" src="https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/0d7f5679-e7d9-4d47-aa8c-573e6d542c92">

## users rows
<img width="375" alt="Screenshot 2024-04-08 at 12 40 53 PM" src="https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/af601a75-50e2-4e67-a0fc-5085262c360f">

## located rows

<img width="294" alt="Screenshot 2024-04-08 at 1 02 41 PM" src="https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/7034bb77-bab2-4b2a-8623-0642874a2855">


## First Advanced Query:show the average price for each car model within each company
    SELECT
      company.company_name,
      CarModels.Model,
      AVG(CAST(CarModels.price AS DECIMAL(10,2))) AS average_price
    FROM
      CarModels
    JOIN
      company ON CarModels.company_id = company.company_id
    GROUP BY
      company.company_name, CarModels.Model
    ORDER BY
      company.company_name, average_price DESC;
## Second Advanced Query:A specific user can search a specific car model and brand by distance. close to far
    SELECT
    company.company_name AS Brand,
      CarModels.Model,
      car_location.city_name AS CarLocation,
      SQRT(POW(user_location.latitude - car_location.latitude, 2) + POW(user_location.longitude - car_location.longitude, 2)) AS Distance
    FROM
      users
    INNER JOIN location AS user_location ON users.location_id = user_location.locationID
    INNER JOIN CarModels ON CarModels.location_id IS NOT NULL
    INNER JOIN location AS car_location ON CarModels.location_id = car_location.locationID
    INNER JOIN company ON CarModels.company_id = company.company_id
    WHERE
      users.UserID = 1000
      AND company.company_name = 'Honda'
      AND CarModels.Model = 'Civic' 
    ORDER BY
      Distance;

## Third Advanced Query:For a specific car model list the milege from low to high with price
    SELECT
      company.company_name AS Brand,
      CarModels.Model,
      CarModels.miles,
      CarModels.price
    FROM
      CarModels
    INNER JOIN company ON CarModels.company_id = company.company_id
    WHERE
      CarModels.Model = 'Civic'
      AND company.company_name = 'Honda'
    ORDER BY
      CAST(CarModels.miles AS UNSIGNED) ASC, 
      CAST(CarModels.price AS DECIMAL(10,2)) ASC; 
## Fourth Advanced Query:For given carid if it has recall give details, if not say no
    SELECT
      CarModels.CarID,
      CASE
        WHEN recall.recallID IS NOT NULL THEN 'Yes'
        ELSE 'No'
      END AS HasRecall,
      recall.reason,
      recall.report_received_date,
      recall.consequence_summary,
      recall.component
    FROM
      CarModels
    LEFT JOIN recall ON CarModels.CarID = recall.CarID
    WHERE
      CarModels.CarID = 1613; 

