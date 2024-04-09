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

   
2)	<img width="468" alt="image" src="https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/0446a2d8-9f73-4116-bc47-f6e503a46cc6">

The cost is not change at all, so no need for indexing.

