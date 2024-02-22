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
We aim to build a website which allows users to check for detailed information of the car they search(Ex: Make, Model, Engine, Fuel Type). The user can also compare a specific aspect of the car( Ex: Engine difference between Mustang and Camaro)  to have a better understanding of differences. What is more, this website will also include the recent sales information on used cars so that the users can know about the price of the car they liked, what is more we will also include a market price which allows the user to compare and find out the car with the best price that they can afford. For interaction, the user can login with their account, find the car they like to know by searching names or choose the constraints. The user can also compare the car with others on the specific performance.
## Description
Car Family is a web platform to help users quickly sort and find the cars that people are looking for, it could also help people determine whether they should sell or buy a used car based on price. The project involves designing, sorting, combining, and filtering the database so that it helps the user to find their best car. Our platform would include the information of Name Model ,Company,Year of Purchase,KM's driven,Price,Fuel type,Registration city,Transmission,Condition means car is used or new,Seller Location,Features of cars Images of selling car.  Based on that, users would visualize to know the information of the car that they are looking for.

Also, based on the Car Family platform, users could also compare different cars to see the differences of car’s infornamation. Moreover, CarFamily also provides used car information. It would help users to determine when and where to buy/sell a car that is more cost-sufficient. The information of this part would be pricesold, yearsold,mileage, make, model,trim, engine,year,zipcode, id. Based on these, users would know which car is more value-maintaining, and which car is not.   

We will use some algorithms to calculate the hedge ratio, and we will also use MySQL to search the data from the database and SQL to establish the database. We will also use HTML5, CSS, Javascript, React.js to design our frontend webpage. 



## Usefulness
The website we build aims for potential customers who are interested in purchasing cars but they may not know what to choose. In this case this website allows them to have access to information about the car they like immediately. Also if they do not have any brand preferences, this website can find the car that is most suitable for them based on their preferences(Ex: FWD/RWD, Sedan/SUV). Beside this, the user can also have two cars be compared directly with their information shown. Also they can check the sales information before to have a better sense of the price of such a car. The simple feature might be showing information of the specific car they choose, while the complex feature may be filtering based on users’ demand, comparing two cars. 

There are similar websites such as Cars, Carfax, Edmunds. But our website is different because we include a direct comparison between two cars based on the user’s preferences and we also include the market price comparison of the used cars so that the user can choose the car which has the best price.


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
Car Info: users can get access to a certain type of car’s information by typing the name of the car or by selecting the filter. In this case, the user can have a comprehensive understanding of each cars’ performance. Within this service, we also provide direct comparison between two cars allowing users to make direct comparisons.
cars for sale: we provide detailed information about the current selling cars and their prices. This allows the user to search for the specific car that they like( Ex: color, performance, etc.) For each car for sale, we also include the market price for such specific cars. The user may type in the car name or select a price range for filtering.
cars sold: we also provide the historical records of the deal for different types of cars which allow the users to compare the price and may find out the best time to buy a car. The user can type in the car name or select the car for checking the information.


## UI Mockup

Login Page is displayed when the user first visits the website. If user have a account just sign in, if not he need to sing up.
Once the user enters his login credentials and is authenticated, the landing page is displayed. The user can then search for players  in the search bar. 

![Screenshot 2024-02-05 234531](https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/fe0e6ce3-490a-401b-881e-43e7a440e4c4)

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
