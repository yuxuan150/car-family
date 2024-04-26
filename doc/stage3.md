# Stage 3
# Part1:

## DDL commands for the tables:
    -- Users Table
    CREATE TABLE users (
        UserID INT AUTO_INCREMENT PRIMARY KEY,
        UserName VARCHAR(255) NOT NULL,
        Email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        location_id INT,
        FOREIGN KEY (location_id) REFERENCES location(locationID)
    );
    
    -- Location Table
    CREATE TABLE location (
        locationID INT AUTO_INCREMENT PRIMARY KEY,
        city_name VARCHAR(50) NOT NULL UNIQUE,
        latitude FLOAT NOT NULL,
        longitude FLOAT NOT NULL
    );
    
    -- CarModels Table
    CREATE TABLE CarModels (
      CarID INT AUTO_INCREMENT PRIMARY KEY,
      Model VARCHAR(255) NOT NULL,
      year YEAR NOT NULL,
      miles VARCHAR(255) NOT NULL,
      color VARCHAR(50),
      price VARCHAR(255) NOT NULL,
      company_id INT NOT NULL,
      location_id INT,
      FOREIGN KEY (company_id) REFERENCES company(company_id),
      FOREIGN KEY (location_id) REFERENCES location(locationID)
    );
    
    -- Recall Table
    CREATE TABLE recall (
        recallID INT AUTO_INCREMENT PRIMARY KEY,
        reason TEXT,
        report_received_date YEAR NOT NULL,
        consequence_summary TEXT,
        component VARCHAR(255),
        CarID INT,
        FOREIGN KEY (CarID) REFERENCES CarModels(CarID)
    );
    
    -- Company Table
    CREATE TABLE company (
        company_id INT AUTO_INCREMENT PRIMARY KEY,
        company_name VARCHAR(255) NOT NULL,
        created_date INT NOT NULL
    );
    -- located
    CREATE TABLE located (
        located_id INT AUTO_INCREMENT PRIMARY KEY,
        locationID INT UNIQUE NOT NULL,
        company_id INT UNIQUE NOT NULL,
        FOREIGN KEY (company_id) REFERENCES company(company_id),
        FOREIGN KEY (locationID) REFERENCES location(locationID)
    );

# Screenshots of Database & Tables:
1. gcloud sql connect team088 --user=root
2. type password : team088
3. use stage3;
4. show tables;
<img width="215" alt="Screenshot 2024-04-08 at 12 37 49 PM" src="https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/a1a969a1-3cca-4f1a-9ec0-ef531d29f38b">

## CarModels rows
<img width="386" alt="Screenshot 2024-04-08 at 12 39 23 PM" src="https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/f9e43b44-a527-4529-9247-60d774486709">

## company rows
<img width="330" alt="Screenshot 2024-04-08 at 12 39 41 PM" src="https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/d3a24a3a-c684-43b3-bc78-ca98bccaa2bf">

## location rows
<img width="370" alt="Screenshot 2024-04-08 at 12 40 05 PM" src="https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/71c92c9f-62f3-47ab-8479-bbe287afab12">

## recall rows
<img width="394" alt="Screenshot 2024-04-08 at 12 40 38 PM" src="https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/0d7f5679-e7d9-4d47-aa8c-573e6d542c92">

## users rows
<img width="375" alt="Screenshot 2024-04-08 at 12 40 53 PM" src="https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/af601a75-50e2-4e67-a0fc-5085262c360f">

## located rows

<img width="294" alt="Screenshot 2024-04-08 at 1 02 41 PM" src="https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/7034bb77-bab2-4b2a-8623-0642874a2855">


## 1. This query combines aggregation, complex joins, and subqueries that are not trivially replaced by joins.The function in your query calculates the average price of car models by company and model, and it uses several advanced SQL techniques including subqueries and aggregation with GROUP BY. Here’s a breakdown of what the query does and how it achieves its results: we use Subqueries That Cannot Be Easily Replaced by a Join and Aggregation via GROUP BY

	SELECT c.company_name, cm.Model, AVG(cm.price) AS average_price
	FROM company c
	JOIN (
  	  SELECT company_id, Model, price
	    FROM CarModels
	    WHERE price > (SELECT AVG(price) FROM CarModels WHERE year > 2010)
	) cm ON c.company_id = cm.company_id
	GROUP BY c.company_name, cm.Model
	HAVING AVG(cm.price) > (SELECT AVG(price) FROM CarModels)
	ORDER BY average_price DESC;
![Screenshot 2024-04-25 214920](https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/0b98bbf0-833f-4191-9145-4a898ccdb26b)

## 2.This query is designed to retrieve the average price of car models from a specific brand that have had safety-related recalls. It only includes models whose average price is less than the overall average price of all car models in the CarModels table. This could be useful for consumers looking for safer car options below the average price or for market analysis by a company to compare the pricing of its recalled models against the broader market this would use Join multiple relations, Aggregation via GROUP BY, Subqueries that cannot be easily replaced by a join
 	  SELECT 
	    c.company_name AS Brand, 
 	   cm.Model, 
	    AVG(CAST(cm.price AS DECIMAL(10,2))) AS AveragePrice
	FROM 
	    CarModels cm 
	INNER JOIN 
	    company c ON cm.company_id = c.company_id
	WHERE 
	    cm.CarID IN (
	        SELECT CarID 
 	       FROM recall 
  	      WHERE reason LIKE '%engine fault%'
 	   )
	GROUP BY 
	    c.company_name, cm.Model
	HAVING 
	    AVG(CAST(cm.price AS DECIMAL(10,2))) < (
	        SELECT AVG(CAST(price AS DECIMAL(10,2))) 
	        FROM CarModels
	    )
	ORDER BY 
	    AveragePrice ASC;
![Screenshot 2024-04-25 215220](https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/cc24cb7c-b8fc-4ac9-aef4-0b61a25be185)


## 3. Advanced Query:For a specific car model list the milege from low to high with price
    SELECT
      company.company_name AS Brand,
      CarModels.Model,
      CarModels.miles,
      CarModels.price
    FROM
      CarModels
    INNER JOIN company ON CarModels.company_id = company.company_id
    WHERE
      CarModels.Model = 'Civic'
      AND company.company_name = 'Honda'
    ORDER BY
      CAST(CarModels.miles AS UNSIGNED) ASC, 
      CAST(CarModels.price AS DECIMAL(10,2)) ASC; 
![Screenshot 2024-04-06 223701](https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/21bdd96a-41e6-4ed3-bf3f-978762287928)
## 4. Advanced Query:For given carid if it has recall give details, if not say no
    SELECT
      CarModels.CarID,
      CASE
        WHEN recall.recallID IS NOT NULL THEN 'Yes'
        ELSE 'No'
      END AS HasRecall,
      recall.reason,
      recall.report_received_date,
      recall.consequence_summary,
      recall.component
    FROM
      CarModels
    LEFT JOIN recall ON CarModels.CarID = recall.CarID
    WHERE
      CarModels.CarID = 1613; 
        (since this is for on carid so only one data will show)
![Screenshot 2024-04-06 224114](https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/df1bf3a9-0433-4573-922e-41abce22f86c)


# Part2:

## Executing EXPLAIN ANALYZE on the first advance query:
## 1.	For the query show the average price for each car model within each company
EXPLAIN ANALYZ
SELECT company.company_name, CarModels.Model, AVG(CAST(CarModels.price AS DECIMAL(10,2))) AS average_price 
FROM CarModels 
JOIN company ON CarModels.company_id = company.company_id 
GROUP BY company.company_name, CarModels.Model 
ORDER BY company.company_name, average_price DESC;


 <img width="468" alt="image" src="https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/7434e487-1a65-4027-bf0e-a1f49faee655">

1)	For indexing, firstly I tried using CREATE INDEX idx_car_models_model ON CarModels(Model); then the output is:                      

<img width="468" alt="image" src="https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/8aa66bc3-7a43-4a64-b022-ba1b948dd2e1">


Although the time is decrement, but the cost still not change.

## 2.	For query that a specific user can search a specific car model and brand by distance. close to far.
EXPLAIN ANALYZ SELECT company.company_name AS Brand, CarModels.Model, car_location.city_name AS CarLocation, SQRT(POW(user_location.latitude - car_location.latitude, 2) + POW(user_location.longitude - car_location.longitude, 2)) AS Distance FROM users INNER JOIN location AS user_location ON users.location_id = user_location.locationID INNER JOIN CarModels ON CarModels.location_id IS NOT NULL INNER JOIN location AS car_location ON CarModels.location_id = car_location.locationID INNER JOIN company ON CarModels.company_id = company.company_id WHERE users.UserID = 1000 AND company.company_name = 'Honda' AND CarModels.Model = 'Civic' ORDER BY Distance;

 
 <img width="468" alt="image" src="https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/144d9a96-84ee-4681-beb9-aacefe7fb368">
                                                                     
1)	For indexing, firstly I try : CREATE INDEX idx_company_name ON company(company_name); 
The output looks good, cost decrement a lot. Then I will try use another indexing.
<img width="468" alt="image" src="https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/1cd585f6-a3eb-4dd8-ae86-cbb938ade6d1">

       2) CREATE INDEX idx_car_models_model ON CarModels(Model);
  
          
 <img width="468" alt="image" src="https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/f7bb87c2-db35-41a8-895f-a74a8ade363e">

Cost decrement more, looks good, then we should keep these two indexes.
## 3.	For query that : For a specific car model list the milege from low to high with price:
EXPLAIN ANALYZE  
SELECT company.company_name AS Brand, CarModels.Model, CarModels.miles, CarModels.price FROM CarModels INNER JOIN company ON CarModels.company_id = company.company_id WHERE CarModels.Model = 'Civic' AND company.company_name = 'Honda' ORDER BY CAST(CarModels.miles AS UNSIGNED) ASC, CAST(CarModels.price AS DECIMAL(10,2)) ASC;  


<img width="468" alt="image" src="https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/4ecaf7c6-d2c2-4f5a-ad9b-fa22507424a3">

1)	Since CREATE INDEX idx_car_models_model ON CarModels(Model);
CREATE INDEX idx_company_name ON company(company_name); are already creater, no more indexing I can do.
## 4.	For a Query that for given carid if it has recall give details, if not say no;
EXPLAIN ANALYZE  
SELECT CarModels.CarID, CASE WHEN recall.recallID IS NOT NULL THEN 'Yes' ELSE 'No' END AS HasRecall, recall.reason, recall.report_received_date, recall.consequence_summary, recall.component FROM CarModels LEFT JOIN recall ON CarModels.CarID = recall.CarID WHERE CarModels.CarID = 1613;


<img width="468" alt="image" src="https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/a9e6734e-2f2c-4baf-a5fc-25624582d986">

1)	CREATE INDEX idx_recall_carid ON recall(CarID);

	<img width="468" alt="image" src="https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/0446a2d8-9f73-4116-bc47-f6e503a46cc6">

The cost is not change at all, so no need for indexing.


