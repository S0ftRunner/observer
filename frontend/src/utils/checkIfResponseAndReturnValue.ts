export const checkResponseAndReturnData = async (response: Response) => {
  if (response.ok) {
    return await response.json();
  };

  throw new Error('Данных нет');
}