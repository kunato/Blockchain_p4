'use strict';
const { Block, Blockchain } = require('./chain');
const userDB = require('./userdb');
const { decode } = require('./helper');
const boom = require('boom');
const joi = require('joi');

// BlockChain Plugin contain /block/ router handler
const blockchainPlugin = {
    name: 'blockchainPlugin',
    version: '1.0.0',
    register: async function(server, options) {
        await Blockchain.getInstance().addGenesisBlock();

        // GET By height
        server.route({
            method: 'GET',
            path: '/block/{name}',
            handler: async function(request, h) {
                try {
                    const block = await Blockchain.getInstance().getBlock(
                        request.params.name
                    );
                    return {
                        ...block,
                        body: {
                            ...block.body,
                            star: {
                                ...block.body.star,
                                storyDecoded: decode(block.body.star.story)
                            }
                        }
                    };
                } catch (_e) {
                    return boom.badRequest('Invalid Block');
                }
            }
        });

        // GET By address
        server.route({
            method: 'GET',
            path: '/stars/address:{address}',
            handler: async function(request, h) {
                try {
                    const blocks = await Blockchain.getInstance().getBlockByAddress(
                        request.params.address
                    );
                    return blocks.map(block => ({
                        ...block,
                        body: {
                            ...block.body,
                            star: {
                                ...block.body.star,
                                storyDecoded: decode(block.body.star.story)
                            }
                        }
                    }));
                } catch (_e) {
                    return boom.badRequest('Invalid address');
                }
            }
        });

        // GET BY HASH
        server.route({
            method: 'GET',
            path: '/stars/hash:{hash}',
            handler: async function(request, h) {
                try {
                    const block = await Blockchain.getInstance().getBlockByHash(
                        request.params.hash
                    );
                    return {
                        ...block,
                        body: {
                            ...block.body,
                            star: {
                                ...block.body.star,
                                storyDecoded: decode(block.body.star.story)
                            }
                        }
                    };
                } catch (_e) {
                    return boom.badRequest('Invalid Block');
                }
            }
        });

        // POST endpoint
        server.route({
            method: 'POST',
            path: '/block',
            options: {
                payload: {
                    allow: 'application/json'
                },
                validate: {
                    payload: joi.object().keys({
                        body: joi
                            .object()
                            .keys({
                                address: joi.string().required(),
                                star: joi
                                    .object()
                                    .keys({
                                        dec: joi.string().required(),
                                        ra: joi.string().required(),
                                        story: joi.string().required()
                                    })
                                    .required()
                            })
                            .required()
                    })
                }
            },
            handler: async function(request, h) {
                try {
                    const { body } = request.payload;
                    const { address } = body;
                    const user = await userDB.getUserLevel(address);
                    if (user.registerStar) {
                        return await Blockchain.getInstance().addBlock(
                            new Block({
                                ...body,
                                star: {
                                    ...body.star,
                                    story: new Buffer(body.star.story).toString(
                                        'hex'
                                    )
                                }
                            })
                        );
                    } else {
                        return boom.badRequest(
                            'User has no permission to register stars'
                        );
                    }
                } catch (_e) {
                    return boom.badImplementation('Something went wrong');
                }
            }
        });
    }
};

module.exports = blockchainPlugin;
