import commonStyles, { primaryColor, primaryContrastColor, textSecondaryColor } from 'assets/jss/components/commonStyle';

const styles = theme => ({
  ...commonStyles(theme),

  poolDetails: {
    padding: '10px 0 20px'
  },

  detailsSection: {
    paddingLeft: '45px'
  },

  balance: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '10px 0 2px'
  },
  balanceSecondary: {
    fontWeight: 'bold',
    color: '#fff'
  },
  balanceDescription: {
    color: textSecondaryColor,
    fontSize: '16px',
    marginBottom: '20px',

    [theme.breakpoints.down('sm')]: {
      marginBottom: '10px'
    }
  },

  balanceWithLogo: {
    display: 'flex',
    alignItems: 'center',
    marginTop: -10
  },
  balanceLogo: {
    height: 50,
    marginRight: 10,
    textAlign: 'center',

    '& img': {
      maxWidth: 50,
      maxHeight: 50
    }
  },

  balanceWithPadding: {
    padding: '12px 0'
  },

  step: {
    height: '30px',
    marginTop: '10px',
    marginBottom: '25px',
    color: primaryColor,
    position: 'relative',
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
    paddingLeft: '1px',
    backgroundColor: '#2c3040'
  },

  stepLabel: {
    position: 'relative',
    padding: '0 15px',
    backgroundColor: '#2c3040'
  },

  loader: {
    color: primaryContrastColor,
    margin: '2px 20px'
  }
});

export default styles;