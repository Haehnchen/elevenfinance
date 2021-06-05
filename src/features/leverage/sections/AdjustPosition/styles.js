import commonStyles, { COLORS } from 'assets/jss/common';

const styles = {
  button: {
    ...commonStyles.buttonSecondary
  },

  leverageChange: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '20px 0',
  },

  leverage: {
    width: 125,
    textAlign: 'center',

    '& :first-child': {
      ...commonStyles.h2,
      margin: '5px 0',

      '&.green': {
        color: COLORS.green
      },
      '&.orange': {
        color: COLORS.orange
      },
      '&.red': {
        color: COLORS.red
      }
    },

    '& :last-child': {
      ...commonStyles.textSecondary,
      lineHeight: '18px'
    }
  },

  arrow: {
    width: 50,
    textAlign: 'center',

    '& svg': {
      color: COLORS.textSecondaryDark,

      width: 50,
      height: 50,
    }
  }
}

export default styles;