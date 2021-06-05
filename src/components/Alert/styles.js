import { BORDER, COLORS, FONT, MEDIA } from 'assets/jss/common';

const styles = {
  wrapper: {
    display: 'flex',
    padding: 12,
    marginBottom: 10,

    color: COLORS.textSecondaryLight,
    fontSize: FONT.size.normal,

    background: COLORS.bgDark,
    borderRadius: BORDER.radius,

    '&.warning': {
      border: '1px solid ' + COLORS.primary,

      '& $icon': {
        color: COLORS.primary
      }
    },

    [MEDIA.mobile]: {
      flexDirection: 'column',
      padding: '16px 12px',
    }
  },

  icon: {
    width: 65,
    padding: '0 20px 0 5px',

    '& svg': {
      width: 40,
      height: 40
    },

    [MEDIA.mobile]: {
      display: 'none'
    }
  },

  content: {
    '& p:last-child': {
      marginBottom: 0
    },

    '& a': {
      color: COLORS.primary,
      textDecoration: 'underline'
    }
  }
};

export default styles;