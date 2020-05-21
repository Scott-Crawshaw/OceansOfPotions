/* ******
 * Script to create trigger logging changes to security-sensitive customer details
 * Specifically audits changes to username, password, email, phone number
 */

DELIMITER $$

CREATE TRIGGER security_details_trigger AFTER UPDATE ON `OceansOfPotions_sp20`.`customers`
	FOR EACH ROW
		BEGIN
			IF STRCMP(OLD.CustomerUsername, NEW.CustomerUsername) <> 0 THEN
				INSERT INTO `OceansOfPotions_sp20`.`auditcustomers`(AuditCustomerID, AuditTime, AuditCol, AuditOldVal, AuditNewVal)
                VALUES (NEW.CustomerID, CURRENT_TIMESTAMP, 'CustomerUsername', OLD.CustomerUsername, NEW.CustomerUsername);
			END IF;
			
            IF STRCMP(OLD.CustomerPassword, NEW.CustomerPassword) <> 0 THEN
				INSERT INTO `OceansOfPotions_sp20`.`auditcustomers`(AuditCustomerID, AuditTime, AuditCol, AuditOldVal, AuditNewVal)
                VALUES (NEW.CustomerID, CURRENT_TIMESTAMP, 'CustomerPassword', OLD.CustomerPassword, NEW.CustomerPassword);
			END IF;
            
            IF STRCMP(OLD.CustomerPrimaryEmail, NEW.CustomerPrimaryEmail) <> 0 THEN
				INSERT INTO `OceansOfPotions_sp20`.`auditcustomers`(AuditCustomerID, AuditTime, AuditCol, AuditOldVal, AuditNewVal)
                VALUES (NEW.CustomerID, CURRENT_TIMESTAMP, 'CustomerPrimaryEmail', OLD.CustomerPrimaryEmail, NEW.CustomerPrimaryEmail);
			END IF;
            
            IF STRCMP(OLD.CustomerPrimaryPhone, NEW.CustomerPrimaryPhone) <> 0 THEN
				INSERT INTO `OceansOfPotions_sp20`.`auditcustomers`(AuditCustomerID, AuditTime, AuditCol, AuditOldVal, AuditNewVal)
				VALUES (NEW.CustomerID, CURRENT_TIMESTAMP, 'CustomerPrimaryPhone', OLD.CustomerPrimaryPhone, NEW.CustomerPrimaryPhone);
			END IF;
		END$$
        
DELIMITER ;