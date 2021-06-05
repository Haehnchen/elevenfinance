import commonStyles, { COLORS, FONT } from 'assets/jss/common';

const styles = {
  titleSection: {
    display: 'flex',
  },

  title: {
    ...commonStyles.h3,
    marginBottom: 15,
  },

  link: {
    ...commonStyles.link,

    display: 'inline-block',
    margin: '3px 0 0 30px',
    fontSize: FONT.size.normal,
  },

  emptyMessage: {
    color: COLORS.textSecondaryLight,
    fontSize: FONT.size.normal,
  },

  spinner: {
    '& > *': {
      marginTop: 5,
      marginLeft: 0
    }
  },
}

export default styles;