const Block = require('./simpleChain');

/* ===== Testing ==============================================================|
|  - Self-invoking function to add blocks to chain                             |
|  - Learn more:                                                               |
|   https://scottiestech.info/2014/07/01/javascript-fun-looping-with-a-delay/  |
|                                                                              |
|  * 100 Milliseconds loop = 36,000 blocks per hour                            |
|     (13.89 hours for 500,000 blocks)                                         |
|    Bitcoin blockchain adds 8640 blocks per day                               |
|     ( new block every 10 minutes )                                           |
|  ===========================================================================*/

const blockchain = new Block.Blockchain();

async function run(i) {
  for (let i = 0; i < 10; i++) {
    const blockTest = new Block.Block('Test Block - ' + (i + 1));
    const result = await blockchain.addBlock(blockTest);
  }
  console.log(
    'chainstate after add 10 block: ',
    await blockchain.validateChain()
  );
  let inducedErrorBlocks = [2, 4, 7];
  for (var i = 0; i < inducedErrorBlocks.length; i++) {
    let corruptBlock = await blockchain
      .getRawDB()
      .getLevelDBData(inducedErrorBlocks[i]);
    let corruptBlockObj = JSON.parse(corruptBlock);
    corruptBlockObj.body = 'bug';
    await blockchain
      .getRawDB()
      .addLevelDBData(inducedErrorBlocks[i], JSON.stringify(corruptBlockObj));
  }
  console.log('chainstate after corrupt : ', await blockchain.validateChain());
}
run(0);
