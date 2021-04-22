import filtersSection from 'assets/jss/components/sectionFiltersStyle.js';

const secondStyle = {
  opacity: '0.4',
  fontFamily: 'Helvetica',
  fontSize: '14px',
  color: '#FFFFFF',
  letterSpacing: '0',
  lineHeight: '14px',
};

const farmItemStyle = theme => ({
  ...filtersSection(theme),

  mainTitle: {
    fontFamily: 'Helvetica',
    fontSize: '32px',
    color: '#FFFFFF',
    letterSpacing: '0',
    lineHeight: '32px',
    fontWeight: "300",
  },
  subTitle: {
    fontFamily: 'Helvetica',
    fontSize: '16px',
    color: '#FFFFFF',
    letterSpacing: '0',
    lineHeight: '32px',
    fontWeight: "300",
  },
  secondTitle: {
    ...secondStyle,
    fontWeight: "550",
  },
  flexColumnCenter: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  farmItem: {
    position: 'relative',
    paddingTop: 40,
    minWidth: 260,
    margin: '10px 10px 50px',
    padding: 15,
    borderRadius: 20,

    color: '#ffffff',
    textAlign: 'center'
  },
  logo: {
    display: 'flex',
    justifyContent: 'center'
  },
  logoImage: {
    width: 65,
    height: 65,
    zIndex: 1
  },
  weightFont: {
    fontSize: 20,
    fontWeight: 500
  },
  menu: {
    display: 'flex',
    justifyContent: 'space-around'
  },
  menuButton: {
    borderRadius: 10,
    fontSize: 15,
    margin: 10
  },
  margin: {
    marginRight: '5px'
  },

  poolWarning: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    background: '#f0b90b',
    color: 'rgb(30, 41, 59)',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: '5px 10px !important',
    borderRadius: '5px 5px 0 0'
  },
  buttonLoader: {
    color: 'rgb(30, 41, 59)',
    margin: '2px 20px',

    '& svg': {
      margin: 0
    }
  }
});

export default farmItemStyle;
