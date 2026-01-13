import { PaletteOptions } from '@mui/material/styles';
import { ColorsTheme, ThemeMode } from './types';


export const getPaletteTheme = (mode: ThemeMode, colorsTheme: ColorsTheme): PaletteOptions => ({
  mode,
  primary: {
    main: colorsTheme.MAIN,
  },
  secondary: {
    main: colorsTheme.SECONDARY,
    dark: '#E0E0E0',
    contrastText: '#000000',
  },
  text: {
    primary: colorsTheme.TEXT_MAIN,
    secondary: colorsTheme.TEXT_SECONDARY,
  },
  success: {
    main: '#4AD13BCC',
  },
  info: {
    main: '#5E9AFFB2',
  },
  error: {
    main: '#FF686899',
  },
  iconPrimary: {
    main: colorsTheme.ICON_MAIN,
  },
  iconSecondary: {
    main: colorsTheme.ICON_SECONDARY,
  },
});