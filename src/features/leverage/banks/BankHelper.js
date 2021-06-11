import BigfootBnb from './BigfootBnb';
import BigfootUsd from './BigfootUsd';
import eleUsd from './eleUsd';

export default class BankHelper {

  static getBankInstance(bank) {
    switch (bank.id) {
      case 'bfbnb':
        return new BigfootBnb();

      case 'bfusd':
        return new BigfootUsd();

      case 'eleusd':
        return new eleUsd();

      default:
        return null;
    }
  }

}