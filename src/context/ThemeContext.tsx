import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance, ColorTheme } from '../types';

interface ThemeContextType {
  appearance: Appearance;
  colorTheme: ColorTheme;
  soundEnabled: boolean;
  reducedMotion: boolean;
  setAppearance: (a: Appearance) => void;
  setColorTheme: (c: ColorTheme) => void;
  setSoundEnabled: (s: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appearance, setAppearance] = useState<Appearance>(() => {
    return (localStorage.getItem('studyhabit_appearance') as Appearance) || 'system';
  });

  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    return (localStorage.getItem('studyhabit_colortheme') as ColorTheme) || 'green';
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('studyhabit_sound') === 'true';
  });

  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    // Check reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', handleMotionChange);
    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    // Appearance (Dark mode class)
    const isDark =
      appearance === 'dark' ||
      (appearance === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    root.classList.toggle('dark', isDark);

    // Color Theme attribute
    root.setAttribute('data-theme', colorTheme);

    localStorage.setItem('studyhabit_appearance', appearance);
    localStorage.setItem('studyhabit_colortheme', colorTheme);
    localStorage.setItem('studyhabit_sound', soundEnabled ? 'true' : 'false');
  }, [appearance, colorTheme, soundEnabled]);

  return (
    <ThemeContext.Provider
      value={{
        appearance,
        colorTheme,
        soundEnabled,
        reducedMotion,
        setAppearance,
        setColorTheme,
        setSoundEnabled,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
