import commonStyles, { BORDER, COLORS, FONT } from 'assets/jss/common';

const styles = {
  sidebar: {
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    width: 255,
    padding: '0 10px',
    background: COLORS.bgSurface,
    boxShadow: '1px 0px 3px rgba(22, 20, 20, 0.18)',
    zIndex: 2,
    minHeight: '100vh',
    paddingBottom: 110,
    overflowY: 'auto',
  },

  logo: {
    display: 'block',
    margin: '25px 14px 40px',
    textAlign: 'center',

    fontWeight: 'bold',
    fontSize: '18px',
    lineHeight: '24px',
    color: COLORS.textMain,

    '&:link, &:visited, &:hover, &:active': {
      color: COLORS.textMain
    },

    '& img': {
      width: 40,
      height: 40,
      marginRight: 14
    }
  },

  network: {
    position: 'relative',
    height: 32,
    padding: '6px 16px',
    marginBottom: 10,

    background: COLORS.bgLight,
    borderRadius: BORDER.radius,

    color: COLORS.textLight,
    fontSize: FONT.size.small,
    lineHeight: '20px',

    '& img': {
      width: 20,
      height: 20,
      marginRight: 14,
      marginTop: -3
    },
  },

  networkStatus: {
    width: 14,
    height: 14,
    borderRadius: 7,
    position: 'absolute',
    top: 9,
    right: 9,

    '&.connected': {
      background: '#166E57'
    }
  },

  wallet: {
    display: 'block',
    cursor: 'pointer',
    width: '100%',
    padding: '5px 14px',

    color: COLORS.primary,
    fontSize: FONT.size.normal,
    fontWeight: 'bold',
    lineHeight: '20px',
    textAlign: 'center',

    background: 'none',
    border: '1px solid',
    borderRadius: BORDER.radius,
    borderColor: COLORS.primary,

    '& svg': {
      width: 20,
      height: 20,
      marginRight: 8,
      top: -3,
      verticalAlign: 'middle',
      display: 'inline-block'
    }
  },

  divider: {
    height: 2,
    background: COLORS.bgLight,
    margin: '20px 0',

    '&.small': {
      margin: '12px 0'
    }
  },

  menu: {
    padding: 0,
    margin: '0 0 40px'
  },

  menuItem: {
    listStyle: 'none',
    padding: '6px 13px',
    marginBottom: 5,

    borderRadius: BORDER.radius,

    '& svg': {
      width: 22,
      height: 22,
      marginRight: 13,
      marginTop: -2,
      verticalAlign: 'middle',
      display: 'inline-block'
    },

    '& a': {
      color: COLORS.textLight,
      fontSize: FONT.size.normal,
      fontWeight: 'bold',
      lineHeight: '22px'
    },

    '&:hover': {
      background: COLORS.bgDark,
    },

    '&.active': {
      background: COLORS.bgDark,

      '& a': {
        color: COLORS.primary
      }
    },
  },

  bigfootButton: {
    ...commonStyles.button,

    display: 'block',

    fontSize: 15,
    fontWeight: 'bold',
    lineHeight: '20px',
    textTransform: 'uppercase',

    boxShadow: 'inset 0 -3px 0 0 rgba(0,0,0,.2)',

    '& svg': {
      ...commonStyles.button['& svg'],

      width: 16,
      height: 22,
      marginRight: 11,
    }
  },

  bottom: {
    position: 'absolute',
    background: COLORS.bgSurface,
    left: 10,
    right: 10,
    bottom: 0,
    paddingBottom: 20
  },

  priceBlock: {
    height: 28,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  price: {
    minWidth: 100,
    paddingTop: 5,
    color: COLORS.textMain,
    fontSize: FONT.size.bigger,
    fontWeight: 'bold',
    lineHeight: '18px',

    '& img': {
      width: 18,
      height: 18,
      marginLeft: 3,
      marginRight: 8,
      marginTop: -3
    },

    '& span': {
      width: '60% !important',
    }
  },

  buyButton: {
    padding: '3px 14px',

    color: COLORS.primary,
    fontSize: FONT.size.normal,
    fontWeight: 'bold',
    lineHeight: '20px',

    border: '1px solid ' + COLORS.primary,
    borderRadius: BORDER.radius,

    '&:link, &:visited, &:hover, &:active': {
      color: COLORS.primary,
    },

    '& svg': {
      width: 20,
      height: 20,
      marginRight: 8,
      marginTop: -3,
      verticalAlign: 'middle',
      display: 'inline-block'
    }
  },

  socials: {
    textAlign: 'center',

    '& a': {
      color: COLORS.textMain,
      margin: '0 7px',
    },

    '& img': {
      height: 22
    }
  }
};

export default styles;