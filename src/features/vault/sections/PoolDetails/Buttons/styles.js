import commonStyles, { COLORS, FONT } from 'assets/jss/common';

const styles = {
  buttonPrimary: {
    ...commonStyles.button,
  },

  buttonSecondary: {
    ...commonStyles.buttonSecondary
  },

  alert: {
    ...commonStyles.alert,
    marginBottom: 20,
  },

  withdrawTokenSelectWrapper: {
    display: 'flex',
    marginBottom: 20,

    color: COLORS.textSecondaryLight,
    fontSize: FONT.size.normal
  },

  withdrawTokenSelect: {
    width: 150,
    flex: '0 0 auto',

    margin: '4px 0 0 10px',
  }
}

export default styles;