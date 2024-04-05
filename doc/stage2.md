# Conceptual Design (UML)
For the UML, we will use five entities based on description: Users, CarModels, Location, Recall, and company. Here are the assumptions and cardinality descriptions

    1. Users: Represents the accounts on the platform.
        . Description: Each user can search for different car model. each user will contain userID, UserName, Email and password.
    2. CarModels: Contains detailed static information about car models.
        · Description: This entity stores general information about car models, such as year, miles, model, price, color, location,recall information and brand. It would help user to determine which car he is looking for, and show more comprehensive static data show to user.
    3. Recall: showing the recall information of a given specific car.
        · Description: A recall on a car is issued when a manufacturer discovers a defect or safety concern that could potentially endanger drivers, passengers, or the public, necessitating a repair or adjustment to address the issue. Recall table store each recall information for specific car.  User could check these information by click on specific car model. It helps user to increase safety considerations. 
    4. Company: It contains the company name and date for each car model.
        · Description: Similar to Recall, user could find the company of the specific car through Carmodels. And it contains the company name and date of the company's creation.
    5. Location: This table would contain both user location and specific car location. User could buy the closest car which he looking for.
        · Description: This entity will contain longitude, latitude,  cityname. 


# Relationships:
      · A many-to-one relationship between CarModels and Users, as a user can sell and buy different cars, but one car can only sold or bought by one user.

      · A many-to-many relationship between Users and both Recall and Car History through search, as each user can search multiple cars' history and recall information, and each car history and recall information can be involved in multiple users.

      · A one-to-one relationship between Users and CarTeams, once the user regressed, he/she could only build one team with one or multiple car models.


# Logical Design (Relational Schema)
      1. Users(UserID: INT [PK], Username: VARCHAR(255), Email: VARCHAR(255), Password: VARCHAR(255))
      2. CarModels(CarID: INT [PK], TeamID: INT [FK to CarTeams.TeamID], Brand: VARCHAR(255), Model: VARCHAR(255), Engine: VARCHAR(255), Transmission: VARCHAR(255), Drivetrain: VARCHAR(255), FuelType: VARCHAR(255), MPG: DECIMAL)
      3. Sales(SaleID: INT [PK], CarID: INT [FK to CarModels.CarID], UserID: INT [FK to Users.UserID], Company: VARCHAR(255), YearOfPurchase: YEAR, KMsDriven: INT, RegistrationCity: VARCHAR(255), Condition: VARCHAR(255), SellerLocation: VARCHAR(255), Features: TEXT, ImageURLs: TEXT, PriceSold: DECIMAL, YearSold: YEAR, Mileage: INT, Trim: VARCHAR(255), Year: YEAR, ZipCode: VARCHAR(255))
      4. Listings(ListingID: INT [PK], CarID: INT [FK to CarModels.CarID], UserID: INT [FK to Users.UserID], Company: VARCHAR(255), YearOfPurchase: YEAR, KMsDriven: INT, ListingPrice: DECIMAL, RegistrationCity: VARCHAR(255), Condition: VARCHAR(255), SellerLocation: VARCHAR(255), Features: TEXT, ImageURLs: TEXT, Mileage: INT, Trim: VARCHAR(255), Year: YEAR, ZipCode: VARCHAR(255))
      5. CarTeams(TeamID: INT [PK], UserID: INT [FK to Users.UserID], AssembleDate: INT)

# Normalization:
      · A relation R is in 3rd normal form if: whenever there is a nontrivial dependency A1,A2,...An->B for R, then {A1,A2,...,An} is a super-key for R, or B is part of a key.
      · R is in BCNF if whenever X->A holds, then X is a superkey.The BCNF is slightly stricter than 3NF, and it doesn't let R get away with it if A is part of some key. So, BCNF is "more aggressive" in splitting.
      · Chose 3NF over BCNF due to its balance between strict normalization and practical usability, considering that BCNF can sometimes result in excessive table decomposition which might not be necessary for this application context.
 
 

# Entities and Their Attributes:
    1. Users
        · Attributes: UserID (PK),LocationID(FK), Username, Email, Password
    2. CarModels
        · Attributes: CarID (PK), CompanyID(FK), LocationID(FK), Model, Year, color, Miles, Price
    3. Location
        · Attributes: LocationID (PK), cityname, latitude,longitude
    4. Recall
        · Attributes: Recall ID (PK), CarID(FK), Report received date, Reason, Consequence summary,Component
    5. Company
        · Attributes: Company name (PK), Created date, Company Name

# Relationships:
    · Users to CarModels: Many-to-Many (A user can search multiple cars, and a car could be searched by multiple users)
    · Users to Location: Many-to-One (A user can only have one location, but a location could contain multiple users)
    · CarModels to Location: Many-to-One (A car can only have one location, but a location could contain multiple cars)
    · CarModels to Recall: Many-to-One (Same model of car may recall at the same time with same reason )
    · CarModels to Company: Many-to-One (A car could only belong to one company, but a company could have different model of car )
    

# Steps to Create the UML:
    1. Draw Entities: Start by drawing five rectangles, each representing one of the entities: User, CarModels, Sales, Listings, and CarTeams.
    2. Add Attributes: Inside each entity rectangle, list down all the attributes it has. Make sure to underline primary keys (PK) and denote foreign keys (FK) appropriately.
    3. Draw Relationships: Connect the entities with lines to represent relationships. Add a diamond shape along the line if you want to clearly denote the relationship name or type.
    4. Denote Cardinalities: At each end of the relationship lines, denote the cardinality (one-to-many, many-to-many) using the appropriate symbols (1, N, M).
    5. Add Associative Entities if Needed: For the many-to-many relationship (CarModels to CarTeams), you might need to draw an associative entity or simply show that CarTeams has foreign keys referring back to CarModels.
 
