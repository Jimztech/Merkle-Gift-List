// Server side.
const bodyparser = require('body-parser');
const express = require('express');
const verifyProof = require('../utils/verifyProof');
const MerkleTree = require('../utils/MerkleTree');
const crypto = require('crypto');
const app = express();

// Constructing the List.
const niceList = require('../utils/niceList');
const tree = new MerkleTree(niceList.map(name => crypto.createHash('sha256').update(name).digest()), crypto.createHash('sha256'))
app.use(bodyparser.json());

// Generating a root;
// const tree = new MerkleTree(niceList);
// console.log(`Root: ${tree.getRoot()}`);
// console.log(`Leaves: ${niceList.length}`);
// console.log(`Layers: ${Math.ceil(Math.log2(niceList))}`);
// process.exit();

const port = 1225;
app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
})

// Previous code Here...

// Endpoint to get the merkle proof for a name.
app.get('/proof/:name', (req, res) => {
  const name= req.params.name;
  const index = niceList.findIndex(n => n === name);
  if (index === -1){
    return res.status(404).json({error: "Name not found in the List."});
  }
  const proof = tree.getProof(crypto.createHash('sha256').update(name).digest());
  res.json({ proof, root: tree.getRoot().toString('hex') });
});

/*
// Function to verify proof.
function verifiedProof(proof, leaf, root) {
  return tree.verify(proof, crypto.createHash('sha256').update(leaf).digest(), Buffer.from(root, 'hex'));
}
*/

// Endpoint to verify a merkle proof.
app.post('/gift', (req, res) => {
  const { proof, leaf } = req.body;
  const root = tree.getRoot().toString('hex');
  const isValid = verifyProof(proof, leaf, root);
  res.json({ isValid });
});