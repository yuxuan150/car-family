CREATE TABLE CarTeams (
    TeamID INT AUTO_INCREMENT,
    UserID INT NOT NULL,
    AssembleDate DATE NOT NULL,
    PRIMARY KEY (TeamID)
);
CREATE TABLE sales (
    SaleID INT AUTO_INCREMENT PRIMARY KEY,
    ListingID INT,
    BuyerUserID INT,  -- 购买者的UserID
    SalePrice DECIMAL(10, 2),  -- 销售价格
    SaleDate DATE,  -- 销售日期
    -- 从listing表复制的其他字段
    CarID INT,
    Company VARCHAR(255),
    YearOfPurchase YEAR,
    KMsDriven INT,
    RegistrationCity VARCHAR(255),
    Condition VARCHAR(100),
    SellerLocation VARCHAR(255),
    Features TEXT,
    ImageURLs TEXT,
    Mileage DECIMAL(10, 2),
    Trim VARCHAR(100),
    Year YEAR,
    ZipCode VARCHAR(20),
    FOREIGN KEY (ListingID) REFERENCES listing(ListingID),
    FOREIGN KEY (BuyerUserID) REFERENCES users(UserID)  -- 假设有一个用户表来存储UserID
);

