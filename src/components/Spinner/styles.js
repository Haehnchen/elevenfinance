import { COLORS } from 'assets/jss/common';

const size = '2.8em';
const thickness = '0.4em';

const styles = {
  spinner: {
    display: 'block',
    borderRadius: '50%',
    width: size,
    height: size,
    overflow: 'hidden',

    margin: '-1px auto',
    fontSize: '8px',
    position: 'relative',
    textIndent: '-10em',
    borderTop: thickness + ' solid rgba(0, 0, 0, 0.2)',
    borderRight: thickness + ' solid rgba(0, 0, 0, 0.2)',
    borderBottom: thickness + ' solid rgba(0, 0, 0, 0.2)',
    borderLeft: thickness + ' solid ' + COLORS.primaryContrast,
    transform: 'translateZ(0)',
    animation: '$spinner 1.1s infinite linear',

    '&:after': {
      borderRadius: '50%',
      width: size,
      height: size,
    }
  },
  '@keyframes spinner': {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '100%': {
      transform: 'rotate(360deg)'
    }
  },

  dots: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '20px auto',
    width: 56,

    '& > div': {
      width: 12,
      height: 12,
      backgroundColor: COLORS.textSecondaryDark,
      borderRadius: '100%',
      display: 'inline-block',
      animation: '$bounceDelay 1s infinite ease-in-out both',

      '&:first-child': {
        animationDelay: '-0.32s',
      },

      '&:nth-child(2)': {
        animationDelay: '-0.16s'
      }
    },
  },

  '@keyframes bounceDelay': {
    '0%, 80%, 100%': {
      transform: 'scale(0)'
    },
    '40%': {
      transform: 'scale(1.0)'
    }
  }
};

export default styles;