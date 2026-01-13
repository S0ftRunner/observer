import { enqueueSnackbar, VariantType } from 'notistack';
import ReactMarkdown from 'react-markdown';

// 3 секунды защиты от спама
const DEBOUNCE_TIME = 3000;
const lastShownTimes: Record<string, number> = {};

export const showNotification = (
  message: string,
  type: VariantType,
  error?: Array<string> | string
) => {
  const errorString = Array.isArray(error) ? error.join('|') : error || '';
  const notificationKey = `${type}_${message}_${errorString}`;
  const now = Date.now();
  const lastShown = lastShownTimes[notificationKey];

  // Защита от спама
  if (lastShown && (now - lastShown < DEBOUNCE_TIME)) {
    return;
  }

  // Обновляем время
  lastShownTimes[notificationKey] = now;

  // Очистка старых записей (старше 1 минуты)
  const oneMinuteAgo = now - 60000;
  Object.keys(lastShownTimes).forEach(key => {
    if (lastShownTimes[key]! < oneMinuteAgo) {
      delete lastShownTimes[key];
    }
  });

  enqueueSnackbar(
    <ReactMarkdown>
      {`${message}${error ? ` Ошибка: ${Array.isArray(error) ? error.join('. ') : error}` : ''}`}
    </ReactMarkdown>,
    { variant: type }
  );
};