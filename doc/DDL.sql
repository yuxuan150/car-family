-- Users Table
CREATE TABLE users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    UserName VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    location_id BIGINT UNSIGNED NOT NULL,
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
  miles INT NOT NULL,
  color VARCHAR(50),
  price DECIMAL(10, 2) NOT NULL,
  company_id INT NOT NULL,
  location_id INT,
  FOREIGN KEY (company_id) REFERENCES company(company_id),
  FOREIGN KEY (location_id) REFERENCES location(location_id)
);


-- Recall Table
CREATE TABLE recall (
    recallID INT AUTO_INCREMENT PRIMARY KEY,
    reason TEXT,
    report_received_date DATE,
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



