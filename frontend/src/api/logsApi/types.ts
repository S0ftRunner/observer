export type TLogFile = {
  originalName: string;
  savedPath: string;
  size?: number;
}

export type TLog = {
  status: string;
  message: string;
  logId: string;
  analysis: string;
  fileInfo?: TLogFile;
}