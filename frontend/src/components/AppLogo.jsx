import { useId } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

const TAGLINE = 'learn effectively on your own';

/**
 * Logo mark: open book with sprouting leaf — learning + growth
 * colorScheme: 'default' (gradient) | 'light' (white, for dark/gradient backgrounds)
 */
function LogoMark({ size = 48, colorScheme = 'default', ...props }) {
  const gradientId = useId().replace(/:/g, '');
  const useLight = colorScheme === 'light';
  const fill = useLight ? 'rgba(255,255,255,0.95)' : `url(#${gradientId})`;

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        flexShrink: 0,
        ...props.sx,
      }}
      {...props}
    >
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {!useLight && (
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6E39D0" />
              <stop offset="50%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        )}
        {/* Open book - left page */}
        <path d="M8 38V10c0-2 2-4 5-4h7v36H8z" fill={fill} opacity={useLight ? 1 : 0.9} />
        {/* Open book - right page */}
        <path d="M40 38V10c0-2-2-4-5-4h-7v36h12c2 0 4-2 4-4z" fill={fill} opacity={useLight ? 1 : 0.9} />
        {/* Center spine */}
        <path d="M21 6h6v36h-6z" fill={fill} opacity={useLight ? 0.9 : 0.65} />
        {/* Sprouting leaf - upward growth */}
        <path
          d="M24 10c-1.5 0-3 1.5-3 3.5 0 2 1.5 4 3 5.5 1.5-1.5 3-3.5 3-5.5 0-2-1.5-3.5-3-3.5z"
          fill={fill}
          opacity={useLight ? 1 : 0.95}
        />
      </svg>
    </Box>
  );
}

/**
 * Full logo: mark + "Learn English" + optional tagline
 * variant: 'full' | 'compact' | 'markOnly'
 */
export function AppLogo({
  variant = 'full',
  showTagline = true,
  to,
  size = 'medium',
  colorScheme = 'default',
  sx = {},
}) {
  const markSize = size === 'small' ? 32 : size === 'large' ? 64 : 48;
  const titleSize = size === 'small' ? 'h6' : size === 'large' ? 'h4' : 'h5';

  const alignFromSx = sx?.alignItems;
  const textAlign = alignFromSx === 'center' ? 'center' : 'left';

  const content = (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1.5,
        ...sx,
      }}
    >
      <LogoMark size={markSize} colorScheme={colorScheme} />
      {(variant === 'full' || variant === 'compact') && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: alignFromSx === 'center' ? 'center' : 'flex-start', textAlign }}>
          {showTagline && variant === 'full' && (
            <Typography
              variant="caption"
              sx={{
                color: 'inherit',
                opacity: 0.85,
                fontSize: size === 'small' ? '0.65rem' : '0.75rem',
                lineHeight: 1.2,
                mt: 0.25,
              }}
            >
              {TAGLINE}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );

  if (to) {
    return (
      <Box
        component={Link}
        to={to}
        sx={{
          textDecoration: 'none',
          color: 'inherit',
          '&:hover': { opacity: 0.9 },
        }}
      >
        {content}
      </Box>
    );
  }

  return content;
}

export default AppLogo;
