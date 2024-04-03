# Conceptual Design (UML)
For the UML, we will use five entities based on your description: Users, CarModels, Sales, Listings, and an additional entity CarTeams for users to build up their own teams. Here are the assumptions and cardinality descriptions

    1. Users: Represents the accounts on the platform.
        . Description: Each user can list multiple cars for sale, assemble a unique car team (become the captain of the team), and view multiple historical sales records.
    2. CarModels: Contains detailed static information about car models.
        · Description: This entity stores general information about car models that isn't specific to a sale instance. It's modeled separately from Sales and Listings to avoid redundancy and ensure that details like brand, model, engine, etc., are stored in one place.
    3. Recall: showing the recall information of a given specific car.
        · Description: It store each recall record for specific car. It is separate from Car models, as a result , user could directly search for recallId to see the record of specific recall.
    4. Car history: Represents the accident , mileage and some other key information for used car.
        · Description: Similar to Recall, use could directly search the vin numeber to see all the information about specific use dcar they are looking for.
    5. CarTeams: Users could build up a car team between different cars.
        · Description: This entity allows users to build different teams based on different models of cars, and users could find the cars in CarModels entities.


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
        · Attributes: UserID (PK), Username, Email, Password
    2. CarModels
        · Attributes: CarID (PK), TeamID(FK), Brand, Model, Year, Transmission, KM'sDrivetrain, FuelType, MPG,Price
    3. CarHistory
        · Attributes: Vin (PK), Brand, Model, Year, State,Color, Title_status, Mileage
    4. Recall
        · Attributes: Recall ID (PK), Report received date, Reason, Consequence summary,Component
    5. CarTeam
        · Attributes: TeamID (PK), UserID(FK), AssembleDate

# Relationships:
    · Users to Sales: One-to-Many (A user can sell multiple cars, but each sale record is associated with one user)
    · Users to Listings: One-to-Many (A user can have multiple current listings)
    · Users to CarTeams: One-to-One (A user can assemble only one team)
    · CarModels to Sales: One-to-Many (Multiple sales records can refer to the same car model)
    · CarModels to Listings: One-to-Many (Multiple listings can refer to the same car model)
    · CarTeams to CarModels : one-to-many(A team can involve one or more different car models)

# Steps to Create the UML:
    1. Draw Entities: Start by drawing five rectangles, each representing one of the entities: User, CarModels, Sales, Listings, and CarTeams.
    2. Add Attributes: Inside each entity rectangle, list down all the attributes it has. Make sure to underline primary keys (PK) and denote foreign keys (FK) appropriately.
    3. Draw Relationships: Connect the entities with lines to represent relationships. Add a diamond shape along the line if you want to clearly denote the relationship name or type.
    4. Denote Cardinalities: At each end of the relationship lines, denote the cardinality (one-to-many, many-to-many) using the appropriate symbols (1, N, M).
    5. Add Associative Entities if Needed: For the many-to-many relationship (CarModels to CarTeams), you might need to draw an associative entity or simply show that CarTeams has foreign keys referring back to CarModels.
 
