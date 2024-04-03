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
CREATE TABLE Recalls (
    RecallID INT AUTO_INCREMENT PRIMARY KEY,
    ReportReceivedDate DATE NOT NULL,
    Brand VARCHAR(255) NOT NULL,
    Reason TEXT,
    Component VARCHAR(255),
    ConsequenceSummary TEXT
);
CREATE TABLE CarHistory (
    VIN VARCHAR(17) PRIMARY KEY,
    Brand VARCHAR(50) NOT NULL,
    Model VARCHAR(50) NOT NULL,
    Year YEAR NOT NULL,
    Title_Status VARCHAR(50) NOT NULL,
    Mileage INT NOT NULL,
    Color VARCHAR(50) NOT NULL,
    State VARCHAR(50) NOT NULL
);
