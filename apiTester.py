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