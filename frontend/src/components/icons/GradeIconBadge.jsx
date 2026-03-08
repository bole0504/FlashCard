import { Box } from '@mui/material';
import { getGradeInfo } from '../../constants/grades';

/**
 * Badge-style grade icon: number inside a circular/rounded badge
 * Color varies by group: Primary (green), Middle (amber), High (pink)
 */
export function GradeIconBadge({ grade, size = 48, ...props }) {
  const info = getGradeInfo(grade);

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: '50%',
        bgcolor: info.color,
        color: 'white',
        fontWeight: 700,
        fontSize: size * 0.45,
        boxShadow: `0 2px 8px ${info.color}40`,
        ...props.sx,
      }}
      {...props}
    >
      {grade}
    </Box>
  );
}
