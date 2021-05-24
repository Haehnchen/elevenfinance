import commonStyles, { BREAKPOINTS, COLORS, FONT } from 'assets/jss/common';

const styles = {
  detailsSection: {
    paddingLeft: '45px',

    ['@media(max-width: ' + BREAKPOINTS.md + ')']: {
      marginBottom: 20
    },
  },

  balance: {
    ...commonStyles.h3,
    fontWeight: 'bold',
    margin: '11px 0 3px',

    ['@media(min-width: ' + BREAKPOINTS.md + ') and (max-width: ' + BREAKPOINTS.lg + ')']: {
      fontSize: '20px'
    },
  },
  balanceSecondary: {
    color: COLORS.textHeader,
    fontSize: FONT.size.bigger,
    fontWeight: 500,
    lineHeight: FONT.size.bigger,
    margin: '5px 0 7px',

    ['@media(min-width: ' + BREAKPOINTS.md + ') and (max-width: ' + BREAKPOINTS.lg + ')']: {
      fontSize: '15px'
    },
  },
  balanceDescription: {
    ...commonStyles.textSecondary,
    lineHeight: FONT.size.normal,
    marginBottom: '25px',

    ['@media(min-width: ' + BREAKPOINTS.md + ') and (max-width: ' + BREAKPOINTS.lg + ')']: {
      marginBottom: '10px'
    }
  },

  balanceWithLogo: {
    display: 'flex',
    alignItems: 'center',
    marginTop: -10
  },
  balanceLogo: {
    width: 45,
    height: 45,
    flex: '0 0 auto',
    margin: '0 15px 10px 0',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    '& img': {
      maxWidth: 45,
      maxHeight: 45
    }
  },

  balanceWithPadding: {
    padding: '12px 0'
  },

  button: {
    ...commonStyles.button
  }
};

export default styles;