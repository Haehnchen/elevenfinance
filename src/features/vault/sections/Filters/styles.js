import commonStyles from 'assets/jss/common';

const styles = {
  filters: {
    display: 'flex',
    justifyContent: 'space-between',

    padding: '25px 0 5px',

    '& > *': {
      display: 'flex',
      alignItems: 'center'
    }
  },

  checkboxes: {
    marginLeft: 42,
  },

  checkbox: {
    ...commonStyles.checkbox,

    marginRight: 16,
  },
}

export default styles;