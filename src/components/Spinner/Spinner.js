import React from 'react';
import { createUseStyles } from 'react-jss';

import styles from './styles';
const useStyles = createUseStyles(styles);

const Spinner = ({ type }) => {
  const classes = useStyles();

  switch (type) {
    case 'dots':
      return (
        <div className={classes.dots}>
          <div></div>
          <div></div>
          <div></div>
        </div>
      );

    default:
      return (
        <span className={classes.spinner}>...</span>
      )
  }
}

export default Spinner;