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
Car Family is a web platform to help users quickly sort and find the cars that people are looking for, it could also help people determine whether they should sell or buy a used car based on price. The project involves designing, sorting, combining, and filtering the database so that it helps the user to find their best car. Our platform would include the information of Name Model ,Company,Year of Purchase,KM's driven,Price,Fuel type,Registration city,Transmission,Condition means car is used or new,Seller Location,Features of cars Images of selling car.  Based on that, users would visualize to know the information of the car that they are looking for. Also, based on the Car Family platform, users could also compare different cars to see the differences of car’s infornamation. Moreover, CarFamily also provides used car information. It would help users to determine when and where to buy/sell a car is more cost-sufficient. The information of this part would be pricesold, yearsold,milage, make, model,trim, engine,year,zipcode, id.    Users  Based on these, users would know which car is more value-maintaining, and which car is not.   We will use some algorithms to calculate the hedge ratio, and we will also use MySQL to search the data from the database and SQL to establish the database. We will also use HTML5, CSS, Javascript, React.js to design our frontend webpage.


## Usefulness
The website we build aims for potential customers who are interested in purchasing cars but they may not know what to choose. In this case this website allows them to have access to information about the car they like immediately. Also if they do not have any brand preferences, this website can find the car that is most suitable for them based on their preferences(Ex: FWD/RWD, Sedan/SUV). Beside this, the user can also have two cars be compared directly with their information shown. Also they can check the sales information before to have a better sense of the price of such a car. The simple feature might be showing information of the specific car they choose, while the complex feature may be filtering based on users’ demand, comparing two cars. 
There are similar websites such as Cars, Carfax, Edmunds. But our website is different because we include a direct comparison between two cars based on the user’s preferences and we also include the market price comparison of the used cars so that the user can choose the car which has the best price.


## Realness
The database server will store the below entities:


|   Entity    |   Attributes                 |  
| ----------- | -----------------------------| 
| User        |    userId, name, email, password, role, fundsAvailable |
| TeamDetails | teamId , userId , createdDate, teamName, points |
| Player      |    playerId, playerName, playerPosition, playerRating, playerBasePrice, Nationality |
| TeamPlayer | teamPlayerId, teamID, playerId, dateAdded |
| Games | gameId, homeTeamId, awayTeamId, homeScore, awayScore , datePlayed, location |




### Data Source Links: <br /> 
https://www.kaggle.com/datasets/davidcariboo/player-scores?select=players.csv

The data comes from Transfermarkt, which is one of the largest sports websites in the world. The footballing information we will be using is listed in the link above. The database is updated on a weekly basis.


## Functionality Description
The web portal for a fantasy soccer game will offer a wide range of functionalities to its users.

Firstly, the login screen is displayed and the user is prompted to enter his/her login credentials. 
The admin can add new users to the database. The admin can also delete users from the database. The admin can also update the user details in the database. The admin can also view the list of users in the database. Admin can also view all the teams' details in the database and also view all the players' details in the database. Admin is able to make changes to the current player and team database for updating and maintaining the information provided on the webpage. The admin can choose to archive certain players to make them “inactive”, which is similar to deletion but the player’s data will be kept for observation only.

The general user will see the list of players in his current team as the landing page. He can search for players based on different parameters like name, position, rating , base price etc. The user can add(insert) players to his team, remove(delete) players from his team, update(update) the players in his team and view the players in his team. The user can also manage positions of players in their team to simulate different tactics that may be used in the field. 

With these and other functionalities, the web portal for a fantasy soccer game will provide a comprehensive and engaging platform for users to experience the excitement of soccer and gaming.

## UI Mockup

Login Page is displayed when the user first visits the website. If user have a account just sign in, if not he need to sing up.
Once the user enters his login credentials and is authenticated, the landing page is displayed. The user can then search for players  in the search bar. 

![Screenshot 2024-02-05 234531](https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/fe0e6ce3-490a-401b-881e-43e7a440e4c4)


![Landing page after login](UIMockup/LandingPage.png "Landing Page.")

The Admin portal is displayed when the user logs in as an admin. The admin can add new users, delete users, update user details, view all users, view all teams and view all players.

![Admin portal](UIMockup/AdminPortal.png "Admin Portal.")
## Work Distribution

- All team members will equally contribute to DB UML diagrams and design.
- Each page will require querying based on concepts from the course. We plan to include Triggers, Stored Procedures and CRUD operations.


| Member | Task |
| --- | --- |
| Payal Mantri | Initial setup of the frontend in React, and work on different UI Pages. |
| Ammar Raza | Creating the frontend User Interface in React, set up devops to host the application|
| Stephen Moy | Setting up the backend database and creating APIs in Java |
| Youhan Li | Setting up the backend user database and connecting the backend with the frontend. Work on setting up authorization |


 ## Final Demo Video


</br>
