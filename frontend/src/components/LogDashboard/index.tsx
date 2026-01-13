import { Box, Paper, Typography } from "@mui/material";

type LogDashboardProps = {
  ipCount: number;
  danger?: number;
};

export const LogDashboard = ({ ipCount, danger }: LogDashboardProps) => {
  return (
    <Box display="flex" gap={2} mt={3} mb={3}>
      <Paper sx={{ p: 2, minWidth: 200 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Уникальные IP-адреса
        </Typography>
        <Typography variant="h4">{ipCount}</Typography>
      </Paper>

      {danger !== undefined && (
        <Paper sx={{ p: 2, minWidth: 200 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Уровень угрозы
          </Typography>
          <Typography
            variant="h4"
            color={
              danger < 30 ? "success.main" : danger < 70 ? "warning.main" : "error.main"
            }
          >
            {danger}%
          </Typography>
        </Paper>
      )}
    </Box>
  );
};
