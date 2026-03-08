/**
 * Design Tokens — Learn English App
 * Inspired by: Language Learning App (Figma Community)
 * https://www.figma.com/design/rTERVkcLfKPfNqK5NVRKEW
 */

export const colorsDark = {
  background: {
    primary: '#1E1E2A',
    secondary: '#252532',
    surface: '#2D2D3A',
    card: '#353542',
  },
  primary: {
    main: '#6E39D0',
    light: '#8B5CF6',
    dark: '#5B21B6',
    gradient: 'linear-gradient(135deg, #6E39D0 0%, #A855F7 50%, #EC4899 100%)',
  },
  secondary: {
    main: '#00C8C8',
    light: '#22D3D3',
    dark: '#0891B2',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#A1A1AA',
    disabled: '#71717A',
    inverse: '#18181B',
  },
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  border: {
    default: 'rgba(255, 255, 255, 0.12)',
    focus: 'rgba(110, 57, 208, 0.6)',
  },
};

export const colorsLight = {
  background: {
    primary: '#F5F5F7',
    secondary: '#FFFFFF',
    surface: '#FFFFFF',
    card: '#FFFFFF',
  },
  primary: {
    main: '#6E39D0',
    light: '#8B5CF6',
    dark: '#5B21B6',
    gradient: 'linear-gradient(135deg, #6E39D0 0%, #A855F7 50%, #EC4899 100%)',
  },
  secondary: {
    main: '#0891B2',
    light: '#22D3D3',
    dark: '#0E7490',
  },
  text: {
    primary: '#18181B',
    secondary: '#52525B',
    disabled: '#A1A1AA',
    inverse: '#FFFFFF',
  },
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  border: {
    default: 'rgba(0, 0, 0, 0.12)',
    focus: 'rgba(110, 57, 208, 0.6)',
  },
};

/** @deprecated Use colorsDark or colorsLight */
export const colors = colorsDark;

export const typography = {
  fontFamily: {
    primary: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    mono: '"JetBrains Mono", "Fira Code", monospace',
  },
  fontSize: {
    xs: '0.75rem',   // 12px
    sm: '0.875rem',  // 14px
    base: '1rem',    // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem',   // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};
