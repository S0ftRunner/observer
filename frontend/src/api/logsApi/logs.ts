import { BACKEND_URL } from "@/config";
import { checkResponseAndReturnData } from "@/utils";

const LOGS_URL = "logs";

export const analizeLog = async (logData: any) => {
  const response = await fetch(`${BACKEND_URL}/${LOGS_URL}/analize`, {
    method: "POST",
    body: JSON.stringify(logData),
  });
  const data = await checkResponseAndReturnData(response);

  return data;
};

export const uploadPcapAndAnalyze = async (file: File) => {
  const formData = new FormData();
  formData.append("pcapFile", file);

  const response = await fetch(`${BACKEND_URL}/${LOGS_URL}/analize`, {
    method: "POST",
    body: formData,
  });

  const data = await checkResponseAndReturnData(response);
  return data;
};

export const getLogById = async (id: string) => {
  const response = await fetch(`${BACKEND_URL}/${LOGS_URL}/${id}`);

  const data = await checkResponseAndReturnData(response);

  return data;
};

export const getAllLogs = async () => {
  const response = await fetch(`${BACKEND_URL}/${LOGS_URL}`);

  const data = await checkResponseAndReturnData(response);

  return data;
};

export const deleteLogById = async (id: string) => {
  const response = await fetch(`${BACKEND_URL}/${id}/delete`);

  const data = await checkResponseAndReturnData(response);

  return data;
};

export const updateLogById = async (id: string, bodyData: any) => {
  const response = await fetch(`${BACKEND_URL}/${id}/log`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: bodyData,
  });

  const data = await checkResponseAndReturnData(response);

  return data;
};

export const createLog = async (bodyData: any) => {
  const response = await fetch(`${BACKEND_URL}/`, {
    method: "POST",
    body: bodyData,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await checkResponseAndReturnData(response);

  return data;
};