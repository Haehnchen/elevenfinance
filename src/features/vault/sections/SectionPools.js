/* eslint-disable */
import React, { useState, useEffect, createContext } from 'react';
import { useTranslation } from 'react-i18next';
import BigNumber from "bignumber.js";
import {byDecimals,calculateReallyNum} from 'features/helpers/bignumber';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Accordion from '@material-ui/core/Accordion'
import classNames from "classnames";
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionActions'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import CustomOutlinedInput from 'components/CustomOutlinedInput/CustomOutlinedInput';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import {primaryColor} from "assets/jss/material-kit-pro-react.js";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import Avatar from '@material-ui/core/Avatar';
import CustomInput from "components/CustomInput/CustomInput.js";
import { erc20ABI, alpacamchef } from "../../configure";
// sections for this section
// import SectionOpenedPool from "./SectionOpenedPool";
import { useSnackbar } from 'notistack';
//  hooks
import { useConnectWallet } from '../../home/redux/hooks';
import { useFetchBalances, useFetchPoolBalances, useFetchApproval, useFetchDeposit, useFetchWithdraw, useFetchContractApy } from '../redux/hooks';
import CustomSlider from 'components/CustomSlider/CustomSlider';

import sectionPoolsStyle from "../jss/sections/sectionPoolsStyle";
import { reflect } from 'async';
import { inputLimitPass,inputFinalVal,isEmpty } from 'features/helpers/utils';

import loading from '../../../images/loading.gif';

import masterchefAbi from "./masterchefabi.json"
import async from 'async';

const useStyles = makeStyles(sectionPoolsStyle);

export default function SectionPools() {
  const { t, i18n } = useTranslation();
  const { web3, address, networkId } = useConnectWallet();
  let { pools, fetchPoolBalances } = useFetchPoolBalances();
  const { tokens, fetchBalances } = useFetchBalances();
  const [ openedCardList, setOpenCardList ] = useState([0]);
  const classes = useStyles();

  const { fetchApproval, fetchApprovalPending } = useFetchApproval();
  const { fetchDeposit, fetchDepositEth, fetchDepositPending } = useFetchDeposit();
  const { fetchWithdraw, fetchWithdrawEth, fetchWithdrawPending } = useFetchWithdraw();
  const { contractApy, fetchContractApy } = useFetchContractApy();

  const [ depositedBalance, setDepositedBalance ] = useState({});
  const [ withdrawAmount, setWithdrawAmount ] = useState({});

  const { enqueueSnackbar } = useSnackbar();

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


/*function commarize()
{
	// 1e6 = 1 Million, begin with number to word after 1e6.
	if (this >= 1e6)
	{
		var units = 
		[
			"Million",
			"Billion",
			"Trillion",
			"Quadrillion",
			"Quintillion",
			"Sextillion",
			"Octillion",
			"Nonillion",
			"Decillion",
			"Undecillion"
			// ... Put others here, you can look them up here:
			// http://bmanolov.free.fr/numbers_names.php
			// If you prefer to automate the set of numbers, look at the number vocabulary:
			// https://gist.github.com/MartinMuzatko/1b468b7596c71e83838c
			// Javascript allows plain numbers to a maximum of ~1.79e308
		]

		// Divide to get SI Unit engineering style numbers (1e3,1e6,1e9, etc)
                var unit = 0;
                if (this >= 1e21)
                    unit = Number.parseInt((this/1000).toFixed(0).toString().split("+")[1])-4
                else
		    unit = Math.floor((this / 1000).toFixed(0).toString().length)
		// Calculate the remainder. 1,000,000 = 1.000 Mill
		var num = (this / ('1e'+(unit+2))).toFixed(3)
		var unitname = units[Math.floor(unit / 3) - 1]
		// output number remainder + unitname
		return num + ' ' + unitname
	}
	// Split floating number
	var parts = this.toString().split(".")
	// Only manipulate first part (not the float number)
	// If you prefer europe style numbers, you can replace . with ,
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
	return parts.join(".")
}*/


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

  const changeDetailInputValue = (type,index,total,tokenDecimals,event) => {
    let value = event.target.value;
    if(!inputLimitPass(value,tokenDecimals)){
      return;
    }
    let sliderNum = 0;
    let inputVal = Number(value.replace(',',''));
    if(value){
        sliderNum = byDecimals(inputVal/total,0).toFormat(2) * 100;
    }
    switch(type){
        case 'depositedBalance':
            setDepositedBalance({
                ...depositedBalance,
                [index]: inputFinalVal(value,total,tokenDecimals),
                [`slider-${index}`]: sliderNum,
            });
            break;
        case 'withdrawAmount':
            setWithdrawAmount({
                ...withdrawAmount,
                [index]: inputFinalVal(value,total,tokenDecimals),
                [`slider-${index}`]: sliderNum,
            });
            break;
        default:
            break;
    }
  }

  const handleDepositedBalance = (index,total,event,sliderNum) => {
    setDepositedBalance({
      ...depositedBalance,
      [index]: sliderNum == 0 ? '0': calculateReallyNum(total,sliderNum),
      [`slider-${index}`]: sliderNum == 0 ? 0: sliderNum,
    });
  }

  const handleWithdrawAmount = (index,total,event,sliderNum) => {
    setWithdrawAmount({
      ...withdrawAmount,
      [index]: sliderNum == 0 ? '0': calculateReallyNum(total,sliderNum),
      [`slider-${index}`]: sliderNum == 0 ? 0: sliderNum,
    });
  };

  const onApproval = (pool, index, event) => {
    event.stopPropagation();
    fetchApproval({
      address,
      web3,
      tokenAddress: pool.tokenAddress,
      contractAddress: pool.earnContractAddress,
      index
    }).then(
      () => enqueueSnackbar(`Approval success`, {variant: 'success'})
    ).catch(
      error => enqueueSnackbar(`Approval error: ${error}`, {variant: 'error'})
    )
  }

  const onDeposit = (pool, index, isAll, balanceSingle, event) => {
    event.stopPropagation();
    if (isAll) {
      setDepositedBalance({
        ...depositedBalance,
        [index]: String(forMat(balanceSingle)),
        [`slider-${index}`]: 100,
      })
    }
    let amountValue =  depositedBalance[index]? depositedBalance[index].replace(',',''): depositedBalance[index];
    if(amountValue == undefined){
      amountValue = '0';
    }
    if (!pool.tokenAddress) {// 如果是eth
      fetchDepositEth({
        address,
        web3,
        amount: new BigNumber(amountValue).multipliedBy(new BigNumber(10).exponentiatedBy(pool.tokenDecimals)).toString(10),
        contractAddress: pool.earnContractAddress,
        index
      }).then(
        () => enqueueSnackbar(`Deposit success`, {variant: 'success'})
      ).catch(
        error => enqueueSnackbar(`Deposit error: ${error}`, {variant: 'error'})
      )
    } else {
      fetchDeposit({
        address,
        web3,
        isAll,
        amount: new BigNumber(amountValue).multipliedBy(new BigNumber(10).exponentiatedBy(pool.tokenDecimals)).toString(10),
        contractAddress: pool.earnContractAddress,
        index
      }).then(
        () => enqueueSnackbar(`Deposit success`, {variant: 'success'})
      ).catch(
        error => enqueueSnackbar(`Deposit error: ${error}`, {variant: 'error'})
      )
    }
  }

  const onWithdraw = (pool, index, isAll, singleDepositedBalance, event) => {
    event.stopPropagation();
    if (isAll) {
      setWithdrawAmount({
        ...withdrawAmount,
        [index]: String(forMat(singleDepositedBalance)),
        [`slider-${index}`]: 100,
      })
    }
    let amountValue =  withdrawAmount[index]? withdrawAmount[index].replace(',',''): withdrawAmount[index];
    if(amountValue == undefined){
      amountValue = '0';
    }
    if (!pool.tokenAddress) {// 如果是eth
      fetchWithdrawEth({
        address,
        web3,
        isAll,
        amount: new BigNumber(amountValue).multipliedBy(new BigNumber(10).exponentiatedBy(pool.itokenDecimals)).toString(10),
        contractAddress: pool.earnContractAddress,
        index
      }).then(
        () => enqueueSnackbar(`Withdraw success`, {variant: 'success'})
      ).catch(
        error => enqueueSnackbar(`Withdraw error: ${error}`, {variant: 'error'})
      )
    } else {
      fetchWithdraw({
        address,
        web3,
        isAll,
        amount: new BigNumber(amountValue).multipliedBy(new BigNumber(10).exponentiatedBy(pool.itokenDecimals)).toString(10),
        contractAddress: pool.earnContractAddress,
        index
      }).then(
        () => enqueueSnackbar(`Withdraw success`, {variant: 'success'})
      ).catch(
        error => enqueueSnackbar(`Withdraw error: ${error}`, {variant: 'error'})
      )
    }
    
  }

  const openCard = id => {
    return setOpenCardList(
      openedCardList => {
        if(openedCardList.includes(id)) {
          return openedCardList.filter(item => item!==id)
        } else {
          return [...openedCardList, id]
        }
      }
    )
  } 

  useEffect(() => {
    if (address && web3) {
      const cakelp = "0xa527a61703d82139f8a06bc30097cc9caa2df5a6";
      const contract = new web3.eth.Contract(masterchefAbi, "0x73feaa1ee314f8c655e354234017be2193c9e24e");
      const alpacamchefcontract = new web3.eth.Contract(alpacamchef, "0xA625AB01B08ce023B2a342Dbb12a16f2C8489A8F");
      const wbnbContract = new web3.eth.Contract(erc20ABI, "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c");
      const ethContract = new web3.eth.Contract(erc20ABI, "0x2170Ed0880ac9A755fd29B2688956BD959F933F8");
      const cakeContract = new web3.eth.Contract(erc20ABI, "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82");
      const alpacaContract = new web3.eth.Contract(erc20ABI, "0x8F0528cE5eF7B51152A59745bEfDD91D97091d2F");
      fetchBalances({address, web3, tokens});
      fetchPoolBalances({address, web3, pools});
      getEverythingDone(cakeContract, wbnbContract, cakelp, contract, ethContract, alpacaContract, alpacamchefcontract);
      const id = setInterval(() => {
        fetchBalances({address, web3, tokens});
        fetchPoolBalances({address, web3, pools});
      }, 10000);
      return () => clearInterval(id);
    }
  }, [address, web3, fetchBalances, fetchPoolBalances]);

  const isMoreDepostLimit = (value,depostLimit) => {
    if(isEmpty(value) ||  depostLimit==0 || value < depostLimit){
      return false
    }
    return true;
  }

  const getEverythingDone = async (cakeC, wbnbC, cakeL, mchefCake, ethContract, alpacaContract, alpacamchecmchef) => {
      const cakeInCakeLP = await cakeC.methods.balanceOf(cakeL).call();
      const wbnbInCakeLP = await wbnbC.methods.balanceOf(cakeL).call();
      const cakePrice = cakeInCakeLP/wbnbInCakeLP;
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 70, "0x99d865ed50d2c32c1493896810fa386c1ce81d91", "betheth", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 42, "0x9c4f6a5050cf863e67a402e8b377973b4e3372c1", "psgbnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 48, "0xd5b3ebf1a85d32c73a82b40f75e1cd929caf4029", "atmbnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 43, "0x51a2ffa5b7de506f9a22549e48b33f6cf0d9030e", "juvbnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 46, "0x64373608f2e93ea97ad4d8ca2cce6b2575db2f55", "ogbnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 47, "0xd6b900d5308356317299dafe303e661271aa12f1", "asrbnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 79, "0x9d8b7e4a9D53654D82F12c83448D8f92732bC761", "bopenbnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 82, "0x4D5aA94Ce6BbB1BC4eb73207a5a5d4D052cFcD67", "bmxxbnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 77, "0x9e642d174B14fAEa31D842Dc83037c42b53236E6", "dodobnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 76, "0x4576C456AF93a37a096235e5d83f812AC9aeD027", "swingbybnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 75, "0x5E3CD27F36932Bc0314aC4e2510585798C34a2fC", "brybnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 74, "0xB5Ab3996808c7e489DCDc0f1Af2AB212ae0059aF", "zeebnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 73, "0xC1800c29CF91954357cd0bf3f0accAADa3D0109c", "swgbbnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 84, "0xdC6C130299E53ACD2CC2D291fa10552CA2198a6b", "watchbnb", ethContract);
      getAPYPool(alpacaContract, wbnbC, cakeL, alpacamchecmchef, 999, "0xF3CE6Aac24980E6B657926dfC79502Ae414d3083", "alpacabnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 71, "0xcBe2cF3bd012e9C1ADE2Ee4d41DB3DaC763e78F3", "sfpbnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 68, "0x60bB03D1010b99CEAdD0dd209b64bC8bd83da161", "litbnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 67, "0x66b9E1eAc8a81F3752F7f3A5E95dE460688A17Ee", "hgetbnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 66, "0x74690f829fec83ea424ee1F1654041b2491A7bE9", "bdobnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 65, "0x3Ef4952C7a9AfbE374EA02d1Bf5eD5a0015b7716", "egldbnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 58, "0xFfb9E2d5ce4378F1a89b29bf53F80804CC078102", "wsotebnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 57, "0x36b7D2e5C7877392Fb17f9219efaD56F3D794700", "frontbnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 56, "0x6411310C07d8c48730172146Fd6F31FA84034a8b", "helmetbnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 55, "0x91589786D36fEe5B27A5539CfE638a5fc9834665", "btcstbnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 54, "0xBc765Fd113c5bDB2ebc25F711191B56bB8690aec", "ltcbnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 51, "0x20781bc3701C5309ac75291f5D09BdC23D7b7Fa8", "bscxbnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 50, "0x01ecc44Ddd2D104F44D2AA1A2bD9DFbC91aE8275", "tenbnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 49, "0xbe14f3a89A4F7f279Af9d99554cf12E8C29dB921", "balbtbnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 45, "0x58B58cab6C5cF158f63A2390b817710826d116D0", "reefbnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 44, "0x470BC451810B312BBb1256f96B0895D95eA659B1", "dittobnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 40, "0xC743Dc05F03D25E1aF8eC5F8228f4BD25513c8d0", "blkbnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 39, "0xbEA35584b9a88107102ABEf0BDeE2c4FaE5D8c31", "unfibnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 37, "0x9F40e8a2Fcaa267A0c374B6c661E0b372264cC3D", "hardbnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 32, "0x7793870484647a7278907498ec504879d6971EAb", "ctkbnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 30, "0x752E713fB70E3FA1Ac08bCF34485F14A986956c4", "sxpbnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 27, "0x7a34bd64d18e44CfdE3ef4B81b87BAf3EB3315B6", "injbnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 26, "0x35FE9787F0eBF2a200BAc413D3030CF62D312774", "filbnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 24, "0x68Ff2ca47D27db5Ac0b5c46587645835dD51D3C1", "yfibnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 25, "0x4269e7F43A63CEA1aD7707Be565a94a9189967E9", "unibnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 23, "0x54EdD846dB17f43b6e43296134ECD96284671E81", "bchbnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 22, "0x5acaC332F0F49c8bAdC7aFd0134aD19D3DB972e6", "xtzbnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 20, "0x574a978c2D0d36D707a05E459466C7A1054F1210", "yfiibnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 19, "0x2333c77FC0B2875c11409cdCD3C75D42D402E834", "atombnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 18, "0xC7b4B32A3be2cB6572a1c9959401F832Ce47a6d2", "xrpbnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 16, "0x4e0f3385d932F7179DeE045369286FFa6B03d887", "alphabnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 15, "0x7561EEe90e24F3b348E1087A005F78B4c8453524", "btcbnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 14, "0x70D8929d04b60Af4fb9B58713eBcf18765aDE422", "ethbnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 13, "0x41182c32F854dd97bA0e0B1816022e0aCB2fc0bb", "xvsbnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 12, "0x610e7a287c27dfFcaC0F0a94f547Cc1B770cF483", "twtbnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 7, "0xaeBE45E3a03B734c68e5557AE04BFC76917B4686", "linkbnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 6, "0x981d2Ba1b298888408d342C39c2Ab92e8991691e", "eosbnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 5, "0xbCD62661A6b1DEd703585d3aF7d7649Ef4dcDB5c", "dotbnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 4, "0xc639187ef82271D8f517de6FEAE4FaF5b517533c", "bandbnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 3, "0xBA51D1AB95756ca4eaB8737eCD450cd8F05384cF", "adabnb", ethContract);
      getAPYPool(cakePrice, wbnbC, cakeL, mchefCake, 2, "0x1B96B92314C44b159149f7E0303511fB2Fc4774f", "busdbnb", ethContract);
      getAPYWault();
      getE11APY();
      let tvl = 0;
      tvl += await gettvlbnbpair("0xBA51D1AB95756ca4eaB8737eCD450cd8F05384cF", "0xcDEe7B6b1B9817eBd02aa8101a6E7b78F1B549c9", wbnbC);
      tvl += await gettvlbnbpair("0xF3CE6Aac24980E6B657926dfC79502Ae414d3083", "0x0A33E8e887850Ad53739A0CeF110283b74E02f3e", wbnbC);
      tvl += await gettvlbnbpair("0x4e0f3385d932F7179DeE045369286FFa6B03d887", "0x732404e4D3888B289Ee1665c45f2bf871562B270", wbnbC);
      tvl += await gettvlbnbpair("0xd6b900d5308356317299dafe303e661271aa12f1", "0x1716d66943b0833f26a938d0a75aefac708bd98b", wbnbC);
      tvl += await gettvlbnbpair("0xd5B3ebF1a85D32C73A82B40F75e1cd929cAf4029", "0xd527f4145c84a57e38278485658829040e7e87b7", wbnbC);
      tvl += await gettvlbnbpair("0x2333c77FC0B2875c11409cdCD3C75D42D402E834", "0xC225bf0De350704D18C38450abFBe5ac131Ff6A7", wbnbC);
      tvl += await gettvlbnbpair("0xbe14f3a89A4F7f279Af9d99554cf12E8C29dB921", "0xb18A859F3b5A4b053800e595D855CBB5f5da5EFE", wbnbC);
      tvl += await gettvlbnbpair("0xc639187ef82271D8f517de6FEAE4FaF5b517533c", "0xa6e0f45F80Ca72271343145a9E33b0A4630380d4", wbnbC);
      tvl += await gettvlbnbpair("0x54EdD846dB17f43b6e43296134ECD96284671E81", "0x22d16D31efe717715831cB628D86E0CCdEBbaF91", wbnbC);
      tvl += await gettvlbnbpair("0x74690f829fec83ea424ee1F1654041b2491A7bE9", "0xb1049508617924134d452b4b0ec38980D3f25fB2", wbnbC);
      tvl += await gettvlbnbpair("0xC743Dc05F03D25E1aF8eC5F8228f4BD25513c8d0", "0x689D35ec441F3EDc125Eb53Fec1eaC755f397B76", wbnbC);
      tvl += await gettvlbnbpair("0x4D5aA94Ce6BbB1BC4eb73207a5a5d4D052cFcD67", "0xda88bD84e752960f8fDe52CC2E9e6B19ae0D6e7C", wbnbC);
      tvl += await gettvlbnbpair("0x9d8b7e4a9D53654D82F12c83448D8f92732bC761", "0xE8e64d86CFdAFC25Ccee1681Dab127aE8C37CC4b", wbnbC);
      tvl += await gettvlbnbpair("0x5E3CD27F36932Bc0314aC4e2510585798C34a2fC", "0x07EAcFE846130F78A16f93e1DA8625953080c0d0", wbnbC);
      tvl += await gettvlbnbpair("0x20781bc3701C5309ac75291f5D09BdC23D7b7Fa8", "0xDBF8B3a860a890c452809eb4e99F23335b81ab7B", wbnbC);
      tvl += await gettvlbnbpair("0x7561EEe90e24F3b348E1087A005F78B4c8453524", "0x345657786b32Bf4ac715Ead5ae5C3c08C099FBC9", wbnbC);
      tvl += await gettvlbnbpair("0x91589786D36fEe5B27A5539CfE638a5fc9834665", "0x83b5d185cb2Bd62025D4c55F1bAFA7b9B6785abb", wbnbC);
      tvl += await gettvlbnbpair("0x1B96B92314C44b159149f7E0303511fB2Fc4774f", "0x7Ed3a3bb1Ca62FAAfB08EAdD00d57969485cf6D4", wbnbC);
      tvl += await gettvlbnbpair("0x7793870484647a7278907498ec504879d6971EAb", "0x01d0571F47a79782Db6B0C33c024aEDCB91FEC2C", wbnbC);
      tvl += await gettvlbnbpair("0x470BC451810B312BBb1256f96B0895D95eA659B1", "0xC272241ae3900f795109D506faaEd1047ADbe35E", wbnbC);
      tvl += await gettvlbnbpair("0x9e642d174B14fAEa31D842Dc83037c42b53236E6", "0x9fe4C02ba78cDE545F8c55775BbcC54324e37A9F", wbnbC);
      tvl += await gettvlbnbpair("0xbCD62661A6b1DEd703585d3aF7d7649Ef4dcDB5c", "0x8066fd579b3DcD5e47C9B6915540d5271cc854b5", wbnbC);
      tvl += await gettvlbnbpair("0x3Ef4952C7a9AfbE374EA02d1Bf5eD5a0015b7716", "0x0C0116026103B88aDf611DAfD5301c669776eD48", wbnbC);
      tvl += await gettvlbnbpair("0x981d2Ba1b298888408d342C39c2Ab92e8991691e", "0xAcD820Ec2d105Ba75862202cCd93B932E2F2B88a", wbnbC);
      tvl += await gettvlbnbpair("0x70D8929d04b60Af4fb9B58713eBcf18765aDE422", "0x4585F275e1D5E534528060d7cDCc544E26CfE68B", wbnbC);
      tvl += await gettvlbnbpair("0x35FE9787F0eBF2a200BAc413D3030CF62D312774", "0xd0ff54ce0eA735d010b25eF55f354F0bb7D646Ba", wbnbC);
      tvl += await gettvlbnbpair("0x36b7D2e5C7877392Fb17f9219efaD56F3D794700", "0x928C1937B9178F175551b72e4e43ae08E3c7E9eC", wbnbC);
      tvl += await gettvlbnbpair("0x9F40e8a2Fcaa267A0c374B6c661E0b372264cC3D", "0x0144eeDa9f067592A444eDCC71fE438131f32dBB", wbnbC);
      tvl += await gettvlbnbpair("0x6411310C07d8c48730172146Fd6F31FA84034a8b", "0xC736a70E9d083BA610909A71B1995547e1f1bD1A", wbnbC);
      tvl += await gettvlbnbpair("0x66b9E1eAc8a81F3752F7f3A5E95dE460688A17Ee", "0xB76F6eF15e4EF27e5766573Dcbab684b099CBdE9", wbnbC);
      tvl += await gettvlbnbpair("0x574a978c2D0d36D707a05E459466C7A1054F1210", "0xd39832249075319D8476192fda0344f6bFA19132", wbnbC);
      tvl += await gettvlbnbpair("0x7a34bd64d18e44CfdE3ef4B81b87BAf3EB3315B6", "0x857d733f702eC996C108059027E5385abcb788A0", wbnbC);
      tvl += await gettvlbnbpair("0x51a2ffa5b7de506f9a22549e48b33f6cf0d9030e", "0x2f01ac6cdec485d07d4be8998bc4c16f540b914c", wbnbC);
      tvl += await gettvlbnbpair("0xaeBE45E3a03B734c68e5557AE04BFC76917B4686", "0xCB73C1866508debAda74F1Ac2798334ab0Db8A9d", wbnbC);
      tvl += await gettvlbnbpair("0x60bB03D1010b99CEAdD0dd209b64bC8bd83da161", "0x1F4FCAc27BB56b9D58F436f8f39a92973ae4C343", wbnbC);
      tvl += await gettvlbnbpair("0xBc765Fd113c5bDB2ebc25F711191B56bB8690aec", "0x59DA97Caed37a56Be45c96348E9BdDBe8eCE4fAc", wbnbC);
      tvl += await gettvlbnbpair("0x64373608f2e93ea97ad4d8ca2cce6b2575db2f55", "0xd2e399e7768fc713c9ecf0c8e8988dd056c8dbd7", wbnbC);
      tvl += await gettvlbnbpair("0x9c4f6a5050cf863e67a402e8b377973b4e3372c1", "0x250b9021018132a52c1be46d9f1ae53997c3f8a8", wbnbC);
      tvl += await gettvlbnbpair("0x58B58cab6C5cF158f63A2390b817710826d116D0", "0xd7B75DAE1794649b9ea59E67C50c83D1c3F0aFD6", wbnbC);
      tvl += await gettvlbnbpair("0xcBe2cF3bd012e9C1ADE2Ee4d41DB3DaC763e78F3", "0x8cfd13f45c397BD58e6de469286ebb4FB939Fd2E", wbnbC);
      tvl += await gettvlbnbpair("0xC1800c29CF91954357cd0bf3f0accAADa3D0109c", "0xd56F8c5E5a47fC010a3E86ba57D87B0DCfA5AAe5", wbnbC);
      tvl += await gettvlbnbpair("0x4576C456AF93a37a096235e5d83f812AC9aeD027", "0x991Ece2D170cC4Fb3876e737c37B0e7a0CF0b827", wbnbC);
      tvl += await gettvlbnbpair("0x752E713fB70E3FA1Ac08bCF34485F14A986956c4", "0x7E93C334A215A11A4c80136C914Bb641E6dddE62", wbnbC);
      tvl += await gettvlbnbpair("0x01ecc44Ddd2D104F44D2AA1A2bD9DFbC91aE8275", "0x95576e89a2097A2F3EC585E582B24d9Fa150868b", wbnbC);
      tvl += await gettvlbnbpair("0x610e7a287c27dfFcaC0F0a94f547Cc1B770cF483", "0x7913D9b83bfB2E948aC78F15628EC5aF12927c98", wbnbC);
      tvl += await gettvlbnbpair("0xbEA35584b9a88107102ABEf0BDeE2c4FaE5D8c31", "0x456602BEA1a8644A8f4e34974Be8f5C828bE9580", wbnbC);
      tvl += await gettvlbnbpair("0x4269e7F43A63CEA1aD7707Be565a94a9189967E9", "0x487c000daF32c547eE9413831176D4D545744250", wbnbC);
      tvl += await gettvlbnbpair("0xdC6C130299E53ACD2CC2D291fa10552CA2198a6b", "0x3d7c095a6559df3fd185778ac1687ece650670a5", wbnbC);
      tvl += await gettvlbnbpair("0x1f280a4fa78f5805bac193dddafeb77b16da4614", "0x527636db487dcf972f09a7149cf4686ff8fc32dc", wbnbC);
      tvl += await gettvlbnbpair("0xFfb9E2d5ce4378F1a89b29bf53F80804CC078102", "0x297c7816b70a0be4Ff7687aC381807f2e5Bb19A8", wbnbC);
      tvl += await gettvlbnbpair("0xC7b4B32A3be2cB6572a1c9959401F832Ce47a6d2", "0xF3Ba7c535F9FeA2B95ce636258E2c5419c89c682", wbnbC);
      tvl += await gettvlbnbpair("0x5acaC332F0F49c8bAdC7aFd0134aD19D3DB972e6", "0x3fdcAFc80bE708eD520425EfBAb65f333E1d7703", wbnbC);
      tvl += await gettvlbnbpair("0x41182c32F854dd97bA0e0B1816022e0aCB2fc0bb", "0x31697b615dFEf36A415260996d234a8a8C1f74C4", wbnbC);
      tvl += await gettvlbnbpair("0x68Ff2ca47D27db5Ac0b5c46587645835dD51D3C1", "0x8D212b23948b4b1160d7eD157743c16f6500D089", wbnbC);
      tvl += await gettvlbnbpair("0xB5Ab3996808c7e489DCDc0f1Af2AB212ae0059aF", "0x06bdC7D6d0a2Ef45bC8b83F458407FE961596014", wbnbC);
      tvl += await gettvlethpair("0x99d865ed50d2c32c1493896810fa386c1ce81d91", "0xc11bee3b3ff05c59acc074fa02aea53a49aa96f1", wbnbC, ethContract);
      tvl += await gettvlpresalestrat(wbnbC);
      tvl = await bnbtousd(tvl, wbnbC);
      document.getElementById("tvl").innerHTML = tvl.toFixed(2) + " $";
  }

  const gettvlbnbpair = async (lpAddress, vaultAddress, wbnbC) => {
      const vaultContract = new web3.eth.Contract([{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"implementation","type":"address"}],"name":"NewStratCandidate","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"implementation","type":"address"}],"name":"UpgradeStrat","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"approvalDelay","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"available","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"balance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_time","type":"uint256"}],"name":"changeApprovalDelay","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"depositAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"earn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"firstTimeStrategy","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPricePerFullShare","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_implementation","type":"address"}],"name":"proposeStrat","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_strat","type":"address"}],"name":"setStrategy","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"stratCandidate","outputs":[{"internalType":"address","name":"implementation","type":"address"},{"internalType":"uint256","name":"proposedTime","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"strategy","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"upgradeStrat","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_shares","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawAll","outputs":[],"stateMutability":"nonpayable","type":"function"}],vaultAddress);
      const lpContract = new web3.eth.Contract(erc20ABI, lpAddress);
      const tokensPerShare = await vaultContract.methods.getPricePerFullShare().call() / 1e18;
      const totalShares = await vaultContract.methods.totalSupply().call();
      const totallp = totalShares * tokensPerShare;
      const totallpsupply = await lpContract.methods.totalSupply().call();
      const bnbInPair = await wbnbC.methods.balanceOf(lpAddress).call() * 2;
      return bnbInPair/totallpsupply*totallp;
  }


  const gettvlethpair = async (lpAddress, vaultAddress, wbnbC, ethC) => {
      const wbnbInEthLP = await wbnbC.methods.balanceOf("0x70D8929d04b60Af4fb9B58713eBcf18765aDE422").call();
      const ethInEthLP = await ethC.methods.balanceOf("0x70D8929d04b60Af4fb9B58713eBcf18765aDE422").call();
      const bnbPerEth = wbnbInEthLP/ethInEthLP;
      const ethInPair = await ethC.methods.balanceOf(lpAddress).call() * 2;
      const bnbInPair = ethInPair * bnbPerEth;
      const vaultContract = new web3.eth.Contract([{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"implementation","type":"address"}],"name":"NewStratCandidate","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"implementation","type":"address"}],"name":"UpgradeStrat","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"approvalDelay","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"available","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"balance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_time","type":"uint256"}],"name":"changeApprovalDelay","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"depositAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"earn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"firstTimeStrategy","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPricePerFullShare","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_implementation","type":"address"}],"name":"proposeStrat","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_strat","type":"address"}],"name":"setStrategy","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"stratCandidate","outputs":[{"internalType":"address","name":"implementation","type":"address"},{"internalType":"uint256","name":"proposedTime","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"strategy","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"upgradeStrat","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_shares","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawAll","outputs":[],"stateMutability":"nonpayable","type":"function"}],vaultAddress);
      const lpContract = new web3.eth.Contract(erc20ABI, lpAddress);
      const tokensPerShare = await vaultContract.methods.getPricePerFullShare().call() / 1e18;
      const totalShares = await vaultContract.methods.totalSupply().call();
      const totallp = totalShares * tokensPerShare;
      const totallpsupply = await lpContract.methods.totalSupply().call();
      return bnbInPair/totallpsupply*totallp;
  }

  const gettvlpresalestrat = async (wbnbC) => {
      const stratABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"harvester","type":"address"}],"name":"StratHarvest","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"inputs":[],"name":"BURN_FEE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"CALL_FEE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_FEE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"REWARDS_FEE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TREASURY_FEE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"WITHDRAWAL_FEE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"WITHDRAWAL_MAX","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"balanceOfLpPair","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"balanceOfPool","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"cake","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"cakeToLp0Route","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"cakeToLp1Route","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"cakeToWbnbRoute","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"eleven","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"harvest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"lpPair","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lpToken0","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lpToken1","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"masterchef","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"panic","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"poolId","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"retireStrat","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"rewards","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"treasury","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"unirouter","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vault","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"wbnb","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"wbnbToElevenRoute","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]
      const stratcontract = new web3.eth.Contract(stratABI, "0x9a4adbb2807ab48065dbe37337424947019c58ae");
      const stratbalance = await stratcontract.methods.balanceOf().call();
      const lptoken = new web3.eth.Contract(erc20ABI, "0x4d5aa94ce6bbb1bc4eb73207a5a5d4d052cfcd67");
      const totalsupply = await lptoken.methods.totalSupply().call();
      const bnbInPair = await wbnbC.methods.balanceOf("0x4d5aa94ce6bbb1bc4eb73207a5a5d4d052cfcd67").call() * 2;
      return bnbInPair/totalsupply*stratbalance;
  }

  const bnbtousd = async (amount, wbnbC) => {
    const busdC = new web3.eth.Contract(erc20ABI, "0xe9e7cea3dedca5984780bafc599bd69add087d56");
    const usdInPair = await busdC.methods.balanceOf("0x1b96b92314c44b159149f7e0303511fb2fc4774f").call();
    const bnbInPair = await wbnbC.methods.balanceOf("0x1b96b92314c44b159149f7e0303511fb2fc4774f").call();
    const bnbprice = usdInPair/bnbInPair;
    return amount/1e18*bnbprice;
  }

  const getE11APY = async () => {
    const e11Abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"shareToTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"sharesPerToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"stake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"tokenToShares","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokensPerShare","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalElevenFunds","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"unstake","outputs":[],"stateMutability":"nonpayable","type":"function"}];
    const e11Contract = new web3.eth.Contract(e11Abi, "0x3ed531bfb3fad41111f6dab567b33c4db897f991");
    const tokensPerShare = await e11Contract.methods.tokensPerShare().call() / 1e12;
    const launchDate = 1614802515;
    const todaysDate = Date.now()/1000;
    const timeElapsed = todaysDate-launchDate;
    const percentEarned = (tokensPerShare - 1)*100;
    const percentPerYear = 31536000*percentEarned/timeElapsed;
    document.getElementById("ELEd").innerHTML = (percentPerYear/365).toFixed(2)+"%";
    document.getElementById("ELE").innerHTML = percentPerYear.toFixed(2);
  }

  const getAPYWault = async () => {
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
    const apy = ((1+(interest/365))**365)*100;
    document.getElementById("waultbnb").innerHTML = apy.commarize();
    document.getElementById("waultbnbd").innerHTML = (100*interest/365).toFixed(2)+"%";
    //farming = 0x6F7a2b868a3BABD26415Fd4E8e2Fee2630C9A74d
    //lp = 0x1f280a4fa78f5805bac193dddafeb77b16da4614
  }

  const getAPYPool = async (cakeP, wbnbC, cakeL, chefC, pid, lpAddress, elementID, ethC) => {
    //case alpaca
    if (elementID == "alpacabnb"){
      //cakeC = alpaca contract     contract = alpaca mchef
      const alpasInLp = await cakeP.methods.balanceOf(lpAddress).call();
      const bonusMultiplier = await chefC.methods.bonusMultiplier().call();
      const totalAllocPoints = await chefC.methods.totalAllocPoint().call();
      const poolAllocPoints = await chefC.methods.poolInfo(4).call();
      const alpacaPerBlock = await chefC.methods.alpacaPerBlock().call();
      const interest = alpacaPerBlock/totalAllocPoints*poolAllocPoints["allocPoint"]*bonusMultiplier*10512000/alpasInLp/2;
      const apy = ((1+(interest/365))**365)*100;
      document.getElementById(elementID).innerHTML = apy.commarize();
      document.getElementById(elementID+"d").innerHTML = (100*interest/365).toFixed(2)+"%";
    }else{
    const bonusMultiplier = await chefC.methods.BONUS_MULTIPLIER().call();
    const totalAllocPoints = await chefC.methods.totalAllocPoint().call();
    const cakePerBlock = 4e19;
    let bnbInPair = 0;
    //case eth beth
    if (elementID == "betheth"){
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
    const apy = (1+(cakesPerBlockPairDay/cakeInPair))**365*100-100;
    document.getElementById(elementID).innerHTML = apy.toFixed(2);
    document.getElementById(elementID+"d").innerHTML = (100*(cakesPerBlockPairDay/cakeInPair)).toFixed(2)+"%";

}
}

  useEffect(() => {
    fetchContractApy();
  }, [pools, fetchContractApy]);

  const forMat = number => {
    return new BigNumber(
      number
    ).multipliedBy(
      new BigNumber(1000000000000000)
    ).dividedToIntegerBy(
      new BigNumber(1)
    ).dividedBy(
      new BigNumber(1000000000000000)
    ).toNumber()
  }

  const isZh = Boolean((i18n.language == 'zh') || (i18n.language == 'zh-CN'));
  const gridItemStyle = {
    display: "flex",
    justifyContent : "space-around",
    alignItems : "center",
    alignContent: "space-around",
  }

  const random = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  return (
    <Grid container style={{paddingTop: '4px'}}>
      <Grid item xs={12}>
        <div className={classes.mainTitle}>{t('Vault-Main-Title')}</div>
        <h3 className={classes.secondTitle}>Total value locked: <span id="tvl"><img src={loading} width="70px" alt="loading" /></span></h3>
      </Grid>
      <Grid item>
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
      </Grid>
        {Boolean(networkId === Number(process.env.NETWORK_ID)) && searchResults.map((pool, index) => {
            let balanceSingle = byDecimals(tokens[pool.token].tokenBalance, pool.tokenDecimals);
            // balanceSingle = byDecimals(random(1, 1000000), 1)
            // balanceSingle = new BigNumber(random(1, 1000000000000000))
            let singleDepositedBalance = byDecimals(tokens[pool.earnedToken].tokenBalance, pool.itokenDecimals);
            // singleDepositedBalance = byDecimals(random(1, 1000000), 1)
            // singleDepositedBalance = new BigNumber(random(1, 1000))
            let depositedApy = contractApy[pool.id] || 0;
            // depositedApy = random(0, 1)
            // depositedApy =byDecimals(random(0, 100), 1)
            return (
                <Grid item xs={12} container key={index} style={{marginBottom: "24px"}} spacing={0}>
                    <div style={{width: "100%"}}>
                        <Accordion
                            expanded={Boolean(openedCardList.includes(index))}
                            className={classes.accordion}
                            TransitionProps={{ unmountOnExit: true }}
                        >
                        <AccordionSummary
                            className={classes.details}
                            style={{ justifyContent: "space-between"}}
                            onClick={(event) => {
                                event.stopPropagation();
                                openCard(index)
                            }}
                        >
                        <Grid container alignItems="center" justify="space-around" spacing={4} style={{paddingTop: "16px", paddingBottom: "16px"}}>
                            <Grid item>
                                <Grid container alignItems="center" spacing={2}>
                                    <Grid item>
                                        <Avatar 
                                            alt={pool.token}
                                            src={require(`../../../images/${pool.token}-logo.svg`)}
                                        />
                                    </Grid>
                                    <Grid item style={{minWidth: '100px'}}>
                                            <Typography className={classes.iconContainerMainTitle} variant="body2" gutterBottom>
                                                {pool.token}
                                                <Hidden smUp>
                                                    <i
                                                        style={{color:primaryColor[0],marginLeft:'4px',visibility:Boolean(isZh?pool.tokenDescriptionUrl2:pool.tokenDescriptionUrl)?"visible":"hidden"}}
                                                        className={"yfiiicon yfii-help-circle"} 
                                                        onClick={
                                                            event => {
                                                                event.stopPropagation();
                                                                window.open(isZh?pool.tokenDescriptionUrl2:pool.tokenDescriptionUrl)
                                                            }
                                                        }
                                                        />
                                                </Hidden>
                                            </Typography>
                                            
                                        <Typography className={classes.iconContainerSubTitle} variant="body2">{pool.uses}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item md={8} xs={3}>
                                <Grid item container justify="space-between">
                                    <Hidden smDown>
                                        <Grid item xs={7} container justify='center' alignItems="center">
                                            <Grid item style={{width: "200px"}}>
                                                <Typography className={classes.iconContainerMainTitle} variant="body2" gutterBottom noWrap>{pool.token == 'OG-BNB LP'  || pool.token == 'PSG-BNB LP'  || pool.token == 'JUV-BNB LP' || pool.token == 'ASR-BNB LP'  || pool.token == 'ATM-BNB LP' ? forMat(balanceSingle) : forMat(balanceSingle).toFixed(6)} { pool.token }</Typography>
                                                <Typography className={classes.iconContainerSubTitle} variant="body2">{t('Vault-Balance')}</Typography></Grid>
                                        </Grid>
                                    </Hidden>
                                    <Hidden mdDown>
                                        <Grid item xs={4} container justify='center' alignItems="center">
                                            <Grid item style={{width: "200px"}}>
                                                <Typography className={classes.iconContainerMainTitle} variant="body2" gutterBottom noWrap>{pool.token == 'OG-BNB LP' || pool.token == 'PSG-BNB LP' || pool.token == 'JUV-BNB LP'? forMat(singleDepositedBalance) : forMat(singleDepositedBalance).toFixed(6) } { pool.earnedToken }</Typography>
                                                <Typography className={classes.iconContainerSubTitle} variant="body2">{t('Vault-Deposited')}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Hidden>
                                    <Grid item xs={12} md={1} container justify='center' alignItems="center">
                                        <Grid item>
                                            <Typography className={classes.iconContainerMainTitle} variant="body2" gutterBottom noWrap> <span id={pool.id}>loading...</span> %</Typography>
                                            <Typography className={classes.iconContainerSubTitle} variant="body2">D: <span id ={pool.id+"d"}>...</span></Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item >
                                <Grid item container justify="flex-end" alignItems="center" spacing={2}>
                                    <Hidden mdDown>
                                        <Grid item>
                                        <IconButton
                                            classes={{
                                                root:classes.iconContainerSecond
                                            }}
                                            style={{visibility:Boolean(isZh?pool.tokenDescriptionUrl2:pool.tokenDescriptionUrl)?"visible":"hidden"}}
                                            // className={classes.iconContainerSecond}
                                            onClick={
                                                event => {
                                                    event.stopPropagation();
                                                    window.open(isZh?pool.tokenDescriptionUrl2:pool.tokenDescriptionUrl)
                                                }
                                            }
                                        >
                                            <i className={"yfiiicon yfii-help-circle"} />
                                        </IconButton>
                                        </Grid>
                                    </Hidden>
                                    <Grid item>
                                    <IconButton
                                        className={classes.iconContainerPrimary}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            openCard(index);  
                                        }}
                                    >
                                        {
                                            openedCardList.includes(index) ? <i className={"yfiiicon yfii-arrow-up"} /> : <i className={"yfiiicon yfii-arrow-down"} />
                                        }
                                    </IconButton>
                                    </Grid>
                                </Grid>
                            </Grid>
                      </Grid>
              </AccordionSummary>
              <AccordionDetails style={{ justifyContent: "space-between"}}>
                <Grid container style={{width: "100%", marginLeft: 0, marginRight: 0}}>
                  <Grid item xs={12} sm={6} className={classes.sliderDetailContainer}>
                    <div className={classes.showDetailRight}>
                          {t('Vault-Balance')}:{balanceSingle.toFormat(15)} { pool.token }
                    </div>
                    <FormControl fullWidth variant="outlined">
                        <CustomOutlinedInput 
                            value={depositedBalance[index]!=undefined ? depositedBalance[index] :'0'}
                            onChange={changeDetailInputValue.bind(this,'depositedBalance',index,balanceSingle.toNumber(),pool.tokenDecimals)}
                            />
                    </FormControl>
                    <CustomSlider 
                      classes={{
                        root: classes.depositedBalanceSliderRoot,
                        markLabel: classes.depositedBalanceSliderMarkLabel,
                      }}
                      aria-labelledby="continuous-slider" 
                      value={depositedBalance['slider-'+index]?depositedBalance['slider-'+index]:0}
                      onChange={handleDepositedBalance.bind(this,index,balanceSingle.toNumber())}
                    />
                    
                        <div>
                            {
                                pool.allowance === 0 ? (
                                    <div className={classes.showDetailButtonCon}>
                                        <Button 
                                            style={{
                                                backgroundColor:'#353848',
                                                color:'#C7971C',
                                                boxShadow:'0 2px 2px 0 rgba(53, 56, 72, 0.14), 0 3px 1px -2px rgba(53, 56, 72, 0.2), 0 1px 5px 0 rgba(53, 56, 72, 0.12)',
                                                fontWeight: "bold"
                                            }}
                                            color="primary"
                                            onClick={onApproval.bind(this, pool, index)}
                                            disabled={fetchApprovalPending[index] }
                                            >
                                            {fetchApprovalPending[index] ? `${t('Vault-ApproveING')}` : `${t('Vault-ApproveButton')}`}
                                        </Button>
                                    </div>
                                ) : (
                                    <div className={classes.showDetailButtonCon}>
                                        <Button 
                                            style={{
                                                width: '180px',
                                                margin: '12px 5px',
                                                fontSize: '14px',
                                                fontWeight:'bold',
                                                backgroundColor:'#353848',
                                                color:'#C7971C',
                                                boxShadow:'0 2px 2px 0 rgba(53, 56, 72, 0.14), 0 3px 1px -2px rgba(53, 56, 72, 0.2), 0 1px 5px 0 rgba(53, 56, 72, 0.12)'
                                            }}
                                            round
                                            onFocus={(event) => event.stopPropagation()}
                                            disabled={
                                                fetchDepositPending[index] || (new BigNumber(depositedBalance[index]).toNumber() > balanceSingle.toNumber() || isMoreDepostLimit(new BigNumber(depositedBalance[index]).toNumber(),pool.depostLimit) )
                                            }
                                            onClick={onDeposit.bind(this, pool, index, false, balanceSingle)}
                                            >{t('Vault-DepositButton')}
                                        </Button>
                                        {Boolean(pool.tokenAddress) && <Button 
                                            style={{
                                                width: '180px',
                                                margin: '12px 5px',
                                                fontSize: '14px',
                                                fontWeight:'bold',
                                                backgroundColor:'#353848',
                                                color:'#C7971C',
                                                boxShadow:'0 2px 2px 0 rgba(53, 56, 72, 0.14), 0 3px 1px -2px rgba(53, 56, 72, 0.2), 0 1px 5px 0 rgba(53, 56, 72, 0.12)'
                                            }}
                                            round
                                            onFocus={(event) => event.stopPropagation()}
                                            disabled={
                                                fetchDepositPending[index] || (new BigNumber(depositedBalance[index]).toNumber() > balanceSingle.toNumber() || isMoreDepostLimit(balanceSingle.toNumber(),pool.depostLimit) )
                                            }
                                            onClick={onDeposit.bind(this, pool, index, true, balanceSingle)}
                                            >{t('Vault-DepositButtonAll')}
                                        </Button>}
                                    </div>
                                )
                            }
                        </div>
                    </Grid>

                    <Grid item xs={12} sm={6} className={classes.sliderDetailContainer}>
                        <div className={classes.showDetailRight}>
                                {singleDepositedBalance.multipliedBy(new BigNumber(pool.pricePerFullShare)).toFormat(15)} { pool.token } ({singleDepositedBalance.toFormat(15)} { pool.earnedToken })
                            </div>
                        <FormControl fullWidth variant="outlined">
                            <CustomOutlinedInput 
                                value={withdrawAmount[index]!=undefined ? withdrawAmount[index] : '0'}
                                onChange={changeDetailInputValue.bind(this,'withdrawAmount',index,singleDepositedBalance.toNumber(),pool.itokenDecimals)}
                                />
                        </FormControl>
                        <CustomSlider 
                            classes={{
                                root: classes.drawSliderRoot,
                                markLabel: classes.drawSliderMarkLabel,
                            }}
                            aria-labelledby="continuous-slider" 
                            value={withdrawAmount['slider-'+index]?withdrawAmount['slider-'+index]:0}
                            onChange={handleWithdrawAmount.bind(this,index,singleDepositedBalance.toNumber())}
                            />
                        <div className={classes.showDetailButtonCon}>
                            <Button 
                                style={{
                                    width: '180px',
                                    margin: '12px 5px',
                                    fontSize: '14px',
                                    fontWeight:'bold',
                                    backgroundColor:'#353848',
                                    color:'#635AFF',
                                    boxShadow:'0 2px 2px 0 rgba(53, 56, 72, 0.14), 0 3px 1px -2px rgba(53, 56, 72, 0.2), 0 1px 5px 0 rgba(53, 56, 72, 0.12)'
                                }}
                                round
                                type="button"
                                color="primary"
                                disabled={fetchWithdrawPending[index]}
                                onClick={onWithdraw.bind(this, pool, index, false, singleDepositedBalance)}
                                >
                                {fetchWithdrawPending[index] ? `${t('Vault-WithdrawING')}`: `${t('Vault-WithdrawButton')}`}
                            </Button>
                            <Button 
                                style={{
                                    width: '180px',
                                    margin: '12px 5px',
                                    fontSize: '14px',
                                    fontWeight:'bold',
                                    backgroundColor:'#353848',
                                    color:'#635AFF',
                                    boxShadow:'0 2px 2px 0 rgba(53, 56, 72, 0.14), 0 3px 1px -2px rgba(53, 56, 72, 0.2), 0 1px 5px 0 rgba(53, 56, 72, 0.12)',
                                }}
                                round
                                type="button"
                                color="primary"
                                onClick={onWithdraw.bind(this, pool, index, true, singleDepositedBalance)}
                                >
                                {fetchWithdrawPending[index] ? `${t('Vault-WithdrawING')}`: `${t('Vault-WithdrawButtonAll')}`}
                            </Button>
                        </div>
                    </Grid>

                  </Grid>
              </AccordionDetails>
            </Accordion>
            </div>
            </Grid>
          )
        })}
      
    </Grid>
  )
}
