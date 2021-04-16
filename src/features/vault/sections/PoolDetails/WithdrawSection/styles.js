import { textSecondaryColor, fonts } from 'assets/jss/components/commonStyle';

const button = {
  width: '180px',
  margin: '12px 5px',
  fontSize: '14px',
  fontWeight: '500',
  backgroundColor: '#635AFF',
  color: '#0b111b',
  boxShadow: '0 2px 2px 0 rgba(53, 56, 72, 0.14), 0 3px 1px -2px rgba(53, 56, 72, 0.2), 0 1px 5px 0 rgba(53, 56, 72, 0.12)',
  padding: '10px 16px'
};

const styles = theme => ({
  sliderDetailContainer: {
    padding: '24px 16px',
  },

  drawSliderRoot:{
    color:'#635AFF',
  },
  drawSliderMarkLabel:{
    color:'#635AFF'
  },

  showDetailButtonCon: {
    display: 'flex',
    justifyContent: 'space-around',
    '& + &': {
      marginLeft: '5px'
    }
  },

  poolBalanceBlock: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 5px',
    marginBottom: '10px',

    fontFamily: fonts,
    fontSize: '18px',
    fontWeight: 'bold',
  },
  poolBalance: {
    textAlign: 'right'
  },
  poolBalanceToken: {
    fontSize: '16px',
    fontWeight: 'normal'
  },
  poolBalanceDescription: {
    fontSize: '16px',
    fontWeight: 'normal',
    textAlign: 'right',
    color: textSecondaryColor,
  },

  withdrawButton: {
    ...button,

    '&:hover': button,
    '&:active': button
  },
});

export default styles;