<h1 align="center">Car Family </h1>

## Table of contents

- [Project Summary](#project-summary)
- [Description](#description)
- [Usefulness](#usefulness)
- [Realness](#realness)
- [Functionality description](#functionality-description)
- [UI Mockup](#ui-mockup)
- [Work Distribution](#work-distribution)
## Project Summary
We aim to build a website which allows users to check for detailed information of the car they search(Ex: Make, Model, Engine, Fuel Type). User can also assemble a team containing their favorite car models. What is more, this website will also include the recent sales information on used cars so that the users can know about the price of the car they liked. We will also include a market price which allows the user to compare and find out the car with the best price that they can afford. For interaction, the user can login with their account, find the car they like to know by searching names or choose the constraints.
## Description
Car Family is a web platform to help users quickly sort and find the cars that people are looking for, it could also help people determine whether they should sell or buy a used car based on price. The project involves designing, sorting, combining, and filtering the database so that it helps the user to find their best car. Our platform would include the information of Name Model ,Company,Year of Purchase,KM's driven,Price,Fuel type,Registration city,Transmission,Condition means car is used or new,Seller Location,Features of cars Images of selling car.  Based on that, users would visualize to know the information of the car that they are looking for.

Also, based on the Car Family platform, users could also select some of their favorite car models to build up their fantasy car teams. Moreover, CarFamily also provides used car information. It would help users to determine when and where to buy/sell a car that is more cost-sufficient. The information of this part would be pricesold, yearsold,mileage, make, model,trim, engine,year,zipcode, id. Based on these, users would know which car is more value-maintaining, and which car is not.   

We will use some algorithms to calculate the hedge ratio, and we will also use MySQL to search the data from the database and SQL to establish the database. We will also use HTML5, CSS, Javascript, React.js to design our frontend webpage. 



## Usefulness
The website we build aims for potential customers who are interested in purchasing cars but they may not know what to choose. In this case this website allows them to have access to information about the car they like immediately. Also if they do not have any brand preferences, this website can find the car that is most suitable for them based on their preferences(Ex: FWD/RWD, Sedan/SUV). Beside this, users can also build their own car teams. Also they can check the sales information before to have a better sense of the price of such a car. The simple feature might be showing information of the specific car they choose, while the complex feature may be filtering based on users’ demand, assembling car teams.

There are similar websites such as Cars, Carfax, Edmunds. But our website is different because our website could assembling your dream car team, and it could also play against other players online which adds lots of fun. By choosing different cars as part of your team, user could know more information about the car which he choose, as a result, it is a better way to help user to choose his favourite car as well. 


## Realness
We already have two datasets, which include  Name, Model ,Company,Year of Purchase,KM's driven,Price,Fuel type,Registration city,Transmission,Condition means car is used or new,Seller Location,Features of cars Images of selling car. pricesold, yearsold,mileage, make, model,trim, engine,year,zipcode, id.have  the data is from kaggle.com, and it is a CSV file. 
which are 10.9MB and 13.1MB.
Data link:
https://www.kaggle.com/datasets/abdullahkhanuet22/olx-cars-dataset
https://www.kaggle.com/datasets/tsaustin/us-used-car-sales-data
https://www.kaggle.com/datasets/andreinovikov/used-cars-dataset
https://www.kaggle.com/datasets/rkiattisak/sports-car-prices-dataset



|   Entity    |   Attributes                 |  
| ----------- | -----------------------------| 
| Users       |    UserID (PK), Username, Email, Password |
| CarModels   | CarID (PK), TeamID(FK), Brand, Model, Engine, Transmission, Drivetrain, FuelType, MPG|
| Sales      |   SaleID (PK), CarID (FK), UserID (FK), Company, YearOfPurchase, KMsDriven, RegistrationCity, Condition, SellerLocation, Features, ImageURLs, PriceSold, YearSold, Mileage, Trim, Year, ZipCode |
| Listings | ListingID (PK), CarID (FK), UserID (FK), Company, YearOfPurchase, KMsDriven, ListingPrice, RegistrationCity, Condition, SellerLocation, Features, ImageURLs, Mileage, Trim, Year, ZipCode |
|CarTeams  | TeamID (PK), UserID(FK), AssembleDate |





## Functionality Description
Functionality Description:
Our website have the following services:
CarModels: users can get access to a certain type of car’s information by typing the name of the car or by selecting the filter. In this case, the user can have a comprehensive understanding of each cars’ performance. Within this service, we also provide direct comparison between two cars allowing users to make direct comparisons.
Listings: we provide detailed information about the current selling cars and their prices. This allows the user to search for the specific car that they like( Ex: color, performance, etc.) For each car for sale, we also include the market price for such specific cars. The user may type in the car name or select a price range for filtering.
Sales: we also provide the historical records of the deal for different types of cars which allow the users to compare the price and may find out the best time to buy a car. The user can type in the car name or select the car for checking the information.

User: In this mode, the user would create their own username, passwords, our website will insert the information to our database, the user can change their username or passwords and these will also update to database.
Car model: This will contain the database shown to the user about information of different cars. User can type the car name in search bar and our database systems will read and found out the car they want.
Sales: This contain the sold cars history. Which will updates when I car is sold from the sale listing. The user can also type in the search bar of the car they want to see about the sales history and we will read this and filter out the data for users.
Listing: This will contain the information of the cars that is currently on sales. The user can also insert the information of cars that they want to sell. Once the car is sold, such data will be delete and insert into Sales.
CarTeam: This is a creative part which user can form their own car team. The user can choose the car they like and form a car team, which will be inserted in our database, our database will read the engine and power and provide the rate of such team.
CarTeams: allows users to build up their own teams


## UI Mockup

Login Page is displayed when the user first visits the website. If user have a account just sign in, if not he need to sing up.
Once the user enters his login credentials and is authenticated, the landing page is displayed. The user can then search for players  in the search bar. 

![Screenshot 2024-02-26 212314](https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/16e8f30f-b200-41f3-b122-92137d1ef5e4)

the main page of how our website will work.
![Screenshot 2024-02-06 000017](https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/d5d68268-119d-4839-90d2-94fa713dbf9d)



| Member | Task |
| --- | --- |
| Yuxuan Nan | Creating the frontend User Interface in React, set up devops to host the application |
| Zixin Mao | Setting up the backend database|
| Hao Liu | Working on UI page and frontend User Interface |
| Zehao Ji | connect the backend with the frontend |


 ## Final Demo Video


</br>
