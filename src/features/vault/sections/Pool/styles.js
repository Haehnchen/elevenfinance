import { primaryColor, hoverColor} from "assets/jss/material-kit-pro-react.js";

const styles = theme => ({
  poolInactive: {
    opacity: 0.5,
  },
  discontinued: {
    padding: '0 !important',
    margin: '-6px 0 6px',

    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    },
  },
  discontinuedLabel: {
    marginRight: 20,
    background: '#25272f',
    padding: '5px 10px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  discontinuedMessage: {
    fontSize: '15px',
    fontWeight: 'bold',
    paddingTop: '5px',
    color: '#ddd',

    [theme.breakpoints.down('sm')]: {
      padding: '5px 15px'
    },
  },
  accordion: {
    backgroundColor: '#2C3040',
    color: '#fff',
    boxShadow: '0px 4px 8px 0px rgba(0, 0, 0, 0.06)',
    borderRadius: '8px',
  },
  details: {
    // padding: '12px 0',
    background: '#2C3040',
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.06)',
    borderRadius: '8px',
  },
  iconContainerSecond: {
    width: '48px',
    height: '48px',
    backgroundColor: '#353848',
    borderRadius: '8px',
    color: primaryColor[0],

    "& i": {
      fontSize: '24px',
    },
    "&:hover,&:focus": {
      backgroundColor: hoverColor[1],
    }
  },
  iconContainerPrimary: {
    width: '48px',
    height: '48px',
    backgroundColor: '#242833',
    borderRadius: '8px',
    color: '#fff',
    "& i": {
      fontSize: '24px',
    },
    "&:hover,&:focus": {
      opacity: 0.5,
      background: '#242833',
    }
  },
  iconContainerMainTitle: {
    fontSize: '18px',
    fontWeight: '300',
    color: '#fff',
    lineHeight: '18px',
    // marginBottom:'8px',
    letterSpacing: 0,
  },
  iconContainerSubTitle: {
    fontSize: '14px',
    fontWeight: '300',
    color: '#fff',
    lineHeight: '14px',
    opacity: "0.4",
    letterSpacing: 0
  },
  poolTvl: {
    fontSize: '14px',
    fontWeight: '300',
    color: '#fff',
    lineHeight: '14px',
    letterSpacing: 0,
    marginBottom: '5px'
  },

  hidden: {
    display: 'none'
  }
});

export default styles;