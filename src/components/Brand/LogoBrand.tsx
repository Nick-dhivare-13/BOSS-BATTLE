import React from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';
import { AppLogo } from './AppLogo';

export const LogoBrand: React.FC<{
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  showIconOnly?: boolean;
  className?: string;
}> = ({ size = 'md', showSubtitle = true, showIconOnly = false, className = '' }) => {
  const { reducedMotion } = useTheme();

  const logoSizeMap = {
    sm: 'sm' as const,
    md: 'md' as const,
    lg: 'lg' as const,
    xl: 'xl' as const,
  };

  const titleSizeMap = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl',
  };

  const subtitleSizeMap = {
    sm: 'text-[8px]',
    md: 'text-[9px]',
    lg: 'text-[11px]',
    xl: 'text-xs',
  };

  if (showIconOnly) {
    return <AppLogo size={logoSizeMap[size]} className={className} />;
  }

  return (
    <motion.div
      initial={reducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`flex items-center gap-3 select-none ${className}`}
    >
      <AppLogo size={logoSizeMap[size]} />
      <div className="flex flex-col">
        <h1
          className={`${titleSizeMap[size]} font-black tracking-tight leading-none text-slate-900 dark:text-white uppercase font-sans`}
        >
          BOSS BATTLES
        </h1>
        {showSubtitle && (
          <p
            className={`${subtitleSizeMap[size]} font-black text-[#10b981] tracking-widest mt-1 uppercase`}
          >
            STUDY. FIGHT. WIN.
          </p>
        )}
      </div>
    </motion.div>
  );
};

