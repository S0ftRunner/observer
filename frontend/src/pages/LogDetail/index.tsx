import { Box, Typography } from "@mui/material";
import { useParams } from "react-router";

export const LogDetail = () => {
  const { id } = useParams();
  
  return (
    <Box>
      <Typography variant="h4">Детали лога ID: {id}</Typography>
      <Box p={4}>
        <Typography>Тест лог - здесь будет детальная информация</Typography>
      </Box>
    </Box>
  );
};