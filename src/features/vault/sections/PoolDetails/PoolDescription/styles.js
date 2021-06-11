import { BORDER, COLORS, FONT, MEDIA } from 'assets/jss/common';

const styles = {
  descriptionSection: {
    minHeight: '100%',
    padding: '12px 16px',

    color: COLORS.textSecondaryLight,
    fontSize: FONT.size.normal,

    background: COLORS.bgDark,
    borderRadius: BORDER.radius,

    [MEDIA.mobile]: {
      marginTop: 20,
      minHeight: 0
    },
  },

  statsSection: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 10px',

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
      },

      '& .small': {
        display: 'block',
        marginTop: -4,

        color: COLORS.textSecondaryDark,
        fontSize: FONT.size.small,
      },

      '&.warning *': {
        color: COLORS.primary + ' !important'
      }
    },
  },

  statsContent: {
    width: '100%'
  },

  statsLinks: {
    textAlign: 'center',
    paddingTop: 10,

    '& a': {
      margin: '0 15px',

      color: COLORS.primary + ' !important',
      fontSize: FONT.size.normal,
      textDecoration: 'underline',

      '& svg': {
        width: 16,
        height: 16,
        marginRight: 6,
        marginTop: -3,
        verticalAlign: 'middle',
        display: 'inline-block'
      }
    }
  }
}

export default styles;