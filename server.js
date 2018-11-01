'use strict';
const Hapi = require('hapi');

const server = Hapi.server({
    host: 'localhost',
    port: 8000
});

// Start the server
async function start() {
    try {
        // Register BlockChain plugins
        await server.register(require('./blockchain.plugin'));
        // Register User plugins
        await server.register(require('./user.plugin'));
        await server.start();
    } catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
}

start();
