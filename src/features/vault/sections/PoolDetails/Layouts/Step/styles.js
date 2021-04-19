import { primaryColor } from 'assets/jss/components/commonStyle';

const styles = theme => ({
  step: {
    height: '30px',
    marginTop: '10px',
    marginBottom: '25px',
    color: primaryColor,
    position: 'relative',
  },
  stepEmpty: {
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    },
  },

  stepLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: '1px',
    marginTop: '15px',
    left: '0',
    backgroundColor: primaryColor,
  },

  stepBg: {
    content: '',
    position: 'absolute',
    left: '-16px',
    width: '16px',
    height: '100%',
    background: '#2c3040',
  },

  stepNumber: {
    position: 'relative',
    display: 'inline-block',
    border: '2px solid ' + primaryColor,
    fontWeight: 'bold',
    width: '30px',
    height: '30px',
    textAlign: 'center',
    borderRadius: '15px',
    lineHeight: '27px',
    backgroundColor: '#2c3040'
  },

  stepLabel: {
    position: 'relative',
    padding: '0 15px',
    backgroundColor: '#2c3040'
  },
});

export default styles;