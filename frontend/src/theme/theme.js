import { createTheme } from '@mui/material/styles';
import { colorsDark, colorsLight, typography, borderRadius } from './designTokens';

function getThemeOptions(mode) {
  const colors = mode === 'light' ? colorsLight : colorsDark;
  return {
    palette: {
      mode,
      primary: {
        main: colors.primary.main,
        light: colors.primary.light,
        dark: colors.primary.dark,
        contrastText: colors.text.primary,
      },
      secondary: {
        main: colors.secondary.main,
        light: colors.secondary.light,
        dark: colors.secondary.dark,
        contrastText: colors.background.primary,
      },
      background: {
        default: colors.background.primary,
        paper: colors.background.surface,
      },
      text: {
        primary: colors.text.primary,
        secondary: colors.text.secondary,
        disabled: colors.text.disabled,
      },
      success: { main: colors.success },
      error: { main: colors.error },
      warning: { main: colors.warning },
    },
    typography: {
      fontFamily: typography.fontFamily.primary,
      h1: { fontSize: typography.fontSize['4xl'], fontWeight: typography.fontWeight.bold },
      h2: { fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.bold },
      h3: { fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.semibold },
      h4: { fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.semibold },
      h5: { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold },
      h6: { fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold },
      body1: { fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.regular },
      body2: { fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.regular },
      button: { fontWeight: typography.fontWeight.semibold, textTransform: 'none' },
    },
    shape: { borderRadius: borderRadius.md },
    spacing: 8,
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { backgroundColor: colors.background.primary },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            minHeight: 48,
            borderRadius: borderRadius.md,
            fontWeight: typography.fontWeight.semibold,
            padding: '8px 24px',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none', filter: 'brightness(1.1)' },
          },
          containedPrimary: {
            background: 'linear-gradient(135deg, #6E39D0 0%, #A855F7 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
              filter: 'brightness(1.05)',
            },
          },
          outlined: { borderWidth: 2, '&:hover': { borderWidth: 2 } },
        },
      },
      MuiTextField: {
        defaultProps: { variant: 'outlined', size: 'medium' },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: borderRadius.md,
              backgroundColor: colors.background.surface,
              '& fieldset': { borderColor: colors.border.default },
              '&:hover fieldset': { borderColor: colors.text.secondary },
              '&.Mui-focused fieldset': {
                borderColor: colors.primary.main,
                borderWidth: 2,
              },
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: borderRadius.lg,
            backgroundColor: colors.background.surface,
            border: `1px solid ${colors.border.default}`,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: colors.background.secondary,
            borderBottom: `1px solid ${colors.border.default}`,
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: { borderRadius: borderRadius.md },
        },
      },
    },
  };
}

export function getTheme(mode = 'dark') {
  return createTheme(getThemeOptions(mode));
}

export const theme = getTheme('dark');
