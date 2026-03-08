import { Box } from '@mui/material';
import { getGradeInfo } from '../../constants/grades';

/**
 * Level icon - Tree growth style:
 * Primary (1-5): Seedling - stem + small leaves
 * Middle (6-8): Young tree - triangular/conical shape, thin trunk
 * High (9-12): Mature tree - round full canopy, thick trunk
 */
export function LevelIconTree({ grade, size = 48, ...props }) {
  const info = getGradeInfo(grade);

  const getSvg = () => {
    if (info.group === 'primary') return <SeedlingSvg grade={grade} />;
    if (info.group === 'middle') return <YoungTreeSvg grade={grade} />;
    return <MatureTreeSvg grade={grade} />;
  };

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        color: info.color,
        ...props.sx,
      }}
      {...props}
    >
      <svg width={size} height={size} viewBox="0 0 48 48" fill="currentColor">
        {getSvg()}
      </svg>
    </Box>
  );
}

/** Primary: Cute seedling - stem + 2 leaves, grows with grade */
function SeedlingSvg({ grade }) {
  const scale = 0.6 + (grade / 5) * 0.4;
  return (
    <g transform={`translate(24, 24) scale(${scale}) translate(-24, -24)`}>
      <path d="M24 26 Q22 20 24 14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M24 26 Q26 20 24 14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="20" cy="16" rx="5" ry="7" fill="currentColor" opacity="0.95" transform="rotate(-20 20 16)" />
      <ellipse cx="28" cy="16" rx="5" ry="7" fill="currentColor" opacity="0.95" transform="rotate(20 28 16)" />
      <path d="M24 28 L24 44" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  );
}

/** Middle: Young tree - conical shape (like pine), thin trunk, distinct silhouette */
function YoungTreeSvg({ grade }) {
  const progress = (grade - 5) / 3;
  const trunkHeight = 8 + progress * 4;
  const trunkWidth = 3;
  const topWidth = 6 + progress * 8;
  const midWidth = 10 + progress * 6;
  const baseWidth = 14 + progress * 4;

  return (
    <g>
      {/* Trunk - thin, centered */}
      <rect
        x={24 - trunkWidth / 2}
        y={44 - trunkHeight}
        width={trunkWidth}
        height={trunkHeight}
        rx="1"
        fill="currentColor"
        opacity="0.85"
      />
      {/* Conical canopy - 3 triangular layers */}
      <path
        d={`M24 ${12 - progress * 2} L${24 - topWidth} ${28} L${24 + topWidth} ${28} Z`}
        fill="currentColor"
        opacity="0.95"
      />
      <path
        d={`M24 ${18 - progress} L${24 - midWidth} ${32} L${24 + midWidth} ${32} Z`}
        fill="currentColor"
        opacity="0.85"
      />
      <path
        d={`M24 ${24} L${24 - baseWidth} ${40} L${24 + baseWidth} ${40} Z`}
        fill="currentColor"
        opacity="0.75"
      />
    </g>
  );
}

/** High: Mature tree - round full canopy, thick trunk, lush appearance */
function MatureTreeSvg({ grade }) {
  const progress = (grade - 8) / 4;
  const trunkWidth = 6 + progress * 2;
  const canopyY = 10 - progress * 2;
  const r1 = 14 + progress * 2;
  const r2 = 12 + progress * 2;
  const r3 = 10 + progress;

  return (
    <g>
      {/* Thick trunk */}
      <rect
        x={24 - trunkWidth / 2}
        y={36}
        width={trunkWidth}
        height={12}
        rx="2"
        fill="currentColor"
        opacity="0.8"
      />
      {/* Full round canopy - 3 overlapping circles for lush look */}
      <circle cx="24" cy={canopyY} r={r1} fill="currentColor" opacity="0.9" />
      <circle cx="20" cy={canopyY + 6} r={r2} fill="currentColor" opacity="0.85" />
      <circle cx="28" cy={canopyY + 6} r={r2} fill="currentColor" opacity="0.85" />
      <circle cx="24" cy={canopyY + 10} r={r3} fill="currentColor" opacity="0.8" />
    </g>
  );
}
