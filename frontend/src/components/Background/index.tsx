import { FC } from 'react';
import { Box, styled } from '@mui/material';


const BackgroundBox = styled(Box)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;

  ${({ theme }) => ('dark' === theme.palette.mode
    ? `
      background: linear-gradient(359.68deg, #414958 0.27%, #5E6674 99.65%);
    `
    : `
      background: linear-gradient(179.04deg, rgba(243, 232, 234, 0.25) 0.82%, rgba(255, 112, 140, 0.225) 99.19%);
      `
  )}

  background-repeat: no-repeat;
  background-size: cover;
`;

export const Background: FC = () => {
  return <BackgroundBox />;
};