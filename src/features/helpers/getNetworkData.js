export const getNetworkMulticall = () => {
  switch (process.env.NETWORK_ID) {
    case '56':
      return '0xB94858b0bB5437498F5453A16039337e5Fdc269C';
    default:
      return '';
  }
}