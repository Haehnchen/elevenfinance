const curveAddress = '0x445FE580eF8d70FF569aB36e80c647af338db351';
const curveABI = [
  { "stateMutability": "view", "type": "function", "name": "get_dy", "inputs": [{ "name": "i", "type": "int128" }, { "name": "j", "type": "int128" }, { "name": "dx", "type": "uint256" }], "outputs": [{ "name": "", "type": "uint256" }], "gas": 6289374 }
];

export const convertCurve3Pool = async ({ web3, inputTokenIndex, outputTokenIndex, amount }) => {
  const contract = new web3.eth.Contract(curveABI, curveAddress);
  const data = await contract.methods.get_dy(
    inputTokenIndex,
    outputTokenIndex,
    amount,
  ).call();

  return data;
}