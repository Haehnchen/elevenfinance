import React from 'react';
import { createUseStyles } from 'react-jss';

import styles from './styles.js';
const useStyles = createUseStyles(styles);

export default function OpenPosition() {
  const classes = useStyles();

  return (
    <>
      <button
        className={classes.button}
      >
        Open Position
      </button>
    </>
  )
}