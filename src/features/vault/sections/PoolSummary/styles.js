import commonStyles from 'assets/jss/common';

const styles = {
  poolSummary: {
    display: 'flex',
    justifyContent: 'space-between',
    cursor: 'pointer'
  },

  poolInfo: {
    display: 'flex',
    flex: '0 0 auto',
    justifyContent: 'space-between',
    width: 310
  },

  logo: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    position: 'relative',
    overflow: 'hidden',

    '& img': {
      height: '100%',
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

    '& p': {
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
  },
}

export default styles;