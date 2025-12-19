import { useLogs } from "@/store";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect } from "react";
import { StyledCard, StyledCardContent } from "./styledComponents";
import { useNavigate } from "react-router";
import { RouteEnum } from "@/types";

export const LogsStory = () => {
  const { getLogs, logs } = useLogs();

  const navigate = useNavigate();

  useEffect(() => {
    const getAllLogs = async () => {
      try {
        await getLogs();
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      }
    };

    getAllLogs();
  }, []);

  const handleClickCard = (id: string) => {
    navigate(`${RouteEnum.Logs}/${id}`);
  };

  return (
    <Box display="flex" gap={16} margin={8}>
      {logs ? (
        logs.items.map((log) => (
          <StyledCard
            key={log._id}
            sx={{ minWidth: 275 }}
            onClick={() => handleClickCard(log._id)}
          >
            <StyledCardContent>
              <Typography variant="h2">Название файла: {log.title}</Typography>
              <Typography>Количество логов: {log.logFiles.length}</Typography>
              <Typography>Уровень угрозы: дописать позже тип</Typography>
            </StyledCardContent>
          </StyledCard>
        ))
      ) : (
        <CircularProgress />
      )}
    </Box>
  );
};
