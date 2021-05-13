import commonStyle, { fonts, primaryColor, primaryContrastColor, bgColor } from 'assets/jss/components/commonStyle';

const styles = theme => ({
  ...commonStyle(theme),

  dialog: {
    backgroundColor: bgColor,
    padding: '5px 0'
  },
  dialogTitle: {
    color: '#fff',
  },
  dialogClose: {
    position: 'absolute',
    top: 10,
    right: 5,
    color: '#5e616b'
  },
  dialogActions: {
    padding: '10px 20px'
  },

  balance: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#eee',
    textAlign: 'right',
    paddingBottom: '3px',
    fontFamily: fonts,

    textAlign: 'right'
  },

  balanceButton: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#eee',
  },

  sliderWrapper: {
    padding: '0 10px'
  },
  sliderRoot:{
    color: primaryColor,
  },
  sliderMarkLabel:{
    color: primaryColor,
  },

  loader: {
    color: primaryContrastColor,
    margin: '2px 20px'
  }

});

export default styles;