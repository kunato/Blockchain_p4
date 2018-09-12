/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);
let blockHeight = 0;

// Add data to levelDB with key/value pair
async function addLevelDBData(key, value) {
  try {
    await db.put(key, value);
    if (key == blockHeight) {
      blockHeight++;
    }
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
    return '{}';
  }
}

// Add data to levelDB with value
function addDataToLevelDB(value) {
  let i = 0;
  db.createReadStream()
    .on('data', function(data) {
      i++;
    })
    .on('error', function(err) {
      return console.log('Unable to read data stream!', err);
    })
    .on('close', function() {
      console.log('Block #' + i);
      addLevelDBData(i, value);
    });
}

module.exports = {
  addLevelDBData: addLevelDBData,
  getLevelDBObjectCount: getLevelDBObjectCount,
  getLevelDBData: getLevelDBData,
  addDataToLevelDB: addDataToLevelDB
};
