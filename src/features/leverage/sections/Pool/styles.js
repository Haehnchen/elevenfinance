import commonStyles, { BORDER, COLORS, FONT, MEDIA } from 'assets/jss/common';

const styles = {
  pool: {
    ...commonStyles.card,
    marginBottom: 14
  },

  summary: {
    position: 'relative',

    display: 'flex',
    justifyContent: 'space-between',
    cursor: 'pointer',

    '&.discontinued': {
      opacity: 0.5
    },

    [MEDIA.mobile]: {
      flexWrap: 'wrap'
    }
  },

  poolInfo: {
    display: 'flex',
    flex: '0 0 auto',
    width: 310,

    [MEDIA.mobile]: {
      width: '100%',
      marginBottom: 10
    }
  },

  logo: {
    flex: '0 0 auto',

    width: 48,
    height: 48,
    marginRight: 22,
    borderRadius: BORDER.radius.small,
    position: 'relative',
    overflow: 'hidden',

    '&.wide': {
      width: 80,
    },

    '& img': {
      height: '100%',
      width: 'auto',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      margin: 'auto'
    }
  },

  nameBlock: {
    width: 240,
  },

  name: {
    ...commonStyles.h4,
    margin: '5px 0',
  },

  description: {
    ...commonStyles.textSecondary,
    marginBottom: 0,
    lineHeight: '18px'
  },

  counter: {
    width: 150,
    textAlign: 'center',

    '& > *': {
      margin: 0,

      '&:first-child': {
        ...commonStyles.h4,
        margin: '5px 0'
      },

      '&:last-child': {
        ...commonStyles.textSecondary,
        lineHeight: '18px'
      }
    },

    [MEDIA.mobile]: {
      width: '40%',
      paddinLeft: 10,
      textAlign: 'left',
      margin: '10px 0'
    }
  },

  stats: {
    display: 'flex',
    justifyContent: 'space-between',
    flex: '0 0 auto',

    width: 160,

    '& *': {
      color: COLORS.textSecondaryLight,
      fontSize: FONT.size.small,
      fontWeight: 'normal',
      lineHeight: FONT.size.h4,
    },

    '& > :first-child': {
      textAlign: 'left',
    },

    '& > :last-child': {
      textAlign: 'right',

      '& > *': {
        fontWeight: 600,
      }
    },

    '& p': {
      marginBottom: 0,
    }
  },

  leverage: {
    height: 48,

    '& p:first-child': {
      margin: '-2px 0 2px'
    }
  },

  leverageInput: {
    ...commonStyles.h4,

    width: 30,
    height: 28,
    margin: '0 10px',

    textAlign: 'center',

    background: 'transparent',
    border: 'none',
    outline: 'none'
  },

  leverageButton: {
    width: 30,
    height: 30,

    color: COLORS.textSecondaryLight,
    fontSize: FONT.size.h4,
    lineHeight: '30px',
    textAlign: 'center',

    background: COLORS.bgDark,
    borderRadius: BORDER.radiusSmall,

    cursor: 'pointer',
    border: 'none',
    outline: 'none'
  },

  controls: {
    width: 200,
    paddingTop: 4,
    textAlign: 'right'
  },

  networkSwitch: {
    width: 200,
    textAlign: 'center',

    color: COLORS.textSecondaryDark,
    fontSize: FONT.size.normal,

    [MEDIA.mobile]: {
      padding: '10px 0 20px',
      lineHeight: '20px'
    }
  },

  networkName: {
    color: COLORS.textSecondaryLight,
    fontSize: FONT.size.normal,

    '& img': {
      width: 20,
      height: 20,
      marginRight: 8,
      marginTop: -3,
      opacity: 0.8
    },
  }
};

export default styles;