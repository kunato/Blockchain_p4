# How to run

```
npm install
```

Test the blockchain program by running

```
node test.js
```

# Using simpleChain as library

simpleChain is only a library
You can use it by import using

```
const b = require('./simpleChain');
let blockchain = new b.Blockchain();
let block = new b.Block('Hello I am Block 1');
await blockchain.addBlock(block);
```
