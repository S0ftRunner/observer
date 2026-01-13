import { getLogById } from "@/api";
import { LogDashboard } from "@/components";
import { extractAndFormatAiResult } from "@/utils";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { useParams, useNavigate } from "react-router";

export const LogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate(); // ✅ добавили

  const [logInfo, setLogInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchLog = async () => {
      try {
        const data = await getLogById(id);
        setLogInfo(data);
      } catch {
        setError("Не удалось загрузить лог");
      } finally {
        setLoading(false);
      }
    };

    fetchLog();
  }, [id]);

  if (loading) {
    return (
      <Box p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const formatted = extractAndFormatAiResult(logInfo.analizedDescription);
  const ipCount = formatted.data?.ips?.length ?? 0;
  const danger = formatted.data?.danger;

  return (
    <Box p={4}>
      {/* 🔹 Верхняя панель */}
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          ← Назад
        </Button>

        <Typography variant="h4">Детали лога</Typography>
      </Box>

      <LogDashboard ipCount={ipCount} danger={danger} />

      <Typography variant="h6">Имя файла</Typography>
      <Typography variant="h5">{logInfo.title}</Typography>

      <Typography variant="h6" mt={3}>
        Результат анализа
      </Typography>

      <Typography>
        <Markdown>{formatted.cleanText}</Markdown>
      </Typography>
    </Box>
  );
};
