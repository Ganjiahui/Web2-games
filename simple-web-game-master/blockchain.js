const crypto = require('crypto');

class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return crypto.createHash('sha256').update(
      this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash
    ).digest('hex');
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, Date.now(), "Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

class Account {
    constructor() {
      this.privateKey = crypto.randomBytes(32).toString('hex');
      this.publicKey = crypto.createECDH('secp256k1').setPrivateKey(this.privateKey, 'hex').getPublicKey('hex');
    }
  }
  
  // Example usage:
  const myAccount = new Account();
  console.log('Private Key:', myAccount.privateKey);
  console.log('Public Key:', myAccount.publicKey);

  // Example usage:
const myBlockchain = new Blockchain();

const name = 'Alice';
const score = 150;
const playerData = { name, score, publicKey: myAccount.publicKey };

const newBlock = new Block(myBlockchain.chain.length, Date.now(), playerData);
myBlockchain.addBlock(newBlock);

console.log(JSON.stringify(myBlockchain, null, 2));
console.log('Is blockchain valid?', myBlockchain.isChainValid());
