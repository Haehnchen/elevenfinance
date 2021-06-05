import commonStyles, { COLORS, MEDIA } from 'assets/jss/common';

const styles = {
  wrapper: {
    ...commonStyles.card,

    margin: '10px 0',
    padding: '10px 20px',

    display: 'flex',
    justifyContent: 'space-between',

    color: COLORS.textSecondaryLight,

    [MEDIA.mobile]: {
      flexWrap: 'wrap'
    }
  },

  nameBlock: {
    width: 240,

    [MEDIA.mobile]: {
      width: '60%',
      paddingRight: 10,
      margin: '10px 0'
    }
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

      '&:last-child': {
        ...commonStyles.textSecondary,
        lineHeight: '18px'
      },
    },

    [MEDIA.mobile]: {
      width: '40%',
      textAlign: 'left',
      margin: '10px 0'
    }
  },

  tooltipContent: {
    textAlign: 'left',
    fontWeight: 400,

    '& p:last-child': {
      marginBottom: 0
    }
  },

  controls: {
    width: 200,
    flex: '0 0 auto',
    paddingTop: 4,
    textAlign: 'right',

    [MEDIA.mobile]: {
      width: '100%',
      margin: '10px 0',
      textAlign: 'center'
    }
  },

  controlsButton: {
    ...commonStyles.buttonSecondary,
    marginLeft: 10,

    '&:first-child': {
      marginLeft: 0,
    }
  }
};

export default styles;