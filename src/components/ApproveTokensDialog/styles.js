import commonStyles from 'assets/jss/common';

const styles = {
  token: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 10,
  },

  image: {
    width: 80,
    height: 80,
    marginRight: 25,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    '& img': {
      maxWidth: '100%',
      maxHeight: '100%'
    },
  },

  name: {
    ...commonStyles.h3,
    marginBottom: 15
  },

  button: {
    ...commonStyles.button,
  },
}

export default styles;