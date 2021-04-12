const inputBackground = {
    backgroundColor: '#2C3040',
    color: '#fff',
    '& input': {
        color: '#fff'
    },
    '& svg': {
        color: '#727580'
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#727580'
    }
}

const primaryColor = '#f0b90b'; // TODO: move to theme settings

const sectionFiltersStyle = theme => ({
    filtersContainer: {
        padding: '3px 0 15px',

        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column-reverse'
        }
    },
    filtersLeft: {
        [theme.breakpoints.up('sm')]: {
            paddingLeft: '10px',
            lineHeight: '56px'
        }
    },
    filtersRight: {
        display: 'flex',
        justifyContent: 'flex-end',

        [theme.breakpoints.down('xs')]: {
            marginBottom: '10px'
        }
    },

    searchInput: {
        ...inputBackground,

        [theme.breakpoints.down('sm')]: {
            width: '60%'
        },
    },
    sortSelect: {
        ...inputBackground,
        marginLeft: '10px',

        '& > *': {
            color: '#fff',
            paddingRight: '5px',
        },

        [theme.breakpoints.down('sm')]: {
            width: '40%'
        },
    },
    filtersCheckbox: {
        marginRight: '25px',

        '& .MuiCheckbox-root': {
            color: '#858790',
            opacity: 0.7,
        },

        '& .Mui-checked': {
            color: primaryColor,
            opacity: 1
        },

        '& .MuiFormControlLabel-label': {
            color: '#858790',
            fontWeight: 'bold',
        },
    },
});

export default sectionFiltersStyle;
