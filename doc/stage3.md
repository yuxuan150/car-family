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


## 3.This SQL query provides a user with a list of available car models from various brands within 200 kilometers, detailing the average price and total availability of each model, sorted by proximity.*/it use join multiple relation and aggregation via group by
   SELECT 
    c.company_name AS Brand,
    cm.Model,
    ROUND(AVG(CAST(cm.price AS DECIMAL(10,2))), 2) AS AveragePrice,
    COUNT(cm.CarID) AS TotalAvailable,
    ROUND(SQRT(
        POW(l.latitude - -10, 2) + 
        POW(l.longitude - -10, 2)
    ), 2) AS Distance
FROM 
    CarModels cm
JOIN 
    company c ON cm.company_id = c.company_id
JOIN 
    location l ON cm.location_id = l.locationID
WHERE 
    SQRT(
        POW(l.latitude - -10, 2) + 
        POW(l.longitude - -10, 2)
    ) <= 200
GROUP BY 
    c.company_name, cm.Model, Distance
ORDER BY 
    Distance ASC;
![Screenshot 2024-04-28 202148](https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/b60df475-f3e8-472e-bc16-949e7d3cbd53)
## 4. The functionality of the updated SQL query is to provide a report that lists each car model, the associated car manufacturer (brand), the total number of unique recalls for each model, and a count of how many times recalls have been reported in each city. This allows stakeholders to understand the frequency and geographical distribution of recalls for specific car models across different brands, aiding in targeted recall management and regional service planning. Join multiple relations and Aggregation via GROUP BY

   SELECT 
    c.company_name AS Brand,
    cm.Model,
    COUNT(DISTINCT r.recallID) AS TotalRecalls,
    l.city_name AS City,
    COUNT(DISTINCT l.city_name) AS CityRecallCount
FROM 
    CarModels cm
JOIN 
    recall r ON cm.CarID = r.CarID
JOIN 
    company c ON cm.company_id = c.company_id
JOIN 
    location l ON cm.location_id = l.locationID
GROUP BY 
    c.company_name, cm.Model, l.city_name
ORDER BY 
    TotalRecalls DESC, CityRecallCount DESC;
![Screenshot 2024-04-28 202318](https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/e5095aed-ef53-422c-a744-14bee3f159d2)


# Part2:

## Executing EXPLAIN ANALYZE on the first advance query:
## 1.	
	EXPLAIN ANALYZE
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


![Screenshot 2024-04-25 215430](https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/cd3c62db-ec67-423b-a0b9-b4dc8f42177d)

1)	 CREATE INDEX idx_car_models_price ON CarModels(price); then the output is:                      
![Screenshot 2024-04-25 220319](https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/9ef13e38-5016-4b78-b55a-f5260e4c1e4d)
cost not changed;
2) CREATE INDEX idx_car_models_year ON CarModels(year); then the output is:
![Screenshot 2024-04-25 220455](https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/b058499c-4046-420f-86d6-87c52d27dd8e)
3) CREATE INDEX idx_company_name ON company(company_name(255));then the output is:
![Screenshot 2024-04-25 220930](https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/0530b104-fce7-483e-ba1c-c162476690c6)
4) CREATE INDEX idx_car_models_model ON CarModels(Model);then the output is:
![Screenshot 2024-04-25 221139](https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/53f4d510-1455-4fc5-9e5e-16c20e514e2e)

This is the line chart of cost changes when you creat different indexs. A,B,C,D,E,F means different indexing. A is the original sql aka no indexing created.0,1,2,3....8 is different cost in one explain analyze output. By vieweing the chart we will find that when we creat index car_models the cost increased; Others index are not changed with original graph.
![Screenshot 2024-04-28 212428](https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/45f08277-85a2-47e4-9a3c-02ecbc3a7f30)

## Executing EXPLAIN ANALYZE on the second advance query:
## 2.
	EXPLAIN ANALYZE
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


 ![Screenshot 2024-04-25 222250](https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/3b1ade6e-36f5-43b1-b712-2161a635c0f8)
                                                                     
1)	CREATE INDEX idx_recall_reason ON recall(reason(255));
![Screenshot 2024-04-25 222737](https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/dffd87c9-6432-4c10-84f9-f4568d411793)

2) CREATE INDEX idx_car_models_company_id ON CarModels(company_id);
![Screenshot 2024-04-25 222904](https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/6fad4aa2-fc1f-48db-bd3d-317286f82673)
3）CREATE INDEX idx_car_models_model ON CarModels(Model);
![Screenshot 2024-04-25 223216](https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/5a373fff-4e05-4001-a61e-c23b0cb721b8)

The cost is not chaned at all, so no need to index for this sql.
![Screenshot 2024-04-28 213355](https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/324faba1-61f4-4050-b447-ad7b5468c74a)

## 3.	
EXPLAIN ANALYZE SELECT 
    c.company_name AS Brand,
    cm.Model,
    ROUND(AVG(CAST(cm.price AS DECIMAL(10,2))), 2) AS AveragePrice,
    COUNT(cm.CarID) AS TotalAvailable,
    ROUND(SQRT(
        POW(l.latitude - -10, 2) + 
        POW(l.longitude - -10, 2)
    ), 2) AS Distance
FROM 
    CarModels cm
JOIN 
    company c ON cm.company_id = c.company_id
JOIN 
    location l ON cm.location_id = l.locationID
WHERE 
    SQRT(
        POW(l.latitude - -10, 2) + 
        POW(l.longitude - -10, 2)
    ) <= 200
GROUP BY 
    c.company_name, cm.Model, Distance
ORDER BY 
    Distance ASC;


![Screenshot 2024-04-28 202703](https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/8759336e-6ead-4994-a74b-653753da4ea3)


1)	CREATE INDEX idx_location_latitude ON location(latitude);
	 ![Screenshot 2024-04-28 202905](https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/65ebd24e-166e-4a6a-afe0-6072016f9531)
2)      CREATE INDEX idx_location_longitude ON location(longitude);
   
       ![Screenshot 2024-04-28 202958](https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/00fbea69-161a-4311-89fe-a186cbd5333e
       
4)	CREATE INDEX idx_company_name ON company(company_name);
   	![Screenshot 2024-04-28 203233](https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/814ec14b-41a7-47ed-ba59-13824eee6ac9)
5)	CREATE INDEX idx_car_models_model ON CarModels(Model);
   	![Screenshot 2024-04-28 203324](https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/777f3c29-f612-46d3-8799-ea335bafa64f)
## 4. 
EXPLAIN ANALYZE SELECT 
    c.company_name AS Brand,
    cm.Model,
    COUNT(DISTINCT r.recallID) AS TotalRecalls,
    l.city_name AS City,
    COUNT(DISTINCT l.city_name) AS CityRecallCount
FROM 
    CarModels cm
JOIN 
    recall r ON cm.CarID = r.CarID
JOIN 
    company c ON cm.company_id = c.company_id
JOIN 
    location l ON cm.location_id = l.locationID
GROUP BY 
    c.company_name, cm.Model, l.city_name
ORDER BY 
    TotalRecalls DESC, CityRecallCount DESC;


![Screenshot 2024-04-28 203426](https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/34a5082b-64fc-43e1-98f8-5aaed2fcf3f3)

1)	CREATE INDEX idx_company_name ON company(company_name);

![Screenshot 2024-04-28 203542](https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/1eb31b2e-e9a5-4cf0-818e-8ab0eeedecbe)

2)	CREATE INDEX idx_car_models_model ON CarModels(Model);
![Screenshot 2024-04-28 203612](https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/79914ae3-bc2f-438a-bdda-70e2615de2de)

3) 	CREATE INDEX idx_location_city_name ON location(city_name);
![Screenshot 2024-04-28 203639](https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/f1877f21-b9c4-46e3-b0b1-f168ba38d516)

