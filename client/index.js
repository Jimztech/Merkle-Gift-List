// Client side.
const readline = require('readline');
const axios = require('axios');
const niceList = require('../utils/niceList.json');
const MerkleTree = require('../utils/MerkleTree');
const verifyProof = require('../utils/verifyProof');

const serverUrl = 'http://localhost:1225';

async function main() {
  // const inList = verifyProof(proof, index, root)
  const name = process.argv[2];

  // Asking for name input.
  if(!name) {
    const r1 = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    // Prompting the user for their name.
  
    r1.question('Enter your name: ', async (nameValue) => {
      await handleName(nameValue);
      r1.close();
    });
  } else {
    await handleName(name);
  }

}

async function handleName(name) {
  try {
    // Request proof from server.
    const response = await axios.get(`${serverUrl}/proof/${name}`);
    const { proof, root } = response.data;

    // Verify the proof with the server.
    const verificationResponse = await axios.post(`${serverUrl}/gift`, { proof, leaf: name });
    console.log('Name is on the List:', verificationResponse.data.isValid);
  } catch {
    console.error("Error message:", error.message)
  }
}
main();