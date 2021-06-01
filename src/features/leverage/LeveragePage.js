import React, { useEffect } from 'react';
import { createUseStyles } from 'react-jss';

import PoolsList from './sections/PoolsList/PoolsList';
import Positions from './sections/Positions/Positions';

import styles from './styles.js';
const useStyles = createUseStyles(styles);

export default function LeveragePage(props) {
  const classes = useStyles();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }, []);

  return (
    <>
      <h2 className={classes.h2}>Leveraged Yield Farming</h2>

      <div className={classes.section}>
        <PoolsList />
      </div>

      <div className={classes.section}>
        <Positions />
      </div>
    </>
  );
}