import { container } from "assets/jss/material-kit-pro-react.js";
import { COLORS, FONT } from 'assets/jss/common';

const appStyle = {
  page: {
    backgroundColor: COLORS.bgDark,
    fontFamily: FONT.family,
    minHeight: '100vh',
    padding: '25px 45px 25px 305px',

    '& *': {
      fontFamily: FONT.family
    }
  },
  container: {
    ...container,
    zIndex: 1,
  },
  children:{
    minHeight:'77vh',
  }
};

export default appStyle;
