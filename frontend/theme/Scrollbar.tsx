import { GlobalStyles, useTheme } from '@mui/material';


export const CustomScrollbar = () => {
  const theme = useTheme();

  return (
    <GlobalStyles
      styles={{
        '*::-webkit-scrollbar': {
          width: '12px',
          height: '12px',
          borderRadius: '80px',
        },
        '*::-webkit-scrollbar-track': {
          background: 'dark' === theme.palette.mode
            ? '#212121'
            : 'white',
          borderRadius: '80px',
        },
        '*::-webkit-scrollbar-thumb': {
          borderRadius: '80px',
        },
        '*': {
          scrollbarColor: `${theme.palette.primary.main} ${'dark' === theme.palette.mode
            ? '#212121'
            : 'white'}`,
        },
      }}
    />
  );
};