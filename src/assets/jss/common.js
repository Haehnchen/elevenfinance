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

    bigger: '16px',
    normal: '14px',
    small: '13px',
  }
}

export const BORDER = {
  radius: '14px'
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
  }
}

export default styles;