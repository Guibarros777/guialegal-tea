import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  showText?: boolean;
  className?: string;
  variant?: 'app_icon' | 'horizontal' | 'mark_with_text';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  showText = true,
  className = '',
  variant = 'app_icon',
}) => {
  // If user requests the full horizontal lockup directly
  if (variant === 'horizontal') {
    const horizontalHeights = {
      sm: 'h-8',
      md: 'h-11',
      lg: 'h-14',
      xl: 'h-20',
    };
    return (
      <div className={`flex items-center ${className}`}>
        <img
          src="/logo_horizontal.png"
          alt="GuiaLegal TEA - Cidadania & Direitos"
          className={`${horizontalHeights[size]} w-auto object-contain`}
        />
      </div>
    );
  }

  const iconSizes = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-11 h-11 rounded-xl',
    lg: 'w-16 h-16 rounded-2xl',
    xl: 'w-24 h-24 rounded-3xl',
  };

  const titleSizes = {
    sm: 'text-sm font-extrabold',
    md: 'text-lg font-black',
    lg: 'text-2xl font-black',
    xl: 'text-3xl font-black',
  };

  const subSizes = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
    xl: 'text-base',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Official App Icon extracted with pixel-perfect fidelity from the author's brand sheet */}
      <div className={`shrink-0 overflow-hidden shadow-lg border border-cyan-500/30 ${iconSizes[size]}`}>
        <img
          src="/app_icon.png"
          alt="GuiaLegal TEA Ícone Oficial"
          className="w-full h-full object-cover"
        />
      </div>

      {showText && (
        <div>
          <div className={`tracking-tight text-white flex items-center gap-1.5 ${titleSizes[size]}`}>
            <span>GuiaLegal</span>
            <span className="text-teal-400">TEA</span>
          </div>
          {showSubtitle && (
            <p className={`font-semibold text-slate-400 tracking-wider uppercase ${subSizes[size]}`}>
              Cidadania & Direitos
            </p>
          )}
        </div>
      )}
    </div>
  );
};
