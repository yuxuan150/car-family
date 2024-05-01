  

-- ----------------------------
-- Procedure structure for GetStatistics
-- ----------------------------
DROP PROCEDURE IF EXISTS `GetStatistics`;
delimiter ;;
CREATE PROCEDURE `GetStatistics`()
BEGIN
    DECLARE iUsers INT;
    DECLARE iRecall INT;
    DECLARE iSelling INT;
    DECLARE iOrders INT;

    -- Get the number of users
    SELECT COUNT(*) INTO iUsers FROM ev_users;

    -- Get the number of models currently selling
    SELECT COUNT(*) INTO iSelling FROM carmodels WHERE status = 'selling';

    -- Get the number of orders already saled
    SELECT COUNT(*) INTO iOrders FROM online_trade;

    -- Get the number of recalls
    SELECT COUNT(*) INTO iRecall FROM recall;

    -- Return the statistics
    SELECT iUsers,iRecall,iSelling,iOrders;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for GetTradeSummary
-- ----------------------------
DROP PROCEDURE IF EXISTS `GetTradeSummary`;
delimiter ;;
CREATE PROCEDURE `GetTradeSummary`(IN trade_status VARCHAR(255))
BEGIN
    SELECT
        COUNT(a.carid) iCount,
        DATE_FORMAT(a.add_time, '%Y-%M-%d') AS sale_date,
        SUM(b.price) iAmount
    FROM
        online_trade a
        INNER JOIN carmodels b ON a.carid = b.CarID 
    WHERE
        b.status = trade_status 
        AND a.add_time >= DATE_SUB(NOW(), INTERVAL 1 MONTH) 
    GROUP BY sale_date;
	 
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for GetUserLogCounts
-- ----------------------------
DROP PROCEDURE IF EXISTS `GetUserLogCounts`;
delimiter ;;
CREATE PROCEDURE `GetUserLogCounts`()
BEGIN
    SELECT b.username, COUNT(*) AS times 
    FROM user_log a  
    INNER JOIN ev_users b ON a.userid = b.userid 
    GROUP BY a.userId  
    ORDER BY times DESC;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for updateRecall
-- ----------------------------
DROP PROCEDURE IF EXISTS `updateRecall`;
delimiter ;;
CREATE PROCEDURE `updateRecall`(IN recall_id INT,
    IN carid INT,
    IN reason TEXT,
    IN report_received_date YEAR,
    IN consequence_summary TEXT,
    IN component VARCHAR(255))
BEGIN
    DECLARE recordCount INT;
    DECLARE rollbackFlag BOOLEAN DEFAULT FALSE;

    -- Start a transaction
    START TRANSACTION;

    -- Check if the record and model exists 
    SELECT COUNT(*) INTO recordCount FROM recall a  inner join carmodels b  on a.CarID=b.CarID 
		 WHERE a.recallID = recall_id;

    -- If the record does not exist, rollback the transaction and return an error
    IF recordCount = 0 THEN
        SET rollbackFlag = TRUE;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Recall record not found';
    END IF;

    -- If there is a record and no error occurred, perform the update operation
    IF NOT rollbackFlag THEN
        -- Update the record
        UPDATE recall
        SET carid = carid,
            reason = reason,
            report_received_date = report_received_date,
            consequence_summary = consequence_summary,
            component = component
        WHERE recallID = recall_id;

        -- Check if the update was successful
        IF ROW_COUNT() = 0 THEN
            SET rollbackFlag = TRUE;
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Update operation failed';
        END IF;
    END IF;

    -- Commit or rollback the transaction based on the transaction status
    IF rollbackFlag THEN
        ROLLBACK;
    ELSE
        COMMIT;
        SELECT 'Recall record updated successfully' AS message;
    END IF;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for update_car_model
-- ----------------------------
DROP PROCEDURE IF EXISTS `update_car_model`;
delimiter ;;
CREATE PROCEDURE `update_car_model`(IN user_id VARCHAR(40),
    IN car_id INT)
BEGIN
    DECLARE car_exists INT DEFAULT 0;
    
    DECLARE exit handler FOR SQLEXCEPTION, SQLWARNING
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
     
				-- Check if the car model exists
				SELECT COUNT(*) INTO car_exists FROM carmodels WHERE CarID = car_id;
				if car_exists>0 then
        -- Update an existing car model
        UPDATE carmodels SET status = 'saled' WHERE CarID = car_id;
        INSERT INTO online_trade (carid, buyer_id) VALUES (car_id, user_id);
				end if;
   
    COMMIT;
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table location
-- ----------------------------
DROP TRIGGER IF EXISTS `check_location`;
delimiter ;;
CREATE TRIGGER `check_location` BEFORE INSERT ON `location` FOR EACH ROW BEGIN
    DECLARE longitude_min DECIMAL(10,6) DEFAULT -180.0;  
    DECLARE longitude_max DECIMAL(10,6) DEFAULT 180.0; 
    DECLARE latitude_min DECIMAL(10,6) DEFAULT -90.0;   
    DECLARE latitude_max DECIMAL(10,6) DEFAULT 90.0;    

    IF NEW.longitude < longitude_min OR NEW.longitude > longitude_max THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'longitude out of range [-180.0, 180.0]';
    END IF;

    IF NEW.latitude < latitude_min OR NEW.latitude > latitude_max THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'latitude out of range [-90.0, 90.0]';
    END IF; 
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table location
-- ----------------------------
DROP TRIGGER IF EXISTS `check_location_update`;
delimiter ;;
CREATE TRIGGER `check_location_update` BEFORE UPDATE ON `location` FOR EACH ROW BEGIN
    DECLARE longitude_min DECIMAL(10,6) DEFAULT -180.0;  
    DECLARE longitude_max DECIMAL(10,6) DEFAULT 180.0; 
    DECLARE latitude_min DECIMAL(10,6) DEFAULT -90.0;   
    DECLARE latitude_max DECIMAL(10,6) DEFAULT 90.0;    

    IF NEW.longitude < longitude_min OR NEW.longitude > longitude_max THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'longitude out of range [-180.0, 180.0]';
    END IF;

    IF NEW.latitude < latitude_min OR NEW.latitude > latitude_max THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'latitude out of range [-90.0, 90.0]';
    END IF; 
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table location
-- ----------------------------
DROP TRIGGER IF EXISTS `prevent_delete`;
delimiter ;;
CREATE TRIGGER `prevent_delete` BEFORE DELETE ON `location` FOR EACH ROW BEGIN
    DECLARE fk_count INT;
    SELECT COUNT(*)
    INTO fk_count
    FROM carmodels
    WHERE location_id = OLD.locationID;
    IF fk_count > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'could not delete because the location record is using by carmodels';
    END IF;
END
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
