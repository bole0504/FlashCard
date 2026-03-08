import { useState } from 'react';
import { IconButton, Tooltip, CircularProgress } from '@mui/material';
import { AutoAwesome } from '@mui/icons-material';

/**
 * AI assist button - placeholder for future AI integration.
 * On click: sentence correction, tense conjugation, or pronunciation.
 */
export function AiAssistButton({ onClick, disabled, 'aria-label': ariaLabel = 'AI assist' }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading || disabled) return;
    setLoading(true);
    try {
      await onClick?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tooltip title="AI will generate content (coming soon)">
      <span>
        <IconButton
          onClick={handleClick}
          disabled={disabled}
          aria-label={ariaLabel}
          size="small"
          sx={{
            color: 'secondary.main',
            '&:hover': { color: 'secondary.light', bgcolor: 'rgba(0, 200, 200, 0.1)' },
          }}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <AutoAwesome fontSize="small" />
          )}
        </IconButton>
      </span>
    </Tooltip>
  );
}
