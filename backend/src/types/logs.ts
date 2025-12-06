export type TLogFile = {
  fileName: string;
  originalName: string;
};

export type ZeekAnalyz = {
  type: string;
  text: string;
  annotations: string;
};

export type ZeekAnalyseResponse = {
  status: string;
  filename: string;
  analysiz: ZeekAnalyz[];
};
