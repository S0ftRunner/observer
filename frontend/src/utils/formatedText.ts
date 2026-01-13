type AiJson = {
  Danger?: number | string;
  IPs?: string[] | string;
};

type FormatResult = {
  cleanText: string;
  dangerText: string | null;
  ipsText: string | null;
  data: { danger?: number; ips?: string[] } | null;
};

const dangerToPercent = (danger: number | string | undefined): number | undefined => {
  if (danger === undefined || danger === null) return undefined;

  if (typeof danger === "number") {
    if (Number.isFinite(danger)) return Math.max(0, Math.min(100, Math.round(danger)));
    return undefined;
  }

  // строка: "75%", "75", "высокая" и т.п.
  const s = String(danger).trim().toLowerCase();

  const numMatch = s.match(/(\d{1,3})/);
  if (numMatch) {
    const n = parseInt(numMatch[1], 10);
    return Math.max(0, Math.min(100, n));
  }

  // простая шкала для слов
  if (["низкая", "low"].includes(s)) return 20;
  if (["средняя", "medium"].includes(s)) return 50;
  if (["высокая", "high"].includes(s)) return 80;
  if (["критическая", "critical"].includes(s)) return 95;

  return undefined;
};

const normalizeIps = (ips: AiJson["IPs"]): string[] | undefined => {
  if (!ips) return undefined;
  if (Array.isArray(ips)) return Array.from(new Set(ips.map(x => String(x).trim()).filter(Boolean)));
  // если вдруг пришла строка "1.1.1.1, 2.2.2.2"
  return Array.from(
    new Set(
      String(ips)
        .split(/[,\s]+/)
        .map(x => x.trim())
        .filter(Boolean)
    )
  );
};

export const getShortSummary = (text: string, maxLength = 160): string => {
  if (!text) return "";

  const noHeaders = text
    .replace(/```json[\s\S]*?```/gi, "")
    .replace(/#+\s?.*/g, "")          // markdown-заголовки
    .replace(/===.*?===/g, "")        // служебные блоки
    .replace(/\*\*.*?\*\*/g, "")      // жирный текст
    .replace(/\s+/g, " ")
    .trim();

  if (noHeaders.length <= maxLength) return noHeaders;
  return noHeaders.slice(0, maxLength).trim() + "…";
};

export const extractAndFormatAiResult = (text: string): FormatResult => {
  // 1) ищем fenced-блок ```json ... ```
  const fenced = text.match(/```json\s*([\s\S]*?)\s*```/i);

  // 2) если fenced-блок не найден — попробуем найти просто { ... } ближе к концу
  const fallback = !fenced ? text.match(/\{[\s\S]*"Danger"[\s\S]*\}/i) : null;

  const jsonRaw = fenced?.[1] ?? fallback?.[0] ?? null;

  let parsed: AiJson | null = null;

  if (jsonRaw) {
    // иногда модель кладёт лишние символы, попробуем аккуратно
    try {
      parsed = JSON.parse(jsonRaw);
    } catch {
      // небольшой хак: убрать trailing commas
      try {
        const fixed = jsonRaw.replace(/,\s*([}\]])/g, "$1");
        parsed = JSON.parse(fixed);
      } catch {
        parsed = null;
      }
    }
  }

  const danger = dangerToPercent(parsed?.Danger);
  const ips = normalizeIps(parsed?.IPs);

  // 3) вырезаем JSON-блок из текста
  let cleanText = text;
  if (fenced) {
    cleanText = cleanText.replace(fenced[0], "").trim();
  } else if (fallback) {
    cleanText = cleanText.replace(fallback[0], "").trim();
  }

  // 4) чуть “причесать” текст: убрать двойные пустые строки, добавить переносы
  cleanText = cleanText
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const dangerText = danger !== undefined ? `Уровень опасности: ${danger}%` : null;
  const ipsText = ips && ips.length ? `IP-адреса: ${ips.join(", ")}` : null;

  return {
    cleanText,
    dangerText,
    ipsText,
    data: parsed ? { danger, ips } : null,
  };
};
