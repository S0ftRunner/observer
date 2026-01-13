import { Box, Typography } from "@mui/material";

export const MainPage = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      paddingTop={8}
      gap={8}
      flexDirection="column"
    >
      <Typography variant="h1" fontWeight={600}>
        Observer
      </Typography>
      <Typography>
        Данное приложение позволяет оператору SOC проанализировать PCAP файлы.
        <br/>
        Их можно загрузить в разделе "Анализ логов"
      </Typography>
    </Box>
  );
};
