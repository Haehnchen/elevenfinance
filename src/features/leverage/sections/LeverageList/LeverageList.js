import React, { useState, useEffect } from 'react';

import { useConnectWallet } from '../../../home/redux/hooks';

import {
  useFetchLeverageBalances,
} from '../../redux/hooks';


export default function LeverageList() {
  const { web3, address, network } = useConnectWallet();
  let { leverageOptions, fetchLeverageBalances, fetchLeverageBalancesDone } = useFetchLeverageBalances();

  
  //
  const fetchBalances = null; //@todo: implement useFetchBalances
  // const { tokens, fetchBalances, fetchBalancesDone } = useFetchBalances();
  //


  const [data, setData] = useState([]);


  useEffect(() => {
    const fetch = (forceUpdate = false) => {
      if (address && web3 && network) {
        fetchLeverageBalances({ address, web3, leverageOptions, network, forceUpdate });
      }
    }

    fetch(true);

    const id = setInterval(fetch, 15000);
    return () => clearInterval(id);
  }, [address, web3, network, fetchBalances, fetchLeverageBalances]);


  return (
    <>
      <h2>Leveraged Yield Farming</h2>
      
      {leverageOptions.map( option => {
        return(
          <div key={option.title}>
            {option.title}
          </div>
        );
      })}

    </>
  )
}