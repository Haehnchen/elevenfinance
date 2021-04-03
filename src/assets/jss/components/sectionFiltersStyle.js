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

const sectionFiltersStyle = theme => ({
    filtersContainer: {
        padding: '3px 0 15px',
        display: 'flex',
        justifyContent: 'flex-end'
    },
    searchInput: {
        ...inputBackground,
        [theme.breakpoints.down('sm')]: {
            width: '60%'
        },
    },
    sortSelect: {
        marginLeft: '10px',
        ...inputBackground,
        '& > *': {
            color: '#fff',
            paddingRight: '5px',
        },

        [theme.breakpoints.down('sm')]: {
            width: '40%'
        },
    },
});

export default sectionFiltersStyle;
