import { Card, CardContent, styled } from "@mui/material";

export const StyledCard = styled(Card)`
  border-radius: 8px;
  transition: transform 0.5s ease;
  &:hover {
    transform: scale(1.02);
    cursor: pointer;
  }
`;

export const StyledCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
