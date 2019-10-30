from chalice import Chalice
import boto3
from datetime import datetime
import uuid

app = Chalice(app_name='xflags_ticketing')
ticketing_table = "xflags_ticketing"
dynamodb = boto3.resource('dynamodb', region_name='us-west-2')
table = dynamodb.Table(ticketing_table)

@app.route('/purchase', methods=['POST'], cors=True)
def purchase():
    ticket_json = app.current_request.json_body
    ticket_id = uuid.uuid4()
    response = table.put_item(
        Item={
            'ticketId': str(ticket_id),
            'firstName': ticket_json['firstName'],
            'lastName': ticket_json['lastName'],
            'createdAt': str(datetime.now()),
            'email': ticket_json['email'],
            'isDeleted': False,
            'isRedeemed': False
        }
    )
    return response


# The view function above will return {"hello": "world"}
# whenever you make an HTTP GET request to '/'.
#
# Here are a few more examples:
#
# @app.route('/hello/{name}')
# def hello_name(name):
#    # '/hello/james' -> {"hello": "james"}
#    return {'hello': name}
#
# @app.route('/users', methods=['POST'])
# def create_user():
#     # This is the JSON body the user sent in their POST request.
#     user_as_json = app.current_request.json_body
#     # We'll echo the json body back to the user in a 'user' key.
#     return {'user': user_as_json}
#
# See the README documentation for more examples.
#
