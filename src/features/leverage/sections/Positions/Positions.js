import React from 'react';
import { createUseStyles } from 'react-jss';

import styles from './styles.js';
const useStyles = createUseStyles(styles);

export default function Positions() {
  const classes = useStyles();

  return (
    <>
      <h3 className={classes.title}>My Positions</h3>
    </>
  )
}