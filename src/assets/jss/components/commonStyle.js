// TODO: move to theme settings
export const primaryColor = '#f0b90b';
export const primaryColorHover = '#dcab10';
export const primaryContrastColor = 'rgb(30, 41, 59)';

export const textNormalColor = '#ffffff';
export const textSecondaryColor = '#94a3b8';

export const fonts = 'Inter var,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji';

const commonStyle = theme => ({
  buttonPrimary: {
    backgroundColor: primaryColor,
    color: primaryContrastColor,
    fontFamily: fonts,
    fontSize: '14px',
    fontWeight: '500',
    padding: '10px 16px',
    boxShadow: '0 0 0 0 rgb(0 0 0 / 20%), 0 0 0 0 rgb(0 0 0 / 14%), 0 0 0 0 rgb(0 0 0 / 12%)',

    '&:hover': {
      backgroundColor: primaryColorHover,
      color: primaryContrastColor,
      boxShadow: '0 0 0 0 rgb(0 0 0 / 20%), 0 0 0 0 rgb(0 0 0 / 14%), 0 0 0 0 rgb(0 0 0 / 12%)',
    },

    '&:focus': {
      backgroundColor: primaryColorHover,
      color: primaryContrastColor,
      boxShadow: '0 0 0 0 rgb(0 0 0 / 20%), 0 0 0 0 rgb(0 0 0 / 14%), 0 0 0 0 rgb(0 0 0 / 12%)',
    },

    '&:active': {
      backgroundColor: primaryColor,
      color: primaryContrastColor,
    }
  },
});

export default commonStyle;