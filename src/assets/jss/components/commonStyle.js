// TODO: move to theme settings
const primaryColor = '#f0b90b';
const primaryColorHover = '#dcab10';
const primaryContrastColor = 'rgb(30, 41, 59)';

const textNormalColor = '#ffffff';
const textSecondaryColor = '#94a3b8';

const fonts = 'Inter var,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji';

const commonStyle = theme => ({
  buttonPrimary: {
		backgroundColor: primaryColor,
		color: primaryContrastColor,
		fontFamily: fonts,
		fontSize: '14px',
		fontWeight: '500',
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