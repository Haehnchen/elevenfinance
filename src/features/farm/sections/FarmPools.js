import React, {useState, useEffect} from 'react';
import classNames from "classnames";
import {useTranslation} from 'react-i18next';
import {makeStyles} from "@material-ui/core/styles";
import farmItemStyle from "../jss/sections/farmItemStyle";
import Grid from '@material-ui/core/Grid';
// core components
import Button from "components/CustomButtons/Button.js";
import {useFetchPoolsInfo} from '../redux/hooks';
import {Avatar} from "@material-ui/core";
import { useConnectWallet } from '../../home/redux/hooks';
import masterchefAbi from "./masterchefabi.json"
import { vaultERC20, erc20ABI, e11Abi, alpacamchef } from "../../configure";
import TextField from '@material-ui/core/TextField';


const useStyles = makeStyles(farmItemStyle);


export default () => {
  const classes = useStyles();
  const {t, i18n} = useTranslation();
  const {pools, poolsInfo, fetchPoolsInfo} = useFetchPoolsInfo();
  const { web3, address, networkId } = useConnectWallet();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const term = searchTerm.toLowerCase()
    const results = pools.filter(pool =>
      pool.token.toLowerCase().includes(term)
    );
    setSearchResults(results);
  }, [searchTerm]);


function commarize() {
  // Alter numbers larger than 1k
  if (this >= 1e3) {
    var units = ["k", "Million", "Billion", "Trillion", "Quadrillion", "Quintillion", "Sextillion", "Septillion", "Octillion", "Nonillion", "Decillion", "Undecillion"];

    // Divide to get SI Unit engineering style numbers (1e3,1e6,1e9, etc)
    var unit = 0;
    if (this>=1e21)
      unit = Math.floor(Number.parseInt(this.toFixed(0).toString().split("+")[1])/3) * 3
    else
      unit = Math.floor(((this).toFixed(0).length - 1) / 3) * 3
    // Calculate the remainder
    var num = (this / ('1e'+unit)).toFixed(2)
    var unitname = units[Math.floor(unit / 3) - 1]

    // output number remainder + unitname
    return num + " " + unitname
  }

  // return formatted original number
  return this.toLocaleString()
}


Number.prototype.commarize = commarize;


//  useEffect(() => {
//    fetchPoolsInfo();
//  }, [pools, fetchPoolsInfo]);

  useEffect(() => {
    if (address && web3) {
/*      const elelp = "0x1f43e18a2558aef9276a00e041c57ba589813eb2";;
      const cakelp = "0xa527a61703d82139f8a06bc30097cc9caa2df5a6";
      const contract = new web3.eth.Contract(masterchefAbi, "0x73feaa1ee314f8c655e354234017be2193c9e24e");
      const wbnbContract = new web3.eth.Contract(erc20ABI, "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c");
      const ethContract = new web3.eth.Contract(erc20ABI, "0x2170Ed0880ac9A755fd29B2688956BD959F933F8");
      const cakeContract = new web3.eth.Contract(erc20ABI, "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82");
      const elevenPerBnb = 4000;
      const masterchefAddress = "0x1ac6C0B955B6D7ACb61c9Bdf3EE98E0689e07B8A";
      const lELEERC20 = new web3.eth.Contract(erc20ABI, elelp);
      const ELEERC20 = new web3.eth.Contract(erc20ABI, "0xAcD7B3D9c10e97d0efA418903C0c7669E702E4C0");
      const elevenChef = new web3.eth.Contract(masterchefAbi, masterchefAddress);
      const aplacaChef = new web3.eth.Contract(alpacamchef, "0xA625AB01B08ce023B2a342Dbb12a16f2C8489A8F");
      const BMXXERC20 = new web3.eth.Contract(erc20ABI, "0xda88bD84e752960f8fDe52CC2E9e6B19ae0D6e7C");
      const ASRERC20 = new web3.eth.Contract(erc20ABI, "0x1716D66943b0833f26A938d0A75aEfAc708Bd98B");
      const JUVERC20 = new web3.eth.Contract(erc20ABI, "0x2f01AC6cDec485d07D4Be8998Bc4c16f540b914C");
      const PSGERC20 = new web3.eth.Contract(erc20ABI, "0x250b9021018132a52C1bE46d9f1ae53997C3f8A8");
      const OGERC20 = new web3.eth.Contract(erc20ABI, "0xd2e399e7768fc713c9ecf0c8e8988dd056c8dbd7");
      const ATMERC20 = new web3.eth.Contract(erc20ABI, "0xd527f4145C84a57E38278485658829040E7e87b7");
      const E11ERC20 = new web3.eth.Contract(e11Abi, "0x3ed531bfb3fad41111f6dab567b33c4db897f991");
      const lBMXXERC20 = new web3.eth.Contract(erc20ABI, "0x4D5aA94Ce6BbB1BC4eb73207a5a5d4D052cFcD67");
      const lASRERC20 = new web3.eth.Contract(erc20ABI, "0xd6b900d5308356317299dafe303e661271aa12f1");
      const lJUVERC20 = new web3.eth.Contract(erc20ABI, "0x51a2ffa5b7de506f9a22549e48b33f6cf0d9030e");
      const lPSGERC20 = new web3.eth.Contract(erc20ABI, "0x9c4f6a5050cf863e67a402e8b377973b4e3372c1");
      const lOGERC20 = new web3.eth.Contract(erc20ABI, "0x64373608f2e93ea97ad4d8ca2cce6b2575db2f55");
      const lATMERC20 = new web3.eth.Contract(erc20ABI, "0xd5b3ebf1a85d32c73a82b40f75e1cd929caf4029");
      const lBETHERC20 = new web3.eth.Contract(erc20ABI, "0x99d865ed50d2c32c1493896810fa386c1ce81d91");
      const ALPACAERC20 = new web3.eth.Contract(erc20ABI, "0x0A33E8e887850Ad53739A0CeF110283b74E02f3e");
      const lALPACAERC20 = new web3.eth.Contract(erc20ABI, "0xf3ce6aac24980e6b657926dfc79502ae414d3083");
      const BETHERC20 = new web3.eth.Contract(erc20ABI, "0xc11beE3b3Ff05C59ACC074fa02aEA53a49aa96F1");
      const alpacatoken = new web3.eth.Contract(erc20ABI, "0x8F0528cE5eF7B51152A59745bEfDD91D97091d2F");
      getAPYPool(cakeContract, wbnbContract, cakelp, contract, 70, "0x99d865ed50d2c32c1493896810fa386c1ce81d91", "BETH-ETH LP", ethContract, masterchefAddress, ASRERC20, JUVERC20, PSGERC20, OGERC20, ATMERC20, E11ERC20, BETHERC20, elevenChef, lASRERC20, lJUVERC20, lPSGERC20, lOGERC20, lATMERC20, lELEERC20, ELEERC20, lBETHERC20, BMXXERC20, lBMXXERC20, aplacaChef, ALPACAERC20, lALPACAERC20, alpacatoken);
      getAPYPool(cakeContract, wbnbContract, cakelp, contract, 42, "0x9c4f6a5050cf863e67a402e8b377973b4e3372c1", "PSG-BNB LP", ethContract, masterchefAddress, ASRERC20, JUVERC20, PSGERC20, OGERC20, ATMERC20, E11ERC20, BETHERC20, elevenChef, lASRERC20, lJUVERC20, lPSGERC20, lOGERC20, lATMERC20, lELEERC20, ELEERC20, lBETHERC20, BMXXERC20, lBMXXERC20, aplacaChef, ALPACAERC20, lALPACAERC20, alpacatoken);
      getAPYPool(cakeContract, wbnbContract, cakelp, contract, 48, "0xd5b3ebf1a85d32c73a82b40f75e1cd929caf4029", "ATM-BNB LP", ethContract, masterchefAddress, ASRERC20, JUVERC20, PSGERC20, OGERC20, ATMERC20, E11ERC20, BETHERC20, elevenChef, lASRERC20, lJUVERC20, lPSGERC20, lOGERC20, lATMERC20, lELEERC20, ELEERC20, lBETHERC20, BMXXERC20, lBMXXERC20, aplacaChef, ALPACAERC20, lALPACAERC20, alpacatoken);
      getAPYPool(cakeContract, wbnbContract, cakelp, contract, 43, "0x51a2ffa5b7de506f9a22549e48b33f6cf0d9030e", "JUV-BNB LP", ethContract, masterchefAddress, ASRERC20, JUVERC20, PSGERC20, OGERC20, ATMERC20, E11ERC20, BETHERC20, elevenChef, lASRERC20, lJUVERC20, lPSGERC20, lOGERC20, lATMERC20, lELEERC20, ELEERC20, lBETHERC20, BMXXERC20, lBMXXERC20, aplacaChef, ALPACAERC20, lALPACAERC20, alpacatoken);
      getAPYPool(cakeContract, wbnbContract, cakelp, contract, 46, "0x64373608f2e93ea97ad4d8ca2cce6b2575db2f55", "OG-BNB LP", ethContract, masterchefAddress, ASRERC20, JUVERC20, PSGERC20, OGERC20, ATMERC20, E11ERC20, BETHERC20, elevenChef, lASRERC20, lJUVERC20, lPSGERC20, lOGERC20, lATMERC20, lELEERC20, ELEERC20, lBETHERC20, BMXXERC20, lBMXXERC20, aplacaChef, ALPACAERC20, lALPACAERC20, alpacatoken);
      getAPYPool(cakeContract, wbnbContract, cakelp, contract, 47, "0xd6b900d5308356317299dafe303e661271aa12f1", "ASR-BNB LP", ethContract, masterchefAddress, ASRERC20, JUVERC20, PSGERC20, OGERC20, ATMERC20, E11ERC20, BETHERC20, elevenChef, lASRERC20, lJUVERC20, lPSGERC20, lOGERC20, lATMERC20, lELEERC20, ELEERC20, lBETHERC20, BMXXERC20, lBMXXERC20, aplacaChef, ALPACAERC20, lALPACAERC20, alpacatoken);
      getAPYPool(cakeContract, wbnbContract, cakelp, contract, 82, "0x4D5aA94Ce6BbB1BC4eb73207a5a5d4D052cFcD67", "BMXX-BNB LP", ethContract, masterchefAddress, ASRERC20, JUVERC20, PSGERC20, OGERC20, ATMERC20, E11ERC20, BETHERC20, elevenChef, lASRERC20, lJUVERC20, lPSGERC20, lOGERC20, lATMERC20, lELEERC20, ELEERC20, lBETHERC20, BMXXERC20, lBMXXERC20, aplacaChef, ALPACAERC20, lALPACAERC20, alpacatoken);
      getAPYPool(cakeContract, wbnbContract, cakelp, contract, 999, "0xF3CE6Aac24980E6B657926dfC79502Ae414d3083", "ALPACA-BNB LP", ethContract, masterchefAddress, ASRERC20, JUVERC20, PSGERC20, OGERC20, ATMERC20, E11ERC20, BETHERC20, elevenChef, lASRERC20, lJUVERC20, lPSGERC20, lOGERC20, lATMERC20, lELEERC20, ELEERC20, lBETHERC20, BMXXERC20, lBMXXERC20, aplacaChef, ALPACAERC20, lALPACAERC20, alpacatoken);
      getAPYPool(cakeContract, wbnbContract, cakelp, contract, 999, "0xd6b900d5308356317299dafe303e661271aa12f1", "ELE", ethContract, masterchefAddress, ASRERC20, JUVERC20, PSGERC20, OGERC20, ATMERC20, E11ERC20, BETHERC20, elevenChef, lASRERC20, lJUVERC20, lPSGERC20, lOGERC20, lATMERC20, lELEERC20, ELEERC20, lBETHERC20, BMXXERC20, lBMXXERC20, aplacaChef, ALPACAERC20, lALPACAERC20, alpacatoken);
      getAPYPool(cakeContract, wbnbContract, cakelp, contract, 999, "0x1f43e18a2558aef9276a00e041c57ba589813eb2", "ELE-BNB LP", ethContract, masterchefAddress, ASRERC20, JUVERC20, PSGERC20, OGERC20, ATMERC20, E11ERC20, BETHERC20, elevenChef, lASRERC20, lJUVERC20, lPSGERC20, lOGERC20, lATMERC20, lELEERC20, ELEERC20, lBETHERC20, BMXXERC20, lBMXXERC20, aplacaChef, ALPACAERC20, lALPACAERC20, alpacatoken);*/
      const cakelp = "0xa527a61703d82139f8a06bc30097cc9caa2df5a6";
      const contract = new web3.eth.Contract(masterchefAbi, "0x73feaa1ee314f8c655e354234017be2193c9e24e");
      const alpacamchefcontract = new web3.eth.Contract(alpacamchef, "0xA625AB01B08ce023B2a342Dbb12a16f2C8489A8F");
      const wbnbContract = new web3.eth.Contract(erc20ABI, "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c");
      const ethContract = new web3.eth.Contract(erc20ABI, "0x2170Ed0880ac9A755fd29B2688956BD959F933F8");
      const cakeContract = new web3.eth.Contract(erc20ABI, "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82");
      const alpacaContract = new web3.eth.Contract(erc20ABI, "0x8F0528cE5eF7B51152A59745bEfDD91D97091d2F");
      const eleErc20 = new web3.eth.Contract(erc20ABI, "0xAcD7B3D9c10e97d0efA418903C0c7669E702E4C0");
      getEverythingDone(cakeContract, wbnbContract, cakelp, contract, ethContract, alpacaContract, alpacamchefcontract, eleErc20);

      const id = setInterval(() => {
      }, 10000);
      return () => clearInterval(id);
    }
  }, [address, web3]);


  const getEverythingDone = async (cakeC, wbnbC, cakeL, mchefCake, ethContract, alpacaContract, alpacamchecmchef, ele) => {
      const cakeInCakeLP = await cakeC.methods.balanceOf(cakeL).call();
      const wbnbInCakeLP = await wbnbC.methods.balanceOf(cakeL).call();
      const cakePrice = cakeInCakeLP/wbnbInCakeLP;
      const eleInPancake = await ele.methods.balanceOf("0x1f43e18A2558Aef9276A00E041c57ba589813eB2").call();
      const wbnbInPancakeEle = await wbnbC.methods.balanceOf("0x1f43e18A2558Aef9276A00E041c57ba589813eB2").call();
      const elePerBnb = eleInPancake/wbnbInPancakeEle;
      const mchefEle = new web3.eth.Contract(masterchefAbi, "0x1ac6c0b955b6d7acb61c9bdf3ee98e0689e07b8a");
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 70, "0x99d865ed50d2c32c1493896810fa386c1ce81d91", "BETH-ETH LP", ethContract, elePerBnb, "0xc11beE3b3Ff05C59ACC074fa02aEA53a49aa96F1", mchefEle, 6);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 42, "0x9c4f6a5050cf863e67a402e8b377973b4e3372c1", "PSG-BNB LP", ethContract, elePerBnb, "0x250b9021018132a52C1bE46d9f1ae53997C3f8A8", mchefEle, 4);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 48, "0xd5b3ebf1a85d32c73a82b40f75e1cd929caf4029", "ATM-BNB LP", ethContract, elePerBnb, "0xd527f4145c84a57e38278485658829040e7e87b7", mchefEle, 2);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 43, "0x51a2ffa5b7de506f9a22549e48b33f6cf0d9030e", "JUV-BNB LP", ethContract, elePerBnb, "0x2f01ac6cdec485d07d4be8998bc4c16f540b914c", mchefEle, 1);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 46, "0x64373608f2e93ea97ad4d8ca2cce6b2575db2f55", "OG-BNB LP", ethContract, elePerBnb, "0xd2e399e7768fc713c9ecf0c8e8988dd056c8dbd7", mchefEle, 5);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 47, "0xd6b900d5308356317299dafe303e661271aa12f1", "ASR-BNB LP", ethContract, elePerBnb, "0x1716d66943b0833f26a938d0a75aefac708bd98b", mchefEle, 3);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 79, "0x9d8b7e4a9D53654D82F12c83448D8f92732bC761", "BOPEN-BNB LP", ethContract, elePerBnb, "0xE8e64d86CFdAFC25Ccee1681Dab127aE8C37CC4b", mchefEle, 14);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 82, "0x4D5aA94Ce6BbB1BC4eb73207a5a5d4D052cFcD67", "BMXX-BNB LP", ethContract, elePerBnb, "0xda88bD84e752960f8fDe52CC2E9e6B19ae0D6e7C", mchefEle, 10);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 77, "0x9e642d174B14fAEa31D842Dc83037c42b53236E6", "DODO-BNB LP", ethContract, elePerBnb, "0x9fe4C02ba78cDE545F8c55775BbcC54324e37A9F", mchefEle, 11);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 76, "0x4576C456AF93a37a096235e5d83f812AC9aeD027", "SWINGBY-BNB LP", ethContract, elePerBnb, "0x991Ece2D170cC4Fb3876e737c37B0e7a0CF0b827", mchefEle, 15);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 75, "0x5E3CD27F36932Bc0314aC4e2510585798C34a2fC", "BRY-BNB LP", ethContract, elePerBnb, "0x07EAcFE846130F78A16f93e1DA8625953080c0d0", mchefEle, 16);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 74, "0xB5Ab3996808c7e489DCDc0f1Af2AB212ae0059aF", "ZEE-BNB LP", ethContract, elePerBnb, "0x06bdC7D6d0a2Ef45bC8b83F458407FE961596014", mchefEle, 17);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 73, "0xC1800c29CF91954357cd0bf3f0accAADa3D0109c", "SWGB-BNB LP", ethContract, elePerBnb, "0xd56F8c5E5a47fC010a3E86ba57D87B0DCfA5AAe5", mchefEle, 18);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 84, "0xdC6C130299E53ACD2CC2D291fa10552CA2198a6b", "WATCH-BNB LP", ethContract, elePerBnb, "0x3d7c095a6559df3fd185778ac1687ece650670a5", mchefEle, 60);
      getAPYPool(alpacaContract, wbnbC, cakeL, alpacamchecmchef, 999, "0xF3CE6Aac24980E6B657926dfC79502Ae414d3083", "ALPACA-BNB LP", ethContract, elePerBnb, "0x0a33e8e887850ad53739a0cef110283b74e02f3e", mchefEle, 9);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 71, "0xcBe2cF3bd012e9C1ADE2Ee4d41DB3DaC763e78F3", "SFP-BNB LP", ethContract, elePerBnb, "0x8cfd13f45c397BD58e6de469286ebb4FB939Fd2E", mchefEle, 19);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 68, "0x60bB03D1010b99CEAdD0dd209b64bC8bd83da161", "LIT-BNB LP", ethContract, elePerBnb, "0x1F4FCAc27BB56b9D58F436f8f39a92973ae4C343", mchefEle, 20);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 67, "0x66b9E1eAc8a81F3752F7f3A5E95dE460688A17Ee", "HGET-BNB LP", ethContract, elePerBnb, "0xB76F6eF15e4EF27e5766573Dcbab684b099CBdE9", mchefEle, 21);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 66, "0x74690f829fec83ea424ee1F1654041b2491A7bE9", "BDO-BNB LP", ethContract, elePerBnb, "0xb1049508617924134d452b4b0ec38980D3f25fB2", mchefEle, 22);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 65, "0x3Ef4952C7a9AfbE374EA02d1Bf5eD5a0015b7716", "EGLD-BNB LP", ethContract, elePerBnb, "0x0C0116026103B88aDf611DAfD5301c669776eD48", mchefEle, 23);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 58, "0xFfb9E2d5ce4378F1a89b29bf53F80804CC078102", "WSOTE-BNB LP", ethContract, elePerBnb, "0x297c7816b70a0be4Ff7687aC381807f2e5Bb19A8", mchefEle, 24);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 57, "0x36b7D2e5C7877392Fb17f9219efaD56F3D794700", "FRONT-BNB LP", ethContract, elePerBnb, "0x928C1937B9178F175551b72e4e43ae08E3c7E9eC", mchefEle, 25);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 56, "0x6411310C07d8c48730172146Fd6F31FA84034a8b", "HELMET-BNB LP", ethContract, elePerBnb, "0xC736a70E9d083BA610909A71B1995547e1f1bD1A", mchefEle, 26);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 55, "0x91589786D36fEe5B27A5539CfE638a5fc9834665", "BTCST-BNB LP", ethContract, elePerBnb, "0x83b5d185cb2Bd62025D4c55F1bAFA7b9B6785abb", mchefEle, 28);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 54, "0xBc765Fd113c5bDB2ebc25F711191B56bB8690aec", "LTC-BNB LP", ethContract, elePerBnb, "0x59DA97Caed37a56Be45c96348E9BdDBe8eCE4fAc", mchefEle, 29);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 51, "0x20781bc3701C5309ac75291f5D09BdC23D7b7Fa8", "BSCX-BNB LP", ethContract, elePerBnb, "0xDBF8B3a860a890c452809eb4e99F23335b81ab7B", mchefEle, 30);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 50, "0x01ecc44Ddd2D104F44D2AA1A2bD9DFbC91aE8275", "TEN-BNB LP", ethContract, elePerBnb, "0x95576e89a2097A2F3EC585E582B24d9Fa150868b", mchefEle, 31);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 49, "0xbe14f3a89A4F7f279Af9d99554cf12E8C29dB921", "BALBT-BNB LP", ethContract, elePerBnb, "0xb18A859F3b5A4b053800e595D855CBB5f5da5EFE", mchefEle, 32);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 45, "0x58B58cab6C5cF158f63A2390b817710826d116D0", "REEF-BNB LP", ethContract, elePerBnb, "0xd7B75DAE1794649b9ea59E67C50c83D1c3F0aFD6", mchefEle, 33);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 44, "0x470BC451810B312BBb1256f96B0895D95eA659B1", "DITTO-BNB LP", ethContract, elePerBnb, "0xC272241ae3900f795109D506faaEd1047ADbe35E", mchefEle, 34);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 40, "0xC743Dc05F03D25E1aF8eC5F8228f4BD25513c8d0", "BLK-BNB LP", ethContract, elePerBnb, "0x689D35ec441F3EDc125Eb53Fec1eaC755f397B76", mchefEle, 35);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 39, "0xbEA35584b9a88107102ABEf0BDeE2c4FaE5D8c31", "UNFI-BNB LP", ethContract, elePerBnb, "0x456602BEA1a8644A8f4e34974Be8f5C828bE9580", mchefEle, 36);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 37, "0x9F40e8a2Fcaa267A0c374B6c661E0b372264cC3D", "HARD-BNB LP", ethContract, elePerBnb, "0x0144eeDa9f067592A444eDCC71fE438131f32dBB", mchefEle, 37);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 32, "0x7793870484647a7278907498ec504879d6971EAb", "CTK-BNB LP", ethContract, elePerBnb, "0x01d0571F47a79782Db6B0C33c024aEDCB91FEC2C", mchefEle, 38);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 30, "0x752E713fB70E3FA1Ac08bCF34485F14A986956c4", "SXP-BNB LP", ethContract, elePerBnb, "0x7E93C334A215A11A4c80136C914Bb641E6dddE62", mchefEle, 39);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 27, "0x7a34bd64d18e44CfdE3ef4B81b87BAf3EB3315B6", "INJ-BNB LP", ethContract, elePerBnb, "0x857d733f702eC996C108059027E5385abcb788A0", mchefEle, 40);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 26, "0x35FE9787F0eBF2a200BAc413D3030CF62D312774", "FIL-BNB LP", ethContract, elePerBnb, "0xd0ff54ce0eA735d010b25eF55f354F0bb7D646Ba", mchefEle, 41);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 24, "0x68Ff2ca47D27db5Ac0b5c46587645835dD51D3C1", "YFI-BNB LP", ethContract, elePerBnb, "0x8D212b23948b4b1160d7eD157743c16f6500D089", mchefEle, 43);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 25, "0x4269e7F43A63CEA1aD7707Be565a94a9189967E9", "UNI-BNB LP", ethContract, elePerBnb, "0x487c000daF32c547eE9413831176D4D545744250", mchefEle, 42);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 23, "0x54EdD846dB17f43b6e43296134ECD96284671E81", "BCH-BNB LP", ethContract, elePerBnb, "0x22d16D31efe717715831cB628D86E0CCdEBbaF91", mchefEle, 44);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 22, "0x5acaC332F0F49c8bAdC7aFd0134aD19D3DB972e6", "XTZ-BNB LP", ethContract, elePerBnb, "0x3fdcAFc80bE708eD520425EfBAb65f333E1d7703", mchefEle, 45);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 20, "0x574a978c2D0d36D707a05E459466C7A1054F1210", "YFII-BNB LP", ethContract, elePerBnb, "0xd39832249075319D8476192fda0344f6bFA19132", mchefEle, 46);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 19, "0x2333c77FC0B2875c11409cdCD3C75D42D402E834", "ATOM-BNB LP", ethContract, elePerBnb, "0xC225bf0De350704D18C38450abFBe5ac131Ff6A7", mchefEle, 47);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 18, "0xC7b4B32A3be2cB6572a1c9959401F832Ce47a6d2", "XRP-BNB LP", ethContract, elePerBnb, "0xF3Ba7c535F9FeA2B95ce636258E2c5419c89c682", mchefEle, 48);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 16, "0x4e0f3385d932F7179DeE045369286FFa6B03d887", "ALPHA-BNB LP", ethContract, elePerBnb, "0x732404e4D3888B289Ee1665c45f2bf871562B270", mchefEle, 49);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 15, "0x7561EEe90e24F3b348E1087A005F78B4c8453524", "BTC-BNB LP", ethContract, elePerBnb, "0x345657786b32Bf4ac715Ead5ae5C3c08C099FBC9", mchefEle, 50);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 14, "0x70D8929d04b60Af4fb9B58713eBcf18765aDE422", "ETH-BNB LP", ethContract, elePerBnb, "0x4585F275e1D5E534528060d7cDCc544E26CfE68B", mchefEle, 51);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 13, "0x41182c32F854dd97bA0e0B1816022e0aCB2fc0bb", "XVS-BNB LP", ethContract, elePerBnb, "0x31697b615dFEf36A415260996d234a8a8C1f74C4", mchefEle, 52);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 12, "0x610e7a287c27dfFcaC0F0a94f547Cc1B770cF483", "TWT-BNB LP", ethContract, elePerBnb, "0x7913D9b83bfB2E948aC78F15628EC5aF12927c98", mchefEle, 53);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 7, "0xaeBE45E3a03B734c68e5557AE04BFC76917B4686", "LINK-BNB LP", ethContract, elePerBnb, "0xCB73C1866508debAda74F1Ac2798334ab0Db8A9d", mchefEle, 54);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 6, "0x981d2Ba1b298888408d342C39c2Ab92e8991691e", "EOS-BNB LP", ethContract, elePerBnb, "0xAcD820Ec2d105Ba75862202cCd93B932E2F2B88a", mchefEle, 55);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 5, "0xbCD62661A6b1DEd703585d3aF7d7649Ef4dcDB5c", "DOT-BNB LP", ethContract, elePerBnb, "0x8066fd579b3DcD5e47C9B6915540d5271cc854b5", mchefEle, 56);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 4, "0xc639187ef82271D8f517de6FEAE4FaF5b517533c", "BAND-BNB LP", ethContract, elePerBnb, "0xa6e0f45F80Ca72271343145a9E33b0A4630380d4", mchefEle, 57);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 3, "0xBA51D1AB95756ca4eaB8737eCD450cd8F05384cF", "ADA-BNB LP", ethContract, elePerBnb, "0xcDEe7B6b1B9817eBd02aa8101a6E7b78F1B549c9", mchefEle, 58);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 2, "0x1B96B92314C44b159149f7E0303511fB2Fc4774f", "BUSD-BNB LP", ethContract, elePerBnb, "0x7Ed3a3bb1Ca62FAAfB08EAdD00d57969485cf6D4", mchefEle, 59);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 999, "0x1f43e18A2558Aef9276A00E041c57ba589813eB2", "ELE-BNB LP", ethContract, elePerBnb, "", mchefEle, 8);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 999, "", "ELE", ethContract, elePerBnb, "", mchefEle, 7);
      getAPYWault(mchefEle, wbnbC, elePerBnb);
  }

  const getAPYWault = async (chefEle, wbnbC, eleP) => {
    const waultFarmAbi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Claim","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"liquidityMining","outputs":[{"internalType":"contract IERC20","name":"lpToken","type":"address"},{"internalType":"uint256","name":"lastRewardBlock","type":"uint256"},{"internalType":"uint256","name":"accWaultPerShare","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"pendingRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_waultPerBlock","type":"uint256"}],"name":"setWaultPerBlock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"_wault","type":"address"},{"internalType":"contract IERC20","name":"_lpToken","type":"address"}],"name":"setWaultTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"startBlock","type":"uint256"}],"name":"startMining","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userInfo","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"rewardDebt","type":"uint256"},{"internalType":"uint256","name":"pendingRewards","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"wault","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"waultPerBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];
    const waultContract = new web3.eth.Contract(erc20ABI, "0x6ff2d9e5891a7a7c554b80e0d1b791483c78bce9");
    const waultsInLP = await waultContract.methods.balanceOf("0x1f280a4fa78f5805bac193dddafeb77b16da4614").call() * 2;
    const lpContract = new web3.eth.Contract(erc20ABI, "0x1f280a4fa78f5805bac193dddafeb77b16da4614");
    const totallp = await lpContract.methods.totalSupply().call();
    const stakedlp = await lpContract.methods.balanceOf("0x6F7a2b868a3BABD26415Fd4E8e2Fee2630C9A74d").call();
    const waultsStaked = waultsInLP*stakedlp/totallp;
    const waultFarmContract = new web3.eth.Contract(waultFarmAbi, "0x6F7a2b868a3BABD26415Fd4E8e2Fee2630C9A74d");
    const waultperblock = await waultFarmContract.methods.waultPerBlock().call();
    const interest = waultperblock*10512000/waultsInLP/stakedlp*totallp;
    document.getElementById("WAULT-BNB LPd").innerHTML = (interest/365*100).toFixed(2);
    let apy = ((1+(interest/365))**365)*100;
    //farming = 0x6F7a2b868a3BABD26415Fd4E8e2Fee2630C9A74d
    //lp = 0x1f280a4fa78f5805bac193dddafeb77b16da4614
    const wbnbInPair = await wbnbC.methods.balanceOf("0x1f280a4fa78f5805bac193dddafeb77b16da4614").call();
    const totalAllocEle = await chefEle.methods.totalAllocPoint().call();
    const pairInfoEle = await chefEle.methods.poolInfo(61).call();
    const waultvault = new web3.eth.Contract(vaultERC20, "0x527636db487dcf972f09a7149cf4686ff8fc32dc");
    const tokensPerShare = await waultvault.methods.getPricePerFullShare().call();
    const waultInMchef = await waultvault.methods.balanceOf("0x1ac6C0B955B6D7ACb61c9Bdf3EE98E0689e07B8A").call();
    const eleAPR = 7500000000000000000000000/totalAllocEle*pairInfoEle["allocPoint"]*100/(wbnbInPair/totallp*waultInMchef*tokensPerShare/1e18*eleP);
    apy += eleAPR;
    document.getElementById("WAULT-BNB LP").innerHTML = apy.commarize();
    document.getElementById("WAULT-BNB LPl").innerHTML = eleAPR.toFixed(2);

  }


  const getAPYPool = async (cakeP, wbnbC, cakeL, chefC, pid, lpAddress, elementID, ethC, eleP, vaultA, chefEle, elePID) => {
    const totalAllocEle = await chefEle.methods.totalAllocPoint().call();
    const pairInfoEle = await chefEle.methods.poolInfo(elePID).call();
    //case alpaca
    if (elementID == "ALPACA-BNB LP"){
      //cakeC = alpaca contract     contract = alpaca mchef
      const alpasInLp = await cakeP.methods.balanceOf(lpAddress).call();
      const bonusMultiplier = await chefC.methods.bonusMultiplier().call();
      const totalAllocPoints = await chefC.methods.totalAllocPoint().call();
      const poolAllocPoints = await chefC.methods.poolInfo(4).call();
      const alpacaPerBlock = await chefC.methods.alpacaPerBlock().call();
      const interest = alpacaPerBlock/totalAllocPoints*poolAllocPoints["allocPoint"]*bonusMultiplier*10512000/alpasInLp/2;
      const apy = ((1+(interest/365))**365)*100;
      document.getElementById(elementID).innerHTML = apy.commarize();
      document.getElementById(elementID+"d").innerHTML = (interest/365*100).toFixed(2);
      const vaultContract = new web3.eth.Contract(vaultERC20, vaultA);
      const lpContract = new web3.eth.Contract(erc20ABI, lpAddress);
      const lpSupply = await lpContract.methods.totalSupply().call();
      const lpStaked = await vaultContract.methods.balanceOf("0x1ac6C0B955B6D7ACb61c9Bdf3EE98E0689e07B8A").call();
      const tokensPerShare = await vaultContract.methods.getPricePerFullShare().call();
      const wbnbInPair = await wbnbC.methods.balanceOf(lpAddress).call() * 2;
      const eleapr = 7500000000000000000000000/totalAllocEle*pairInfoEle["allocPoint"]*100/(wbnbInPair/lpSupply*lpStaked*tokensPerShare/1e18*eleP);
      document.getElementById(elementID+"l").innerHTML = eleapr.toFixed(2);
    }
    else if (elementID == "ELE-BNB LP"){
      const lele = new web3.eth.Contract(erc20ABI, "0x1f43e18a2558aef9276a00e041c57ba589813eb2");
      const lpStaked = await lele.methods.balanceOf("0x1ac6c0b955b6d7acb61c9bdf3ee98e0689e07b8a").call();
      const lpSupply = await lele.methods.totalSupply().call();
      const ele = new web3.eth.Contract(erc20ABI, "0xacd7b3d9c10e97d0efa418903c0c7669e702e4c0");
      const eleInPair = await ele.methods.balanceOf(lpAddress).call() * 2;
      let apy = 7500000000000000000000000/totalAllocEle*pairInfoEle["allocPoint"]*100/eleInPair*lpSupply/lpStaked;
      document.getElementById(elementID).innerHTML = apy.toFixed(2);
    }
    else if (elementID == "ELE"){
      const e11 = new web3.eth.Contract(e11Abi, "0x3ed531bfb3fad41111f6dab567b33c4db897f991");
      const tokensPerShare = await e11.methods.tokensPerShare().call() / 1e12;
      const launchDate = 1614802515;
      const todaysDate = Date.now()/1000;
      const timeElapsed = todaysDate-launchDate;
      const percentEarned = (tokensPerShare - 1)*100;
      const percentPerYear = 31536000*percentEarned/timeElapsed;

      let e11Staked = await e11.methods.balanceOf("0x1ac6c0b955b6d7acb61c9bdf3ee98e0689e07b8a").call();
      const eleapr = 7500000000000000000000000/totalAllocEle*pairInfoEle["allocPoint"]*100/e11Staked/tokensPerShare;
      let apy = percentPerYear+eleapr;
      document.getElementById(elementID).innerHTML = apy.toFixed(2);
      document.getElementById(elementID+"d").innerHTML = (percentPerYear/365).toFixed(2);
      document.getElementById(elementID+"l").innerHTML = eleapr.toFixed(2);
    }
    else {
    const bonusMultiplier = await chefC.methods.BONUS_MULTIPLIER().call();
    const totalAllocPoints = await chefC.methods.totalAllocPoint().call();
    const cakePerBlock = 4e19;
    let bnbInPair = 0;
    //case eth beth
    if (elementID == "BETH-ETH LP"){
      const wbnbInEthLP = await wbnbC.methods.balanceOf("0x70D8929d04b60Af4fb9B58713eBcf18765aDE422").call();
      const ethInEthLP = await ethC.methods.balanceOf("0x70D8929d04b60Af4fb9B58713eBcf18765aDE422").call();
      const bnbPerEth = wbnbInEthLP/ethInEthLP;
      const ethInPair = await ethC.methods.balanceOf(lpAddress).call() * 2;
      bnbInPair = ethInPair * bnbPerEth;
    }
    //case bnb pair
    else{
      bnbInPair = await wbnbC.methods.balanceOf(lpAddress).call() * 2;
    }
    const poolNfo = await chefC.methods.poolInfo(pid).call();
    const cakesPerBlockPair = cakePerBlock * poolNfo["allocPoint"] / totalAllocPoints * bonusMultiplier;
    const cakesPerBlockPairDay = cakesPerBlockPair * 28800;
    const cakeInPair = bnbInPair * cakeP;
    let apy = (1+(cakesPerBlockPairDay/cakeInPair))**365*100-100;
    const vaultContract = new web3.eth.Contract(vaultERC20, vaultA);
    const tokensPerShare = await vaultContract.methods.getPricePerFullShare().call();
    const lpStaked = await vaultContract.methods.balanceOf("0x1ac6C0B955B6D7ACb61c9Bdf3EE98E0689e07B8A").call();
    const lpContract = new web3.eth.Contract(erc20ABI, lpAddress);
    const lpSupply = await lpContract.methods.totalSupply().call();
    const wbnbInPair = bnbInPair;
    const eleapr = 7500000000000000000000000/totalAllocEle*pairInfoEle["allocPoint"]*100/(wbnbInPair/lpSupply*lpStaked*tokensPerShare/1e18*eleP);
    apy += eleapr;
    document.getElementById(elementID).innerHTML = apy.toFixed(2);
    document.getElementById(elementID+"d").innerHTML = (100*(cakesPerBlockPairDay/cakeInPair)).toFixed(2);
    document.getElementById(elementID+"l").innerHTML = eleapr.toFixed(2);
}
}

/*  const getAPYPool = async (cakeC, wbnbC, cakeL, chefC, pid, lpAddress, elementID, ethC, mchefAddr, asr, juv, psg, og, atm, e11, beth, eChef, lasr, ljuv, lpsg, log, latm, lele, ele, lbeth, bmxx, lbmxx, alpachef, alpaca, lalpaca, alpatoken) => {
    let apy = 0;
    const eleInPancake = await ele.methods.balanceOf("0x1f43e18A2558Aef9276A00E041c57ba589813eB2").call();
    const wbnbInPancakeEle = await wbnbC.methods.balanceOf("0x1f43e18A2558Aef9276A00E041c57ba589813eB2").call();
    const ePrice = eleInPancake/wbnbInPancakeEle;
    if(elementID != "ELE" && elementID != "ELE-BNB LP"){
    const cakeInCakeLp = await cakeC.methods.balanceOf(cakeL).call();
    const wbnbInCakeLp = await wbnbC.methods.balanceOf(cakeL).call();
    const yearly = 7500000000000000000000000;
    const cakeperbnb = cakeInCakeLp/wbnbInCakeLp;
    const bonusMultiplier = await chefC.methods.BONUS_MULTIPLIER().call();
    const totalAllocPoints = await chefC.methods.totalAllocPoint().call();
    const eleTotalAllocPoints = await eChef.methods.totalAllocPoint().call();
    const cakePerBlock = 4e19;
    let bnbInPair = 0;
    //case eth beth
    if (elementID == "BETH-ETH LP"){
      const wbnbInEthLP = await wbnbC.methods.balanceOf("0x70D8929d04b60Af4fb9B58713eBcf18765aDE422").call();
      const ethInEthLP = await ethC.methods.balanceOf("0x70D8929d04b60Af4fb9B58713eBcf18765aDE422").call();
      const bnbPerEth = wbnbInEthLP/ethInEthLP;
      const ethInPair = await ethC.methods.balanceOf(lpAddress).call() * 2;
      bnbInPair = ethInPair * bnbPerEth;
    }
    //case bnb pair
    else{
      bnbInPair = await wbnbC.methods.balanceOf(lpAddress).call() * 2;
    }
    if (elementID == "ALPACA-BNB LP"){
       const poolNfo = await alpachef.methods.poolInfo(4).call();
       const bonusAlpa = await alpachef.methods.bonusMultiplier().call();
       const alpaTotalWeight = await alpachef.methods.totalAllocPoint().call();
       const alpaPerBlock = await alpachef.methods.alpacaPerBlock().call();
       const totalAlpaAllocPoints = await alpachef.methods.totalAllocPoint().call();
       const alpasPerBlockPair = alpaPerBlock * poolNfo["allocPoint"] / totalAlpaAllocPoints * bonusAlpa;
       const alpasPerBlockPairDay = alpasPerBlockPair * 28800;
       const alpaInPair = await alpatoken.methods.balanceOf("0xF3CE6Aac24980E6B657926dfC79502Ae414d3083").call();
       apy = (1+(alpasPerBlockPairDay/alpaInPair/2))**365*100-100;
    }
    else {
      const poolNfo = await chefC.methods.poolInfo(pid).call();
      const cakesPerBlockPair = cakePerBlock * poolNfo["allocPoint"] / totalAllocPoints * bonusMultiplier;
      const cakesPerBlockPairDay = cakesPerBlockPair * 28800;
      const cakeInPair = bnbInPair * cakeperbnb;
      apy = (1+(cakesPerBlockPairDay/cakeInPair))**365*100-100;}
    }
//    apy = 7500000000000000000000000*1/22*100/eleInPair;
    let eleBalance = 0;
    if(elementID == "PSG-BNB LP"){
      //vaultbalance
      const lpStaked = await psg.methods.balanceOf(mchefAddr).call();
      const lpSupply = await lpsg.methods.totalSupply().call();
      const wbnbInPair = await wbnbC.methods.balanceOf(lpAddress).call() * 2;
      apy += 7500000000000000000000000/45.5*1*100/(wbnbInPair/lpSupply*lpStaked*ePrice);
    }
    if(elementID == "ATM-BNB LP"){
      //vaultbalance
      const lpStaked = await atm.methods.balanceOf(mchefAddr).call();
      const lpSupply = await latm.methods.totalSupply().call();
      const wbnbInPair = await wbnbC.methods.balanceOf(lpAddress).call() * 2;
      apy += 7500000000000000000000000/45.5*1*100/(wbnbInPair/lpSupply*lpStaked*ePrice);
    }
    if(elementID == "ALPA-BNB LP"){
      //vaultbalance
      const lpStaked = await alpaca.methods.balanceOf(mchefAddr).call();
      const lpSupply = await lalpaca.methods.totalSupply().call();
      const wbnbInPair = await wbnbC.methods.balanceOf(lpAddress).call() * 2;
      apy += 7500000000000000000000000/45.5*3*100/(wbnbInPair/lpSupply*lpStaked*ePrice);
    }
    if(elementID == "JUV-BNB LP"){
      //vaultbalance
      const lpStaked = await juv.methods.balanceOf(mchefAddr).call();
      const lpSupply = await ljuv.methods.totalSupply().call();
      const wbnbInPair = await wbnbC.methods.balanceOf(lpAddress).call() * 2;
      apy += 7500000000000000000000000/45.5*1*100/(wbnbInPair/lpSupply*lpStaked*ePrice);
    }
    if(elementID == "OG-BNB LP"){
      //vaultbalance
      const lpStaked = await og.methods.balanceOf(mchefAddr).call();
      const lpSupply = await log.methods.totalSupply().call();
      const wbnbInPair = await wbnbC.methods.balanceOf(lpAddress).call() * 2;
      apy += 7500000000000000000000000/45.5*1*100/(wbnbInPair/lpSupply*lpStaked*ePrice);
    }
    if(elementID == "ASR-BNB LP"){
      //vaultbalance
      const lpStaked = await asr.methods.balanceOf(mchefAddr).call();
      const lpSupply = await lasr.methods.totalSupply().call();
      const wbnbInPair = await wbnbC.methods.balanceOf(lpAddress).call() * 2;
      apy += 7500000000000000000000000/45.5*1*100/(wbnbInPair/lpSupply*lpStaked*ePrice);
    }
    if(elementID=="BMXX-BNB LP"){
      const lpStaked = await bmxx.methods.balanceOf(mchefAddr).call();
      const lpSupply = await lbmxx.methods.totalSupply().call();
      const wbnbInPair = await wbnbC.methods.balanceOf(lpAddress).call() * 2;
      apy += 7500000000000000000000000/45.5*0.5*100/(wbnbInPair/lpSupply*lpStaked*ePrice);
    }

    if(elementID=="ELE-BNB LP"){
      const lpStaked = await lele.methods.balanceOf(mchefAddr).call();
      const lpSupply = await lele.methods.totalSupply().call();
      const eleInPair = await ele.methods.balanceOf(lpAddress).call() * 2;
      apy += 7500000000000000000000000/45.5*30*100/eleInPair;
    }
    if(elementID=="BETH-ETH LP"){
      const zwbnbInEthLP = await wbnbC.methods.balanceOf("0x70D8929d04b60Af4fb9B58713eBcf18765aDE422").call();
      const zethInEthLP = await ethC.methods.balanceOf("0x70D8929d04b60Af4fb9B58713eBcf18765aDE422").call();
      const zbnbPerEth = zwbnbInEthLP/zethInEthLP;
      const zethInPair = await ethC.methods.balanceOf(lpAddress).call() * 2;
      const zbnbInPair = zethInPair * zbnbPerEth;

      const lpStaked = await beth.methods.balanceOf(mchefAddr).call();
      const lpSupply = await lbeth.methods.totalSupply().call();
      apy += 7500000000000000000000000/45.5*2*100/(zbnbInPair/lpSupply*lpStaked*ePrice);
    }

    if(elementID=="ELE"){
      //let sharesPerToken = await e11.methods.sharesPerToken();
      eleBalance = await e11.methods.balanceOf(mchefAddr).call();
      apy = apy + 7500000000000000000000000/45.5*5*100/eleBalance;
    }
    if (apy>1000000)
    document.getElementById(elementID).innerHTML = apy.commarize();
    else
    document.getElementById(elementID).innerHTML = apy.toFixed(2);

}*/


  const offsetImageStyle = {marginLeft: "-25%", zIndex: 0, background: '#ffffff'}
  return (
    <Grid container style={{paddingTop: '4px'}}>
      <Grid item xs={12}>
        <div className={classes.mainTitle}>{t('Farm-Main-Title')}</div>
        <h3 style={{color:'orange'}} className={classes.secondTitle}>{t('Farm-Second-Title')}</h3>
      </Grid>
      {/* <Grid item>
        <div>
          <TextField
            type="text"
            variant="outlined"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              classes:{
                root: classes.secondTitle
              }
            }}
            style={{
              backgroundColor: '#353848',
              marginBottom: '15px',
              borderRadius: '5px'
            }}
          />
        </div>
      </Grid> */}
      <Grid container item xs={12} justify={"center"}>
        {searchResults.map((pool, index) => {
          const {token, name, earnedToken, earnedTokenAddress, color, tokenDescription, token1, token2} = pool;

          // 根据名称是否含有LP判断是否是存 LPToken对
          const isLP = name.toLowerCase().indexOf('lp') > -1;

          const lpTokens = isLP ? token.split('/') : [];

          return (
            <Grid item sm={6} key={index}>
              <div style={{background: `rgba(${color},0.5)`}} className={classNames({
                [classes.flexColumnCenter]: true,
                [classes.farmItem]: true
              })} key={index}>
                {/*Logo处理*/}
                {isLP && lpTokens.length === 2 ? (
                  <div className={classes.logo}>
                    {lpTokens.map((item, index) => {
                      console.log(`../../../images/${item}-logo.svg`);
                      return (
                        <Avatar key={index}
                                src={require(`../../../images/${item}-logo.svg`)} className={classes.logoImage}
                                style={index > 0 ? offsetImageStyle : {}}
                        />
                      )
                    })}
                  </div>
                ) : <img src={require(`../../../images/${token}-logo.svg`)} className={classes.logoImage}/>}
                <div className={classes.weightFont} style={{marginTop: 10}}>{token}</div>

                <div style={{fontSize: 13}}>
                  {t('Farm-Stake')} {tokenDescription}
                </div>
                <div style={{fontSize: 13, marginTop: -5}}>{t('Farm-Earn')} {earnedToken}</div>

                <div className={classes.weightFont} style={{margin: 15}}>{token == "ELE-BNB LP"? "APR" : "APY"}: <span id={ pools[index]["name"] }>loading...</span> %</div>
                <div>{ token != "ELE-BNB LP"? "Vault APR/Day: ":"x60 weight" }<span id={ pools[index]["name"]+"d" }>{ token != "ELE-BNB LP"?"loading...":""}</span>{ token != "ELE-BNB LP"? "%":""}</div>
                <div>{ token != "ELE-BNB LP"?"ELE APR: ":"Deposit LP and get boosted rewards"}<span id={ pools[index]["name"]+"l" }>{ token != "ELE-BNB LP"?"loading...":""}</span>{ token != "ELE-BNB LP"? "%":""}</div>

                {/*操作菜单*/}
                <div className={classes.menu} style={isLP ? {} : {justifyContent: 'center'}}>
                  {isLP ? (
                    <>
                      <Button className={classes.menuButton}
                              href={`/#/farm/pool/${index + 1}`}
                              style={{background: `rgb(${color})`}}>
                        {t('Farm-Mining')}
                      </Button>
                      <Button
                        className={classes.menuButton}
                        href={`https://exchange.pancakeswap.finance/#/add/${token1}/${token2}`}
                        target={"_blank"}
                        style={{background: `rgb(${color})`}}>
                        {t('Farm-Get')} LP Token
                      </Button>
                    </>
                  ) : <Button
                    className={classes.menuButton}
                    href={`/#/farm/pool/${index + 1}`}
                    style={{background: `rgb(${color})`}}>{t('Farm-Mining')}</Button>}
                </div>
              </div>
            </Grid>
          )
        })}
      </Grid>
    </Grid>
  )
}
