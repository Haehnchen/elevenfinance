import commonStyles, { BORDER, COLORS, FONT } from 'assets/jss/common';

const styles = {
  filters: {
    display: 'flex',
    justifyContent: 'space-between',

    padding: '25px 0 5px',

    '& > *': {
      display: 'flex',
      alignItems: 'center'
    }
  },

  checkboxes: {
    marginLeft: 42,
  },

  checkbox: {
    ...commonStyles.checkbox,

    marginRight: 16,
  },

  search: {
    position: 'relative',

    width: 40,
    height: 40,
    marginRight: 10,

    background: COLORS.bgSurface,
    borderRadius: BORDER.radius,

    cursor: 'pointer',

    transition: 'width .15s ease-in-out',

    '& svg': {
      position: 'absolute',

      width: 20,
      height: 20,
      top: 10,
      left: 10,

      color: COLORS.textSecondaryDark,
    },

    '& input': {
      display: 'none',

      width: 146,
      height: '100%',

      marginLeft: 40,

      color: COLORS.textSecondaryLight,
      fontSize: FONT.size.normal,

      background: 'transparent',
      border: 'none',
    },

    '&.open': {
      width: 200,
      border: '1px solid ' + COLORS.border,
    },

    '&.open input': {
      display: 'block'
    }
  }
}

export default styles;