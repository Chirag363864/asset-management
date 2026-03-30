// src/theme.js
import { alpha, createTheme } from '@mui/material/styles';

// Premium Color System - Tone-based layering
const lightPalette = {
  mode: 'light',
  primary: { 
    main: '#0A84FF',
    light: '#5AB4FF', 
    dark: '#0066CC',
    contrastText: '#FFFFFF' 
  },
  secondary: { 
    main: '#FFD166',
    light: '#FFE099',
    dark: '#E6BC4D',
    contrastText: '#0F172A' 
  },
  success: { 
    main: '#10B981',
    light: '#34D399',
    dark: '#059669'
  },
  warning: { 
    main: '#F59E0B',
    light: '#FBBF24',
    dark: '#D97706'
  },
  error: { 
    main: '#EF4444',
    light: '#F87171',
    dark: '#DC2626'
  },
  info: {
    main: '#3B82F6',
    light: '#60A5FA',
    dark: '#2563EB'
  },
  grey: {
    50: '#FAFBFC',
    100: '#F4F6F8',
    200: '#E8ECF0',
    300: '#D1D9E0',
    400: '#9BA8B8',
    500: '#6B7A90',
    600: '#4A5568',
    700: '#2D3748',
    800: '#1A202C',
    900: '#0F1419',
  },
  background: { 
    default: 'linear-gradient(135deg, #F8FAFB 0%, #EEF2F6 50%, #E8ECF3 100%)',
    paper: 'rgba(255, 255, 255, 0.85)',
    elevated: 'rgba(255, 255, 255, 0.95)'
  },
  divider: 'rgba(15, 23, 42, 0.06)',
  text: {
    primary: '#0F172A',
    secondary: '#475569',
    disabled: '#94A3B8'
  },
  action: {
    active: '#0A84FF',
    hover: 'rgba(10, 132, 255, 0.04)',
    selected: 'rgba(10, 132, 255, 0.08)',
    disabled: 'rgba(0, 0, 0, 0.26)',
    disabledBackground: 'rgba(0, 0, 0, 0.12)',
  }
};

const darkPalette = {
  mode: 'dark',
  primary: { 
    main: '#0A84FF',
    light: '#3D9EFF', 
    dark: '#0066CC',
    contrastText: '#FFFFFF' 
  },
  secondary: { 
    main: '#FFD166',
    light: '#FFE099',
    dark: '#E6BC4D',
    contrastText: '#0F172A' 
  },
  success: { 
    main: '#30D158',
    light: '#5AE276',
    dark: '#28A745'
  },
  warning: { 
    main: '#FFD166',
    light: '#FFE099',
    dark: '#E6BC4D'
  },
  error: { 
    main: '#FF453A',
    light: '#FF6961',
    dark: '#E63946'
  },
  info: {
    main: '#5AB4FF',
    light: '#7DC4FF',
    dark: '#3D9EFF'
  },
  grey: {
    50: '#1A1F2E',
    100: '#202738',
    200: '#2A3142',
    300: '#3A4256',
    400: '#4E5A6E',
    500: '#6B7A90',
    600: '#9BA8B8',
    700: '#C4CFE0',
    800: '#DFE6F0',
    900: '#F0F4F8',
  },
  background: { 
    default: 'linear-gradient(135deg, #0B0F19 0%, #12161F 50%, #1A1F2E 100%)',
    paper: 'rgba(26, 31, 46, 0.85)',
    elevated: 'rgba(32, 39, 56, 0.95)'
  },
  divider: 'rgba(255, 255, 255, 0.08)',
  text: {
    primary: '#F0F4F8',
    secondary: '#9BA8B8',
    disabled: '#4E5A6E'
  },
  action: {
    active: '#0A84FF',
    hover: 'rgba(10, 132, 255, 0.08)',
    selected: 'rgba(10, 132, 255, 0.12)',
    disabled: 'rgba(255, 255, 255, 0.26)',
    disabledBackground: 'rgba(255, 255, 255, 0.12)',
  }
};

const shape = { 
  borderRadius: 16,
  borderRadiusLarge: 24,
  borderRadiusSmall: 12
};

const getTypography = (palette) => ({
  fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  h1: { 
    fontWeight: 700, 
    fontSize: '2.5rem',
    lineHeight: 1.2,
    letterSpacing: '-0.03em',
    fontFamily: '"Inter", sans-serif'
  },
  h2: { 
    fontWeight: 700, 
    fontSize: '2rem',
    lineHeight: 1.3,
    letterSpacing: '-0.02em',
    fontFamily: '"Inter", sans-serif'
  },
  h3: { 
    fontWeight: 600, 
    fontSize: '1.5rem',
    lineHeight: 1.4,
    letterSpacing: '-0.01em'
  },
  h4: { 
    fontWeight: 600, 
    fontSize: '1.25rem',
    lineHeight: 1.5,
    letterSpacing: '-0.01em'
  },
  h5: { 
    fontWeight: 600, 
    fontSize: '1.125rem',
    lineHeight: 1.5
  },
  h6: {
    fontWeight: 600,
    fontSize: '1rem',
    lineHeight: 1.5
  },
  subtitle1: { 
    fontSize: '1rem',
    lineHeight: 1.6,
    fontWeight: 500,
    color: palette.text.secondary
  },
  subtitle2: {
    fontSize: '0.875rem',
    lineHeight: 1.6,
    fontWeight: 500,
    color: palette.text.secondary
  },
  body1: { 
    fontSize: '1rem',
    lineHeight: 1.7,
    fontWeight: 400,
    color: palette.text.primary
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.6,
    fontWeight: 400,
    color: palette.text.secondary
  },
  caption: {
    fontSize: '0.75rem',
    lineHeight: 1.5,
    fontWeight: 400,
    color: palette.text.disabled
  },
  overline: {
    fontSize: '0.75rem',
    lineHeight: 2,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: palette.text.secondary
  },
  button: { 
    textTransform: 'none', 
    fontWeight: 600,
    letterSpacing: '0.01em',
    fontSize: '0.9375rem'
  }
});

// Sophisticated shadow system with layered depth
const lightShadows = [
  'none',
  '0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.04)', // xs
  '0 2px 4px rgba(15, 23, 42, 0.04), 0 4px 8px rgba(15, 23, 42, 0.06)', // sm
  '0 4px 8px rgba(15, 23, 42, 0.06), 0 8px 16px rgba(15, 23, 42, 0.08)', // md
  '0 8px 16px rgba(15, 23, 42, 0.08), 0 16px 32px rgba(15, 23, 42, 0.10)', // lg
  '0 16px 32px rgba(15, 23, 42, 0.10), 0 24px 48px rgba(15, 23, 42, 0.12)', // xl
  ...Array(19).fill('0 4px 8px rgba(15, 23, 42, 0.06), 0 8px 16px rgba(15, 23, 42, 0.08)')
];

const darkShadows = [
  'none',
  '0 1px 2px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.4)', // xs
  '0 2px 4px rgba(0, 0, 0, 0.4), 0 4px 8px rgba(0, 0, 0, 0.5)', // sm
  '0 4px 8px rgba(0, 0, 0, 0.5), 0 8px 16px rgba(0, 0, 0, 0.6)', // md
  '0 8px 16px rgba(0, 0, 0, 0.6), 0 16px 32px rgba(0, 0, 0, 0.7)', // lg
  '0 16px 32px rgba(0, 0, 0, 0.7), 0 24px 48px rgba(0, 0, 0, 0.8)', // xl
  ...Array(19).fill('0 4px 8px rgba(0, 0, 0, 0.5), 0 8px 16px rgba(0, 0, 0, 0.6)')
];

const getComponents = (mode, palette) => ({
  MuiCssBaseline: {
    styleOverrides: {
      '@import': [
        'url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap")'
      ],
      body: {
        background: mode === 'light' 
          ? 'linear-gradient(135deg, #F8FAFB 0%, #EEF2F6 50%, #E8ECF3 100%)'
          : 'linear-gradient(135deg, #0B0F19 0%, #12161F 50%, #1A1F2E 100%)',
        minHeight: '100vh',
        transition: 'background 0.5s cubic-bezier(0.4, 0, 0.2, 1), color 0.3s ease',
        overflowX: 'hidden'
      },
      '*': { 
        boxSizing: 'border-box',
        margin: 0,
        padding: 0
      },
      '*, *::before, *::after': { 
        boxSizing: 'inherit',
        transition: 'color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease, transform 0.2s ease'
      },
      '::-webkit-scrollbar': { 
        width: 8, 
        height: 8 
      },
      '::-webkit-scrollbar-track': {
        background: mode === 'light' ? 'rgba(15, 23, 42, 0.03)' : 'rgba(255, 255, 255, 0.03)',
        borderRadius: 4
      },
      '::-webkit-scrollbar-thumb': { 
        backgroundColor: mode === 'light' ? 'rgba(15, 23, 42, 0.15)' : 'rgba(255, 255, 255, 0.15)', 
        borderRadius: 4,
        '&:hover': {
          backgroundColor: mode === 'light' ? 'rgba(15, 23, 42, 0.25)' : 'rgba(255, 255, 255, 0.25)'
        }
      },
      '@keyframes fadeIn': {
        from: { opacity: 0, transform: 'translateY(8px)' },
        to: { opacity: 1, transform: 'translateY(0)' }
      },
      '@keyframes slideIn': {
        from: { opacity: 0, transform: 'translateX(-16px)' },
        to: { opacity: 1, transform: 'translateX(0)' }
      },
      '@keyframes scaleIn': {
        from: { opacity: 0, transform: 'scale(0.95)' },
        to: { opacity: 1, transform: 'scale(1)' }
      }
    }
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: shape.borderRadius,
        backgroundColor: mode === 'light' 
          ? 'rgba(255, 255, 255, 0.85)' 
          : 'rgba(26, 31, 46, 0.85)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: mode === 'light' 
          ? '1px solid rgba(15, 23, 42, 0.08)' 
          : '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: mode === 'light' 
          ? '0 4px 8px rgba(15, 23, 42, 0.06), 0 8px 16px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)' 
          : '0 4px 8px rgba(0, 0, 0, 0.5), 0 8px 16px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: mode === 'light'
            ? '0 8px 16px rgba(15, 23, 42, 0.08), 0 16px 32px rgba(15, 23, 42, 0.10)'
            : '0 8px 16px rgba(0, 0, 0, 0.6), 0 16px 32px rgba(0, 0, 0, 0.7)',
          borderColor: mode === 'light'
            ? 'rgba(10, 132, 255, 0.15)'
            : 'rgba(10, 132, 255, 0.25)'
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: mode === 'light'
            ? 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)'
        }
      }
    }
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundColor: mode === 'light' 
          ? 'rgba(255, 255, 255, 0.85)' 
          : 'rgba(26, 31, 46, 0.85)',
        boxShadow: mode === 'light' 
          ? '0 2px 8px rgba(15, 23, 42, 0.04), 0 4px 16px rgba(15, 23, 42, 0.06)' 
          : '0 2px 8px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: mode === 'light' 
          ? '1px solid rgba(15, 23, 42, 0.08)' 
          : '1px solid rgba(255, 255, 255, 0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: mode === 'light'
            ? 'linear-gradient(90deg, transparent, rgba(10, 132, 255, 0.1), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(10, 132, 255, 0.2), transparent)'
        }
      }
    }
  },
  MuiButton: {
    styleOverrides: {
      root: { 
        borderRadius: 12, 
        paddingInline: 20, 
        paddingBlock: 10,
        fontSize: '0.9375rem',
        fontWeight: 600,
        letterSpacing: '0.01em',
        textTransform: 'none',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 0,
          height: 0,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.2)',
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.6s, height 0.6s'
        },
        '&:active::before': {
          width: '300px',
          height: '300px'
        }
      },
      containedPrimary: {
        background: mode === 'light' 
          ? 'linear-gradient(135deg, #0A84FF 0%, #0066CC 100%)' 
          : 'linear-gradient(135deg, #0A84FF 0%, #3D9EFF 100%)',
        boxShadow: mode === 'light' 
          ? '0 4px 12px rgba(10, 132, 255, 0.25), 0 2px 4px rgba(10, 132, 255, 0.15)' 
          : '0 4px 12px rgba(10, 132, 255, 0.35), 0 2px 4px rgba(10, 132, 255, 0.25)',
        color: '#FFFFFF',
        '&:hover': {
          background: mode === 'light' 
            ? 'linear-gradient(135deg, #0066CC 0%, #004C99 100%)' 
            : 'linear-gradient(135deg, #3D9EFF 0%, #0A84FF 100%)',
          boxShadow: mode === 'light' 
            ? '0 6px 20px rgba(10, 132, 255, 0.35), 0 4px 8px rgba(10, 132, 255, 0.25)' 
            : '0 6px 20px rgba(10, 132, 255, 0.45), 0 4px 8px rgba(10, 132, 255, 0.35)',
          transform: 'translateY(-2px) scale(1.01)'
        },
        '&:active': {
          transform: 'translateY(0) scale(0.98)'
        }
      },
      containedSecondary: {
        background: mode === 'light'
          ? 'linear-gradient(135deg, #FFD166 0%, #E6BC4D 100%)'
          : 'linear-gradient(135deg, #FFD166 0%, #FFE099 100%)',
        color: '#0F172A',
        boxShadow: mode === 'light'
          ? '0 4px 12px rgba(255, 209, 102, 0.25)'
          : '0 4px 12px rgba(255, 209, 102, 0.35)',
        '&:hover': {
          background: mode === 'light'
            ? 'linear-gradient(135deg, #E6BC4D 0%, #CCA944 100%)'
            : 'linear-gradient(135deg, #FFE099 0%, #FFD166 100%)',
          transform: 'translateY(-2px) scale(1.01)'
        }
      },
      outlined: {
        backgroundColor: mode === 'light' 
          ? 'rgba(255, 255, 255, 0.7)' 
          : 'rgba(26, 31, 46, 0.7)',
        backdropFilter: 'blur(10px)',
        borderWidth: '1.5px',
        borderColor: mode === 'light'
          ? alpha(palette.primary.main, 0.3)
          : alpha(palette.primary.main, 0.4),
        color: palette.primary.main,
        '&:hover': { 
          backgroundColor: mode === 'light' 
            ? 'rgba(255, 255, 255, 0.9)' 
            : 'rgba(26, 31, 46, 0.9)',
          borderColor: palette.primary.main,
          borderWidth: '1.5px',
          transform: 'translateY(-2px)',
          boxShadow: mode === 'light'
            ? '0 4px 12px rgba(10, 132, 255, 0.15)'
            : '0 4px 12px rgba(10, 132, 255, 0.25)'
        }
      },
      text: {
        color: palette.primary.main,
        '&:hover': {
          backgroundColor: mode === 'light'
            ? 'rgba(10, 132, 255, 0.04)'
            : 'rgba(10, 132, 255, 0.08)'
        }
      }
    }
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: shape.borderRadius,
        backgroundColor: mode === 'light' 
          ? 'rgba(255, 255, 255, 0.85)' 
          : 'rgba(26, 31, 46, 0.85)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: mode === 'light' 
          ? '1px solid rgba(15, 23, 42, 0.08)' 
          : '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: mode === 'light' 
          ? '0 4px 8px rgba(15, 23, 42, 0.06), 0 8px 16px rgba(15, 23, 42, 0.08)' 
          : '0 4px 8px rgba(0, 0, 0, 0.5), 0 8px 16px rgba(0, 0, 0, 0.6)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      },
      elevation0: {
        boxShadow: 'none'
      },
      elevation1: {
        boxShadow: mode === 'light'
          ? '0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.04)'
          : '0 1px 2px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.4)'
      },
      elevation2: {
        boxShadow: mode === 'light'
          ? '0 2px 4px rgba(15, 23, 42, 0.04), 0 4px 8px rgba(15, 23, 42, 0.06)'
          : '0 2px 4px rgba(0, 0, 0, 0.4), 0 4px 8px rgba(0, 0, 0, 0.5)'
      }
    }
  },
  MuiTextField: {
    defaultProps: { size: 'medium', variant: 'outlined' },
    styleOverrides: {
      root: {
        '& .MuiInputLabel-root': {
          color: palette.text.secondary,
          '&.Mui-focused': {
            color: palette.primary.main
          }
        }
      }
    }
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        backgroundColor: mode === 'light'
          ? 'rgba(255, 255, 255, 0.7)'
          : 'rgba(26, 31, 46, 0.7)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          backgroundColor: mode === 'light'
            ? 'rgba(255, 255, 255, 0.9)'
            : 'rgba(26, 31, 46, 0.9)'
        },
        '&:hover .MuiOutlinedInput-notchedOutline': { 
          borderColor: mode === 'light' 
            ? palette.grey[400] 
            : palette.grey[600],
          borderWidth: '1.5px'
        },
        '&.Mui-focused': {
          backgroundColor: mode === 'light'
            ? 'rgba(255, 255, 255, 1)'
            : 'rgba(32, 39, 56, 1)',
          boxShadow: mode === 'light'
            ? `0 0 0 3px ${alpha(palette.primary.main, 0.1)}`
            : `0 0 0 3px ${alpha(palette.primary.main, 0.2)}`
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { 
          borderColor: palette.primary.main, 
          borderWidth: 2
        }
      },
      notchedOutline: {
        borderColor: mode === 'light'
          ? 'rgba(15, 23, 42, 0.12)'
          : 'rgba(255, 255, 255, 0.12)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
      }
    }
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        fontWeight: 500,
        fontSize: '0.8125rem',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'scale(1.05)'
        }
      },
      filled: {
        backgroundColor: mode === 'light'
          ? alpha(palette.primary.main, 0.1)
          : alpha(palette.primary.main, 0.2),
        color: palette.primary.main,
        '&:hover': {
          backgroundColor: mode === 'light'
            ? alpha(palette.primary.main, 0.15)
            : alpha(palette.primary.main, 0.25)
        }
      },
      outlined: {
        borderColor: mode === 'light'
          ? alpha(palette.primary.main, 0.3)
          : alpha(palette.primary.main, 0.4),
        color: palette.primary.main
      }
    }
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        borderRadius: 8,
        backgroundColor: mode === 'light'
          ? 'rgba(15, 23, 42, 0.95)'
          : 'rgba(240, 244, 248, 0.95)',
        color: mode === 'light' ? '#FFFFFF' : '#0F172A',
        backdropFilter: 'blur(10px)',
        padding: '8px 12px',
        fontSize: '0.8125rem',
        fontWeight: 500,
        boxShadow: mode === 'light'
          ? '0 4px 12px rgba(15, 23, 42, 0.2)'
          : '0 4px 12px rgba(0, 0, 0, 0.5)'
      },
      arrow: {
        color: mode === 'light'
          ? 'rgba(15, 23, 42, 0.95)'
          : 'rgba(240, 244, 248, 0.95)'
      }
    }
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        border: 0,
        boxShadow: mode === 'light'
          ? '0 8px 32px rgba(15, 23, 42, 0.12)'
          : '0 8px 32px rgba(0, 0, 0, 0.6)',
        backgroundColor: mode === 'light'
          ? 'rgba(255, 255, 255, 0.95)'
          : 'rgba(26, 31, 46, 0.95)',
        backdropFilter: 'blur(20px)'
      }
    }
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'scale(1.1)',
          backgroundColor: mode === 'light'
            ? alpha(palette.primary.main, 0.08)
            : alpha(palette.primary.main, 0.12)
        },
        '&:active': {
          transform: 'scale(0.95)'
        }
      }
    }
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: {
        borderRadius: 4,
        height: 6,
        backgroundColor: mode === 'light'
          ? alpha(palette.primary.main, 0.1)
          : alpha(palette.primary.main, 0.15)
      },
      bar: {
        borderRadius: 4,
        background: `linear-gradient(90deg, ${palette.primary.main}, ${palette.primary.light})`
      }
    }
  },
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        backdropFilter: 'blur(10px)',
        border: mode === 'light'
          ? '1px solid rgba(15, 23, 42, 0.08)'
          : '1px solid rgba(255, 255, 255, 0.08)'
      },
      standardSuccess: {
        backgroundColor: mode === 'light'
          ? alpha(palette.success.main, 0.1)
          : alpha(palette.success.main, 0.15),
        color: mode === 'light' ? palette.success.dark : palette.success.light
      },
      standardError: {
        backgroundColor: mode === 'light'
          ? alpha(palette.error.main, 0.1)
          : alpha(palette.error.main, 0.15),
        color: mode === 'light' ? palette.error.dark : palette.error.light
      },
      standardWarning: {
        backgroundColor: mode === 'light'
          ? alpha(palette.warning.main, 0.1)
          : alpha(palette.warning.main, 0.15),
        color: mode === 'light' ? palette.warning.dark : palette.warning.light
      },
      standardInfo: {
        backgroundColor: mode === 'light'
          ? alpha(palette.info.main, 0.1)
          : alpha(palette.info.main, 0.15),
        color: mode === 'light' ? palette.info.dark : palette.info.light
      }
    }
  }
});

export const getTheme = (mode) => {
  const palette = mode === 'light' ? lightPalette : darkPalette;
  const shadows = mode === 'light' ? lightShadows : darkShadows;
  const typography = getTypography(palette);
  const components = getComponents(mode, palette);
  
  return createTheme({ palette, shape, typography, shadows, components, spacing: 8 });
};
