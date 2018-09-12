/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);
let blockHeight = 1;

// Add data to levelDB with key/value pair
async function addLevelDBData(key, value) {
  try {
    await db.put(key, value);
    const keyNumber = Number.parseInt(key);
    blockHeight = keyNumber + 1;
  } catch (e) {
    return console.log('Block ' + key + ' submission failed', err);
  }
}

function getLevelDBObjectCount() {
  return blockHeight;
}

// Get data from levelDB with key
async function getLevelDBData(key) {
  try {
    const value = await db.get(key);
    return value;
  } catch (e) {
    console.log('Error : Cannot find block with key ' + key);
    return null;
  }
}

module.exports = {
  addLevelDBData: addLevelDBData,
  getLevelDBObjectCount: getLevelDBObjectCount,
  getLevelDBData: getLevelDBData
};
