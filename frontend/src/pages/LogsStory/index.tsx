import { useLogs } from "@/store";
import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import { StyledCard, StyledCardContent } from "./styledComponents";
import { useNavigate } from "react-router";
import { RouteEnum } from "@/types";

export const LogsStory = () => {
  const { getLogs, logs } = useLogs();

  const navigate = useNavigate();

  useEffect(() => {
    getLogs();
  }, []);

  const handleClickCard = (id: string) => {
    console.log(id);
    // navigate(`${RouteEnum.Logs}/${id}`);
  };

  return (
    <Box display="flex" gap={16} margin={8}>
      {logs.items.map((log) => (
        <StyledCard
          key={log._id}
          sx={{ minWidth: 275 }}
          // onClick={() => handleClickCard(log._id)}
        >
          <StyledCardContent>
            <Typography variant="h2">Название файла: {log.title}</Typography>
            <Typography>Количество логов: {log.logFiles.length}</Typography>
            <Typography>Уровень угрозы: дописать позже тип</Typography>
          </StyledCardContent>
        </StyledCard>
      ))}
    </Box>
  );
};
