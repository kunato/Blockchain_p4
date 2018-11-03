'use strict';
const boom = require('boom');
const joi = require('joi');
const bitcoinMessage = require('bitcoinjs-message');
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
                try {
                    const user = await userDB.getUserLevel(address);
                    const newRequestTimeStamp = Date.now();
                    if (
                        user.requestTimeStamp + 300 * 1000 >
                        newRequestTimeStamp
                    ) {
                        const validationWindow =
                            300 -
                            (newRequestTimeStamp - user.requestTimeStamp) /
                                1000;
                        return await userDB.addUserLevel(address, {
                            ...user,
                            validationWindow
                        });
                    } else {
                        throw new Error('Address request are now invalid');
                    }
                } catch (_e) {
                    const requestTimeStamp = Date.now();
                    const message = `${address}:${requestTimeStamp}:starRegistry`;
                    const validationWindow = 300;
                    const user = await userDB.addUserLevel(address, {
                        address,
                        requestTimeStamp,
                        message,
                        validationWindow
                    });
                    return user;
                }
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
                const { requestTimeStamp, message } = user;
                const valid = bitcoinMessage.verify(
                    message,
                    address,
                    signature
                );
                const newRequestTimeStamp = Date.now();
                if (
                    valid &&
                    requestTimeStamp + 1000 * 300 > newRequestTimeStamp
                ) {
                    const validationWindow =
                        300 - (newRequestTimeStamp - requestTimeStamp) / 1000;
                    user = await userDB.addUserLevel(address, {
                        registerStar: true,
                        status: {
                            ...user,
                            validationWindow,
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
