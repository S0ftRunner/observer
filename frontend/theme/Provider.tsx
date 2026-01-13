import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { useMediaQuery, ThemeProvider as MuiThemeProvider } from '@mui/material';
import { CustomScrollbar } from './Scrollbar';
import { ThemeMode } from './types';
import { ContextType, ThemeModeContext } from './context';
import { getTheme } from './theme';


interface Props {
  children: ReactNode,
}

export const ThemeProvider: FC<Props> = ({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const maybeThemeMode = localStorage.getItem('themeMode') as ThemeMode | undefined;

  const [mode, setMode] = useState<ThemeMode>(() => maybeThemeMode || (prefersDarkMode ? 'dark' : 'light'));

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const valueProvider: ContextType = useMemo(() => ([mode, setMode]), [mode, setMode]);

  return (
    <MuiThemeProvider theme={getTheme(mode)}>
      <ThemeModeContext.Provider value={valueProvider}>
        <CustomScrollbar />
        {children}
      </ThemeModeContext.Provider>
    </MuiThemeProvider>
  );
};