import { alpha, Components, Theme } from '@mui/material';
import { ColorsTheme, ThemeMode } from './types';

// TODO: Create folders for each component and join 'em in single index file
export const getComponentsTheme = (mode: ThemeMode, colorsTheme: ColorsTheme): Components<Omit<Theme, 'components'>> => ({
  MuiSelect: {
    styleOverrides: {
      root: ({ theme }) => ({
        minHeight: '50px',
        opacity: 1,
        borderRadius: '10px',
        padding: '0 10px',

        '& .MuiInputBase-input': {
          padding: 0,
          fontSize: '16px',
          borderRadius: '10px',
          '-webkit-text-fill-color': colorsTheme.TEXT_MAIN,
          '-webkit-box-shadow': `inset 0 0 0 1000px ${theme.palette.background.paper}`,
          '&:-webkit-autofill': {
            '-webkit-text-fill-color': colorsTheme.TEXT_MAIN,
            '-webkit-box-shadow': `inset 0 0 0 1000px ${theme.palette.background.paper} inset`,
          },
        },
        '& .MuiOutlinedInput-root': {
          borderRadius: '10px',

          '& fieldset': {
            border: 0,
            borderRadius: '8px',
          },

          '&:hover fieldset': {
            border: `1px solid ${colorsTheme.MAIN}`,
            borderRadius: '8px',
          },

          '&.Mui-focused fieldset': {
            border: `1px solid ${colorsTheme.MAIN}`,
            borderRadius: '8px',
          },
        },
      }),
      select: {
        transition: 'background-color 0.3s, color 0.3s',
      },
    },
  },
  MuiInput: {
    styleOverrides: {
      input: {
        paddingTop: 10,
        paddingBottom: 10,
        fontSize: 16,
        lineHeight: 1.5,
        transition: 'background-color 0.3s, color 0.3s',
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        borderRadius: '10px',
        padding: '10px',
        fontSize: '16px',
        fontWeight: 400,
        lineHeight: '24px',
      },
    },
  },
  MuiToggleButtonGroup: {
    styleOverrides: {
      root: {
        display: 'flex',
        gap: '0px !important',
        '&.MuiToggleButtonGroup-horizontal': {
          '& .MuiToggleButton-root': {
            '&:first-of-type': {
              borderRadius: '10px 0 0 10px',
              borderRight: 0,
            },
            '&:last-of-type': {
              borderLeft: 0,
              borderRadius: '0 10px 10px 0',
            },
          },
        },
        '&.MuiToggleButtonGroup-vertical': {
          flexDirection: 'column',
          '& .MuiToggleButton-root': {
            width: '100%',
            '&:first-of-type': {
              borderRadius: '10px 10px 0 0',
            },
            '&:last-of-type': {
              borderRadius: '0 0 10px 10px',
            },
          },
        },
        '& .MuiToggleButton-root': {
          flex: 1,
          margin: 0,
        },
      },
    },
  },
  MuiToggleButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        padding: '10px 20px',
        height: '44px',
        flex: 1,
        transition: 'all 0.3s',
        border: '1px solid #B3B3B3',
        fontWeight: 400,
        color: colorsTheme.TEXT_MAIN,
        '&:not(.Mui-selected) .MuiTypography-root': {
          color: 'inherit',
          textWrap: 'nowrap',
        },
        '&.Mui-selected': {
          color: 'white !important',
          backgroundColor: colorsTheme.MAIN,
          border: `1px solid ${colorsTheme.MAIN}`,
          fontWeight: 700,
          '&:hover': {
            backgroundColor: colorsTheme.MAIN_HOVER,
            border: `1px solid ${colorsTheme.MAIN_HOVER}`,
          },
          '& .MuiTypography-root': {
            color: 'inherit !important',
            fontWeight: 'inherit !important',
            lineHeight: '24px',
            textWrap: 'nowrap',
          },
        },
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        borderRadius: '10px',
        transition: 'all 0.3s',
        boxShadow: '0px 2px 20px 0px #0000001A',
        gap: '8px',
        padding: '12px 30px',
        margin: 0,
        fontWeight: 700,
        lineHeight: '24px',
        '&.MuiButton-sizeSmall': {
          padding: '8px 16px',
          fontSize: '14px',
        },
        '&.MuiButton-sizeMedium': {
          padding: '12px 24px',
          fontSize: '16px',
        },
        '&.MuiButton-sizeLarge': {
          padding: '10px 24px 10px 30px',
          fontSize: '18px',
          lineHeight: '26px',
          minHeight: '60px',
        },
      },
      contained: {
        color: '#FFF',
      },
      containedSecondary: ({ theme }) => ({
        '--variant-containedColor': '#000000',
        '--variant-containedBg': theme.palette.secondary.main,
        color: '#000000',
        backgroundColor: theme.palette.secondary.main,
        '&:hover': {
          '--variant-containedColor': '#000000',
          '--variant-containedBg': theme.palette.secondary.dark,
        },
      }),
      textSecondary: ({ theme }) => ({
        '--variant-containedColor': '#000000',
        '--variant-containedBg': theme.palette.primary.main,
        color: '#000000',
        backgroundColor: theme.palette.secondary.main,
        '&:hover': {
          '--variant-containedColor': '#000000',
          '--variant-containedBg': theme.palette.secondary.dark,
          backgroundColor: theme.palette.secondary.dark,
        },
      }),
      outlined: ({ theme, ownerState }) => {
        const borderColor = 'light' === mode ? '#B3B3B3' : '#B3B3B3';
        const textColor = 'light' === mode ? '#2C2D2E' : '#FFF';
        const mainColor = 'inherit' === ownerState.color
          ? 'currentColor'
          : theme.palette[ownerState.color || 'primary'].main;
        const bgColor = 'light' === mode ? '#FFF' : '#2C2D2E';

        return {
          position: 'relative',
          border: 'none',
          color: textColor,
          backgroundColor: bgColor,
          boxShadow: 'none',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            border: `1px solid ${borderColor}`,
            borderRadius: 'inherit',
            pointerEvents: 'none',
          },
          '&:hover::before': {
            backgroundColor: alpha(mainColor, 'light' === mode ? 0.15 : 0.25),
            borderColor,
          },
        };
      },
    },
  },
  MuiMenu: {
    styleOverrides: {
      root: {
        '& .MuiPaper-root': {
          borderRadius: '16px',
          boxShadow: '0px 2px 20px 0px #0000001A',
        },
      },
    },
  },
  MuiList: {
    styleOverrides: {
      root: {
        padding: 0,
      },
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: {
        padding: '10px 16px',
        height: '44px',
        minHeight: '24px',
        minWidth: '200px',
      },
    },
  },
  MuiListItemText: {
    styleOverrides: {
      root: {
        '& .MuiTypography-root': {
          lineHeight: '24px',
          fontSize: '16px',
          letterSpacing: 0,
        },
      },
    },
  },
  MuiTypography: {
    styleOverrides: {
      root: {
        transition: 'color 0.3s',
        color: colorsTheme.TEXT_MAIN,
      },
    },
  },
  MuiSwitch: {
    styleOverrides: {
      input: {
        position: 'absolute',
        transition: 'background-color 0.3s',
      },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {
        color: colorsTheme.TEXT_MAIN,
        transition: 'color 0.3s',
      },
    },
  },
  MuiCheckbox: {
    styleOverrides: {
      root: {
        color: colorsTheme.MAIN,
        transition: 'color 0.3s',
      },
    },
  },
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        transition: 'background-color 0.3s, color 0.3s, border-color 0.3s',
      },
      '*': {
        transition: 'background-color 0.3s, color 0.3s, border-color 0.3s, box-shadow 0.3s',
      },
      html: {
        transition: 'background-color 0.3s, color 0.3s, border-color 0.3s',
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {},
    },
  },
  MuiTextField: {
    styleOverrides: {
      root:
      ({ theme }) => ({
        borderRadius: '10px',

        '& .MuiInputBase-input': {
          padding: '10px',
          '-webkit-text-fill-color': colorsTheme.TEXT_MAIN,
          fontSize: '16px',
          lineHeight: '24px',
          height: 'auto',
          borderRadius: '10px',

          '&:-webkit-autofill': {
            '-webkit-box-shadow': '0 0 0 1000px white inset',
            '-webkit-text-fill-color': 'black',
          },
        },

        '& .MuiInputBase-input::placeholder': {
          color: colorsTheme.TEXT_SECONDARY,
        },

        '& .MuiOutlinedInput-root': {
          borderRadius: '10px',

          '& fieldset': {
            borderRadius: '10px',
          },

          '&:hover fieldset': {
            border: `solid ${theme.palette.primary.main}`,
            borderRadius: '10px',
          },

          '&.Mui-focused fieldset': {
            border: `solid ${theme.palette.primary.main}`,
            borderRadius: '10px',
          },
        },
      }),
    },
  },
});