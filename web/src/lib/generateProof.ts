
const path = require("path");
// @ts-ignore
const snarkjs = require('snarkjs');

export const generateProof = async (input0: number[], input1: number, input2: number): Promise<any> => {
  console.log(`Generating vote proof with inputs: ${input0}, ${input1}, ${input2}`);
  
  // We need to have the naming scheme and shape of the inputs match the .circom file
  const inputs = {
    token_owners: input0,
    wallet_hash: input1,
    num_roles: input2
  }

  // Paths to the .wasm file and proving key
  const wasmPath = path.join(process.cwd(), '../circuits/build/check_ownership_js/check_ownership.wasm'); 
  const provingKeyPath = path.join(process.cwd(), '../circuits/build/proving_key.zkey')

  try {
    
    const { proof, publicSignals } = await snarkjs.plonk.fullProve(inputs, wasmPath, provingKeyPath);

    
    const calldataBlob = await snarkjs.plonk.exportSolidityCallData(proof, publicSignals);
    const calldata = calldataBlob.split(',');

    console.log(calldata);

    return {
      proof: calldata[0], 
      publicSignals: JSON.parse(calldata[1]),
    }
  } catch (err) {
    console.log(`Error:`, err)
  
    return {
      proof: "", 
      publicSignals: [],
    }
  }
}