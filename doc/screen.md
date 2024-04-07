## show the average price for each car model within each company

SELECT
  company.company_name,
  CarModels.Model,
  AVG(CAST(CarModels.price AS DECIMAL(10,2))) AS average_price
FROM
  CarModels
JOIN
  company ON CarModels.company_id = company.company_id
GROUP BY
  company.company_name, CarModels.Model
ORDER BY
  company.company_name, average_price DESC;


  
![Screenshot 2024-04-06 214724](https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/0a398cd6-342f-4afc-99bf-093832887dd9)

## A specific user can search a specific car model and brand by distance. close to far
SELECT
company.company_name AS Brand,
  CarModels.Model,
  car_location.city_name AS CarLocation,
  SQRT(POW(user_location.latitude - car_location.latitude, 2) + POW(user_location.longitude - car_location.longitude, 2)) AS Distance
FROM
  users
INNER JOIN location AS user_location ON users.location_id = user_location.locationID
INNER JOIN CarModels ON CarModels.location_id IS NOT NULL
INNER JOIN location AS car_location ON CarModels.location_id = car_location.locationID
INNER JOIN company ON CarModels.company_id = company.company_id
WHERE
  users.UserID = 1000
  AND company.company_name = 'Honda'
  AND CarModels.Model = 'Civic' 
ORDER BY
  Distance;
![Screenshot 2024-04-06 222829](https://github.com/cs411-alawini/sp24-cs411-team088-Chaseb/assets/90883274/d13f7dc4-2151-4236-bd3c-f3bea350692b)
