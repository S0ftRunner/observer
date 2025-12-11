import { BACKEND_URL } from "@/config";
import { checkResponseAndReturnData } from "@/utils";

const LOGS_URL = "logs";

export const analizeLog = async (logData: any) => {
  const response = await fetch(`${BACKEND_URL}/${LOGS_URL}/analize`, {
    method: "POST",
    body: JSON.stringify(logData),
  });
  const data = checkResponseAndReturnData(response);

  return data;
};


export const getLogById = async (id: string) => {
  const response = await fetch(`${BACKEND_URL}/${LOGS_URL}/${id}`);
  
  const data = checkResponseAndReturnData(response);

  return data;
}