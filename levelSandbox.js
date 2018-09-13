/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

// Add data to levelDB with key/value pair
async function addLevelDBData(key, value) {
  try {
    await db.put(key, value);
  } catch (e) {
    return console.log('Block ' + key + ' submission failed', err);
  }
}

async function getLevelDBObjectCount() {
  try {
    const result = await getLastBlockLevelDB();
    return result + 1;
  } catch (e) {
    return 0;
  }
}

function getLastBlockLevelDB(value) {
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
