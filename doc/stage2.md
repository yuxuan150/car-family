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


# Logical Design (Relational Schema)
      1. Users(UserID: INT [PK], Username: VARCHAR(255), Email: VARCHAR(255), Password: VARCHAR(255))
      2. CarModels(CarID: INT [PK], CompanyID: INT [FK to Company.CompanyID],LocationID: INT [FK to location.locationID], Model: VARCHAR(255), Year: INT, color: VARCHAR(255),Mile: INT,Price:INT)
      3. Location(LocationID: INT[PK],cityname: VARCHAR(255), Latitude: DECIMAL, Longitude:DECIMAL)
      4. Recall(Recall ID: INT[PK],CarID: INT [FK to CarModels.CarID], Report received date:INT,Reason:VARCHAR(255), Consequence summary:VARCHAR(255), Component: VARCHAR(255))
      5. Company(CompanyID: INT [PK], created date: INT, company name: VARCHAR(255))

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
        · Attributes: CompanyID (PK), Created date, Company Name

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
 
