import commonStyles, { COLORS, FONT } from 'assets/jss/common';

const styles = {
  title: {
    ...commonStyles.h3,
    marginBottom: 20,
  },

  emptyMessage: {
    margin: '20px 0',
    color: COLORS.textSecondaryLight,
    fontSize: FONT.size.normal,
  },

  spinner: {
    '& > *': {
      marginLeft: 0
    }
  },
}

export default styles;