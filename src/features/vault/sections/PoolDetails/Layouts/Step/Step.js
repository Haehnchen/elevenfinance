import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import styles from './styles';
const useStyles = makeStyles(styles);

const Step = ({ number, label }) => {
  const classes = useStyles();

  return (
    <div className={classes.step}>
      <span className={classes.stepLine}></span>
      {number && (
        <span>
          <span className={classes.stepBg}></span>
          <span className={classes.stepNumber}>{number}</span>
          <span className={classes.stepLabel}>{label}</span>
        </span>
      )}
    </div>
  )
}

export default Step;