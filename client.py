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
    if resp.json()['status'] != 201:
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
        has_account = input("Press 1 if you have an account, press 2 if you would like to make one: ")
        if has_account == '2': # CREATE AN ACCOUNT
            username = input("Enter your username: ")
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

        elif has_account == '1': # ALREADY HAVE AN ACCOUNT
            customer_username = input("Please enter your username: ")
            customer_password = input("Please enter your password: ")

            while True:
                action = input("What would you like to do? Press 1 to view/update/delete your own account, press 2 to view all customers, press 3 to view/update followings, press 4 to view potions, press 5 to create an order: ")
                if action == '1': # VIEW/UPDATE/DELETE YOUR OWN ACCOUNT
                    option1 = input("Press 1 to view your account, press 2 to delete your account, press 3 to update your account, press 4 to update your password: ")
                    while option1 not in ['1', '2', '3', '4']:
                        print("Invalid input: please reenter!")
                        option1 = input("Press 1 to view your account, press 2 to delete your account, press 3 to update your account, press 4 to update your password: ")
                    if option1 == '1': # VIEW YOUR ACCOUNT
                        pass
                    elif option1 == '2': # DELETE YOUR ACCOUNT
                        pass
                        # remember: need to break out of the loop here
                    elif option1 == '3': # UPDATE YOUR ACCOUNT
                        pass
                        # remember: need to break out of the loop here if username changes
                    elif option1 == '4': # UPDATE YOUR PASSWORD
                        pass
                        # remember: need to break out of the loop here
                elif action == '2': # VIEW ALL CUSTOMERS
                    pass
                elif action == '3': # VIEW/UPDATE FOLLOWINGS
                    option3 = input("Press 1 to follow another customer, press 2 to unfollow another customer, press 3 to view who you are following, press 4 to view your followers: ")
                    while option3 not in ['1', '2', '3', '4']:
                        print("Invalid input: please reenter!")
                        option3 = input("Press 1 to follow another customer, press 2 to unfollow another customer, press 3 to view who you are following, press 4 to view your followers: ")
                    if option3 == '1': # FOLLOW ANOTHER CUSTOMER
                        pass
                    elif option3 == '2': # UNFOLLOW ANOTHER CUSTOMER
                        pass
                    elif option3 == '3': # VIEW WHO YOU ARE FOLLOWING
                        pass
                    elif option3 == '4': # VIEW WHO IS FOLLOWING YOU
                        pass
                elif action == '4': # VIEW POTIONS
                    option4 = input("Press 1 to get all potions, press 2 to get a single potion: ")
                    while option4 not in ['1', '2']:
                        print("Invalid input: please reenter!")
                        option4 = input("Press 1 to get all potions, press 2 to get a single potion: ")
                    if option4 == '1': # VIEW ALL POTIONS
                        pass
                    elif option4 == '2': # VIEW A SINGLE POTION
                        pass
                elif action == '5': # CREATE AN ORDER
                    pass
                else:
                    print("Invalid input: Please reenter.")

        else:
            print("Invalid input: Please reenter.")
