const banks = {
  bfBNB: "0xA96C90223e4cC69192A9ffF1BA4c8b86D02765B2",
  bfUSD: "0xE9B3017cd7A347a8B0324F88db335255E5c5D3FD",
}

export const leverageOptions = [
  {
    network: 'bsc',
    title: "CAKE-BNB LP",
    image: '',
    bigfootAddress: '0x7fF89d5d048DA9a090C51D3FF7eD0fC45bcFe521',
    bankAddress: banks.bfBNB,
    deathLeverage: 3.333333333333,
    maxLeverage: 2.666666666666,
    tokens: [
      {
        token: "11CAKEBNB",
        image: '',
        address: '0x58D25A7e34eE8fA7A070510e6D2E0096Ed62c828',
      },
      {
        token: "BNB",
        image: '',
        address: null, //native token
      },
    ],
  },
  {
    network: 'bsc',
    title: "USDT-BUSD WLP",
    image: 'usdt-busd.png',
    bigfootAddress: '0x97E1227D1d0072d9eCf72065e60B64F883dA7FDF',
    bankAddress: banks.bfUSD,
    deathLeverage: 6.5,
    maxLeverage: 6,
    tokens: [
      {
        token: "11USDTBUSD",
        image: 'usdt-busd.png',
        address: '0x1a489ee9ccd2f062f86361fb7af9dac9293864bc',
      },
      {
        token: "BUSD",
        image: '',
        address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
      },
    ],
  },
];
