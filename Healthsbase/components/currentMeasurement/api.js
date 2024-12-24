export const deleteMeasurement  = async (analysis_id ) => {
    console.log('Удаляем анализ', analysis_id );  // Логируем перед отправкой
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/delete/analysis/${analysis_id}`, {
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