export const COLORS = {
  primary: '#FEBF32',
  primaryContrast: '#1B1717',

  textMain: '#ffffff',
  textHeader: '#FCFCFC',
  textLight: '#EEEEEE',
  textSecondaryLight: '#B5B7BF',

  bgDark: '#1D1E24',
  bgSurface: '#23262B',
  bgLight: '#30323B'
};

export const FONT = {
  family: '"Poppins", sans-serif',

  size: {
    h2: '28px',
    h3: '22px',
    h4: '18px',

    bigger: '15px',
    normal: '14px',
    small: '13px',
  }
}

export const BORDER = {
  radius: '14px'
}

export const TRANSITIONS = {
  slide: {
    transitionSlide: {
      overflow: 'hidden',
      transition: 'max-height 0.25s linear',
    },

    transitionSlideClosed: {
      maxHeight: 0,
    },

    transitionSlideOpen: {
      maxHeight: 300,
    }
  }
}

export const BREAKPOINTS = {
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px'
}

const styles = {
  card: {
    background: COLORS.bgSurface,
    borderRadius: BORDER.radius,
    padding: 20,
    boxShadow: '-4px 8px 12px rgba(0, 0, 0, 0.05)'
  },

  h2: {
    margin: '0 0 10px',

    color: COLORS.textHeader,
    fontSize: FONT.size.h2,
    fontWeight: 500,
  },

  h3: {
    margin: '0 0 10px',

    color: COLORS.textHeader,
    fontSize: FONT.size.h3,
    fontWeight: 500,
  },

  h4: {
    margin: '0 0 5px',

    color: COLORS.textHeader,
    fontSize: FONT.size.h4,
    lineHeight: '18px',
    fontWeight: 500,
  },

  textSecondary: {
    color: COLORS.textSecondaryLight,
    fontSize: FONT.size.normal
  },

  button: {
    position: 'relative',
    padding: '10px 15px',

    color: COLORS.primaryContrast,
    fontSize: FONT.size.bigger,
    fontWeight: 500,
    lineHeight: '20px',
    textAlign: 'center',

    border: 'none',
    borderRadius: '7px',

    background: COLORS.primary,

    cursor: 'pointer',
    transition: 'transform .1s ease-in-out',

    '& svg': {
      width: 20,
      height: 20,
      marginRight: 10,
      verticalAlign: 'middle',
      display: 'inline-block',
      marginTop: -5
    },

    '&:link, &:visited, &:hover, &:active': {
      color: COLORS.primaryContrast,
      background: COLORS.primary
    },

    '&:hover': {
      transform: 'scale(1.05)'
    },
  },

  buttonSecondary: {
    position: 'relative',
    padding: '10px 15px',

    color: COLORS.primary,
    fontSize: FONT.size.bigger,
    lineHeight: '20px',
    textAlign: 'center',

    border: 'none',
    borderRadius: '7px',

    background: 'rgba(254, 191, 50, 0.2)',

    cursor: 'pointer',
    transition: 'transform .1s ease-in-out',

    '& svg': {
      width: 20,
      height: 20,
      marginRight: 10,
      verticalAlign: 'middle',
      display: 'inline-block',
      marginTop: -5
    },

    '&:link, &:visited, &:hover, &:active': {
      transform: 'scale(1.05)'
    },
  }
}

export default styles;