'use strict';
const boom = require('boom');
const joi = require('joi');
const userDB = require('./userdb');

const userPlugin = {
    name: 'userPlugin',
    version: '1.0.0',
    register: async function(server, options) {
        server.route({
            method: 'POST',
            path: '/requestValidation',
            options: {
                payload: {
                    allow: 'application/json'
                },
                validate: {
                    payload: joi.object().keys({
                        address: joi.string().required()
                    })
                }
            },
            handler: async function(request, h) {
                const { address } = request.payload;
                requestTimeStamp = Date.now();
                message = `${address}:${requestTimeStamp}:starRegistry`;
                validationWindow = 300;
                const user = await userDB.addUserLevel(address, {
                    address,
                    requestTimeStamp,
                    message,
                    validationWindow
                });
                return user;
            }
        });

        server.route({
            method: 'POST',
            path: '/message-signature/validate',
            options: {
                payload: {
                    allow: 'application/json'
                },
                validate: {
                    payload: joi.object().keys({
                        address: joi.string().required(),
                        signature: joi.string().required()
                    })
                }
            },
            handler: async function(request, h) {
                const { address, signature } = request.payload;
                let user = await userDB.getUserLevel(address);
                const { requestTimeStamp, validationWindow, message } = user;
                const valid = bitcoinMessage.verify(
                    message,
                    address,
                    signature
                );
                if (
                    valid &&
                    Number(requestTimeStamp) + Number(validationWindow) <
                        Date.now()
                ) {
                    user = await userDB.addUserLevel(address, {
                        registerStar: true,
                        status: {
                            ...user,
                            messageSignature: 'valid'
                        }
                    });
                } else {
                    user = {
                        registerStar: false,
                        status: {
                            ...user,
                            messageSignature: 'invalid'
                        }
                    };
                }
                return user;
            }
        });
    }
};

module.exports = userPlugin;
