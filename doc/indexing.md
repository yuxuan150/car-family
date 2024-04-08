1.	For the query show the average price for each car model within each company
EXPLAIN ANALYZ
SELECT company.company_name, CarModels.Model, AVG(CAST(CarModels.price AS DECIMAL(10,2))) AS average_price 
FROM CarModels 
JOIN company ON CarModels.company_id = company.company_id 
GROUP BY company.company_name, CarModels.Model 
ORDER BY company.company_name, average_price DESC;
 
1)	For indexing, firstly I tried using CREATE INDEX idx_car_models_model ON CarModels(Model); then the output is:                      
Although the time is decrement, but the cost still not change. 
2.	For query that a specific user can search a specific car model and brand by distance. close to far.
EXPLAIN ANALYZ SELECT company.company_name AS Brand, CarModels.Model, car_location.city_name AS CarLocation, SQRT(POW(user_location.latitude - car_location.latitude, 2) + POW(user_location.longitude - car_location.longitude, 2)) AS Distance FROM users INNER JOIN location AS user_location ON users.location_id = user_location.locationID INNER JOIN CarModels ON CarModels.location_id IS NOT NULL INNER JOIN location AS car_location ON CarModels.location_id = car_location.locationID INNER JOIN company ON CarModels.company_id = company.company_id WHERE users.UserID = 1000 AND company.company_name = 'Honda' AND CarModels.Model = 'Civic' ORDER BY Distance;
                                                                      
1)	For indexing, firstly I try : CREATE INDEX idx_company_name ON company(company_name); 
The output looks good, cost decrement a lot. Then I will try use another indexing.
       2) CREATE INDEX idx_car_models_model ON CarModels(Model);
 
Cost decrement more, looks good, then we should keep these two indexes.
3.	For query that : For a specific car model list the milege from low to high with price:
EXPLAIN ANALYZE  
SELECT company.company_name AS Brand, CarModels.Model, CarModels.miles, CarModels.price FROM CarModels INNER JOIN company ON CarModels.company_id = company.company_id WHERE CarModels.Model = 'Civic' AND company.company_name = 'Honda' ORDER BY CAST(CarModels.miles AS UNSIGNED) ASC, CAST(CarModels.price AS DECIMAL(10,2)) ASC;  
1)	Since CREATE INDEX idx_car_models_model ON CarModels(Model);
CREATE INDEX idx_company_name ON company(company_name); are already creater, no more indexing I can do.
4.	For a Query that for given carid if it has recall give details, if not say no;
EXPLAIN ANALYZE  
SELECT CarModels.CarID, CASE WHEN recall.recallID IS NOT NULL THEN 'Yes' ELSE 'No' END AS HasRecall, recall.reason, recall.report_received_date, recall.consequence_summary, recall.component FROM CarModels LEFT JOIN recall ON CarModels.CarID = recall.CarID WHERE CarModels.CarID = 1613; 
1)	CREATE INDEX idx_recall_carid ON recall(CarID); 
The cost is not change at all, so no need for indexing.
