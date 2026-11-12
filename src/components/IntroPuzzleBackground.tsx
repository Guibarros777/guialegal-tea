import React, { useEffect, useState, useMemo } from 'react';

interface PuzzlePieceData {
  id: number;
  row: number;
  col: number;
  color: string;
  initialX: number;
  initialY: number;
  initialRotate: number;
  delay: number;
  topTab: number;
  rightTab: number;
  bottomTab: number;
  leftTab: number;
  path: string;
}

export const IntroPuzzleBackground: React.FC<{ isCalmMode?: boolean }> = ({ isCalmMode = false }) => {
  const [isAssembled, setIsAssembled] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  // Exact Brand Colors from the official logo
  const brandColors = [
    '#0F2E4E', // Dark Navy
    '#0284C7', // Ocean Blue
    '#00A7B5', // Vibrant Teal
    '#14B8A6', // Mint Teal
    '#2DD4BF', // Light Mint
    '#F59E0B', // Amber Gold
    '#EA580C', // Coral Orange
    '#FBBF24', // Sun Yellow
    '#0369A1', // Deep Sky
    '#0D9488', // Emerald Teal
    '#D97706', // Rich Ochre
    '#1E3A8A', // Classic Deep Blue
  ];

  // Full-screen ViewBox coordinates: 1920 x 1080 (16:9 standard, covered with slice)
  const totalWidth = 1920;
  const totalHeight = 1080;
  const cols = 10;
  const rows = 6;
  const pieceWidth = totalWidth / cols; // 192px
  const pieceHeight = totalHeight / rows; // 180px

  // Generate deterministic interlocking tab matrices
  const pieces = useMemo(() => {
    // Horizontal tabs between piece (r, c) and (r, c+1)
    const hTabs: number[][] = [];
    for (let r = 0; r < rows; r++) {
      hTabs[r] = [];
      for (let c = 0; c < cols - 1; c++) {
        hTabs[r][c] = ((r * 7 + c * 13) % 2 === 0) ? 1 : -1;
      }
    }

    // Vertical tabs between piece (r, c) and (r+1, c)
    const vTabs: number[][] = [];
    for (let r = 0; r < rows - 1; r++) {
      vTabs[r] = [];
      for (let c = 0; c < cols; c++) {
        vTabs[r][c] = ((r * 11 + c * 5) % 2 === 0) ? 1 : -1;
      }
    }

    const list: PuzzlePieceData[] = [];
    let idCounter = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const topTab = r === 0 ? 0 : -vTabs[r - 1][c];
        const rightTab = c === cols - 1 ? 0 : hTabs[r][c];
        const bottomTab = r === rows - 1 ? 0 : vTabs[r][c];
        const leftTab = c === 0 ? 0 : -hTabs[r][c - 1];

        const x = c * pieceWidth;
        const y = r * pieceHeight;
        const path = generateJigsawPath(x, y, pieceWidth, pieceHeight, topTab, rightTab, bottomTab, leftTab);

        // Calculate scatter positions from outside the full viewport edges
        // Pieces on outer quadrants fly in from their respective screen sides
        const centerX = (cols - 1) / 2;
        const centerY = (rows - 1) / 2;
        const normDX = (c - centerX) / centerX; // -1 to 1
        const normDY = (r - centerY) / centerY; // -1 to 1

        const angle = Math.atan2(normDY, normDX);
        const distance = 800 + ((idCounter * 73) % 450); // scatter far beyond borders
        const initX = Math.cos(angle) * distance;
        const initY = Math.sin(angle) * distance;
        const initRotate = (((idCounter * 43) % 120) - 60);

        // Assembly order: cascade smoothly from outside in, or diagonally
        const distanceFromCenter = Math.sqrt(normDX * normDX + normDY * normDY);
        const delay = (distanceFromCenter * 0.35) + ((idCounter % 5) * 0.08);

        list.push({
          id: idCounter,
          row: r,
          col: c,
          color: brandColors[(r * 4 + c * 3 + idCounter) % brandColors.length],
          initialX: initX,
          initialY: initY,
          initialRotate: initRotate,
          delay: Math.min(delay, 1.4),
          topTab,
          rightTab,
          bottomTab,
          leftTab,
          path,
        });

        idCounter++;
      }
    }
    return list;
  }, []);

  useEffect(() => {
    // Trigger assembly animation shortly after initial mount
    const timer = setTimeout(() => {
      setIsAssembled(true);
    }, 150);
    return () => clearTimeout(timer);
  }, [clickCount]);

  // Click to trigger re-assembly animation for delight
  const handleReassemble = () => {
    setIsAssembled(false);
    setTimeout(() => {
      setClickCount((c) => c + 1);
      setIsAssembled(true);
    }, 120);
  };

  return (
    <div
      onClick={handleReassemble}
      className="absolute inset-0 w-full h-full overflow-hidden select-none cursor-pointer"
      title="Clique para remontar o quebra-cabeça"
    >
      {/* Background base tone */}
      <div className="absolute inset-0 bg-[#061220]" />

      {/* SVG Canvas stretched across the entire screen (cover / slice) */}
      <svg
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full block"
      >
        <defs>
          {/* Subtle drop shadow between pieces for genuine 3D jigsaw depth */}
          <filter id="puzzleShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000000" floodOpacity="0.6" />
          </filter>

          {/* Light surface sheen overlay for each puzzle piece */}
          <linearGradient id="pieceSheen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
          </linearGradient>

          {/* Golden shine accent for amber/yellow pieces */}
          <linearGradient id="warmSheen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* Puzzle Pieces Group */}
        {pieces.map((piece) => {
          const pieceCenterX = piece.col * pieceWidth + pieceWidth / 2;
          const pieceCenterY = piece.row * pieceHeight + pieceHeight / 2;

          const transformStyle = isAssembled
            ? 'translate(0px, 0px) rotate(0deg) scale(1)'
            : `translate(${piece.initialX}px, ${piece.initialY}px) rotate(${piece.initialRotate}deg) scale(0.7)`;

          return (
            <g
              key={piece.id}
              style={{
                transform: transformStyle,
                transformOrigin: `${pieceCenterX}px ${pieceCenterY}px`,
                transition: `transform ${isCalmMode ? '2.4s' : '1.7s'} cubic-bezier(0.2, 0.9, 0.3, 1) ${
                  piece.delay
                }s, opacity 1s ease`,
                opacity: isAssembled ? 0.92 : 0.15,
              }}
            >
              {/* Outer Piece Path with shadow */}
              <path
                d={piece.path}
                fill={piece.color}
                filter="url(#puzzleShadow)"
                stroke="#ffffff"
                strokeWidth="2"
                strokeOpacity="0.35"
              />

              {/* Surface Bevel and Highlight */}
              <path
                d={piece.path}
                fill="url(#pieceSheen)"
                stroke="#000000"
                strokeWidth="1"
                strokeOpacity="0.25"
              />

              {/* Subtle inner tab connector ring for visual delight */}
              <circle
                cx={pieceCenterX}
                cy={pieceCenterY}
                r={3}
                fill="#ffffff"
                fillOpacity="0.2"
              />
            </g>
          );
        })}
      </svg>

      {/* Dark Vignette Overlay: Keeps edges vivid and darkens the center slightly so the logo pops */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_rgba(6,18,32,0.55)_0%,_rgba(6,18,32,0.85)_75%,_rgba(4,12,22,0.95)_100%)]" />

      {/* Center Glow Aura behind the central logo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[680px] h-[500px] sm:h-[680px] bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[420px] h-[300px] sm:h-[420px] bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />

      {/* Helper cue at bottom */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] text-teal-300/60 uppercase tracking-widest font-semibold pointer-events-none">
        Quebra-cabeça GuiaLegal TEA • Fundo Completo
      </div>
    </div>
  );
};

/**
 * Generates an interlocking jigsaw puzzle piece path with authentic organic tabs and blanks.
 * topTab, rightTab, bottomTab, leftTab:
 *   1  = Tab protruding outward
 *  -1  = Blank receding inward
 *   0  = Flat outer boundary edge
 */
function generateJigsawPath(
  x: number,
  y: number,
  w: number,
  h: number,
  topTab: number,
  rightTab: number,
  bottomTab: number,
  leftTab: number
): string {
  // Proportions of the interlocking puzzle knob
  const neckW = w * 0.16;
  const headW = w * 0.28;
  const tabDepth = h * 0.22;

  let d = `M ${x} ${y} `;

  // TOP EDGE (from x,y to x+w,y)
  if (topTab === 0) {
    d += `H ${x + w} `;
  } else {
    const dir = topTab === 1 ? -1 : 1; // -1 is outward (upwards into -y)
    const midX = x + w / 2;
    d += `H ${midX - headW / 2} `;
    d += `C ${midX - headW / 2} ${y + dir * tabDepth * 0.25}, ${midX - neckW / 2} ${y + dir * tabDepth * 0.4}, ${midX - headW / 2} ${y + dir * tabDepth * 0.8} `;
    d += `C ${midX - headW * 0.6} ${y + dir * tabDepth * 1.15}, ${midX + headW * 0.6} ${y + dir * tabDepth * 1.15}, ${midX + headW / 2} ${y + dir * tabDepth * 0.8} `;
    d += `C ${midX + neckW / 2} ${y + dir * tabDepth * 0.4}, ${midX + headW / 2} ${y + dir * tabDepth * 0.25}, ${midX + headW / 2} ${y} `;
    d += `H ${x + w} `;
  }

  // RIGHT EDGE (from x+w,y to x+w,y+h)
  if (rightTab === 0) {
    d += `V ${y + h} `;
  } else {
    const dir = rightTab === 1 ? 1 : -1; // 1 is outward (rightwards into +x)
    const midY = y + h / 2;
    d += `V ${midY - headW / 2} `;
    d += `C ${x + w + dir * tabDepth * 0.25} ${midY - headW / 2}, ${x + w + dir * tabDepth * 0.4} ${midY - neckW / 2}, ${x + w + dir * tabDepth * 0.8} ${midY - headW / 2} `;
    d += `C ${x + w + dir * tabDepth * 1.15} ${midY - headW * 0.6}, ${x + w + dir * tabDepth * 1.15} ${midY + headW * 0.6}, ${x + w + dir * tabDepth * 0.8} ${midY + headW / 2} `;
    d += `C ${x + w + dir * tabDepth * 0.4} ${midY + neckW / 2}, ${x + w + dir * tabDepth * 0.25} ${midY + headW / 2}, ${x + w} ${midY + headW / 2} `;
    d += `V ${y + h} `;
  }

  // BOTTOM EDGE (from x+w,y+h to x,y+h)
  if (bottomTab === 0) {
    d += `H ${x} `;
  } else {
    const dir = bottomTab === 1 ? 1 : -1; // 1 is outward (downwards into +y)
    const midX = x + w / 2;
    d += `H ${midX + headW / 2} `;
    d += `C ${midX + headW / 2} ${y + h + dir * tabDepth * 0.25}, ${midX + neckW / 2} ${y + h + dir * tabDepth * 0.4}, ${midX + headW / 2} ${y + h + dir * tabDepth * 0.8} `;
    d += `C ${midX + headW * 0.6} ${y + h + dir * tabDepth * 1.15}, ${midX - headW * 0.6} ${y + h + dir * tabDepth * 1.15}, ${midX - headW / 2} ${y + h + dir * tabDepth * 0.8} `;
    d += `C ${midX - neckW / 2} ${y + h + dir * tabDepth * 0.4}, ${midX - headW / 2} ${y + h + dir * tabDepth * 0.25}, ${midX - headW / 2} ${y + h} `;
    d += `H ${x} `;
  }

  // LEFT EDGE (from x,y+h to x,y)
  if (leftTab === 0) {
    d += `Z`;
  } else {
    const dir = leftTab === 1 ? -1 : 1; // -1 is outward (leftwards into -x)
    const midY = y + h / 2;
    d += `V ${midY + headW / 2} `;
    d += `C ${x + dir * tabDepth * 0.25} ${midY + headW / 2}, ${x + dir * tabDepth * 0.4} ${midY + neckW / 2}, ${x + dir * tabDepth * 0.8} ${midY + headW / 2} `;
    d += `C ${x + dir * tabDepth * 1.15} ${midY + headW * 0.6}, ${x + dir * tabDepth * 1.15} ${midY - headW * 0.6}, ${x + dir * tabDepth * 0.8} ${midY - headW / 2} `;
    d += `C ${x + dir * tabDepth * 0.4} ${midY - neckW / 2}, ${x + dir * tabDepth * 0.25} ${midY - headW / 2}, ${x} ${midY - headW / 2} `;
    d += `Z`;
  }

  return d;
}
