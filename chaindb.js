/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

// Add data to levelDB with key/value pair
async function addBlockLevel(key, value) {
    try {
        await db.put(key, value);
    } catch (e) {
        return console.log('Block ' + key + ' submission failed', err);
    }
}

async function getObjectCountLevel() {
    try {
        const result = await getLastBlockLevel();
        return result + 1;
    } catch (e) {
        return 0;
    }
}

function getLastBlockLevel(value) {
    let lastBlock = {};
    let highestHeight = -1;
    return new Promise((resolve, reject) => {
        db.createReadStream()
            .on('data', function(data) {
                lastBlock = JSON.parse(data.value);
                if (highestHeight < lastBlock.height) {
                    highestHeight = lastBlock.height;
                }
            })
            .on('error', function(err) {
                console.log('Unable to read data stream!', err);
                reject(err);
            })
            .on('close', function() {
                resolve(highestHeight);
            });
    });
}

function getBlockByHashLevel(hash) {
    return new Promise((resolve, reject) => {
        let block;
        db.createReadStream()
            .on('data', function(data) {
                const currentBlock = JSON.parse(data.value);
                if (hash === currentBlock.hash) {
                    block = currentBlock;
                }
            })
            .on('error', function(err) {
                console.log('Unable to read data stream!', err);
                reject(err);
            })
            .on('close', function() {
                resolve(block);
            });
    });
}

function getBlockByAddressLevel(address) {
    return new Promise((resolve, reject) => {
        const block = [];
        db.createReadStream()
            .on('data', function(data) {
                const currentBlock = JSON.parse(data.value);
                if (address === currentBlock.body.address) {
                    block.push(currentBlock);
                }
            })
            .on('error', function(err) {
                console.log('Unable to read data stream!', err);
                reject(err);
            })
            .on('close', function() {
                resolve(block);
            });
    });
}

// Get data from levelDB with key
async function getBlockLevel(key) {
    try {
        const value = await db.get(key);
        return value;
    } catch (e) {
        console.log('Error : Cannot find block with key ' + key);
        throw e;
    }
}

module.exports = {
    addBlockLevel,
    getObjectCountLevel,
    getBlockByHashLevel,
    getBlockByAddressLevel,
    getBlockLevel
};
