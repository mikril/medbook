import Constants from 'expo-constants';
export const deleteMeasurement  = async (analysis_id ) => {
    console.log('Удаляем анализ', analysis_id );  // Логируем перед отправкой
    const apiUrl = Constants.manifest.extra.apiUrl;
    try {
      const response = await fetch(`${apiUrl}/delete/analysis/${analysis_id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.statusText}`);
      }
  
      const result = await response.json();
      return result;
    } 
    catch (error) {
      console.error("Ошибка при удалении анализа:", error);
      throw error;
    }
  };