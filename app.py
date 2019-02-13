from flask import Flask, request
from flask_restful import Api, Resource, reqparse

#initiializing the flask webapp
app = Flask(__name__)
api = Api(app)

#writing services endpoints
api.add_resource(service_manager, "/endpoints/<string:client_id>/services")
api.add_resource(service_manager_indv, "/endpoints/<string:client_id>/services/<string:service_id>")

#running and setting host port (local for nginx reverse proxy)
app.run(host='127.0.0.1', port=3141)