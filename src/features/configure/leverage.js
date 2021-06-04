export const banks = {
  bfbnb: {
    id: 'bfbnb',
    name: 'bfBNB',
    address: '0xA96C90223e4cC69192A9ffF1BA4c8b86D02765B2',
    apiKey: 'BFBNB',
    currency: 'BNB',
    minPositionSize: 0.11,
    tokenDecimals: 18,
  },
  bfusd: {
    id: 'bfusd',
    name: 'bfUSD',
    address: '0xE9B3017cd7A347a8B0324F88db335255E5c5D3FD',
    apiKey: 'BFUSD',
    currency: 'USD',
    minPositionSize: 1000,
    tokenDecimals: 18,
  }
}

export const pools = [
  {
    network: 'bsc',
    id: 'cakebnb',
    name: "CAKE-BNB LP",
    image: 'cake_bnb.png',
    bigfootAddress: '0x7fF89d5d048DA9a090C51D3FF7eD0fC45bcFe521',
    bank: 'bfbnb',
    apiKey: 'CAKE-BNB LP',
    deathLeverage: 3.333333333333,
    maxLeverage: 2.5,
    tokens: [
      {
        token: "BNB",
        image: 'BNB-logo.svg',
        address: null, // native token
        decimals: 18,
      },
    ],

    rates: {
      yieldFarming: 0,
      tradingFee: 13.87,
      borrowApy: 0,
    },

    params: {
      token: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
      strategy: '0xCb84813806225D629dFb9C651A3d600955135998',
      strategyLiquidation: '0x2d679e20A5E2461E6ADCa390DCD30c583F85B5b1',
    }
  },
  {
    network: 'bsc',
    id: 'usdtbusd',
    name: "USDT-BUSD WLP",
    image: 'usdt_busd.png',
    bigfootAddress: '0x97E1227D1d0072d9eCf72065e60B64F883dA7FDF',
    bank: 'bfusd',
    apiKey: 'USDT-BUSD WLP',
    deathLeverage: 6.5,
    maxLeverage: 6,
    tokens: [
      {
        token: "BUSD",
        image: 'BUSD-logo.png',
        address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
        decimals: 18,

        meta: {
          nerveUsdTokenIndex: 0
        }
      },
    ],

    rates: {
      yieldFarming: 0,
      tradingFee: 0, // wex (no trading fee)
      borrowApy: 0,
    },

    params: {
      token: '0x9Ce20a5169A3CD64A98C2C200aA995A2d8c8830e',
      strategy: '0x5d1F6f28847a1699a9Ab3d2AA9Cb94543f40C797',
      strategyLiquidation: '0x6A86DF83e6D81F53B9995758eD3202b68C32fa9D',
    }
  },
];
