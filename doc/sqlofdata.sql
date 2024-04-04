CREATE TABLE Users (
    UserID INT PRIMARY KEY,
    UserName VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL
);
CREATE TABLE CarModels (
    CarID INT PRIMARY KEY,
    Make VARCHAR(255) NOT NULL,
    Model VARCHAR(255) NOT NULL,
    Year YEAR NOT NULL,
    KMs_driven INT NOT NULL,
    Price DECIMAL(10, 2) NOT NULL,
    FuelType VARCHAR(50) NOT NULL,
    Transmission VARCHAR(50) NOT NULL
);
CREATE TABLE location (
  location_id SERIAL PRIMARY KEY,
  city_name VARCHAR(50) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL
);
CREATE TABLE car (
  car_id SERIAL PRIMARY KEY,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(255) NOT NULL,
  body_type VARCHAR(25) NOT NULL,
  car_type VARCHAR(25) NOT NULL,
  year INT NOT NULL,
  price INT NOT NULL
);
CREATE TABLE user_account (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact VARCHAR(15) NOT NULL,
  location_id INT NOT NULL,
  FOREIGN KEY (location_id) REFERENCES location(location_id)
);
CREATE TABLE advertisement (
  ad_id SERIAL PRIMARY KEY,
  car_id INT NOT NULL,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  FOREIGN KEY (car_id) REFERENCES car(car_id),
  FOREIGN KEY (user_id) REFERENCES user_account(user_id)
);
CREATE TABLE bid (
  bid_id SERIAL PRIMARY KEY,
  car_id INT NOT NULL,
  user_id INT NOT NULL,
  date_bid DATE NOT NULL,
  bid_price INT NOT NULL,
  bid_status VARCHAR(25) NOT NULL,
  FOREIGN KEY (car_id) REFERENCES car(car_id),
  FOREIGN KEY (user_id) REFERENCES user_account(user_id)
);