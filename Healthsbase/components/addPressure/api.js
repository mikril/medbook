export const addPressures  = async (id, messureData) => {
    console.log('Добавляем анализ', id, messureData);  // Логируем перед отправкой
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/user/${id}/pressure`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body:  JSON.stringify(messureData), 
      });
      
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.statusText}`);
      }
  
      const result = await response.json();
      return result;
    } 
    catch (error) {
      console.error("Ошибка при добавлении анализа:", error);
      throw error;
    }
  };