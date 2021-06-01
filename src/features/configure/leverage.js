export const banks = {
  bfBNB: {
    address: '0xA96C90223e4cC69192A9ffF1BA4c8b86D02765B2',
    apiKey: 'BFBNB',
  },
  bfUSD: {
    address: '0xE9B3017cd7A347a8B0324F88db335255E5c5D3FD',
    apiKey: 'BFUSD',
  }
}

export const pools = [
  {
    network: 'bsc',
    id: 'cakebnb',
    name: "CAKE-BNB LP",
    image: 'cake_bnb.png',
    bigfootAddress: '0x7fF89d5d048DA9a090C51D3FF7eD0fC45bcFe521',
    bank: 'bfBNB',
    apiKey: 'CAKE-BNB LP',
    deathLeverage: 3.333333333333,
    maxLeverage: 2.5,
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

    rates: {
      yieldFarming: 0,
      tradingFee: 13.87,
      borrowApy: 0,
    },
  },
  {
    network: 'bsc',
    id: 'usdtbusd',
    name: "USDT-BUSD WLP",
    image: 'usdt_busd.png',
    bigfootAddress: '0x97E1227D1d0072d9eCf72065e60B64F883dA7FDF',
    bank: 'bfUSD',
    apiKey: 'USDT-BUSD WLP',
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

    rates: {
      yieldFarming: 0,
      tradingFee: 0, // wex (no trading fee)
      borrowApy: 0,
    },
  },
];