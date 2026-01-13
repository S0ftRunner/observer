import { useLogs } from "@/store";
import {
  Box,
  CircularProgress,
  Typography,
  Chip,
  Button,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { StyledCard, StyledCardContent } from "./styledComponents";
import { useNavigate } from "react-router";
import { RouteEnum } from "@/types";
import { extractAndFormatAiResult, getShortSummary } from "@/utils";
import { uploadPcapAndAnalyze } from "@/api";

const dangerColor = (danger: number | null) => {
  if (danger === null) return "default";
  if (danger < 30) return "success";
  if (danger < 70) return "warning";
  return "error";
};

export const LogsStory = () => {
  const { getLogs, logs } = useLogs();
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    getLogs().catch(console.error);
  }, []);

  const handleOpenFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // ✅ проверка расширения
    const lowerName = file.name.toLowerCase();
    if (!lowerName.endsWith(".pcap") && !lowerName.endsWith(".pcapng")) {
      alert("Файл должен быть формата .pcap или .pcapng");
      event.target.value = "";
      return;
    }

    try {
      setUploading(true);

      // отправляем файл на backend
      const res = await uploadPcapAndAnalyze(file);

      // обновляем список логов
      await getLogs();

      // (опционально) сразу перейти к новому логу
      if (res?.logId) {
        navigate(`${RouteEnum.Logs}/${res.logId}`);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Ошибка при загрузке или анализе файла");
    } finally {
      setUploading(false);
      event.target.value = ""; // ✅ сброс выбора файла, чтобы можно было загрузить тот же файл повторно
    }
  };

  if (!logs) {
    return <CircularProgress />;
  }

  return (
    <Box margin={8}>
      {/* ✅ Верхняя панель с кнопкой */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">История анализов</Typography>

        <Button
          variant="contained"
          onClick={handleOpenFileDialog}
          disabled={uploading}
        >
          {uploading ? "Загрузка..." : "Добавить PCAP"}
        </Button>

        {/* ✅ Скрытый input */}
        <input
          ref={fileInputRef}
          type="file"
          hidden
          accept=".pcap,.pcapng"
          onChange={handleFileSelected}
        />
      </Box>

      {/* ✅ Сетка карточек */}
      <Box display="flex" gap={4} flexWrap="wrap">
        {logs.items.map((log) => {
          const formatted = extractAndFormatAiResult(log.analizedDescription);
          const danger = formatted.data?.danger ?? null;

          return (
            <StyledCard
              key={log._id}
              sx={{ width: 340, cursor: "pointer" }}
              onClick={() => navigate(`${RouteEnum.Logs}/${log._id}`)}
            >
              <StyledCardContent>
                <Typography variant="h6" gutterBottom>
                  {log.title}
                </Typography>

                {danger !== null && (
                  <Chip
                    label={`Угроза: ${danger}%`}
                    color={dangerColor(danger)}
                    size="small"
                    sx={{ mb: 1 }}
                  />
                )}

                <Typography variant="body2" color="text.secondary">
                  {getShortSummary(formatted.cleanText)}
                </Typography>
              </StyledCardContent>
            </StyledCard>
          );
        })}
      </Box>
    </Box>
  );
};
