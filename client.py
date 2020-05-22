import argparse
import requests

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
                    pass

        elif inputCommand == "FOLLOWINGS":
            pass

        elif inputCommand == "ORDERS":
            pass

        elif inputCommand == "POTIONS":
            pass
