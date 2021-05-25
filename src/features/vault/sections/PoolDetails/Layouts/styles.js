import commonStyles, { BORDER, BREAKPOINTS, COLORS, FONT, MEDIA } from 'assets/jss/common';

const styles = {
  detailsSection: {
    paddingLeft: '45px',

    ['@media(max-width: ' + BREAKPOINTS.md + ')']: {
      marginBottom: 20
    },

    [MEDIA.mobile]: {
      '&.without-steps': {
        paddingLeft: 0,
        textAlign: 'center'
      }
    }
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
  },

  divider: {
    height: 1,
    background: COLORS.primary,
    margin: '20px 0 30px'
  },

  statsSection: {
    minHeight: '100%',
    padding: '12px 15px',

    color: COLORS.textSecondaryLight,
    fontSize: FONT.size.normal,

    background: COLORS.bgDark,
    borderRadius: BORDER.radius,

    [MEDIA.mobile]: {
      marginTop: 20,
      minHeight: 0
    },

    '& .header': {
      marginBottom: 10,
      textAlign: 'center',

      color: COLORS.textLight,
      fontSize: FONT.size.h4,
    },

    '& .item': {
      display: 'flex',
      width: '100%',

      '& span': {
        width: '50%',
      },

      '& span:first-child': {
        paddingRight: 15,

        textAlign: 'right',
        color: COLORS.textLight,

        borderRight: '1px solid ' + COLORS.border
      },

      '& span:last-child': {
        paddingLeft: 15
      }
    }
  },
};

export default styles;