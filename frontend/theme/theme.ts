import { createTheme, Theme } from '@mui/material';
import { COLORS_DARK_THEME, COLORS_LIGHT_THEME } from './colors';
import { getComponentsTheme } from './components';
import { ColorsTheme, ThemeMode } from './types';
import { getPaletteTheme } from './palette';
import { getTypographyTheme } from './typography';



export const createCustomTheme = (mode: ThemeMode, colorsTheme: ColorsTheme): Theme => createTheme({
  palette: getPaletteTheme(mode, colorsTheme),
  components: getComponentsTheme(mode, colorsTheme),
  typography: getTypographyTheme(),
});

export const getTheme = (mode: ThemeMode = 'dark'): Theme => createCustomTheme(
  mode,
  'light' === mode ? COLORS_LIGHT_THEME : COLORS_DARK_THEME
);