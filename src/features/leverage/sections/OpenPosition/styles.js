import commonStyles, { COLORS } from 'assets/jss/common';

const styles = {
  button: {
    ...commonStyles.buttonSecondary
  },

  label: {
    ...commonStyles.label,

    marginLeft: -10
  },

  sliderWrapper: {
    margin: '0 -10px',
    padding: '10px 20px 0',

    overflowX: 'hidden',
    overflowY: 'visible'
  },
  sliderRoot:{
    color: COLORS.primary + ' !important',
  },
  sliderRail: {
    opacity: '1',
    color: '#353848',
  },
  sliderMark: {
    opacity: '0 !important',
  },
  sliderMarkLabel:{
    color: COLORS.primary + ' !important',
    fontWeight: '600 !important'
  },
};

export default styles;