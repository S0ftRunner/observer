export const checkResponseAndReturnData = async (response: Response): Promise<any> => {
  if (response.ok) {
    return await response.json();
  };

  throw new Error('Данных нет');
}