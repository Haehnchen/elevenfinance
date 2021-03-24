/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import BigNumber from "bignumber.js";
import { byDecimals, calculateReallyNum } from 'features/helpers/bignumber';
// @material-ui/core components
import { InputAdornment } from "@material-ui/core";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionActions'
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import CustomOutlinedInput from 'components/CustomOutlinedInput/CustomOutlinedInput';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import { primaryColor } from "assets/jss/material-kit-pro-react.js";
import { Search } from "@material-ui/icons"
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
// core components
import Button from "components/CustomButtons/Button.js";
import Avatar from '@material-ui/core/Avatar';
// sections for this section
// import SectionOpenedPool from "./SectionOpenedPool";
import { useSnackbar } from 'notistack';
//  hooks
import { useConnectWallet } from '../../home/redux/hooks';
import { useFetchBalances, useFetchPoolBalances, useFetchApproval, useFetchDeposit, useFetchWithdraw, useFetchContractApy } from '../redux/hooks';
import CustomSlider from 'components/CustomSlider/CustomSlider';

import sectionPoolsStyle from "../jss/sections/sectionPoolsStyle";
import { inputLimitPass, inputFinalVal, isEmpty } from 'features/helpers/utils';

import InputBase from '@material-ui/core/InputBase';

import loading from '../../../images/loading.gif';

import millify from 'millify';

import NumberFormat from 'react-number-format';

import _ from 'lodash';

const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: '14px',
    padding: '10px 26px 10px 12px',
  },
}))(InputBase);

const useStyles = makeStyles(sectionPoolsStyle);

export default function SectionPools() {
  const { t, i18n } = useTranslation();
  const { web3, address, networkId } = useConnectWallet();
  let { pools, fetchPoolBalances } = useFetchPoolBalances();
  const { tokens, fetchBalances } = useFetchBalances();
  const [openedCardList, setOpenCardList] = useState([0]);
  const classes = useStyles();

  const { fetchApproval, fetchApprovalPending } = useFetchApproval();
  const { fetchDeposit, fetchDepositEth, fetchDepositPending } = useFetchDeposit();
  const { fetchWithdraw, fetchWithdrawEth, fetchWithdrawPending } = useFetchWithdraw();
  const { fetchContractApy } = useFetchContractApy();

  const [depositedBalance, setDepositedBalance] = useState({});
  const [withdrawAmount, setWithdrawAmount] = useState({});

  const { enqueueSnackbar } = useSnackbar();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchChange = event => {
    setSortTerm("");
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const term = searchTerm.toLowerCase()
    const results = pools.filter(pool =>
      pool.token.toLowerCase().includes(term)
    );
    setSearchResults(results);
  }, [searchTerm]);

  const [data, setData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const response = await fetch("https://eleven.finance/api.json");
    const json = await response.json();

    const normalizedData = pools.map((pool) => {
      let token = pool.token;
      let vault = json[token]["vault"];
      let tvl = json[token]["tvl"];
      pool["vault"] = vault;
      pool["tvl"] = tvl;
      return pool;
    });

    normalizedData["totalvaluelocked"] = json["totalvaluelocked"]

    setData(normalizedData);
  }

  const [sortTerm, setSortTerm] = useState("");

  const handleSort = event => {
    setSearchTerm("");
    setSortTerm(event.target.value);
  }

  useEffect(() => {
    switch (sortTerm) {
      case "":
        setSearchResults(pools);
        break;
      case "apy":
        if (pools[0].vault !== undefined) {
          const orderedPools = _.orderBy(pools, 'vault.apy', 'desc');
          setSearchResults(orderedPools);
        }
        break;
      case "apd":
        if (pools[0].vault !== undefined) {
          const orderedPools = _.orderBy(pools, 'vault.aprd', 'desc');
          setSearchResults(orderedPools);
        }
        break;
      case "tvl":
        if (pools[0].vault !== undefined) {
          const orderedPools = _.orderBy(pools, 'tvl', 'desc');
          setSearchResults(orderedPools);
        }
        break;
      default:
        setSearchResults(pools);
    }
  }, [sortTerm])

  const changeDetailInputValue = (type, index, total, tokenDecimals, event) => {
    let value = event.target.value;
    if (!inputLimitPass(value, tokenDecimals)) {
      return;
    }
    let sliderNum = 0;
    let inputVal = Number(value.replace(',', ''));
    if (value) {
      sliderNum = byDecimals(inputVal / total, 0).toFormat(2) * 100;
    }
    switch (type) {
      case 'depositedBalance':
        setDepositedBalance({
          ...depositedBalance,
          [index]: inputFinalVal(value, total, tokenDecimals),
          [`slider-${index}`]: sliderNum,
        });
        break;
      case 'withdrawAmount':
        setWithdrawAmount({
          ...withdrawAmount,
          [index]: inputFinalVal(value, total, tokenDecimals),
          [`slider-${index}`]: sliderNum,
        });
        break;
      default:
        break;
    }
  }

  const handleDepositedBalance = (index, total, event, sliderNum) => {
    setDepositedBalance({
      ...depositedBalance,
      [index]: sliderNum == 0 ? '0' : calculateReallyNum(total, sliderNum),
      [`slider-${index}`]: sliderNum == 0 ? 0 : sliderNum,
    });
  }

  const handleWithdrawAmount = (index, total, event, sliderNum) => {
    setWithdrawAmount({
      ...withdrawAmount,
      [index]: sliderNum == 0 ? '0' : calculateReallyNum(total, sliderNum),
      [`slider-${index}`]: sliderNum == 0 ? 0 : sliderNum,
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
      () => enqueueSnackbar(`Approval success`, { variant: 'success' })
    ).catch(
      error => enqueueSnackbar(`Approval error: ${error}`, { variant: 'error' })
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
    let amountValue = depositedBalance[index] ? depositedBalance[index].replace(',', '') : depositedBalance[index];
    if (amountValue == undefined) {
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
        () => enqueueSnackbar(`Deposit success`, { variant: 'success' })
      ).catch(
        error => enqueueSnackbar(`Deposit error: ${error}`, { variant: 'error' })
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
        () => enqueueSnackbar(`Deposit success`, { variant: 'success' })
      ).catch(
        error => enqueueSnackbar(`Deposit error: ${error}`, { variant: 'error' })
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
    let amountValue = withdrawAmount[index] ? withdrawAmount[index].replace(',', '') : withdrawAmount[index];
    if (amountValue == undefined) {
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
        () => enqueueSnackbar(`Withdraw success`, { variant: 'success' })
      ).catch(
        error => enqueueSnackbar(`Withdraw error: ${error}`, { variant: 'error' })
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
        () => enqueueSnackbar(`Withdraw success`, { variant: 'success' })
      ).catch(
        error => enqueueSnackbar(`Withdraw error: ${error}`, { variant: 'error' })
      )
    }
  }

  const openCard = id => {
    return setOpenCardList(
      openedCardList => {
        if (openedCardList.includes(id)) {
          return openedCardList.filter(item => item !== id)
        } else {
          return [...openedCardList, id]
        }
      }
    )
  }

  useEffect(() => {
    if (address && web3) {
      fetchBalances({ address, web3, tokens });
      fetchPoolBalances({ address, web3, pools });
      const id = setInterval(() => {
        fetchBalances({ address, web3, tokens });
        fetchPoolBalances({ address, web3, pools });
      }, 10000);
      return () => clearInterval(id);
    }
  }, [address, web3, fetchBalances, fetchPoolBalances]);

  const isMoreDepostLimit = (value, depostLimit) => {
    if (isEmpty(value) || depostLimit == 0 || value < depostLimit) {
      return false
    }
    return true;
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
  const units = ["", "K", "Million", "Billion", "Trillion", "Quadrillion", "Quintillion", "Sextillion", "Septillion", "Octillion", "Nonillion", "Decillion", "Undecillion"];

  const getApy = pool => {
    if (pool.vault === undefined) {
      return "";
    } else {
      const vaultApy = pool.vault.apy;
      return millify(vaultApy, { units, space: true });
    }
  }

  const getAprd = pool => {
    if (pool.vault === undefined) {
      return "";
    } else {
      const vaultAprd = pool.vault.aprd;
      return millify(vaultAprd, { units, space: true });
    }
  }

  return (
    <Grid container style={{ paddingTop: '4px' }}>
      <Grid item xs={12}>
        <div className={classes.mainTitle}>{t('Vault-Main-Title')}</div>
        <h3 style={{color: 'white'}}>TVL: <NumberFormat value={data.totalvaluelocked} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={0} /></h3>
      </Grid>
      <FormControl className={classes.margin}>
        <InputLabel shrink id="demo-simple-select-placeholder-label-label" htmlFor="demo-customized-textbox" style={{color: 'white'}}>Search</InputLabel>
          <BootstrapInput
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            autoFocus={true}
          />
      </FormControl>
      <FormControl>
        <InputLabel shrink id="demo-simple-select-placeholder-label-label" style={{color: 'white'}}>Sort by</InputLabel>
        <NativeSelect
          value={sortTerm}
          onChange={handleSort}
          style={{width: '100px', backgroundColor: 'white'}}
          input={<BootstrapInput />}
        >
          <option value="" label="Default" />
          <option value="apy">APY</option>
          <option value="apd">APD</option>
          <option value="tvl">TVL</option>
        </NativeSelect>
      </FormControl>
      {Boolean(networkId === Number(process.env.NETWORK_ID)) && searchResults.map((pool, index) => {
        let balanceSingle = byDecimals(tokens[pool.token].tokenBalance, pool.tokenDecimals);
        let singleDepositedBalance = byDecimals(tokens[pool.earnedToken].tokenBalance, pool.itokenDecimals);
        return (
          <Grid item xs={12} container key={index} style={{ marginBottom: "24px" }} spacing={0}>
            <div style={{ width: "100%" }}>
              <Accordion
                expanded={Boolean(openedCardList.includes(index))}
                className={classes.accordion}
                TransitionProps={{ unmountOnExit: true }}
              >
                <AccordionSummary
                  className={classes.details}
                  style={{ justifyContent: "space-between" }}
                  onClick={(event) => {
                    event.stopPropagation();
                    openCard(index)
                  }}
                >
                  <Grid container alignItems="center" justify="space-around" spacing={4} style={{ paddingTop: "16px", paddingBottom: "16px" }}>
                    <Grid item>
                      <Grid container alignItems="center" spacing={2}>
                        <Avatar style={{marginRight: '5px'}} alt={pool.token} src={require(`../../../images/${pool.token}-logo.svg`)} />
                        <Grid item style={{ minWidth: '100px' }}>
                          <Typography className={classes.iconContainerMainTitle} variant="body2" gutterBottom>
                            {pool.token}
                            <Hidden smUp>
                              <i
                                style={{ color: primaryColor[0], marginLeft: '4px', visibility: Boolean(isZh ? pool.tokenDescriptionUrl2 : pool.tokenDescriptionUrl) ? "visible" : "hidden" }}
                                className={"yfiiicon yfii-help-circle"}
                                onClick={
                                  event => {
                                    event.stopPropagation();
                                    window.open(isZh ? pool.tokenDescriptionUrl2 : pool.tokenDescriptionUrl)
                                  }
                                }
                              />
                            </Hidden>
                          </Typography>
                          {pool.token === 'ELE' ? (
                            <Typography className={classes.poolTvl} variant="body2">--</Typography>
                          ) : (
                            <Typography className={classes.poolTvl} variant="body2"> <NumberFormat value={pool.tvl} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={0} /> </Typography>
                          )}
                          <Typography className={classes.iconContainerSubTitle} variant="body2">{pool.uses}</Typography>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item md={8} xs={3}>
                      <Grid item container justify="space-between">
                        <Hidden smDown>
                          <Grid item xs={7} container justify='center' alignItems="center">
                            <Grid item style={{ width: "200px" }}>
                              <Typography className={classes.iconContainerMainTitle} variant="body2" gutterBottom noWrap>{pool.token == 'OG-BNB LP' || pool.token == 'PSG-BNB LP' || pool.token == 'JUV-BNB LP' || pool.token == 'ASR-BNB LP' || pool.token == 'ATM-BNB LP' ? forMat(balanceSingle) : forMat(balanceSingle).toFixed(6)} {pool.token}</Typography>
                              <Typography className={classes.iconContainerSubTitle} variant="body2">{t('Vault-Balance')}</Typography></Grid>
                          </Grid>
                        </Hidden>
                        <Hidden mdDown>
                          <Grid item xs={4} container justify='center' alignItems="center">
                            <Grid item style={{ width: "200px" }}>
                              <Typography className={classes.iconContainerMainTitle} variant="body2" gutterBottom noWrap>{pool.token == 'OG-BNB LP' || pool.token == 'PSG-BNB LP' || pool.token == 'JUV-BNB LP' ? forMat(singleDepositedBalance) : forMat(singleDepositedBalance).toFixed(6)} {pool.earnedToken}</Typography>
                              <Typography className={classes.iconContainerSubTitle} variant="body2">{t('Vault-Deposited')}</Typography>
                            </Grid>
                          </Grid>
                        </Hidden>
                        <Grid item xs={12} md={1} container justify='center' alignItems="center">
                          <Grid item>
                            <Typography className={classes.iconContainerMainTitle} variant="body2" gutterBottom noWrap> 
                              <span>APY: {getApy(pool)} %</span>
                            </Typography>
                            <Typography className={classes.iconContainerSubTitle} variant="body2">
                              <span>APRD: {getAprd(pool)} %</span>
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item>
                      <Grid item container justify="flex-end" alignItems="center" spacing={2}>
                        <Hidden mdDown>
                          <Grid item>
                            <IconButton
                              classes={{
                                root: classes.iconContainerSecond
                              }}
                              style={{ visibility: Boolean(isZh ? pool.tokenDescriptionUrl2 : pool.tokenDescriptionUrl) ? "visible" : "hidden" }}
                              onClick={
                                event => {
                                  event.stopPropagation();
                                  window.open(isZh ? pool.tokenDescriptionUrl2 : pool.tokenDescriptionUrl)
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
                <AccordionDetails style={{ justifyContent: "space-between" }}>
                  <Grid container style={{ width: "100%", marginLeft: 0, marginRight: 0 }}>
                    <Grid item xs={12} sm={6} className={classes.sliderDetailContainer}>
                      <div className={classes.showDetailRight}>
                        {t('Vault-Balance')}:{balanceSingle.toFormat(15)} {pool.token}
                      </div>
                      <FormControl fullWidth variant="outlined">
                        <CustomOutlinedInput
                          value={depositedBalance[index] != undefined ? depositedBalance[index] : '0'}
                          onChange={changeDetailInputValue.bind(this, 'depositedBalance', index, balanceSingle.toNumber(), pool.tokenDecimals)}
                        />
                      </FormControl>
                      <CustomSlider
                        classes={{
                          root: classes.depositedBalanceSliderRoot,
                          markLabel: classes.depositedBalanceSliderMarkLabel,
                        }}
                        aria-labelledby="continuous-slider"
                        value={depositedBalance['slider-' + index] ? depositedBalance['slider-' + index] : 0}
                        onChange={handleDepositedBalance.bind(this, index, balanceSingle.toNumber())}
                      />

                      <div>
                        {
                          pool.allowance === 0 ? (
                            <div className={classes.showDetailButtonCon}>
                              <Button
                                style={{
                                  width: '180px',
                                  margin: '12px 5px',
                                  fontSize: '14px',
                                  fontWeight: 'bold',
                                  backgroundColor: '#ff635a',
                                  color: '#ffffff',
                                  boxShadow: '0 2px 2px 0 rgba(53, 56, 72, 0.14), 0 3px 1px -2px rgba(53, 56, 72, 0.2), 0 1px 5px 0 rgba(53, 56, 72, 0.12)',
                                  fontWeight: "bold"
                                }}
                                round
                                color="primary"
                                onClick={onApproval.bind(this, pool, index)}
                                disabled={fetchApprovalPending[index]}
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
                                  fontWeight: 'bold',
                                  backgroundColor: '#ff635a',
                                  color: '#ffffff',
                                  boxShadow: '0 2px 2px 0 rgba(53, 56, 72, 0.14), 0 3px 1px -2px rgba(53, 56, 72, 0.2), 0 1px 5px 0 rgba(53, 56, 72, 0.12)'
                                }}
                                round
                                onFocus={(event) => event.stopPropagation()}
                                disabled={
                                  fetchDepositPending[index] || (new BigNumber(depositedBalance[index]).toNumber() > balanceSingle.toNumber() || isMoreDepostLimit(new BigNumber(depositedBalance[index]).toNumber(), pool.depostLimit))
                                }
                                onClick={onDeposit.bind(this, pool, index, false, balanceSingle)}
                              >{t('Vault-DepositButton')}
                              </Button>
                              {Boolean(pool.tokenAddress) && <Button
                                style={{
                                  width: '180px',
                                  margin: '12px 5px',
                                  fontSize: '14px',
                                  fontWeight: 'bold',
                                  backgroundColor: '#ff635a',
                                  color: '#ffffff',
                                  boxShadow: '0 2px 2px 0 rgba(53, 56, 72, 0.14), 0 3px 1px -2px rgba(53, 56, 72, 0.2), 0 1px 5px 0 rgba(53, 56, 72, 0.12)'
                                }}
                                round
                                onFocus={(event) => event.stopPropagation()}
                                disabled={
                                  fetchDepositPending[index] || (new BigNumber(depositedBalance[index]).toNumber() > balanceSingle.toNumber() || isMoreDepostLimit(balanceSingle.toNumber(), pool.depostLimit))
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
                        {singleDepositedBalance.multipliedBy(new BigNumber(pool.pricePerFullShare)).toFormat(15)} {pool.token} ({singleDepositedBalance.toFormat(15)} {pool.earnedToken})
                            </div>
                      <FormControl fullWidth variant="outlined">
                        <CustomOutlinedInput
                          value={withdrawAmount[index] != undefined ? withdrawAmount[index] : '0'}
                          onChange={changeDetailInputValue.bind(this, 'withdrawAmount', index, singleDepositedBalance.toNumber(), pool.itokenDecimals)}
                        />
                      </FormControl>
                      <CustomSlider
                        classes={{
                          root: classes.drawSliderRoot,
                          markLabel: classes.drawSliderMarkLabel,
                        }}
                        aria-labelledby="continuous-slider"
                        value={withdrawAmount['slider-' + index] ? withdrawAmount['slider-' + index] : 0}
                        onChange={handleWithdrawAmount.bind(this, index, singleDepositedBalance.toNumber())}
                      />
                      <div className={classes.showDetailButtonCon}>
                        <Button
                          style={{
                            width: '180px',
                            margin: '12px 5px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            backgroundColor: '#635AFF',
                            color: '#ffffff',
                            boxShadow: '0 2px 2px 0 rgba(53, 56, 72, 0.14), 0 3px 1px -2px rgba(53, 56, 72, 0.2), 0 1px 5px 0 rgba(53, 56, 72, 0.12)'
                          }}
                          round
                          type="button"
                          color="primary"
                          disabled={fetchWithdrawPending[index]}
                          onClick={onWithdraw.bind(this, pool, index, false, singleDepositedBalance)}
                        >
                          {fetchWithdrawPending[index] ? `${t('Vault-WithdrawING')}` : `${t('Vault-WithdrawButton')}`}
                        </Button>
                        <Button
                          style={{
                            width: '180px',
                            margin: '12px 5px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            backgroundColor: '#635AFF',
                            color: '#ffffff',
                            boxShadow: '0 2px 2px 0 rgba(53, 56, 72, 0.14), 0 3px 1px -2px rgba(53, 56, 72, 0.2), 0 1px 5px 0 rgba(53, 56, 72, 0.12)',
                          }}
                          round
                          type="button"
                          color="primary"
                          onClick={onWithdraw.bind(this, pool, index, true, singleDepositedBalance)}
                        >
                          {fetchWithdrawPending[index] ? `${t('Vault-WithdrawING')}` : `${t('Vault-WithdrawButtonAll')}`}
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
