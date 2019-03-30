from flask import Flask, request
from flask_restful import Api, Resource, reqparse

from lib.accounts import authentication as auth
from lib.services import utils as services_util

import en_us
import utils

import os

from zeroless import (Server)
try:
    pub = Server(port=35893).pub()
    print("Booted publisher")
except:
    pass

class start(Resource):
    def post(self, client_id, service_id):
        request_token = request.headers.get('authorization')
        auth_status = auth.verify(client_id, request_token)
        if auth_status != 200:
            return auth_status

        service = utils.get_service(client_id, service_id)
        if service.count() == 0:
            return en_us.NOT_FOUND

        request = {
            "serviceid": service_id,
            "content": utils.encoder(service)[0]['start_command']
        }
        request = json.dumps(request)
        pub(request.encode('utf-8'))
        return "", 204


class stop(Resource):
    def post(self, client_id, service_id):
        request_token = request.headers.get('authorization')
        auth_status = auth.verify(client_id, request_token)
        if auth_status != 200:
            return auth_status

        service = utils.get_service(client_id, service_id)
        if service.count() == 0:
            return en_us.NOT_FOUND

        request = {
            "serviceid": service_id,
            "content": utils.encoder(service)[0]['stop_command']
        }
        request = json.dumps(request)
        pub(request.encode('utf-8'))
        return "", 204


class restart(Resource):
    def post(self, client_id, service_id):
        request_token = request.headers.get('authorization')
        auth_status = auth.verify(client_id, request_token)
        if auth_status != 200:
            return auth_status

        service = utils.get_service(client_id, service_id)
        if service.count() == 0:
            return en_us.NOT_FOUND

        request = {
            "serviceid": service_id,
            "content": utils.encoder(service)[0]['restart_command']
        }
        request = json.dumps(request)
        pub(request.encode('utf-8'))
        return "", 204