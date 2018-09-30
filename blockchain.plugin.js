'use strict';
const { Block, Blockchain } = require('./simpleChain');
const boom = require('boom');
const joi = require('joi');

// BlockChain Plugin contain /block/ router handler
const blockchainPlugin = {
    name: 'blockchainPlugin',
    version: '1.0.0',
    register: async function(server, options) {
        server.route({
            method: 'GET',
            path: '/block/{name}',
            handler: async function(request, h) {
                try {
                    return await Blockchain.getInstance().getBlock(
                        request.params.name
                    );
                } catch (_e) {
                    return boom.badRequest('Invalid Block');
                }
            }
        });

        server.route({
            method: 'POST',
            path: '/block/',
            options: {
                payload: {
                    allow: 'application/json'
                },
                validate: {
                    payload: joi.object().keys({
                        body: joi.string().required()
                    })
                }
            },
            handler: async function(request, h) {
                try {
                    return await Blockchain.getInstance().addBlock(
                        new Block(request.payload.body)
                    );
                } catch (_e) {
                    return boom.badImplementation('Something went wrong');
                }
            }
        });
    }
};

module.exports = blockchainPlugin;
