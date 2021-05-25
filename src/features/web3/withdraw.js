import { earnContractABI, e11Abi } from "../configure";
import { enqueueSnackbar } from '../common/redux/actions';


export const withdraw = async ({web3, address,isAll, amount, contractAddress, dispatch}) => {
  const contract = contractAddress == "0x3Ed531BfB3FAD41111f6dab567b33C4db897f991"? new web3.eth.Contract(e11Abi, contractAddress) : new web3.eth.Contract(earnContractABI, contractAddress);
  const data = await _withdraw({web3, contract, isAll, amount, address, dispatch, contractAddress });
  return data;
}

const _withdraw = ({web3, contract, address,isAll, amount, dispatch, contractAddress }) => {
  return new Promise((resolve, reject) => {
    // console.log(isAll)
    if (isAll && contractAddress != "0x3Ed531BfB3FAD41111f6dab567b33C4db897f991") {
      contract.methods.withdrawAll().send({ from: address }).on('transactionHash', function(hash){
        console.log(hash)
        dispatch(enqueueSnackbar({
          message: hash,
          options: {
            key: new Date().getTime() + Math.random(),
            variant: 'success'
          },
          hash
        }));
      })
      .on('receipt', function(receipt){
        console.log(receipt);
        resolve()
      })
      .on('error', function(error) {
        console.log(error)
        reject(error)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
    }

    if(!isAll && contractAddress != "0x3Ed531BfB3FAD41111f6dab567b33C4db897f991") {
      contract.methods.withdraw(amount).send({ from: address }).on('transactionHash', function(hash){
        console.log(hash)
        dispatch(enqueueSnackbar({
          message: hash,
          options: {
            key: new Date().getTime() + Math.random(),
            variant: 'success'
          },
          hash
        }));
      })
      .on('receipt', function(receipt){
        console.log(receipt);
        resolve()
      })
      .on('error', function(error) {
        console.log(error)
        reject(error)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
    }

    if(!isAll && contractAddress == "0x3Ed531BfB3FAD41111f6dab567b33C4db897f991") {
      if(isNaN(amount)){
          alert("Too big amount for javascript to understand it. Deposit less than 1M each time or use depositall function");
      }
      contract.methods.unstake(amount).send({ from: address }).on('transactionHash', function(hash){
        console.log(hash)
        dispatch(enqueueSnackbar({
          message: hash,
          options: {
            key: new Date().getTime() + Math.random(),
            variant: 'success'
          },
          hash
        }));
      })
      .on('receipt', function(receipt){
        console.log(receipt);
        resolve()
      })
      .on('error', function(error) {
        console.log(error)
        reject(error)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
    }



  })
}
