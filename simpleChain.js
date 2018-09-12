/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');
const db = require('./levelSandbox');

/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block {
  constructor(data) {
    (this.hash = ''),
      (this.height = 0),
      (this.body = data),
      (this.time = 0),
      (this.previousBlockHash = '');
  }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain {
  constructor() {
    let genesis = new Block('First block in the chain - Genesis block');
    this.addBlock(genesis);
  }

  // Add new block
  async addBlock(newBlock) {
    const currentBlockHeight = this.getBlockHeight();
    // Block height
    newBlock.height = currentBlockHeight;
    // UTC timestamp
    newBlock.time = new Date()
      .getTime()
      .toString()
      .slice(0, -3);
    // previous block hash
    if (currentBlockHeight > 0) {
      const previousBlock = await db.getLevelDBData(currentBlockHeight - 1);
      newBlock.previousBlockHash = JSON.parse(previousBlock).hash;
    }
    // Block hash with SHA256 using newBlock and converting to a string
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    // Adding block object to chain
    await db.addLevelDBData(
      currentBlockHeight,
      JSON.stringify(newBlock).toString()
    );
    return newBlock;
  }

  getRawDB() {
    return db;
  }

  // Get block height
  getBlockHeight() {
    return db.getLevelDBObjectCount();
  }

  // get block
  async getBlock(blockHeight) {
    // return object as a single string
    return JSON.parse(await db.getLevelDBData(blockHeight));
  }

  // validate block
  async validateBlock(blockHeight) {
    // get block object
    let block = await this.getBlock(blockHeight);
    // get block hash
    const blockHash = block.hash;
    // remove block hash to test block integrity
    block.hash = '';
    // generate block hash
    const validBlockHash = SHA256(JSON.stringify(block)).toString();
    // Compare
    if (blockHash === validBlockHash) {
      return true;
    } else {
      console.log(
        'Block #' +
          blockHeight +
          ' invalid hash:\n' +
          blockHash +
          '<>' +
          validBlockHash
      );
      return false;
    }
  }

  // Validate blockchain
  async validateChain() {
    let errorLog = [];
    for (var i = 1; i < this.getBlockHeight() - 1; i++) {
      // validate block
      if (!(await this.validateBlock(i))) {
        errorLog.push(i);
      }
      // compare blocks hash link
      const blockHash = JSON.parse(await db.getLevelDBData(i)).hash;
      const previousHash = JSON.parse(await db.getLevelDBData(i + 1))
        .previousBlockHash;
      if (blockHash !== previousHash) {
        errorLog.push(i);
      }
    }
    if (errorLog.length > 0) {
      console.log('Block errors = ' + errorLog.length);
      console.log('Blocks: ' + errorLog);
      return false;
    } else {
      console.log('No errors detected');
      return true;
    }
  }
}
module.exports = {
  Block: Block,
  Blockchain: Blockchain
};
