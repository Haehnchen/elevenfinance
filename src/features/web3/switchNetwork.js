export const switchNetwork = ({ web3, params }) => {
  web3.currentProvider.request({
    method: 'wallet_addEthereumChain',
    params: [params]
  })
  .catch(error => {
    console.log(error)
  });
};