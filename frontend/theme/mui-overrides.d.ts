import '@mui/material/SvgIcon';
import '@mui/material/styles';

declare module '@mui/material/SvgIcon' {
  interface SvgIconPropsColorOverrides {
    iconPrimary: true;
    iconSecondary: true;
  }
}

declare module '@mui/material/styles' {
  interface Palette {
    iconPrimary: Palette['primary'];
    iconSecondary: Palette['primary'];
  }
  interface PaletteOptions {
    iconPrimary?: PaletteOptions['primary'];
    iconSecondary?: PaletteOptions['primary'];
  }
}