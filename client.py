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
        if has_account == '2':
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
            make_post_call('http://localhost:8080/api/customers/', data)

        elif has_account == '1':

        else:
            print("Invalid input: Please reenter.")
