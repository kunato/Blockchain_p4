const level = require('level');
const chainDB = './userdata';
const db = level(chainDB);

async function addUserLevel(address, value) {
    try {
        await db.put(address, value);
        return value;
    } catch (e) {
        return console.log('Address ' + address + ' submission failed', err);
    }
}

async function getUserLevel(address) {
    try {
        const value = await db.get(address);
        return value;
    } catch (e) {
        console.log('Error : Cannot find User with address ' + address);
        throw e;
    }
}

module.exports = {
    addUserLevel,
    getUserLevel
};
