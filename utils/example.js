const MerkleTree = require('./MerkleTree');
const niceList = require('./niceList');
const verifyProof = require('./verifyProof');

// create the merkle tree for the whole nice list
const merkleTree = new MerkleTree(niceList);

// get the root
const root = merkleTree.getRoot();

// find the proof that norman block is in the list 
const name = 'Norman Block';
const index = niceList.findIndex(n => n === name);
const proof = merkleTree.getProof(index);

// verify proof against the Merkle Root
console.log( verifyProof(proof, name, root) ); // true, Norman Block is in the list!

// TRY IT OUT: what happens if you try a name not in the list, or a fake proof?

if(index === -1){
    console.log("Name is not in the list")
} else {
    const isValid = verifyProof(proof, name, root);

    if(!isValid){
        console.log("Proof is not valid")
    } else {
        console.log("Name is in the list and proof is valid.")
    }
}