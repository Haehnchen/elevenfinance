import BigfootBnb from './BigfootBnb';
import BigfootUsd from './BigfootUsd';

export default class BankHelper {

  static getBankInstance(bank) {
    switch (bank.id) {
      case 'bfbnb':
        return new BigfootBnb();

      case 'bfusd':
        return new BigfootUsd();

      default:
        return null;
    }
  }

}