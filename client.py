import argparse
import requests
import json

# Returns None if failed and the response if successful. Prints error message.
def make_get_call(url):
    resp = requests.get(url)
    if resp.json()['status'] != 200:
        # Make sure not to expose SQL by checking if response is a dict before printing error message
        if type(resp.json()['error']) == dict and 'sqlMessage' in resp.json()['error']:
            print("Error " + str(resp.json()['status']) + ": " + str(resp.json()['error']['sqlMessage']))
        else:
            print("Error " + str(resp.json()['status']) + ": " + str(resp.json()['error']))
        return None
    return resp.json()['response']

# Returns true if successful and false if failed. Prints error message.
def make_post_call(url, data):
    resp = requests.post(url, json=data)
    if resp.json()['status'] != 200:
        # Make sure not to expose SQL by checking if response is a dict before printing error message
        if type(resp.json()['error']) == dict and 'sqlMessage' in resp.json()['error']:
            print("Error " + str(resp.json()['status']) + ": " + str(resp.json()['error']['sqlMessage']))
        else:
            print("Error " + str(resp.json()['status']) + ": " + str(resp.json()['error']))
        return False
    return True

# Returns true if successful and false if failed. Prints error message.
def make_put_call(url, data):
    resp = requests.put(url, json=data)
    if resp.json()['status'] != 200:
        # Make sure not to expose SQL by checking if response is a dict before printing error message
        if type(resp.json()['error']) == dict and 'sqlMessage' in resp.json()['error']:
            print("Error " + str(resp.json()['status']) + ": " + str(resp.json()['error']['sqlMessage']))
        else:
            print("Error " + str(resp.json()['status']) + ": " + str(resp.json()['error']))
        return False
    return True

# Returns true if successful and false if failed. Prints error message.
def make_delete_call(url):
    resp = requests.delete(url)
    if resp.json()['status'] != 200:
        # Make sure not to expose SQL by checking if response is a dict before printing error message
        if type(resp.json()['error']) == dict and 'sqlMessage' in resp.json()['error']:
            print("Error " + str(resp.json()['status']) + ": " + str(resp.json()['error']['sqlMessage']))
        else:
            print("Error " + str(resp.json()['status']) + ": " + str(resp.json()['error']))
        return False
    return True


if __name__ == '__main__':
    while True:
        print("\nUse one of the following commands to choose a part of the database to view/change, or QUIT to quit:")
        print("CUSTOMERS - This command lets you create, view, or update customer accounts")
        print("FOLLOWINGS - This command lets you view following/follower lists and update who you follow")
        print("ORDERS - This command lets you view your own orders and those of people you are following, and create or add to your orders")
        print("POTIONS - This command lets you view available potions")

        inputCommand = input("Type your command here: ")
        if inputCommand == "QUIT":
            break

        if inputCommand == "CUSTOMERS":
            hasAccount = input("Do you have an account? (Y/N): ")
            if hasAccount == "N":
                username = input("To create an account, enter your username: ")
                while not username:
                    username = input("Please reenter a non-null username: ")

                password = input("Enter your password: ")
                while not password:
                    password = input("Please reenter a non-null password: ")

                fname = input("Enter your first name: ")
                while not fname:
                    fname = input("Please reenter a non-null first name: ")

                minitial = input("Enter your middle initial: ")
                while len(minitial) > 1:
                    minitial = input("Please reenter a valid middle initial: ")

                lname = input("Enter your last name: ")
                while not lname:
                    lname = input("Please reenter a non-null last name: ")

                dob = input("Enter your date of birth (YYYY-MM-DD): ")
                while not dob:
                    dob = input("Please reenter a non-null date of birth: ")

                email = input("Enter your email: ")
                while not email:
                    email = input("Please reenter a non-null email: ")

                phone = input("Enter your phone number: ")
                while not phone:
                    phone = input("Please reenter a non-null phone number: ")

                data = {"user": username, "password": password, "fname": fname, "minitial": minitial, "lname": lname, "dob": dob, "email": email, "phone": phone}
                if make_post_call('http://localhost:8080/customers/', data):
                    print("Account created successfully!")
                else:
                    print("Account creation unsuccessful: please try again!")

            elif hasAccount == "Y":
                print("Please provide your login information.")
                loginUsername = input("Username: ")
                loginPassword = input("Password: ")

                print("\nUse one of the following commands to access the database:")
                print("DELETE - This command lets you delete your own account")
                print("UPDATE - This command lets you update account details")
                print("VIEW - This command lets you view customer account details")

                customerCommand = input("Type your command here: ")

                if customerCommand == "DELETE":
                    if make_delete_call('http://localhost:8080/customers?user=%s&pw=%s' % (loginUsername, loginPassword)):
                        print("Account deleted successfully!")
                    else:
                        print("Account deletion unsuccessful: please try again!")

                elif customerCommand == "UPDATE":
                    print("What attribute would you like to update?")
                    print("Options: USERNAME, PASSWORD, FIRST NAME, MIDDLE INITIAL, LAST NAME, DOB, EMAIL, PHONE")
                    attrToUpdate = input("Type your command here: ")

                    if attrToUpdate == "PASSWORD":
                        newPassword = input("New password: ")
                        if make_put_call('http://localhost:8080/customers/password?user=%s&pw=%s' % (loginUsername, loginPassword), {"newPassword": newPassword}):
                            print("Password updated successfully!")
                        else:
                            print("Password update failed: please try again!")

                    else:
                        if attrToUpdate == "USERNAME":
                            attribute = "CustomerUsername"
                            newValue = input("New username: ")

                        elif attrToUpdate == "FIRST NAME":
                            attribute = "CustomerFirstName"
                            newValue = input("New first name: ")

                        elif attrToUpdate == "LAST NAME":
                            attribute = "CustomerLastName"
                            newValue = input("New last name: ")

                        elif attrToUpdate == "MIDDLE INITIAL":
                            attribute = "CustomerMiddleInitial"
                            newValue = input("New middle initial: ")

                        elif attrToUpdate == "DOB":
                            attribute = "CustomerDOB"
                            newValue = input("New date of birth (YYYY-MM-DD): ")

                        elif attrToUpdate == "EMAIL":
                            attribute = "CustomerPrimaryEmail"
                            newValue = input("New email: ")

                        elif attrToUpdate == "PHONE":
                            attribute = "CustomerPrimaryPhone"
                            newValue = input("New phone number: ")

                        if make_put_call('http://localhost:8080/customers?user=%s&pw=%s' % (loginUsername, loginPassword), {"attribute": attribute, "newValue": newValue}):
                            print("Updated " + attrToUpdate + " successfully")
                        else:
                            print("Update failed: please try again!")

                elif customerCommand == "VIEW":
                    viewCustomersCommand = input("What would you like to view? (ALL to view all other customers, SEARCH to lookup customers by username, press enter to view a specific customer): ")
                    if viewCustomersCommand == "ALL":
                        response = make_get_call('http://localhost:8080/customers?user=%s&pw=%s' % (loginUsername, loginPassword))
                        msgForEmptyResponse = "No customers"

                    elif viewCustomersCommand == "SEARCH":
                        search = input("Enter username search: ")
                        response = make_get_call('http://localhost:8080/search/%s?user=%s&pw=%s' % (search, loginUsername, loginPassword))
                        msgForEmptyResponse = "No matching username"

                    elif viewCustomersCommand == "":
                        viewUserID = input("Customer ID of the account you want to view: ")
                        response = make_get_call('http://localhost:8080/customers/%s?user=%s&pw=%s' % (viewUserID, loginUsername, loginPassword))
                        msgForEmptyResponse = "No customers of ID " + viewUserID

                    else:
                        continue

                    if response is None:
                        print("View request unsuccessful: please try again!")
                    else:
                        if len(response) == 0:
                            print(msgForEmptyResponse)
                            continue
                        for customer in response:
                            print(json.dumps(customer, indent=4))

        elif inputCommand == "FOLLOWINGS":
            print("Please provide your login information.")
            loginUsername = input("Username: ")
            loginPassword = input("Password: ")

            print("\nUse one of the following commands to access the database:")
            print("UPDATE - This command lets you update who you follow")
            print("VIEW - This command lets you view who you are following and who is following you")

            followCommand = input("Type your command here: ")

            if followCommand == "UPDATE":
                changeRequested = input("Would you like to follow or unfollow someone? (FOLLOW or UNFOLLOW): ")
                if changeRequested == "FOLLOW":
                    followID = input("Customer ID of the customer you would like to follow: ")
                    if make_post_call('http://localhost:8080/customers/follow/%s?user=%s&pw=%s' % (followID, loginUsername, loginPassword), {}):
                        print("Now following customer " + followID)
                    else:
                        print("Follow request unsuccessful: please try again!")

                elif changeRequested == "UNFOLLOW":
                    unfollowID = input("Customer ID of the customer you would like to unfollow: ")
                    if make_delete_call('http://localhost:8080/customers/follow/%s?user=%s&pw=%s' % (unfollowID, loginUsername, loginPassword)):
                        print("Unfollowed customer " + unfollowID)
                    else:
                        print("Follow request unsuccessful: please try again!")

            elif followCommand == "VIEW":
                viewFollow = input("Which would you like to view: your following list or you followers list? (FOLLOWING or FOLLOWERS): ")
                if viewFollow == "FOLLOWING":
                    viewFollowOption = "followings"
                    response = make_get_call('http://localhost:8080/following?user=%s&pw=%s' % (loginUsername, loginPassword))

                elif viewFollow == "FOLLOWERS":
                    viewFollowOption = "followers"
                    response = make_get_call('http://localhost:8080/followers?user=%s&pw=%s' % (loginUsername, loginPassword))

                else:
                    continue

                if response is None:
                    print("View request unsuccessful: please try again!")
                else:
                    if len(response) == 0:
                        print("No " + viewFollowOption)
                        continue
                    for customer in response:
                        print(json.dumps(customer, indent=4))

        elif inputCommand == "ORDERS":
            print("Please provide your login information.")
            loginUsername = input("Username: ")
            loginPassword = input("Password: ")

            print("\nUse one of the following commands to access the database:")
            print("DELETE - This command lets you cancel an order, given the order was made in the last 24 hours")
            print("UPDATE - This command lets you create an order, add/remove products from an order, or finalize your current order")
            print("VIEW - This command lets you view current/finalized orders belonging to yourself or others")

            orderCommand = input("Type your command here: ")

            if orderCommand == "DELETE":
                print("What is the order you would like to cancel?")
                deleteOrderID = input("OrderID: ")
                if make_delete_call('http://localhost:8080/orders/%s?user=%s&pw=%s' % (deleteOrderID, loginUsername, loginPassword)):
                    print("Successfully deleted order " + deleteOrderID)
                else:
                    print("Order cancellation unsuccessfully: please try again!")

            elif orderCommand == "UPDATE":
                print("What would you like to do with your current order?")
                updateOrderOption = input("Enter DONE to finalize your current order, enter CONTINUE to continue with your current order: ")
                if updateOrderOption == "DONE":
                    shippingAddress = input("Please enter your shipping address: ")
                    privacyInput = input("Would you like this order to be private? (Y/N): ")

                    while True:
                        if privacyInput == "Y":
                            privacy = "1"
                            break
                        elif privacyInput == "N":
                            privacy = "0"
                            break
                        else:
                            print("Invalid input! Please reenter: ")
                            privacyInput = input("Would you like this order to be private? (Y/N): ")

                    if make_put_call('http://localhost:8080/orders?user=%s&pw=%s' % (loginUsername, loginPassword), {"shippingAddress": shippingAddress, "privacy": privacy}):
                        print("Order finalized!")
                    else:
                        print("Order finalization unsuccessful: please try again!")

                elif updateOrderOption == "CONTINUE":
                    updateCurrent = input("Would you like to add or remove an item from your order? (ADD or REMOVE): ")
                    if updateCurrent == "ADD":
                        print("What is the product that you want to add to your current order? A new order will be created if there is no current order")
                        addedProductID = input("Product ID: ")
                        if make_post_call('http://localhost:8080/orders?user=%s&pw=%s' % (loginUsername, loginPassword), {"productID": addedProductID}):
                            print("Successfully added product " + addedProductID + " to your current order")
                        else:
                            print("Product not added successfully: please try again!")

                    elif updateCurrent == "REMOVE":
                        print("What is the product that you want to remove from your current order?")
                        removedProductID = input("Product ID: ")
                        if make_delete_call('http://localhost:8080/orders/products/%s?user=%s&pw=%s' % (removedProductID, loginUsername, loginPassword)):
                            print("Successfully deleted product " + removedProductID + " from your current order")
                        else:
                            print("Product deletion unsuccessfully: please try again!")


            elif orderCommand == "VIEW":
                print("What you you like to view? Enter one of the following commands: ")
                print("CURRENT - View the products in your current order")
                print("FINALIZED - View a finalized order")

                viewOrderCommand = input("Type your command here: ")

                if viewOrderCommand == "CURRENT":
                    response = make_get_call('http://localhost:8080/orders/products?user=%s&pw=%s' % (loginUsername, loginPassword))
                    msgForEmptyResponse = "No products in current order"

                elif viewOrderCommand == "FINALIZED":
                    print("How would you like to view a finalized order?")
                    print("Options: ORDERID, CUSTOMERID, or press enter to get all orders of all the customers you are following")

                    viewFinalizedCommand = input("Type your command here: ")

                    if viewFinalizedCommand == "ORDERID":
                        orderID = input("OrderID: ")
                        queryFor = input("Enter PRODUCTS to view products for this order, enter INFO to view info about this order: ")

                        if queryFor == "PRODUCTS":
                            response = make_get_call('http://localhost:8080/orders/products/%s?user=%s&pw=%s' % (orderID, loginUsername, loginPassword))
                            msgForEmptyResponse = "No products in order " + orderID

                        elif queryFor == "INFO":
                            response = make_get_call('http://localhost:8080/orders/%s?user=%s&pw=%s' % (orderID, loginUsername, loginPassword))
                            msgForEmptyResponse = "No order info for order " + orderID

                    elif viewFinalizedCommand == "CUSTOMERID":
                        customerID = input("CustomerID: ")
                        response = make_get_call('http://localhost:8080/customers/orders/%s?user=%s&pw=%s' % (customerID, loginUsername, loginPassword))
                        msgForEmptyResponse = "No finalized orders for customer " + customerID

                    elif viewFinalizedCommand == "":
                        response = make_get_call('http://localhost:8080/following/orders?user=%s&pw=%s' % (loginUsername, loginPassword))
                        msgForEmptyResponse = "No finalized orders for any of the customers you are following"

                else:
                    continue

                if response is None:
                    print("View request unsuccessful: please try again!")
                else:
                    if len(response) == 0:
                        print(msgForEmptyResponse)
                        continue
                    for customer in response:
                        print(json.dumps(customer, indent=4))



        elif inputCommand == "POTIONS":
            print("Please provide your login information.")
            loginUsername = input("Username: ")
            loginPassword = input("Password: ")

            viewPotionsID = input("Press enter to get all potions, or enter the id of a specific potion: ")
            if viewPotionsID == "":
                response = make_get_call('http://localhost:8080/potions?user=%s&pw=%s' % (loginUsername, loginPassword))
                msgForEmptyResponse = "No potions"

            else:
                response = make_get_call('http://localhost:8080/potions/%s?user=%s&pw=%s' % (viewPotionsID, loginUsername, loginPassword))
                msgForEmptyResponse = "No potion of ID " + viewPotionsID

            if response is None:
                print("View request unsuccessful: please try again!")
            else:
                if len(response) == 0:
                    print(msgForEmptyResponse)
                    continue
                for customer in response:
                    print(json.dumps(customer, indent=4))