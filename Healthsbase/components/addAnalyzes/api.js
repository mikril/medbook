// api.js
export const handleSubmit = async (imageFile, setDate, setAnalyzes) => {
  if (!imageFile) {
    console.error("Файл изображения не выбран");
    return;
  }

  const base64 = imageFile.uri.split(",")[1];
  const extension = imageFile.uri.split(",")[0].split(";")[1];

  try {
    // Первый запрос: получаем токен
    const tokenResponse = await fetch('http://192.168.0.106:5000/token', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!tokenResponse.ok) {
      throw new Error('Ошибка получения токена');
    }

    const tokenData = await tokenResponse.json();
    const token = tokenData.token;

    // Второй запрос: отправляем данные с использованием токена
    const appointmentResponse = await fetch('http://192.168.0.106:5000/analyses', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        file: base64,
        extension: extension,
      }),
    });

    if (!appointmentResponse.ok) {
      throw new Error('Ошибка отправки данных на сервер');
    }

    const result = await appointmentResponse.json();
    setDate(result.date || '');
    setAnalyzes(result.analyses || []);

    console.log('Успех:', result);
  } catch (error) {
    console.error('Ошибка:', error);
  }
};

export const addAnalyze2  = async (accountId, analyzeData) => {
  console.log('Добавляем анализ', accountId, analyzeData);  // Логируем перед отправкой

  try {
    const response = await fetch(`http://127.0.0.1:8000/user/${accountId}/analyzes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body:  JSON.stringify(analyzeData), // В данном случае тело запроса пустое, так как на сервере используется дефолтные значения
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