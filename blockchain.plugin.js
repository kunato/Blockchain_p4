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
                    return boom.badRequest('Invalid hash');
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
                        address: joi.string().required(),
                        star: joi
                            .object()
                            .keys({
                                dec: joi.string().required(),
                                ra: joi.string().required(),
                                story: joi
                                    .string()
                                    .max(500)
                                    .regex(/^[\x00-\x7F]*$/)
                                    .required()
                            })
                            .required()
                    })
                }
            },
            handler: async function(request, h) {
                try {
                    const { address, star } = request.payload;
                    const user = await userDB.getUserLevel(address);
                    if (user.registerStar) {
                        await userDB.addUserLevel(address, {
                            ...user,
                            registerStar: false
                        });
                        return await Blockchain.getInstance().addBlock(
                            new Block({
                                address,
                                star: {
                                    ...star,
                                    story: new Buffer(star.story).toString(
                                        'hex'
                                    )
                                }
                            })
                        );
                    } else {
                        return boom.badRequest(
                            'Address has no permission to register stars'
                        );
                    }
                } catch (_e) {
                    console.log(_e);
                    return boom.badRequest('Address not found');
                }
            }
        });
    }
};

module.exports = blockchainPlugin;
