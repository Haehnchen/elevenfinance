import commonStyle, { fonts, textSecondaryColor } from 'assets/jss/components/commonStyle.js';


const styles = theme => ({
  ...commonStyle(theme),

  vaultPendingRewards: {
    padding: '10px 0 10px 30px',
    borderTop: '1px solid #333',
    fontFamily: fonts,

    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexWrap: 'wrap',
      padding: '10px'
    }
  },
  vaultPendingTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '13px 0 27px',

    [theme.breakpoints.down('sm')]: {
      fontSize: '22px',
      marginBottom: '10px'
    }
  },

  counter: {
    fontSize: '20px',
    fontWeight: 'bold',
    margin: '10px 0 0',

    [theme.breakpoints.down('sm')]: {
      fontSize: '20px',
    }
  },
  counterDescription: {
    color: textSecondaryColor,
    fontSize: '16px',
    marginBottom: '17px',
  },
});

export default styles;