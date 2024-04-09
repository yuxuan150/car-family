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
We aim to build a website which allows users to check for detailed information of the car so that it could aim users to buy the favourite car which they want. So the detail information would include Model, year, color price and miles. We will also include a recall model which could check the reason, components, and brand of recalled vehicle. Users could check the specific car he looking for, to check whether it has been recall or not, so it is consider to the safety. What is more, this website will also include position information on specific car, user  and car company. User would know what is the distance between the specific car he is looking for and himself, so that it helps user to make consideration about whether to buy this car or not.  Car family also provides company table so that user could know which company a car belongs to, and the site shows the company's location.  
## Description
Car Family is a web platform to help users quickly sort and find the cars that people are looking for, it could also help people determine whether they should  buy a used car based on price. The project involves designing, sorting, combining, and filtering the database so that it helps the user to find their best car. Our platform would include the information of brand, Model, color, Year of car,Price.  Based on all the information above, user could determine whether they want to buy or sell the car or not.

Car family also provide recall and car history functionality. As for recall, user could directly type the recall Id to see whether the specific car has been recalled or not. Based on this information, user could know the car they choose whether it has design flaws or not.The recall include reason, report reveived date, recallID, component, consequence summary. If the car has been recalled, it could also show the reason and components they recall. As for car campany,user could know which company a car belongs to, and the site shows the company's location. As a result, both recall and company would help user to determine buy the car.
Also, based on the Car Family platform, users could also search for the car location, and it would tell you how far does user from this car. It would help user to determine the distance between user and this car.

We will also use MySQL to search the data from the database and SQL to establish the database. We will also use HTML5, CSS, Javascript, React.js to design our frontend webpage. 



## Usefulness
The website we build aims for potential customers who are interested in purchasing cars but they may not know what to choose. In this case this website allows them to have access to information about the car they like immediately. Also if they do not have any brand preferences, this website can find the car that is most suitable for them based on their preferences(Ex: price above $30000). Beside this, users can also calculation the distance between user and specific car which they looking for.

There are similar websites such as Cars, Carfax, Edmunds. But our website is different because our website could show whether this car has been recalled or not, and it show which component and reason does this car been recall. We put user safety first. And I believe safety is the number one factor when users consider whether to buy this car.
## Realness
We use 5 databases include uesrs,carmodels,recall,company and location. All of these datasets are from kaggle.com, and it is a CSV file. These datasets have information about uses' location,name,email,password. Include CarModels' carid,companyid,locationid,model,year,color,miles,price. Include recalls' Recallid, carid, Report received date, Reason, Consequence summary,Component. Include company CompanyID, Created date, Company Name. Include location: LocationID, cityname, latitude,longitude.
which are 10.9MB and 13.1MB.
Data link:
https://www.kaggle.com/datasets/abdullahkhanuet22/olx-cars-dataset
https://www.kaggle.com/datasets/tsaustin/us-used-car-sales-data
https://www.kaggle.com/datasets/andreinovikov/used-cars-dataset




|   Entity    |   Attributes                 |  
| ----------- | -----------------------------| 
| Users       |    UserID (PK),LocationID(FK), Username, Email, Password |
| CarModels   | CarID (PK), CompanyID(FK), LocationID(FK), Model, Year, color, Miles, Price|
| recall      |   Recall ID (PK), CarID(FK), Report received date, Reason, Consequence summary,Component |
| company | CompanyID (PK), Created date, Company Name|
| location | LocationID (PK), cityname, latitude,longitude|





## Functionality Description
Functionality Description:
Our website have the following services:
CarModels: users can get access to a certain type of car’s information by typing the name of the car or by selecting the filter. In this case, the user can have a comprehensive understanding of each cars’ performance. Within this service, we also provide direct comparison between two cars allowing users to make direct comparisons.

recall: we provide detailed information about the specific type of car which has been recalled. This allows the user to search for the recall id that they are looking for. For each car for sale, we also include the reason and components for such specific cars, so that user could know more about this specific car.Once it has recalled, it would show all the recall information about this car.

car company: we also provide the which car belongs to which company, and it also show the location of this company. User could click on specific car, and it would show which company it belongs to. Lots of different cars may belongs to one big company.

position: It contains user's location, car's location, and company's location.

User: In this mode, the user would create their own username, passwords, our website will insert the information to our database, the user can change their username or passwords and these will also update to database.





## UI Mockup

Login Page is displayed when the user first visits the website. If user have a account just sign in, if not he need to sing up. 

![3f874191376936496e18434e0dc73d3](https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/d4157de1-b964-49df-b065-a86a014ea555)

Once the user login successfully, this user can seach a specific car by using model,year,miles.....

![Screenshot 2024-04-08 213345](https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/15256437-feb7-4a90-a622-8f594c85b51a)

In this page, uesr can checking if their car has recall. If have, provide recall details.

![Screenshot 2024-04-08 212800](https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/d1a58ce2-083b-4e6c-b1a7-8063839c9599)

| Member | Task |
| --- | --- |
| Yuxuan Nan | Creating the frontend User Interface in React, set up devops to host the application |
| Zixin Mao | Setting up the backend database|
| Hao Liu | Working on UI page and frontend User Interface |



 ## Final Demo Video


</br>
